import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoadPage() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const titleSize = "25px";
  const systemSize = "6.5rem";

  const handleContinue = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      navigate("/login");
    }, 2200);
  };

  const keyframes = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
      100% { transform: translateY(0px); }
    }

    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes riseAndCenter {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(-140px);
      }
    }
  `;

  const fadeStyle = isAnimating
    ? { animation: "fadeOut 0.5s ease forwards" }
    : {};

  return (
    <div
      style={{
        backgroundImage: "url(../src/assets/loadpage.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
      }}
    >
      <style>{keyframes}</style>

      <h1
        style={{
          fontSize: titleSize,
          fontWeight: 600,
          color: "#111111",
          marginBottom: "1rem",
          letterSpacing: "0.05em",
          ...fadeStyle,
        }}
      >
        DICT R7 – TAGBILARAN BOHOL
      </h1>

      <h2
        style={{
          fontSize: systemSize,
          fontWeight: 800,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          lineHeight: "0.88",
          fontStyle: "italic",
          animation: isAnimating
            ? "fadeOut 0.5s ease forwards"
            : "float 6s ease-in-out infinite",
          textShadow: `
            0 10px 25px rgba(0,0,0,0.35),
            0 25px 50px rgba(0,0,0,0.15)
          `,
        }}
      >
        <span style={{ color: "rgba(19, 73, 145, 1)" }}>INVENTORY</span>
        <span style={{ color: "rgba(229, 32, 37, 1)" }}>SYSTEM</span>
      </h2>

      <button
        onClick={handleContinue}
        disabled={isAnimating}
        style={{
          marginTop: "1.5rem",
          height: "52px",
          width: isAnimating ? "56px" : "220px",
          borderRadius: "999px",
          border: "none",
          cursor: isAnimating ? "default" : "pointer",
          backgroundColor: "rgba(19, 73, 145, 1)",
          color: "#ffffff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          transition: "width 0.6s ease, box-shadow 0.3s ease",
          animation: isAnimating ? "riseAndCenter 0.8s ease forwards" : "none",
        }}
      >
        {!isAnimating ? (
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Continue
          </span>
        ) : (
          <span
            style={{
              width: "22px",
              height: "22px",
              border: "3px solid rgba(255,255,255,0.3)",
              borderTopColor: "#ffffff",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
        )}
      </button>
    </div>
  );
}

export default LoadPage;
