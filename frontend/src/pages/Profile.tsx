import p1 from "/src/assets/homepage/pic1.jpg";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from "../auth/AuthUserProvider";
import { useEffect, useState } from "react";

type Props = {name: string; img: string; val: number};

const StatBox = (props: Props) => (
    <div className = "stat_box">
        <center>
            <img className = "stats_img" src = {props.img}/>
            <p className = "stats_p">{props.name}: {props.val}</p>
        </center>
        
    </div>
);

type Stats = { high_score: number; total_games: number; total_pts: number};

const getStats = (id: string): Promise<Stats | null> =>
    fetch(`http://localhost:5001/api/stats/${id}`).then((res) => res.json());

export default function Profile() {
    const { user } = useAuth();

    const [stats, setStats] = useState<Stats | null>(null);

    const calc = (total_pts: number, total_games: number) => {
        if (total_games === 0) return 0;
        return Math.floor(total_pts / total_games);
    }

    useEffect(() => {
        console.log("Loading stats ...");
        if (!user) {
            console.log("No user found");
            return;
        }
        console.log("User found: ", user.uid);
        getStats(user.uid).then((data) => {
          console.log(data);
          setStats(data);
        });
      }, []);

    return (
    <div>
        <center>
            <h1 className = "profile_header">
                {user?.displayName ? user.displayName : "Sign in to view profile"}
            </h1>
            <img className = "profile_img" src = {p1}/>
        </center>
        <div style = {{paddingBottom: "2%"}} >
        <Container >
            <Row>
                <Col>
                    <StatBox 
                        name = {"Games Played"} 
                        img = {"/src/assets/profile/crown.png"} 
                        val = {stats? stats.total_games : 0} 
                    />
                </Col>
                <Col>
                    <StatBox 
                        name = {"High Score"} 
                        img = {"/src/assets/profile/game.png"} 
                        val = {stats? stats.high_score : 0} 
                    />
                </Col>
                <Col>
                    <StatBox 
                        name = {"Average Score"} 
                        img = {"/src/assets/profile/sword.png"} 
                        val = {stats? calc(stats.total_pts, stats.total_games) : 0} 
                    />
                </Col>
            </Row>
        </Container>
        </div>
    </div> 
    );
}
