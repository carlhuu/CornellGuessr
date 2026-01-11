import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
//import Spiral from "../components/spiral";
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
  <div style={{
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "40px 20px",
  }}>
    <div style={{ width: "100%", margin: "0 auto" }}>
      {/* Hero Section */}
      <div style={{
        textAlign: "center",
        marginBottom: "60px",
        animation: "fadeIn 1s ease-in",
      }}>
        <h1 style={{
          fontSize: "4rem",
          fontWeight: "800",
          background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "20px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
        }}>
          Welcome to CornellGuessr!
        </h1>
        <p style={{
          fontSize: "1.25rem",
          color: "#555",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.6",
        }}>
          Test your knowledge of Cornell's beautiful campus
        </p>
      </div>

      {/* Image Gallery Section */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto 80px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        border: "4px solid white",
      }}>
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

      {/* How to Play Section */}
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "60px 40px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        maxWidth: "900px",
        margin: "0 auto 60px",
      }}>
        <h2 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#B31B1B",
          textAlign: "center",
          marginBottom: "30px",
        }}>
          How to Play
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          marginBottom: "40px",
        }}>
          {/* Step 1 */}
          <div style={{
            textAlign: "center",
            padding: "20px",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0 auto 20px",
              boxShadow: "0 4px 15px rgba(179, 27, 27, 0.3)",
            }}>
              1
            </div>
            <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "1.25rem" }}>View Location</h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              See a photo of a spot on Cornell's campus
            </p>
          </div>

          {/* Step 2 */}
          <div style={{
            textAlign: "center",
            padding: "20px",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0 auto 20px",
              boxShadow: "0 4px 15px rgba(179, 27, 27, 0.3)",
            }}>
              2
            </div>
            <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "1.25rem" }}>Make Your Guess</h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Use the map to select where you think it is
            </p>
          </div>

          {/* Step 3 */}
          <div style={{
            textAlign: "center",
            padding: "20px",
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "0 auto 20px",
              boxShadow: "0 4px 15px rgba(179, 27, 27, 0.3)",
            }}>
              3
            </div>
            <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "1.25rem" }}>Score Points</h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Get more points for closer guesses!
            </p>
          </div>
        </div>

        <div style={{
          background: "#f8f9fa",
          borderRadius: "12px",
          padding: "30px",
          borderLeft: "5px solid #B31B1B",
        }}>
          <p style={{
            fontSize: "1.1rem",
            color: "#444",
            lineHeight: "1.8",
            margin: 0,
          }}>
            Each game has <strong>5 rounds</strong>. The closer your guess is to the actual location, 
            the more points you earn. Your goal is to get the highest score possible by the end. 
            Ready to test your Cornell knowledge? <strong>Good luck!</strong>
          </p>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
);

export default HomePage;
