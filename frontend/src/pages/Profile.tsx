import p1 from "/src/assets/homepage/pic1.jpg";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {name: string; img: string; val: number};

const StatBox = (props: Props) => (
    <div className = "stat_box">
        <center>
            <img className = "stats_img" src = {props.img}/>
            <p className = "stats_p">{props.name}: {props.val}</p>
        </center>
        
    </div>
);

const Profile = () => (
    <div>
        <center>
            <h1 className = "profile_header">
                Username
            </h1>
            <img className = "profile_img" src = {p1}/>
        </center>
        
        <Container >
            <Row>
                <Col>
                    <StatBox 
                        name = {"Games Played"} 
                        img = {"/src/assets/profile/crown.png"} 
                        val = {10} 
                    />
                </Col>
                <Col>
                    <StatBox 
                        name = {"High Score"} 
                        img = {"/src/assets/profile/game.png"} 
                        val = {10020} 
                    />
                </Col>
                <Col>
                    <StatBox 
                        name = {"Average Score"} 
                        img = {"/src/assets/profile/sword.png"} 
                        val = {2990} 
                    />
                </Col>
            </Row>
        </Container>

    </div>
);

export default Profile;
