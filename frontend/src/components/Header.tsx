import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signIn, signOut } from "../auth/auth";
import { useAuth } from "../auth/AuthUserProvider";

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const activePath = location.pathname;
  const { user } = useAuth();

  const handleLoginClick = async () => {
    if (user) {
      await signOut();
    } else {
      await signIn();
    }
  };

  const toggle = () => setOpened(!opened);
  const close = () => setOpened(false);

  return (
    <header style={{
      height: "70px",
      background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 2rem",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link 
          to="/" 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <img
            src="big_red.png"
            alt="Logo"
            style={{ 
              height: "40px", 
              width: "40px",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
          <span style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "700",
            letterSpacing: "-0.5px",
          }}>
            CornellGuessr
          </span>
        </Link>

        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}>
          <div style={{
            display: "flex",
            gap: "0.5rem",
          }}
          className="desktop-nav"
          >
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.link}
                onClick={close}
                style={{
                  color: activePath === link.link ? "white" : "rgba(255, 255, 255, 0.85)",
                  textDecoration: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: activePath === link.link ? "600" : "500",
                  backgroundColor: activePath === link.link ? "rgba(255, 255, 255, 0.2)" : "transparent",
                  transition: "all 0.2s ease",
                  backdropFilter: activePath === link.link ? "blur(10px)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (activePath !== link.link) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePath !== link.link) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.85)";
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingLeft: "1rem",
            borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          className="desktop-nav"
          >
            {user && (
              <span style={{
                color: "white",
                fontSize: "0.95rem",
                fontWeight: "500",
              }}>
                Hello, {user.displayName}
              </span>
            )}
            <button
              onClick={handleLoginClick}
              style={{
                background: "white",
                color: "#B31B1B",
                border: "none",
                padding: "0.6rem 1.5rem",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
              }}
            >
              {user ? "Sign out" : "Log in"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggle}
            className="mobile-burger"
            style={{
              display: "none",
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid white",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              width: "40px",
              height: "40px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{
              width: "20px",
              height: "2px",
              backgroundColor: "white",
              display: "block",
              transition: "all 0.3s ease",
              transform: opened ? "rotate(45deg) translateY(6px)" : "none",
            }} />
            <span style={{
              width: "20px",
              height: "2px",
              backgroundColor: "white",
              display: "block",
              transition: "all 0.3s ease",
              opacity: opened ? 0 : 1,
            }} />
            <span style={{
              width: "20px",
              height: "2px",
              backgroundColor: "white",
              display: "block",
              transition: "all 0.3s ease",
              transform: opened ? "rotate(-45deg) translateY(-6px)" : "none",
            }} />
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {opened && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: 0,
            right: 0,
            background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            padding: "1rem",
            animation: "slideDown 0.3s ease",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.link}
              onClick={close}
              style={{
                display: "block",
                color: activePath === link.link ? "white" : "rgba(255, 255, 255, 0.85)",
                textDecoration: "none",
                padding: "1rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: activePath === link.link ? "600" : "500",
                backgroundColor: activePath === link.link ? "rgba(255, 255, 255, 0.2)" : "transparent",
                marginBottom: "0.5rem",
                transition: "all 0.2s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
          
          <div style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            paddingTop: "1rem",
            marginTop: "0.5rem",
          }}>
            {user && (
              <p style={{
                color: "white",
                margin: "0 0 1rem 1rem",
                fontSize: "0.95rem",
              }}>
                Hello, {user.displayName}
              </p>
            )}
            <button
              onClick={handleLoginClick}
              style={{
                width: "100%",
                background: "white",
                color: "#B31B1B",
                border: "none",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {user ? "Sign out" : "Log in"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-burger {
            display: flex !important;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}