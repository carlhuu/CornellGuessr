import 'bootstrap/dist/css/bootstrap.min.css';
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
      if (document.visibilityState === "visible") {
        fetchStats();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  // Not logged in state
  if (!user) {
    return (
      <div style={{
        minHeight: "calc(100vh - 70px)",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "60px 40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          textAlign: "center",
        }}>
          <div style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px",
            fontSize: "3rem",
          }}>
            👤
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#B31B1B",
            marginBottom: "20px",
          }}>
            Profile
          </h1>
          <p style={{
            fontSize: "1.1rem",
            color: "#666",
            marginBottom: "40px",
            lineHeight: "1.6",
          }}>
            Log in to view your stats and track your progress!
          </p>
          <button
            onClick={() => signIn()}
            style={{
              background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
              color: "white",
              border: "none",
              padding: "1rem 3rem",
              borderRadius: "12px",
              fontSize: "1.2rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(179, 27, 27, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(179, 27, 27, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(179, 27, 27, 0.3)";
            }}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 70px)",
      width: "100vw",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "40px 20px",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Profile Header */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          marginBottom: "40px",
          textAlign: "center",
        }}>
          {/* Name */}
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#B31B1B",
            marginBottom: "10px",
          }}>
            Hello, {user.displayName}!
          </h1>
          
          {/* Email */}
          <p style={{
            fontSize: "1.1rem",
            color: "#666",
            marginBottom: "0",
          }}>
            {user.email}
          </p>
        </div>

        {/* Stats Section */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        }}>
          <h2 style={{
            fontSize: "2rem",
            fontWeight: "700",
            color: "#B31B1B",
            marginBottom: "30px",
            textAlign: "center",
          }}>
            Your Statistics
          </h2>

          {loading ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#666",
              fontSize: "1.1rem",
            }}>
              <div style={{
                width: "50px",
                height: "50px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #B31B1B",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 1s linear infinite",
              }}></div>
              Loading stats...
            </div>
          ) : stats ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "25px",
            }}>
              {/* Games Played */}
              <div style={{
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                border: "2px solid #dee2e6",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "2rem",
                }}>
                  🎮
                </div>
                <div style={{
                  fontSize: "1rem",
                  color: "#666",
                  fontWeight: "500",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  Games Played
                </div>
                <div style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  color: "#333",
                }}>
                  {stats.total_games}
                </div>
              </div>

              {/* High Score */}
              <div style={{
                background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                border: "2px solid #ffc107",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 193, 7, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "2rem",
                }}>
                  👑
                </div>
                <div style={{
                  fontSize: "1rem",
                  color: "#856404",
                  fontWeight: "500",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  High Score
                </div>
                <div style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  color: "#856404",
                }}>
                  {stats.high_score}
                </div>
              </div>

              {/* Average Score */}
              <div style={{
                background: "linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                border: "2px solid #f5c6cb",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(220, 53, 69, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "2rem",
                }}>
                  📊
                </div>
                <div style={{
                  fontSize: "1rem",
                  color: "#721c24",
                  fontWeight: "500",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  Average Score
                </div>
                <div style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  color: "#721c24",
                }}>
                  {calc(stats.total_pts, stats.total_games)}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#dc3545",
              fontSize: "1.1rem",
            }}>
              ⚠️ Failed to load stats. Please try again later.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
