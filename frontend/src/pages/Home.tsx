import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Spiral from "../components/spiral";
import p1 from "/homepage/pic1.jpg";
import p2 from "/homepage/pic2.jpg";
import p3 from "/homepage/pic3.jpg";
import p4 from "/homepage/pic4.jpg";

const images = [
  { original: p1 },
  { original: p2 },
  { original: p3 },
  { original: p4 },
];

const arrowStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.3)", 
  borderRadius: "50%",
  width: "30px",            
  height: "30px",
  display: "flex",            
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",        
  color: "white",             
  cursor: "pointer",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  border: "none",             
};

const renderLeftNav = (onClick: React.MouseEventHandler<HTMLButtonElement>) => (
  <button
    type="button"
    style={{ ...arrowStyle, left: "10px" }}
    onClick={onClick}
    className="image-gallery-custom-left-nav"
  >
    ‹
  </button>
);

const renderRightNav = (onClick: React.MouseEventHandler<HTMLButtonElement>) => (
  <button
    type="button"
    style={{ ...arrowStyle, right: "10px" }}
    onClick={onClick}
    className="image-gallery-custom-right-nav"
  >
    ›
  </button>
);

const HomePage = () => (
  <center>
    <h1 className="padded-vert">Welcome to CornellGuessr!</h1>
    <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
      <ImageGallery
        items={images}
        showFullscreenButton={false}
        showPlayButton={false}
        showNav={true} 
        showThumbnails={false}
        autoPlay={true}
        renderLeftNav={renderLeftNav}
        renderRightNav={renderRightNav}
      />
    </div>
    <h2 className="padded-vert">How to play</h2>
    <p className="play-game">
      During each round of play, you will be shown a picture of a spot on
      Cornell's campus. Use the maps feature to select where you think it is.
      The closer you are to the actual location, the more points you get! Each
      game has 5 rounds, and your goal is get the most points possible by the
      end. Good luck!
    </p>
    <Spiral />
  </center>
);

export default HomePage;
