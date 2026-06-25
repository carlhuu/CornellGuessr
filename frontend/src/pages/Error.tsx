import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: `
        radial-gradient(circle at 18% 28%, rgba(179,27,27,.18) 0%, transparent 48%),
        radial-gradient(circle at 82% 72%, rgba(63,81,181,.1) 0%, transparent 45%),
        #090912
      `,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
    }}>
      <div style={{
        background: "rgba(255,255,255,.055)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.1)",
        borderRadius: 24,
        padding: "56px 48px",
        maxWidth: 480,
        width: "100%",
        textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg,#8B0000,#E53935)",
          boxShadow: "0 10px 36px rgba(229,57,53,.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", margin: "0 auto 28px",
        }}>⚠️</div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-.02em" }}>
          Oops!
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.45)", lineHeight: 1.7, marginBottom: 8 }}>
          Sorry, an unexpected error has occurred.
        </p>
        <p style={{ fontSize: ".9rem", color: "rgba(229,57,53,.7)", fontStyle: "italic", marginBottom: 36 }}>
          {error.statusText || error.message}
        </p>
        <a href="/" style={{ textDecoration: "none" }}>
          <button style={{
            background: "linear-gradient(135deg,#8B0000,#E53935)",
            color: "white", border: "none",
            padding: "14px 48px", borderRadius: 14,
            fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            letterSpacing: ".07em", textTransform: "uppercase",
            boxShadow: "0 8px 28px rgba(229,57,53,.38)",
            transition: "all .2s ease",
          }}>
            Go Home
          </button>
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
