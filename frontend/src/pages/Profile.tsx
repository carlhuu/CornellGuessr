import { useAuth } from "../auth/AuthUserProvider";
import { useEffect, useState } from "react";
import { signIn } from "../auth/auth";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type Stats = { high_score: number; total_games: number; total_pts: number };

const getStats = async (id: string): Promise<Stats | null> => {
  const res = await fetch(`${backendUrl}/api/stats/${id}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
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

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const calc = (total_pts: number, total_games: number) => {
    if (total_games === 0) return 0;
    return Math.floor(total_pts / total_games);
  };

  useEffect(() => {
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
      if (document.visibilityState === "visible") fetchStats();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  // ── Not logged in ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ ...pageBg, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div className="cg-page-enter" style={{ ...glass, borderRadius:28, padding:"64px 48px", maxWidth:480, width:"100%", textAlign:"center" }}>
          <div style={{
            width:72, height:72, borderRadius:20, margin:"0 auto 28px",
            background:"linear-gradient(135deg,#8B0000,#E53935)",
            boxShadow:"0 10px 36px rgba(229,57,53,.55)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem",
          }}>👤</div>
          <h1 style={{ fontSize:"2.2rem", fontWeight:800, color:"white", marginBottom:12, letterSpacing:"-.02em" }}>Profile</h1>
          <p style={{ fontSize:"1rem", color:"rgba(255,255,255,.45)", lineHeight:1.7, marginBottom:36 }}>
            Log in to view your stats and track your progress!
          </p>
          <button
            className="cg-btn"
            onClick={() => signIn()}
            style={{
              background:"linear-gradient(135deg,#8B0000,#E53935)",
              color:"white", border:"none",
              padding:"16px 0", borderRadius:14, width:"100%",
              fontSize:"1.05rem", fontWeight:700, cursor:"pointer",
              letterSpacing:".06em", textTransform:"uppercase",
              boxShadow:"0 10px 36px rgba(229,57,53,.45)",
            }}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...pageBg, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
        <div className="cg-spinner" />
        <span style={{ color:"rgba(255,255,255,.4)", fontSize:".85rem", letterSpacing:".12em" }}>LOADING STATS</span>
      </div>
    );
  }

  const statCards = stats ? [
    {
      icon: "🎮",
      label: "Games Played",
      value: stats.total_games,
      style: glass,
      valueColor: "white",
      labelColor: "rgba(255,255,255,.4)",
    },
    {
      icon: "👑",
      label: "High Score",
      value: stats.high_score,
      style: { background:"rgba(229,57,53,.1)", border:"1px solid rgba(229,57,53,.22)", boxShadow:"0 4px 20px rgba(229,57,53,.15)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" } as React.CSSProperties,
      valueColor: "#E53935",
      labelColor: "rgba(229,57,53,.75)",
    },
    {
      icon: "📊",
      label: "Average Score",
      value: calc(stats.total_pts, stats.total_games),
      style: glass,
      valueColor: "white",
      labelColor: "rgba(255,255,255,.4)",
    },
  ] : [];

  // ── Profile ──────────────────────────────────────────────────────────────
  return (
    <div style={{ ...pageBg, padding:"32px 20px" }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }} className="cg-page-enter">

        {/* Profile header */}
        <div style={{ ...glass, borderRadius:20, padding:"40px", marginBottom:24, textAlign:"center" }}>
          <div style={{
            width:80, height:80, borderRadius:"50%",
            background:"linear-gradient(135deg,#8B0000,#E53935)",
            boxShadow:"0 8px 28px rgba(229,57,53,.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 20px",
            fontSize:"2rem", fontWeight:800, color:"white",
          }}>
            {user.displayName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <h1 style={{ fontSize:"2rem", fontWeight:800, color:"white", marginBottom:6, letterSpacing:"-.02em" }}>
            Hello, {user.displayName}!
          </h1>
          <p style={{ fontSize:".95rem", color:"rgba(255,255,255,.35)", margin:0 }}>{user.email}</p>
        </div>

        {/* Stats */}
        <div style={{ ...glass, borderRadius:20, padding:"40px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, justifyContent:"center" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#E53935", boxShadow:"0 0 8px rgba(229,57,53,.9)" }} />
            <h2 style={{ fontSize:"1.6rem", fontWeight:700, color:"white", margin:0, letterSpacing:"-.01em" }}>
              Your Statistics
            </h2>
          </div>

          {stats ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:20 }}>
              {statCards.map((c, i) => (
                <div key={i} className="cg-stat" style={{ ...c.style, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:"2.4rem", marginBottom:14 }}>{c.icon}</div>
                  <div style={{ fontSize:".72rem", color:c.labelColor, letterSpacing:".15em", textTransform:"uppercase", marginBottom:10, fontWeight:700 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize:"3rem", fontWeight:800, color:c.valueColor, lineHeight:1 }}>{c.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"rgba(229,57,53,.75)", fontSize:"1rem" }}>
              ⚠️ Failed to load stats. Please try again later.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
