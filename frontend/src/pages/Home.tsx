import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const galleryItems = [
  { img: "/homepage/pic1.jpg",  name: "Libe Slope" },
  { img: "/game_images/baker.png",   name: "Baker Laboratory" },
  { img: "/game_images/statler.png", name: "Statler Hall" },
  { img: "/game_images/klarman.png", name: "Klarman Hall" },
  { img: "/game_images/olin.png",    name: "Olin Library" },
];

const steps = [
  {
    num: "01",
    title: "See the photo",
    desc: "A single image from somewhere on Cornell's campus. No labels, no hints — just your memory.",
  },
  {
    num: "02",
    title: "Drop your pin",
    desc: "Click the campus map exactly where you think the photo was taken.",
  },
  {
    num: "03",
    title: "Score the round",
    desc: "The closer your pin, the more points. Five rounds, one shot at a perfect 5,000.",
  },
];

const mono: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
};

const serif: React.CSSProperties = {
  fontFamily: "'Newsreader', serif",
};

const sans: React.CSSProperties = {
  fontFamily: "'Geist', sans-serif",
};

export default function HomePage() {
  const heroImgRef = useRef<HTMLImageElement>(null);

  // Parallax hero
  useEffect(() => {
    const onScroll = () => {
      if (heroImgRef.current) {
        const y = window.scrollY || 0;
        heroImgRef.current.style.transform = `translateY(${y * 0.10}px) scale(1.05)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer reveals
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => {
      if (!e.classList.contains("in")) io.observe(e);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F6F4EF" }}>
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(34px);
          transition: opacity 1s cubic-bezier(.2,.7,.3,1), transform 1s cubic-bezier(.2,.7,.3,1);
        }
        [data-reveal].in { opacity: 1; transform: none; }
        .gcard { transition: transform .5s cubic-bezier(.2,.7,.3,1); }
        .gcard:hover { transform: translateY(-6px); }
        .gcard:hover img { transform: scale(1.06); }
        .lift { transition: transform .25s cubic-bezier(.2,.7,.3,1), box-shadow .25s; }
        .lift:hover { transform: translateY(-2px); }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 32px 0" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.02fr .98fr",
          gap: 54,
          alignItems: "center",
          minHeight: "78vh",
        }}>
          <div>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".2em", color: "#B31B1B", marginBottom: 24 }}>
              A CAMPUS GUESSING GAME
            </div>
            <h1 style={{
              ...serif,
              fontWeight: 600,
              fontSize: "clamp(48px,6vw,74px)",
              lineHeight: 1.0,
              letterSpacing: "-.022em",
              color: "#1B1A18",
              margin: 0,
            }}>
              Think you know<br />
              Cornell?<span style={{ fontStyle: "italic", fontWeight: 500, color: "#B31B1B" }}> Prove it.</span>
            </h1>
            <p style={{
              ...sans,
              fontSize: 18,
              lineHeight: 1.65,
              color: "#5c5953",
              maxWidth: 440,
              margin: "28px 0 0",
            }}>
              You'll see a photo from somewhere on campus — Libe Slope, the depths of Duffield, a corner of the Botanic Gardens. Drop a pin. The closer you land, the more you score.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 38 }}>
              <Link to="/play">
                <button className="cg-btn lift" style={{
                  ...sans,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#B31B1B",
                  border: "none",
                  padding: "16px 34px",
                  borderRadius: 8,
                  cursor: "pointer",
                  boxShadow: "0 12px 26px -8px rgba(179,27,27,.5)",
                }}>
                  Play now
                </button>
              </Link>
              <a href="#how" style={{
                ...sans,
                fontSize: 15,
                fontWeight: 500,
                color: "#1B1A18",
                textDecoration: "none",
                borderBottom: "1.5px solid rgba(27,26,24,.25)",
                paddingBottom: 2,
              }}>
                How it works
              </a>
            </div>
            <div style={{ ...mono, fontSize: 12, color: "#908d86", marginTop: 42, letterSpacing: ".02em" }}>
              5 ROUNDS &nbsp;·&nbsp; 1,000 POINTS A ROUND
            </div>
          </div>

          <div style={{
            position: "relative",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 40px 80px -28px rgba(20,18,16,.62)",
          }}>
            <img
              ref={heroImgRef}
              src="/homepage/pic3.jpg"
              alt="Cornell campus"
              style={{ width: "100%", height: 560, objectFit: "cover", display: "block", willChange: "transform" }}
            />
            <div style={{
              position: "absolute",
              left: 18,
              bottom: 18,
              background: "#1B1A18",
              color: "#fff",
              ...mono,
              fontSize: 11,
              letterSpacing: ".08em",
              padding: "8px 13px",
              borderRadius: 5,
            }}>
              LIBE SLOPE
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="how" style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 32px 40px" }}>
        <div data-reveal style={{ ...mono, fontSize: 12, letterSpacing: ".2em", color: "#908d86", marginBottom: 14 }}>
          HOW IT WORKS
        </div>
        <h2 data-reveal style={{
          ...serif,
          fontSize: "clamp(32px,4vw,46px)",
          fontWeight: 500,
          letterSpacing: "-.02em",
          color: "#1B1A18",
          margin: "0 0 56px",
          maxWidth: 620,
          lineHeight: 1.08,
        }}>
          Three steps.{" "}
          <span style={{ fontStyle: "italic", color: "#B31B1B" }}>Five rounds.</span>{" "}
          One very specific corner of upstate New York.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
          {steps.map((s, i) => (
            <div
              key={i}
              data-reveal
              style={{
                padding: i === 0 ? "4px 38px 4px 0" : i === 2 ? "4px 0 4px 38px" : "4px 38px",
                borderRight: i < 2 ? "1px solid rgba(27,26,24,.1)" : "none",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{ ...serif, fontSize: 46, fontWeight: 500, color: "#B31B1B", lineHeight: 1 }}>{s.num}</div>
              <h3 style={{ ...sans, fontSize: 19, fontWeight: 600, color: "#1B1A18", margin: "20px 0 9px" }}>{s.title}</h3>
              <p style={{ ...sans, fontSize: 15, lineHeight: 1.6, color: "#5c5953", margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED LOCATIONS ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "110px 32px 40px" }}>
        <div data-reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <div style={{ ...mono, fontSize: 12, letterSpacing: ".2em", color: "#908d86", marginBottom: 14 }}>
              ON THE BOARD
            </div>
            <h2 style={{ ...serif, fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 500, letterSpacing: "-.02em", color: "#1B1A18", margin: 0 }}>
              A few places you might land.
            </h2>
          </div>
          <span style={{ ...sans, fontSize: 14, color: "#908d86" }}>20 locations and counting</span>
        </div>

        <div data-reveal style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
          {galleryItems.map((g, i) => (
            <div
              key={i}
              className="gcard"
              style={{
                borderRadius: 11,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 14px 32px -18px rgba(20,18,16,.45)",
                border: "1px solid rgba(27,26,24,.07)",
                cursor: "pointer",
              }}
            >
              <div style={{ overflow: "hidden", height: 150 }}>
                <img
                  src={g.img}
                  alt={g.name}
                  style={{ width: "100%", height: 150, objectFit: "cover", display: "block", transition: "transform .6s cubic-bezier(.2,.7,.3,1)" }}
                />
              </div>
              <div style={{ padding: "13px 14px", ...mono, fontSize: 11, letterSpacing: ".04em", color: "#5c5953" }}>
                {g.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EDITORIAL QUOTE ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "130px 32px 120px", textAlign: "center" }}>
        <p data-reveal style={{
          ...serif,
          fontSize: "clamp(24px,3.5vw,40px)",
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.32,
          letterSpacing: "-.01em",
          color: "#1B1A18",
          margin: 0,
        }}>
          "You walk past these buildings a thousand times.{" "}
          <span style={{ fontStyle: "normal", color: "#B31B1B" }}>Now find out if you were ever really looking.</span>"
        </p>
      </div>

      {/* ── CTA BANNER ── */}
      <div data-reveal style={{ maxWidth: 1240, margin: "0 auto 96px", padding: "0 32px" }}>
        <div style={{
          background: "#1B1A18",
          borderRadius: 18,
          padding: "72px 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          position: "relative",
          gap: 32,
        }}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{ ...serif, fontSize: "clamp(28px,3.8vw,44px)", fontWeight: 500, color: "#F6F4EF", margin: 0, letterSpacing: "-.015em" }}>
              Ready to find your way?
            </h2>
            <p style={{ ...sans, fontSize: 16, color: "#9b978f", margin: "14px 0 0" }}>
              Sign in with your Google account to start playing.
            </p>
          </div>
          <Link to="/play" style={{ flexShrink: 0 }}>
            <button className="cg-btn lift" style={{
              position: "relative",
              zIndex: 2,
              ...sans,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              background: "#B31B1B",
              border: "none",
              padding: "17px 40px",
              borderRadius: 9,
              cursor: "pointer",
              boxShadow: "0 14px 30px -8px rgba(179,27,27,.55)",
              whiteSpace: "nowrap",
            }}>
              Start playing →
            </button>
          </Link>
          <img
            src="/homepage/pic1.jpg"
            alt=""
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              width: "42%",
              objectFit: "cover",
              opacity: .16,
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ borderTop: "1px solid rgba(27,26,24,.1)" }}>
        <div style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "34px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/big_red.png" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span style={{ ...serif, fontSize: 16, fontWeight: 600, color: "#1B1A18" }}>CornellGuessr</span>
          </div>
          <span style={{ ...mono, fontSize: 11, letterSpacing: ".06em", color: "#a8a49c" }}>
            A STUDENT-MADE GAME · ITHACA, NY
          </span>
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img-wrap { display: none !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-grid > div { border-right: none !important; border-bottom: 1px solid rgba(27,26,24,.1); padding: 24px 0 !important; }
          .gallery-grid { grid-template-columns: repeat(2,1fr) !important; }
          .cta-inner { flex-direction: column !important; padding: 48px 32px !important; }
        }
      `}</style>
    </div>
  );
}
