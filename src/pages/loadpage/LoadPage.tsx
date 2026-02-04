import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import top from "../../assets/Top.png";
import ground from "../../assets/Ground.png";
import BgImage from "../../assets/logos1.png";

function LoadPage() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleContinue = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      navigate("/login");
    }, 2200);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ANIMATIONS */}
      <style>{`
        @keyframes floatSlowUp {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }

        @keyframes floatGround {
          0% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
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

        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes riseAndCenter {
          from { transform: translateY(0); }
          to { transform: translateY(-140px); }
        }
      `}</style>

      {/* CENTER ROTATING LOGO */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={BgImage}
          alt=""
          className={`
            opacity-15 grayscale
            transition-all duration-1000 ease-in-out
            animate-[slowSpin_120s_linear_infinite]
            ${isAnimating ? "w-[650px]" : "w-[800px]"}
          `}
        />
      </div>

      {/* TOP FLOATING IMAGE */}
      <img
        src={top}
        alt=""
        className="absolute top-0 right-0 w-[50%] pointer-events-none hidden md:block"
        style={{
          animation: "floatSlowUp 5s ease-in-out infinite",
        }}
      />

      {/* GROUND FLOATING IMAGE (FIXED) */}
      <img
        src={ground}
        alt=""
        className="absolute bottom-[0px] left-0 w-[50%] pointer-events-none hidden md:block"
        style={{
          animation: "floatGround 7s ease-in-out infinite",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1
          className="mb-4 font-semibold tracking-widest"
          style={{
            fontSize: "25px",
            color: "#111",
            animation: isAnimating ? "fadeOut 0.5s ease forwards" : undefined,
          }}
        >
          DICT R7 – TAGBILARAN BOHOL
        </h1>

        <h2
          className="font-extrabold italic leading-[0.88]"
          style={{
            fontSize: "6.5rem",
            animation: isAnimating
              ? "fadeOut 0.5s ease forwards"
              : "floatSlowUp 4s ease-in-out infinite",
            textShadow: `
              0 10px 25px rgba(0,0,0,0.35),
              0 25px 50px rgba(0,0,0,0.15)
            `,
          }}
        >
          <span style={{ color: "rgba(19, 73, 145, 1)" }}>INVENTORY</span>
          <br />
          <span style={{ color: "rgba(229, 32, 37, 1)" }}>SYSTEM</span>
        </h2>

        {/* CONTINUE BUTTON */}
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
            color: "#fff",
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
            <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
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
    </div>
  );
}

export default LoadPage;
