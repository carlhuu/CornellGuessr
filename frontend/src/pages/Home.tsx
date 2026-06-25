import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import p1 from "/homepage/pic1.jpg";
import p3 from "/homepage/pic3.jpg";
import p4 from "/homepage/pic4.jpg";

const images = [
  { original: p1 },
  { original: p3 },
  { original: p4 },
];

const glass = {
  background: "rgba(255,255,255,.055)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,.1)",
  boxShadow: "0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.1)",
} as React.CSSProperties;

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  width: "100vw",
  background: `
    radial-gradient(circle at 18% 28%, rgba(179,27,27,.18) 0%, transparent 48%),
    radial-gradient(circle at 82% 72%, rgba(63,81,181,.1)   0%, transparent 45%),
    #090912
  `,
};

const steps = [
  { num: "1", title: "View Location",    desc: "See a photo of a spot on Cornell's campus." },
  { num: "2", title: "Make Your Guess",  desc: "Click the map to pin where you think it is." },
  { num: "3", title: "Score Points",     desc: "Closer guesses earn more points — aim for 1000!" },
];

const arrowStyle: React.CSSProperties = {
  background: "rgba(255,255,255,.12)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,.15)",
  borderRadius: "50%",
  width: 38,
  height: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.3rem",
  color: "white",
  cursor: "pointer",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
};

const renderLeftNav = (onClick: React.MouseEventHandler<HTMLButtonElement>) => (
  <button type="button" style={{ ...arrowStyle, left: 12 }} onClick={onClick}>‹</button>
);
const renderRightNav = (onClick: React.MouseEventHandler<HTMLButtonElement>) => (
  <button type="button" style={{ ...arrowStyle, right: 12 }} onClick={onClick}>›</button>
);

const HomePage = () => (
  <div style={{ ...pageBg, padding: "56px 20px 80px" }}>
    {/* decorative orbs */}
    <div style={{ position:"fixed", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(179,27,27,.1) 0%, transparent 68%)", top:"30%", left:"10%", transform:"translate(-50%,-50%)", pointerEvents:"none", zIndex:0 }} />
    <div style={{ position:"fixed", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(63,81,181,.07) 0%, transparent 68%)", top:"60%", left:"80%", transform:"translate(-50%,-50%)", pointerEvents:"none", zIndex:0 }} />

    <div style={{ maxWidth: 960, margin: "0 auto", position:"relative", zIndex:1 }} className="cg-page-enter">

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: "0 auto 28px",
          background: "linear-gradient(135deg,#8B0000,#E53935)",
          boxShadow: "0 10px 36px rgba(229,57,53,.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem",
        }}>🐻</div>
        <h1 className="cg-title" style={{ fontSize: "3.8rem", fontWeight: 800, marginBottom: 16, letterSpacing: "-.02em", lineHeight: 1.1 }}>
          Welcome to CornellGuessr!
        </h1>
        <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,.45)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Test your knowledge of Cornell's beautiful campus
        </p>
      </div>

      {/* Gallery */}
      <div style={{ ...glass, borderRadius: 20, overflow: "hidden", marginBottom: 48, padding: 0, boxShadow: "0 20px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)" }}>
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

      {/* How to Play */}
      <div style={{ ...glass, borderRadius: 20, padding: "48px 40px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:36, justifyContent:"center" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#E53935", boxShadow:"0 0 8px rgba(229,57,53,.9)" }} />
          <h2 style={{ fontSize:"1.9rem", fontWeight:700, color:"white", margin:0, letterSpacing:"-.01em" }}>
            How to Play
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20, marginBottom:36 }}>
          {steps.map((s, i) => (
            <div key={i} className="cg-stat" style={{ ...glass, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
              <div style={{
                width:60, height:60, borderRadius:"50%",
                background:"linear-gradient(135deg,#8B0000,#E53935)",
                boxShadow:"0 6px 20px rgba(229,57,53,.45)",
                color:"white", fontSize:"1.5rem", fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 18px",
              }}>
                {s.num}
              </div>
              <h3 style={{ color:"white", fontSize:"1.05rem", fontWeight:700, marginBottom:8 }}>{s.title}</h3>
              <p style={{ color:"rgba(255,255,255,.45)", fontSize:".9rem", lineHeight:1.6, margin:0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          background:"rgba(229,57,53,.08)",
          border:"1px solid rgba(229,57,53,.2)",
          borderLeft:"4px solid #E53935",
          borderRadius:12,
          padding:"22px 24px",
          marginBottom:36,
        }}>
          <p style={{ fontSize:"1rem", color:"rgba(255,255,255,.6)", lineHeight:1.8, margin:0 }}>
            Each game has <strong style={{ color:"white" }}>5 rounds</strong>. The closer your guess is to the actual location,
            the more points you earn. Your goal is to get the highest score possible by the end.{" "}
            <strong style={{ color:"#E53935" }}>Good luck!</strong>
          </p>
        </div>

        <div style={{ textAlign:"center" }}>
          <a href="/game" style={{ textDecoration:"none" }}>
            <button className="cg-btn" style={{
              background:"linear-gradient(135deg,#8B0000,#E53935)",
              color:"white", border:"none",
              padding:"14px 52px", borderRadius:14,
              fontSize:"1rem", fontWeight:700, cursor:"pointer",
              letterSpacing:".07em", textTransform:"uppercase",
              boxShadow:"0 8px 28px rgba(229,57,53,.38)",
            }}>
              Play Now →
            </button>
          </a>
        </div>
      </div>

    </div>
  </div>
);

export default HomePage;
