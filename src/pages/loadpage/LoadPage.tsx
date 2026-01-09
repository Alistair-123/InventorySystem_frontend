import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Top from '../../assets/Top.png'
import logo from '../../assets/logos.png'
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
    }, 2000);
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
        transform: translateY(-4px);
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

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
      }}
    >
      <style>{keyframes}</style>

      {/* Institution Header */}
      <h1
        style={{
          fontSize: titleSize,
          fontWeight: 600,
          color: "#111111",
          marginBottom: "1rem",
          letterSpacing: "0.05em",
        }}
      >
        DICT R7 – TAGBILARAN BOHOL
      </h1>

      {/* Title */}
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
          animation: "float 6s ease-in-out infinite",
          textShadow: `
            0 10px 25px rgba(0,0,0,0.35),
            0 25px 50px rgba(0,0,0,0.15)
          `,
          opacity: isAnimating ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        <span style={{ color: "rgba(19, 73, 145, 1)" }}>INVENTORY</span>
        <span style={{ color: "rgba(229, 32, 37, 1)" }}>SYSTEM</span>
      </h2>

      {/* Button */}
      <button
        onClick={handleContinue}
        disabled={isAnimating}
        style={{
          marginTop: "1.2rem",
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
        }}
      >
        {!isAnimating ? (
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              animation: "fadeOut 0.4s ease forwards",
            }}
            className="text-black"
          >
            Continue
          </span>
        ) : (
          <span
            style={{
              width: "20px",
              height: "20px",
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
