import p1 from "/homepage/pic1.jpg";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from "../auth/AuthUserProvider";
import { useEffect, useState } from "react";

type Props = { name: string; img: string; val: number };

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StatBox = (props: Props) => (
  <div className="stat_box">
    <center>
      <img className="stats_img" src={props.img} />
      <p className="stats_p">{props.name}: {props.val}</p>
    </center>
  </div>
);

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

  return (
    <div>
      <center>
        <h1 className="profile_header">
          {user?.displayName ? user.displayName : "Log in to view profile!"}
        </h1>
        <img className="profile_img" src={p1} />
      </center>

      {user && (
        <div style={{ paddingBottom: "2%" }}>
          {loading ? (
            <center><p>Loading stats...</p></center>
          ) : stats ? (
            <Container>
              <Row>
                <Col>
                  <StatBox
                    name="Games Played"
                    img="/profile/crown.png"
                    val={stats.total_games}
                  />
                </Col>
                <Col>
                  <StatBox
                    name="High Score"
                    img="/profile/game.png"
                    val={stats.high_score}
                  />
                </Col>
                <Col>
                  <StatBox
                    name="Average Score"
                    img="/profile/sword.png"
                    val={calc(stats.total_pts, stats.total_games)}
                  />
                </Col>
              </Row>
            </Container>
          ) : (
            <center><p>Failed to load stats.</p></center>
          )}
        </div>
      )}
    </div>
  );
}
