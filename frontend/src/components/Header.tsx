import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signIn, signOut } from "../auth/auth";
import { useAuth } from "../auth/AuthUserProvider";

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const activePath = location.pathname;
  const { user } = useAuth();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "";
  const firstName = user?.displayName?.split(" ")[0] ?? "";

  const handleAuth = async () => {
    if (user) await signOut();
    else await signIn();
    setMobileOpen(false);
  };

  return (
    <>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(246,244,239,.92)",
        backdropFilter: "saturate(140%) blur(8px)",
        WebkitBackdropFilter: "saturate(140%) blur(8px)",
        borderBottom: "1px solid rgba(27,26,24,.09)",
      }}>
        <div style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 32px",
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <img src="/big_red.png" alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
            <span style={{
              fontFamily: "'Newsreader', serif",
              fontSize: 20,
              fontWeight: 600,
              color: "#1B1A18",
              letterSpacing: "-.01em",
            }}>
              Cornell<span style={{ color: "#B31B1B" }}>Guessr</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="cg-desktop-nav">
            {links.filter(l => l.link !== "/").map(l => (
              <Link
                key={l.link}
                to={l.link}
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: activePath === l.link ? "#1B1A18" : "#6B6862",
                  textDecoration: "none",
                  transition: "color .15s",
                }}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 24,
                borderLeft: "1px solid rgba(27,26,24,.12)",
              }}>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#2F3E52",
                  color: "#fff",
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: "#1B1A18" }}>
                  {firstName}
                </span>
                <button
                  onClick={handleAuth}
                  style={{
                    fontFamily: "'Geist', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6B6862",
                    background: "transparent",
                    border: "1px solid rgba(27,26,24,.2)",
                    padding: "6px 14px",
                    borderRadius: 7,
                    cursor: "pointer",
                    marginLeft: 4,
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuth}
                className="cg-btn"
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  background: "#B31B1B",
                  border: "none",
                  padding: "9px 20px",
                  borderRadius: 7,
                  cursor: "pointer",
                  boxShadow: "0 8px 18px -8px rgba(179,27,27,.5)",
                }}
              >
                Log in
              </button>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="cg-mobile-burger"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "none",
              flexDirection: "column",
              gap: 5,
            }}
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block",
                width: 22,
                height: 2,
                background: "#1B1A18",
                borderRadius: 2,
                transition: "all .2s",
              }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: "rgba(246,244,239,.98)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(27,26,24,.08)",
            padding: "12px 24px 20px",
          }}>
            {links.filter(l => l.link !== "/").map(l => (
              <Link
                key={l.link}
                to={l.link}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 15,
                  fontWeight: 500,
                  color: activePath === l.link ? "#B31B1B" : "#1B1A18",
                  textDecoration: "none",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(27,26,24,.07)",
                }}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={handleAuth}
              style={{
                marginTop: 16,
                width: "100%",
                fontFamily: "'Geist', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: "#B31B1B",
                border: "none",
                padding: "13px 0",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {user ? "Sign out" : "Log in"}
            </button>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 640px) {
          .cg-desktop-nav { display: none !important; }
          .cg-mobile-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
