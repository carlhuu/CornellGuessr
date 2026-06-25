import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useAuth } from "../auth/AuthUserProvider";
import { signIn } from "../auth/auth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const images = [
  { url: "/game_images/low-rise-7.png", location: { lat: 42.456237, lng: -76.475352 } },
  { url: "/game_images/botanical-gardens.png", location: { lat: 42.449551, lng: -76.472359 } },
  { url: "/game_images/trillium.png", location: { lat: 42.448071, lng: -76.479248 } },
  { url: "/game_images/noyes-gym.png", location: { lat: 42.446518, lng: -76.488033 } },
  { url: "/game_images/cocktail-lounge.png", location: { lat: 42.447868, lng: -76.485291 } },
  { url: "/game_images/baker.png", location: { lat: 42.450414, lng: -76.481873 } },
  { url: "/game_images/bartels.png", location: { lat: 42.445329, lng: -76.485291 } },
  { url: "/game_images/barton.png", location: { lat: 42.445803, lng: -76.480988 } },
  { url: "/game_images/duffield.png", location: { lat: 42.444457, lng: -76.482602 } },
  { url: "/game_images/gates.png", location: { lat: 42.445034, lng: -76.481229 } },
  { url: "/game_images/hollister.png", location: { lat: 42.444211, lng: -76.484388 } },
  { url: "/game_images/klarman.png", location: { lat: 42.449154, lng: -76.483116 } },
  { url: "/game_images/morrison.png", location: { lat: 42.455644, lng: -76.47927 } },
  { url: "/game_images/newman.png", location: { lat: 42.452892, lng: -76.477716 } },
  { url: "/game_images/olin.png", location: { lat: 42.447906, lng: -76.484661 } },
  { url: "/game_images/psb.png", location: { lat: 42.449799, lng: -76.481368 } },
  { url: "/game_images/rhodes.png", location: { lat: 42.443749, lng: -76.481773 } },
  { url: "/game_images/rpcc.png", location: { lat: 42.456045, lng: -76.477399 } },
  { url: "/game_images/statler.png", location: { lat: 42.445465, lng: -76.481906 } },
  { url: "/game_images/tang.png", location: { lat: 42.444052, lng: -76.483804 } },
];


const shuffleArray = (arr: typeof images) => [...arr].sort(() => Math.random() - 0.5);
const saveState   = (s: object) => localStorage.setItem("cornellguessrGame", JSON.stringify(s));
const loadState   = () => { try { const r = localStorage.getItem("cornellguessrGame"); return r ? JSON.parse(r) : null; } catch { return null; } };
const clearState  = () => localStorage.removeItem("cornellguessrGame");

const animateValue = (from: number, to: number, set: (n: number) => void, ms: number) => {
  const t0 = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - t0) / ms, 1);
    set(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const glass = {
  background: "rgba(255,255,255,.055)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,.1)",
  boxShadow: "0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.1)",
} as React.CSSProperties;

const pageBg: React.CSSProperties = {
  minHeight: "calc(100vh - 70px)",
  width: "100vw",
  background: `
    radial-gradient(circle at 18% 28%, rgba(179,27,27,.18) 0%, transparent 48%),
    radial-gradient(circle at 82% 72%, rgba(63,81,181,.1)   0%, transparent 45%),
    #090912
  `,
};

const Game: React.FC = () => {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API });

  const saved = loadState();
  const [shuffledImages, setShuffledImages] = useState(saved?.shuffledImages || shuffleArray(images));
  const [round,        setRound]        = useState<number>(saved?.round    || 1);
  const [guess,        setGuess]        = useState<{ lat: number; lng: number } | null>(saved?.guess || null);
  const [showResult,   setShowResult]   = useState<boolean>(saved?.showResult || false);
  const [score,        setScore]        = useState<number>(saved?.score     || 0);
  const [curr,         setCurr]         = useState<boolean>(saved?.curr     || false);
  const [currentImage, setCurrentImage] = useState(shuffledImages[round - 1]);
  const [submitting,   setSubmitting]   = useState(false);

  const [tilt,          setTilt]          = useState({ x: 0, y: 0 });
  const [dispRound,     setDispRound]     = useState(0);
  const [dispTotal,     setDispTotal]     = useState<number>(saved?.score || 0);

  const roundScoreRef     = useRef(0);
  const statsSubmittedRef = useRef(false);
  const { user } = useAuth();
  const userId = user?.uid || "Guest";


  // Persist state
  useEffect(() => {
    if (curr) saveState({ shuffledImages, round, guess, showResult, score, curr });
  }, [shuffledImages, round, guess, showResult, score, curr]);

  // Animate scores when result shows
  useEffect(() => {
    if (showResult) {
      const rs = roundScoreRef.current;
      animateValue(0,           rs,    setDispRound, 900);
      animateValue(score - rs,  score, setDispTotal, 1100);
    }
  }, [showResult, score]);

  // Submit stats once on game over
  useEffect(() => {
    if (showResult && round >= 5 && !statsSubmittedRef.current) {
      statsSubmittedRef.current = true;
      fetch(`${backendUrl}/api/stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total_pts: score, userId, displayName: user?.displayName || "Guest" }),
      });
    }
  }, [showResult, round, score, userId, user]);

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
    setDispTotal(0); setDispRound(0);
    roundScoreRef.current = 0; statsSubmittedRef.current = false;
    clearState();
  };

  const submitGuess = async () => {
    if (!guess || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${backendUrl}/api/guesses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: guess.lat, lng: guess.lng, userId, displayName: user?.displayName || "Guest" }),
      });
      if (!res.ok) throw new Error();
      const rs = calcScore(calculateDistance());
      roundScoreRef.current = rs;
      setScore(p => p + rs);
      setShowResult(true);
    } catch {
      alert("Failed to submit guess. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div style={{ ...pageBg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div className="cg-spinner" />
        <span style={{ color: "rgba(255,255,255,.4)", fontSize: ".85rem", letterSpacing: ".12em" }}>LOADING MAPS</span>
      </div>
    );
  }

  // ── Start / Login screen ──────────────────────────────────────────────────
  if (!user || !curr) {
    return (
      <div style={{ ...pageBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
        {/* decorative orbs */}
        <div style={{ position:"absolute", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(179,27,27,.13) 0%, transparent 68%)", top:"50%", left:"28%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(63,81,181,.09) 0%, transparent 68%)", top:"60%", left:"75%", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />

        <div className="cg-page-enter" style={{ ...glass, borderRadius:28, padding:"64px 48px", maxWidth:500, width:"100%", textAlign:"center", position:"relative" }}>
          {/* icon */}
          <div style={{
            width:72, height:72, borderRadius:20, margin:"0 auto 28px",
            background:"linear-gradient(135deg,#8B0000,#E53935)",
            boxShadow:"0 10px 36px rgba(229,57,53,.55)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"2rem",
          }}>🐻</div>

          <h1 className="cg-title" style={{ fontSize:"2.9rem", fontWeight:800, marginBottom:10, letterSpacing:"-.02em" }}>
            CornellGuessr
          </h1>
          <p style={{ fontSize:"1rem", color:"rgba(255,255,255,.45)", lineHeight:1.7, marginBottom:40 }}>
            You'll see a photo taken somewhere on Cornell's campus. Click the map to place your guess — closer means more points.
          </p>

          <button
            className="cg-btn"
            onClick={() => { if (!user) signIn(); else setCurr(true); }}
            style={{
              background:"linear-gradient(135deg,#8B0000,#E53935)",
              color:"white", border:"none",
              padding:"17px 0", borderRadius:14,
              fontSize:"1.05rem", fontWeight:700, cursor:"pointer",
              letterSpacing:".06em", textTransform:"uppercase",
              boxShadow:"0 10px 36px rgba(229,57,53,.45)",
              width:"100%",
            }}
          >
            {user ? "Start Game" : "Log in to Play"}
          </button>

          {user && (
            <p style={{ marginTop:16, color:"rgba(255,255,255,.28)", fontSize:".82rem" }}>
              Signed in as {user.displayName}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Active game ───────────────────────────────────────────────────────────
  return (
    <div style={{ ...pageBg, padding:"32px 20px" }}>
      <div style={{ maxWidth:1300, margin:"0 auto" }} className="cg-page-enter">

        {/* ── Header bar ── */}
        <div style={{ ...glass, borderRadius:20, padding:"16px 28px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          {/* round progress */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <span style={{ color:"rgba(255,255,255,.35)", fontSize:".72rem", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase" }}>
              Round
            </span>
            <div style={{ display:"flex", gap:8 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={i + 1 === round ? "cg-dot-active" : ""}
                  style={{
                    height: 10,
                    width: i + 1 === round ? 34 : 26,
                    borderRadius: 5,
                    background: i + 1 < round
                      ? "rgba(229,57,53,.65)"
                      : i + 1 === round
                      ? "#E53935"
                      : "rgba(255,255,255,.1)",
                    transition: "all .4s cubic-bezier(.34,1.56,.64,1)",
                  }}
                />
              ))}
            </div>
            <span style={{ color:"rgba(255,255,255,.5)", fontSize:".9rem", fontWeight:500 }}>{round} / 5</span>
          </div>

          {/* score badge */}
          <div style={{
            background:"linear-gradient(135deg,#8B0000,#E53935)",
            padding:"10px 28px", borderRadius:12,
            boxShadow:"0 6px 24px rgba(229,57,53,.38)",
            display:"flex", alignItems:"center", gap:10,
          }}>
            <span style={{ color:"rgba(255,255,255,.65)", fontSize:".72rem", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase" }}>Score</span>
            <span style={{ color:"white", fontSize:"1.35rem", fontWeight:800 }}>{score}</span>
          </div>
        </div>

        {/* billing notice — minimal */}
        <div style={{ background:"rgba(255,193,7,.07)", border:"1px solid rgba(255,193,7,.18)", borderRadius:10, padding:"9px 16px", marginBottom:20, fontSize:".78rem", color:"rgba(255,193,7,.65)" }}>
          ⚠️ Maps may show a watermark (billing disabled) — guesses still work!
        </div>

        {/* ── Two-column grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(440px,1fr))", gap:24, marginBottom:24 }}>

          {/* Image card — 3D tilt */}
          <div
            className="cg-card-3d"
            onMouseMove={handleTiltMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
              ...glass,
              borderRadius: 20,
              padding: 24,
              transformStyle: "preserve-3d",
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              boxShadow: `
                0 ${12 + Math.abs(tilt.y)*1.5}px ${40 + Math.abs(tilt.x)*2}px rgba(0,0,0,.55),
                inset 0 1px 0 rgba(255,255,255,.1),
                ${tilt.y > 0 ? "-" : ""}${Math.abs(tilt.y)*1.5}px 0 ${Math.abs(tilt.y)*4}px rgba(229,57,53,.12)
              `,
            }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#E53935", boxShadow:"0 0 8px rgba(229,57,53,.9)", flexShrink:0 }} />
              <span style={{ color:"rgba(255,255,255,.5)", fontSize:".72rem", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase" }}>
                Where on campus?
              </span>
            </div>
            <div style={{ borderRadius:14, overflow:"hidden", boxShadow:"0 6px 28px rgba(0,0,0,.5)", transform:"translateZ(22px)" }}>
              <img src={currentImage.url} alt="Location" style={{ width:"100%", height:"auto", display:"block" }} />
            </div>
          </div>

          {/* Map card */}
          <div style={{ ...glass, borderRadius:20, padding:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{
                width:8, height:8, borderRadius:"50%",
                background: guess ? "#00e676" : "rgba(255,255,255,.22)",
                boxShadow: guess ? "0 0 8px rgba(0,230,118,.85)" : "none",
                transition: "all .35s ease",
                flexShrink: 0,
              }}
              className={!guess && !showResult ? "cg-guess-indicator" : ""}
              />
              <span style={{ color:"rgba(255,255,255,.5)", fontSize:".72rem", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase" }}>
                {showResult ? "Result" : guess ? "Ready to submit" : "Click map to guess"}
              </span>
            </div>
            <div style={{ borderRadius:14, overflow:"hidden", boxShadow:"0 6px 28px rgba(0,0,0,.5)" }}>
              <GoogleMap
                mapContainerStyle={{ width:"100%", height:460 }}
                center={{ lat:42.447, lng:-76.484 }}
                zoom={15}
                onClick={showResult ? undefined : onMapClick}
              >
                {guess && <Marker position={guess} label="You" />}
                {showResult && <Marker position={currentImage.location} label="Actual" />}
              </GoogleMap>
            </div>
          </div>
        </div>

        {/* ── Submit button ── */}
        {!showResult && (
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <button
              className="cg-btn"
              onClick={submitGuess}
              disabled={!guess || submitting}
              style={{
                background: !guess || submitting
                  ? "rgba(255,255,255,.07)"
                  : "linear-gradient(135deg,#8B0000,#E53935)",
                color: !guess || submitting ? "rgba(255,255,255,.25)" : "white",
                border: "none",
                padding: "17px 64px",
                borderRadius: 14,
                fontSize: "1.05rem",
                fontWeight: 700,
                cursor: !guess || submitting ? "not-allowed" : "pointer",
                letterSpacing: ".07em",
                textTransform: "uppercase",
                boxShadow: !guess || submitting ? "none" : "0 10px 36px rgba(229,57,53,.38)",
              }}
            >
              {submitting ? "Submitting…" : "Submit Guess →"}
            </button>
          </div>
        )}

        {/* ── Result panel ── */}
        {showResult && (
          <div className="cg-result-enter" style={{ ...glass, borderRadius:20, padding:"44px 40px", textAlign:"center" }}>
            <p style={{ color:"rgba(255,255,255,.35)", fontSize:".72rem", fontWeight:700, letterSpacing:".2em", textTransform:"uppercase", marginBottom:8 }}>
              Round {round} Results
            </p>

            {/* Big round score */}
            <div style={{
              fontSize:"3.4rem", fontWeight:900, lineHeight:1, marginBottom:32,
              background:"linear-gradient(135deg,#ff7070,#E53935)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              +{dispRound} pts
            </div>

            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:14, marginBottom:40 }}>
              <div className="cg-stat" style={{ ...glass, borderRadius:14, padding:"20px 16px" }}>
                <div style={{ fontSize:".68rem", color:"rgba(255,255,255,.35)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>Distance</div>
                <div style={{ fontSize:"1.65rem", fontWeight:800, color:"white" }}>{calculateDistance().toFixed(2)} km</div>
              </div>
              <div className="cg-stat" style={{ background:"rgba(229,57,53,.1)", border:"1px solid rgba(229,57,53,.22)", boxShadow:"0 4px 20px rgba(229,57,53,.15)", borderRadius:14, padding:"20px 16px" }}>
                <div style={{ fontSize:".68rem", color:"rgba(229,57,53,.75)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>Round Score</div>
                <div style={{ fontSize:"1.65rem", fontWeight:800, color:"#E53935" }}>{dispRound}</div>
              </div>
              <div className="cg-stat" style={{ ...glass, borderRadius:14, padding:"20px 16px" }}>
                <div style={{ fontSize:".68rem", color:"rgba(255,255,255,.35)", letterSpacing:".15em", textTransform:"uppercase", marginBottom:8 }}>Total Score</div>
                <div style={{ fontSize:"1.65rem", fontWeight:800, color:"white" }}>{dispTotal}</div>
              </div>
            </div>

            {round < 5 ? (
              <button
                className="cg-btn"
                onClick={handleNextRound}
                style={{
                  background:"linear-gradient(135deg,#8B0000,#E53935)",
                  color:"white", border:"none",
                  padding:"17px 52px", borderRadius:14,
                  fontSize:"1.05rem", fontWeight:700, cursor:"pointer",
                  letterSpacing:".07em", textTransform:"uppercase",
                  boxShadow:"0 10px 36px rgba(229,57,53,.38)",
                }}
              >
                Next Round →
              </button>
            ) : (
              <>
                <div style={{ fontSize:"2.6rem", fontWeight:900, color:"white", marginBottom:6 }}>🎉 Game Over!</div>
                <p style={{ fontSize:"1rem", color:"rgba(255,255,255,.45)", marginBottom:32 }}>
                  Final Score: <strong style={{ color:"#E53935" }}>{score} points</strong>
                </p>
                <button
                  className="cg-btn"
                  onClick={reset}
                  style={{
                    background:"linear-gradient(135deg,#8B0000,#E53935)",
                    color:"white", border:"none",
                    padding:"17px 52px", borderRadius:14,
                    fontSize:"1.05rem", fontWeight:700, cursor:"pointer",
                    letterSpacing:".07em", textTransform:"uppercase",
                    boxShadow:"0 10px 36px rgba(229,57,53,.38)",
                  }}
                >
                  Play Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
