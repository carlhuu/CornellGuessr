import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useAuth } from "../auth/AuthUserProvider";
import { signIn } from "../auth/auth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const images = [
  { url: "/game_images/low-rise-7.png",        name: "Low Rise 7",           location: { lat: 42.456237, lng: -76.475352 } },
  { url: "/game_images/botanical-gardens.png", name: "Botanical Gardens",    location: { lat: 42.449551, lng: -76.472359 } },
  { url: "/game_images/trillium.png",          name: "Trillium",             location: { lat: 42.448071, lng: -76.479248 } },
  { url: "/game_images/noyes-gym.png",         name: "Noyes Gym",            location: { lat: 42.446518, lng: -76.488033 } },
  { url: "/game_images/cocktail-lounge.png",   name: "Cocktail Lounge",      location: { lat: 42.447868, lng: -76.485291 } },
  { url: "/game_images/baker.png",             name: "Baker Laboratory",     location: { lat: 42.450414, lng: -76.481873 } },
  { url: "/game_images/bartels.png",           name: "Bartels Hall",         location: { lat: 42.445329, lng: -76.485291 } },
  { url: "/game_images/barton.png",            name: "Barton Hall",          location: { lat: 42.445803, lng: -76.480988 } },
  { url: "/game_images/duffield.png",          name: "Duffield Hall",        location: { lat: 42.444457, lng: -76.482602 } },
  { url: "/game_images/gates.png",             name: "Gates Hall",           location: { lat: 42.445034, lng: -76.481229 } },
  { url: "/game_images/hollister.png",         name: "Hollister Hall",       location: { lat: 42.444211, lng: -76.484388 } },
  { url: "/game_images/klarman.png",           name: "Klarman Hall",         location: { lat: 42.449154, lng: -76.483116 } },
  { url: "/game_images/morrison.png",          name: "Morrison Hall",        location: { lat: 42.455644, lng: -76.47927  } },
  { url: "/game_images/newman.png",            name: "Newman Arena",         location: { lat: 42.452892, lng: -76.477716 } },
  { url: "/game_images/olin.png",              name: "Olin Library",         location: { lat: 42.447906, lng: -76.484661 } },
  { url: "/game_images/psb.png",               name: "Physical Sciences",    location: { lat: 42.449799, lng: -76.481368 } },
  { url: "/game_images/rhodes.png",            name: "Rhodes Hall",          location: { lat: 42.443749, lng: -76.481773 } },
  { url: "/game_images/rpcc.png",              name: "RPCC",                 location: { lat: 42.456045, lng: -76.477399 } },
  { url: "/game_images/statler.png",           name: "Statler Hall",         location: { lat: 42.445465, lng: -76.481906 } },
  { url: "/game_images/tang.png",              name: "Tang Hall",            location: { lat: 42.444052, lng: -76.483804 } },
];

const HISTORY_KEY = "cornellguessrHistory";

export type RoundRecord = { name: string; pts: number };
export type GameRecord  = { date: string; score: number; rounds: RoundRecord[] };

export const loadHistory = (): GameRecord[] => {
  try { const r = localStorage.getItem(HISTORY_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
};

const saveHistory = (games: GameRecord[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(games.slice(0, 20)));
};

const shuffleArray = (arr: typeof images) => [...arr].sort(() => Math.random() - 0.5);
const clearState   = () => localStorage.removeItem("cornellguessrGame");

const animateValue = (from: number, to: number, set: (n: number) => void, ms: number) => {
  const t0 = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - t0) / ms, 1);
    set(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// ── Shared style tokens ────────────────────────────────────────────────────
const mono: React.CSSProperties = { fontFamily: "'Geist Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Newsreader', serif" };
const sans: React.CSSProperties  = { fontFamily: "'Geist', sans-serif" };

const lightCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(27,26,24,.07)",
  boxShadow: "0 30px 60px -28px rgba(20,18,16,.35)",
};

const lightBg: React.CSSProperties = {
  minHeight: "calc(100vh - 64px)",
  width: "100%",
  background: "#F6F4EF",
};

const Game: React.FC = () => {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API });

  const [shuffledImages, setShuffledImages] = useState(shuffleArray(images));
  const [round,        setRound]        = useState<number>(1);
  const [guess,        setGuess]        = useState<{ lat: number; lng: number } | null>(null);
  const [showResult,   setShowResult]   = useState<boolean>(false);
  const [score,        setScore]        = useState<number>(0);
  const [started,      setStarted]      = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState(shuffledImages[0]);
  const [submitting,   setSubmitting]   = useState(false);
  const [roundHistory, setRoundHistory] = useState<RoundRecord[]>([]);

  const [tilt,      setTilt]      = useState({ x: 0, y: 0 });
  const [dispRound, setDispRound] = useState(0);
  const [dispTotal, setDispTotal] = useState<number>(0);

  const roundScoreRef     = useRef(0);
  const statsSubmittedRef = useRef(false);
  const { user } = useAuth();
  const userId = user?.uid || "Guest";

  // Clear saved state whenever the component unmounts (navigating away loses all progress)
  useEffect(() => {
    return () => clearState();
  }, []);

  // Reset game whenever the logged-in user changes (logout → login brings a fresh game)
  const prevUserRef = useRef(user?.uid);
  useEffect(() => {
    if (prevUserRef.current !== user?.uid) {
      prevUserRef.current = user?.uid;
      reset();
    }
  }, [user?.uid]);

  // Animate scores when result shows
  useEffect(() => {
    if (showResult) {
      const rs = roundScoreRef.current;
      animateValue(0,           rs,    setDispRound, 900);
      animateValue(score - rs,  score, setDispTotal, 1100);
    }
  }, [showResult, score]);

  // Submit stats + save local history on game over
  useEffect(() => {
    if (showResult && round >= 5 && !statsSubmittedRef.current) {
      statsSubmittedRef.current = true;

      if (user) {
        fetch(`${backendUrl}/api/stats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total_pts: score, userId, displayName: user.displayName || "Guest" }),
        });
      }

      // Always save to local history (guests included)
      const record: GameRecord = {
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        score,
        rounds: roundHistory,
      };
      saveHistory([record, ...loadHistory()]);
    }
  }, [showResult, round, score, userId, user, roundHistory]);

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top)  / r.height - 0.5) * -16,
      y: ((e.clientX - r.left) / r.width  - 0.5) *  16,
    });
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) setGuess({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const calculateDistance = () => {
    if (!guess) return 0;
    const rad = (x: number) => (x * Math.PI) / 180;
    const R = 6371, dLat = rad(currentImage.location.lat - guess.lat), dLng = rad(currentImage.location.lng - guess.lng);
    const a = Math.sin(dLat/2)**2 + Math.cos(rad(guess.lat)) * Math.cos(rad(currentImage.location.lat)) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const calcScore = (d: number) => Math.round(1000 * Math.exp(-d / 0.95));

  const handleNextRound = () => {
    const n = round + 1;
    setRound(n); setShowResult(false); setGuess(null);
    setCurrentImage(shuffledImages[n - 1]);
    roundScoreRef.current = 0;
  };

  const reset = () => {
    const imgs = shuffleArray(images);
    setShuffledImages(imgs); setRound(1); setCurrentImage(imgs[0]);
    setGuess(null); setShowResult(false); setScore(0);
    setDispTotal(0); setDispRound(0); setStarted(false);
    setRoundHistory([]);
    roundScoreRef.current = 0; statsSubmittedRef.current = false;
    clearState();
  };

  const submitGuess = async () => {
    if (!guess || submitting) return;
    setSubmitting(true);
    try {
      if (user) {
        await fetch(`${backendUrl}/api/guesses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: guess.lat, lng: guess.lng, userId, displayName: user.displayName || "Guest" }),
        });
      }
      const dist = calculateDistance();
      const rs = calcScore(dist);
      roundScoreRef.current = rs;
      const newRoundRecord: RoundRecord = { name: currentImage.name, pts: rs };
      setRoundHistory(prev => [...prev, newRoundRecord]);
      setScore(p => p + rs);
      setShowResult(true);
    } catch {
      alert("Failed to submit guess. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading maps ─────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div style={{ ...lightBg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div className="cg-spinner" />
        <span style={{ ...mono, color: "#908d86", fontSize: ".85rem", letterSpacing: ".12em" }}>LOADING MAPS</span>
      </div>
    );
  }

  // ── Login gate (always checked first, can't be bypassed) ─────────────────
  if (!user) {
    return (
      <div style={{ ...lightBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="cg-page-enter" style={{
          ...lightCard,
          borderRadius: 16,
          overflow: "hidden",
          maxWidth: 860,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: 480,
        }}>
          <div style={{ position: "relative" }}>
            <img src="/homepage/pic4.jpg" alt="Cornell campus" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ padding: "60px 52px", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".2em", color: "#B31B1B", marginBottom: 18 }}>SIGN IN TO PLAY</div>
            <h2 style={{ ...serif, fontSize: "clamp(28px,3.5vw,38px)", fontWeight: 600, lineHeight: 1.06, letterSpacing: "-.02em", color: "#1B1A18", margin: 0 }}>
              An account keeps<br />score for you.
            </h2>
            <p style={{ ...sans, fontSize: 15, lineHeight: 1.65, color: "#5c5953", maxWidth: 340, margin: "18px 0 32px" }}>
              CornellGuessr saves every game to your profile so you can track your best runs over time. Sign in with your Cornell Google account to play.
            </p>
            <button
              className="cg-btn"
              onClick={() => signIn()}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                ...sans, fontSize: 15, fontWeight: 600, color: "#1B1A18",
                background: "#fff", border: "1px solid rgba(27,26,24,.18)",
                padding: "14px 26px", borderRadius: 9, cursor: "pointer",
                boxShadow: "0 8px 20px -10px rgba(20,18,16,.4)",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 17, color: "#B31B1B" }}>G</span>
              Continue with Google
            </button>
            <span style={{ ...sans, fontSize: 13, color: "#a8a49c", marginTop: 18 }}>
              We only use this to save your games. Nothing else.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Start screen ──────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div style={{ ...lightBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="cg-page-enter" style={{
          ...lightCard,
          borderRadius: 16,
          overflow: "hidden",
          maxWidth: 860,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: 480,
        }}>
          <div style={{ position: "relative" }}>
            <img src="/homepage/pic1.jpg" alt="Cornell campus" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ padding: "60px 52px", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".2em", color: "#B31B1B", marginBottom: 18 }}>NEW GAME · 5 ROUNDS</div>
            <h2 style={{ ...serif, fontSize: "clamp(32px,3.5vw,42px)", fontWeight: 600, lineHeight: 1.06, letterSpacing: "-.02em", color: "#1B1A18", margin: 0 }}>
              Find your way<br />around Cornell.
            </h2>
            <p style={{ ...sans, fontSize: 15, lineHeight: 1.65, color: "#5c5953", maxWidth: 340, margin: "18px 0 32px" }}>
              You'll get five photos from around campus. Drop a pin for each — closer guesses score more.
            </p>
            <button
              className="cg-btn"
              onClick={() => setStarted(true)}
              style={{
                ...sans, fontSize: 15, fontWeight: 600, color: "#fff",
                background: "#B31B1B", border: "none",
                padding: "15px 36px", borderRadius: 8, cursor: "pointer",
                boxShadow: "0 12px 26px -8px rgba(179,27,27,.5)",
              }}
            >
              Start game →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active game ───────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = { ...lightCard, borderRadius: 16, padding: 24 };
  const labelStyle: React.CSSProperties = { ...mono, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "#908d86" };

  return (
    <div style={{ ...lightBg, padding: "32px 20px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }} className="cg-page-enter">

        {/* Round / score bar */}
        <div style={{ ...lightCard, borderRadius: 16, padding: "14px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ ...labelStyle }}>Round</span>
            <div style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={i + 1 === round ? "cg-dot-active" : ""}
                  style={{
                    height: 10,
                    width: i + 1 === round ? 34 : 26,
                    borderRadius: 5,
                    background: i + 1 < round ? "#B31B1B" : i + 1 === round ? "#B31B1B" : "rgba(27,26,24,.1)",
                    opacity: i + 1 < round ? 0.4 : 1,
                    transition: "all .4s cubic-bezier(.34,1.56,.64,1)",
                  }}
                />
              ))}
            </div>
            <span style={{ ...sans, color: "#5c5953", fontSize: ".9rem", fontWeight: 500 }}>{round} / 5</span>
          </div>
          <div style={{ background: "#B31B1B", padding: "10px 28px", borderRadius: 10, boxShadow: "0 6px 24px rgba(179,27,27,.3)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...mono, color: "rgba(255,255,255,.75)", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>Score</span>
            <span style={{ color: "white", fontSize: "1.35rem", fontWeight: 800 }}>{score}</span>
          </div>
        </div>

        {/* Two-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(440px,1fr))", gap: 24, marginBottom: 24 }}>

          {/* Image card */}
          <div
            className="cg-card-3d"
            onMouseMove={handleTiltMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
              ...cardStyle,
              transformStyle: "preserve-3d",
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              boxShadow: `0 ${12 + Math.abs(tilt.y) * 1.5}px ${40 + Math.abs(tilt.x) * 2}px rgba(20,18,16,.18)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B31B1B", flexShrink: 0 }} />
              <span style={labelStyle}>Where on campus?</span>
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 20px rgba(20,18,16,.15)", transform: "translateZ(22px)" }}>
              <img src={currentImage.url} alt="Location" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>

          {/* Map card */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: guess ? "#16a34a" : "rgba(27,26,24,.2)",
                transition: "all .35s ease", flexShrink: 0,
              }} className={!guess && !showResult ? "cg-guess-indicator" : ""} />
              <span style={labelStyle}>
                {showResult ? "The actual spot" : guess ? "Ready to submit" : "Click map to guess"}
              </span>
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 20px rgba(20,18,16,.15)" }}>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: 460 }}
                center={{ lat: 42.447, lng: -76.484 }}
                zoom={15}
                onClick={showResult ? undefined : onMapClick}
              >
                {guess && <Marker position={guess} label="You" />}
                {showResult && <Marker position={currentImage.location} label="Actual" />}
              </GoogleMap>
            </div>
          </div>
        </div>

        {/* Submit button */}
        {!showResult && (
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <button
              className="cg-btn"
              onClick={submitGuess}
              disabled={!guess || submitting}
              style={{
                ...sans,
                background: !guess || submitting ? "rgba(27,26,24,.06)" : "#B31B1B",
                color: !guess || submitting ? "rgba(27,26,24,.3)" : "white",
                border: "none",
                padding: "16px 64px",
                borderRadius: 12,
                fontSize: "1rem",
                fontWeight: 600,
                cursor: !guess || submitting ? "not-allowed" : "pointer",
                letterSpacing: ".06em",
                boxShadow: !guess || submitting ? "none" : "0 10px 28px rgba(179,27,27,.35)",
              }}
            >
              {submitting ? "Submitting…" : "Submit guess →"}
            </button>
          </div>
        )}

        {/* Result panel */}
        {showResult && (
          <div className="cg-result-enter" style={{ ...lightCard, borderRadius: 16, padding: "44px 40px", textAlign: "center" }}>
            <div style={{ ...mono, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "#908d86", marginBottom: 14 }}>
              Round {round} Results
            </div>

            <div style={{ ...serif, fontSize: "5rem", fontWeight: 600, lineHeight: 1, color: "#B31B1B", marginBottom: 6 }}>
              +{dispRound}
              <span style={{ ...sans, fontSize: "1.4rem", fontWeight: 500, color: "#bdb9b1" }}> pts</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, maxWidth: 560, margin: "28px auto 36px" }}>
              <div className="cg-stat" style={{ background: "#F6F4EF", border: "1px solid rgba(27,26,24,.08)", borderRadius: 12, padding: "20px 16px" }}>
                <div style={{ ...mono, fontSize: ".68rem", color: "#908d86", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>Distance</div>
                <div style={{ ...serif, fontSize: "1.8rem", fontWeight: 600, color: "#1B1A18" }}>{calculateDistance().toFixed(2)}<span style={{ ...sans, fontSize: ".8rem", color: "#a8a49c" }}> km</span></div>
              </div>
              <div className="cg-stat" style={{ background: "#B31B1B", borderRadius: 12, padding: "20px 16px" }}>
                <div style={{ ...mono, fontSize: ".68rem", color: "rgba(255,255,255,.7)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>Round Score</div>
                <div style={{ ...serif, fontSize: "1.8rem", fontWeight: 600, color: "#fff" }}>{dispRound}</div>
              </div>
              <div className="cg-stat" style={{ background: "#F6F4EF", border: "1px solid rgba(27,26,24,.08)", borderRadius: 12, padding: "20px 16px" }}>
                <div style={{ ...mono, fontSize: ".68rem", color: "#908d86", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>Total</div>
                <div style={{ ...serif, fontSize: "1.8rem", fontWeight: 600, color: "#1B1A18" }}>{dispTotal}</div>
              </div>
            </div>

            {round < 5 ? (
              <button className="cg-btn" onClick={handleNextRound} style={{ ...sans, background: "#B31B1B", color: "white", border: "none", padding: "15px 44px", borderRadius: 10, fontSize: "1rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 28px rgba(179,27,27,.35)" }}>
                Next round →
              </button>
            ) : (
              <>
                <div style={{ ...serif, fontSize: "2.2rem", fontWeight: 500, color: "#1B1A18", marginBottom: 6 }}>Game complete!</div>
                <p style={{ ...sans, fontSize: "1rem", color: "#5c5953", marginBottom: 32 }}>
                  Final score: <strong style={{ color: "#B31B1B" }}>{score} points</strong>
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
                  <button className="cg-btn" onClick={reset} style={{ ...sans, background: "#B31B1B", color: "white", border: "none", padding: "14px 36px", borderRadius: 10, fontSize: "1rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 10px 28px rgba(179,27,27,.35)" }}>
                    Play again
                  </button>
                  <button onClick={reset} style={{ ...sans, fontSize: "1rem", fontWeight: 600, color: "#1B1A18", background: "transparent", border: "1px solid rgba(27,26,24,.2)", padding: "14px 36px", borderRadius: 10, cursor: "pointer" }}>
                    Back home
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
