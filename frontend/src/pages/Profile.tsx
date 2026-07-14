import { useAuth } from "../auth/AuthUserProvider";
import { useEffect, useState } from "react";
import { signIn, signOut } from "../auth/auth";
import { Link } from "react-router-dom";
import { loadHistory, type GameRecord } from "./Game";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type Stats = { high_score: number; total_games: number; total_pts: number };

const getStats = async (id: string): Promise<Stats | null> => {
  const res = await fetch(`${backendUrl}/api/stats/${id}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

const mono: React.CSSProperties = { fontFamily: "'Geist Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Newsreader', serif" };
const sans: React.CSSProperties  = { fontFamily: "'Geist', sans-serif" };

const pageBg: React.CSSProperties = {
  minHeight: "calc(100vh - 64px)",
  background: "#F6F4EF",
};

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<GameRecord[]>([]);

  const avgScore = (stats: Stats) => {
    if (stats.total_games === 0) return 0;
    return Math.floor(stats.total_pts / stats.total_games);
  };

  useEffect(() => {
    setHistory(loadHistory());

    const fetchStats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await getStats(user.uid);
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setHistory(loadHistory());
        fetchStats();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ ...pageBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="cg-page-enter" style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid rgba(27,26,24,.07)",
          boxShadow: "0 30px 60px -28px rgba(20,18,16,.35)",
          padding: "72px 56px",
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#2F3E52",
            color: "#fff",
            ...sans,
            fontSize: 26,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}>?</div>
          <h1 style={{ ...serif, fontSize: 34, fontWeight: 600, color: "#1B1A18", marginBottom: 12, letterSpacing: "-.02em" }}>
            Your profile
          </h1>
          <p style={{ ...sans, fontSize: 15, color: "#5c5953", lineHeight: 1.65, marginBottom: 36 }}>
            Sign in with your Cornell Google account and your stats and past games show up here.
          </p>
          <button
            className="cg-btn"
            onClick={() => signIn()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              ...sans,
              fontSize: 15,
              fontWeight: 600,
              color: "#1B1A18",
              background: "#fff",
              border: "1px solid rgba(27,26,24,.18)",
              padding: "14px 26px",
              borderRadius: 9,
              cursor: "pointer",
              boxShadow: "0 8px 20px -10px rgba(20,18,16,.4)",
              margin: "0 auto",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 17, color: "#B31B1B" }}>G</span>
            Continue with Google
          </button>
          <span style={{ ...sans, fontSize: 13, color: "#a8a49c", display: "block", marginTop: 18 }}>
            Just for saving your games. We're not doing anything else with it.
          </span>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...pageBg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div className="cg-spinner" style={{ borderTopColor: "#B31B1B", borderColor: "rgba(27,26,24,.08)" }} />
        <span style={{ ...mono, color: "#908d86", fontSize: ".85rem", letterSpacing: ".12em" }}>LOADING STATS</span>
      </div>
    );
  }

  // ── Profile ───────────────────────────────────────────────────────────────
  return (
    <div style={{ ...pageBg, padding: "52px 32px 100px" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }} className="cg-page-enter">

        {/* Header row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          paddingBottom: 34,
          borderBottom: "1px solid rgba(27,26,24,.1)",
        }}>
          <div style={{
            width: 74,
            height: 74,
            borderRadius: "50%",
            background: "#2F3E52",
            color: "#fff",
            ...sans,
            fontSize: 26,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ ...mono, fontSize: 11, letterSpacing: ".2em", color: "#908d86", marginBottom: 8 }}>YOUR PROFILE</div>
            <h1 style={{ ...serif, fontSize: 38, fontWeight: 600, letterSpacing: "-.02em", color: "#1B1A18", margin: 0, lineHeight: 1 }}>
              {user.displayName}
            </h1>
            <div style={{ ...sans, fontSize: 14, color: "#908d86", marginTop: 8 }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={() => signOut()}
            style={{
              marginLeft: "auto",
              alignSelf: "flex-start",
              ...sans,
              fontSize: 14,
              fontWeight: 600,
              color: "#1B1A18",
              background: "transparent",
              border: "1px solid rgba(27,26,24,.2)",
              padding: "10px 20px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, margin: "34px 0 56px" }}>
          <div className="cg-stat" style={{
            background: "#fff",
            border: "1px solid rgba(27,26,24,.08)",
            borderRadius: 14,
            padding: 26,
          }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: ".14em", color: "#908d86", marginBottom: 12 }}>
              GAMES PLAYED
            </div>
            <div style={{ ...serif, fontSize: 42, fontWeight: 600, color: "#1B1A18", lineHeight: 1 }}>
              {stats?.total_games ?? "-"}
            </div>
          </div>

          <div className="cg-stat" style={{
            background: "#fff",
            border: "1px solid rgba(27,26,24,.08)",
            borderRadius: 14,
            padding: 26,
          }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: ".14em", color: "#B31B1B", marginBottom: 12 }}>
              BEST SCORE
            </div>
            <div style={{ ...serif, fontSize: 42, fontWeight: 600, color: "#B31B1B", lineHeight: 1 }}>
              {stats ? stats.high_score.toLocaleString() : "-"}
            </div>
          </div>

          <div className="cg-stat" style={{
            background: "#fff",
            border: "1px solid rgba(27,26,24,.08)",
            borderRadius: 14,
            padding: 26,
          }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: ".14em", color: "#908d86", marginBottom: 12 }}>
              AVERAGE SCORE
            </div>
            <div style={{ ...serif, fontSize: 42, fontWeight: 600, color: "#1B1A18", lineHeight: 1 }}>
              {stats ? avgScore(stats).toLocaleString() : "-"}
            </div>
          </div>
        </div>

        {/* New game CTA row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ ...mono, fontSize: 12, letterSpacing: ".2em", color: "#908d86" }}>GAME HISTORY</div>
          <Link to="/play">
            <button className="cg-btn" style={{
              ...sans,
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: "#B31B1B",
              border: "none",
              padding: "11px 24px",
              borderRadius: 8,
              cursor: "pointer",
              boxShadow: "0 10px 22px -8px rgba(179,27,27,.5)",
            }}>
              New game →
            </button>
          </Link>
        </div>

        {history.length === 0 ? (
          <div style={{
            background: "#fff",
            border: "1px solid rgba(27,26,24,.08)",
            borderRadius: 14,
            padding: "56px 32px",
            textAlign: "center",
          }}>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".14em", color: "#908d86", marginBottom: 16 }}>NO GAMES YET</div>
            <p style={{ ...sans, fontSize: 16, color: "#5c5953", margin: 0 }}>
              Nothing here yet. Play a round and it'll show up.
            </p>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px solid rgba(27,26,24,.08)", borderRadius: 14, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "flex", alignItems: "center", padding: "12px 26px", borderBottom: "1px solid rgba(27,26,24,.07)", background: "#F6F4EF" }}>
              <span style={{ ...mono, fontSize: 10, letterSpacing: ".14em", color: "#908d86", minWidth: 118 }}>DATE</span>
              <span style={{ ...mono, fontSize: 10, letterSpacing: ".14em", color: "#908d86", flex: 1 }}>ROUNDS</span>
              <span style={{ ...mono, fontSize: 10, letterSpacing: ".14em", color: "#908d86", minWidth: 84, textAlign: "right" }}>TOTAL</span>
            </div>
            {/* Rows */}
            {history.map((game, gi) => (
              <div key={gi} style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 26px", borderBottom: gi < history.length - 1 ? "1px solid rgba(27,26,24,.07)" : "none" }}>
                <div style={{ minWidth: 118 }}>
                  <div style={{ ...sans, fontSize: 15, fontWeight: 600, color: "#1B1A18" }}>{game.date}</div>
                  <div style={{ ...mono, fontSize: 11, letterSpacing: ".06em", color: "#a8a49c", marginTop: 3 }}>
                    {game.rounds.length} ROUNDS
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", gap: 7 }}>
                  {game.rounds.map((r, ri) => (
                    <div key={ri} style={{ flex: 1, background: "#F6F4EF", borderRadius: 7, padding: "9px 6px", textAlign: "center", minWidth: 0 }}>
                      <div style={{ ...mono, fontSize: 9, letterSpacing: ".02em", color: "#a8a49c" }}>
                        R{ri + 1}
                      </div>
                      <div style={{ ...sans, fontSize: 15, fontWeight: 600, color: "#1B1A18", marginTop: 3 }}>{r.pts}</div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "right", minWidth: 84 }}>
                  <div style={{ ...serif, fontSize: 30, fontWeight: 600, color: "#B31B1B", lineHeight: 1 }}>
                    {game.score.toLocaleString()}
                  </div>
                  <div style={{ ...mono, fontSize: 10, letterSpacing: ".1em", color: "#a8a49c", marginTop: 4 }}>POINTS</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
