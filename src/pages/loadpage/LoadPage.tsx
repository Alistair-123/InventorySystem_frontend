import React from "react";

function LoadPage() {
    const titleSize = "2rem";
  const systemSize = "6.5rem";
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
        color: "#ffffff",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: titleSize,
        color: "#000000ff",
       }}>
        DICT R7 – TAGBILARAN BOHOL
      </h1>

      <h2 style={{ fontSize: systemSize }}>
        <span style={{ color: "#2563eb" }}>INVENTORY</span>{" "}
        <br></br>
        <span style={{ color: "#dc2626" }}>SYSTEM</span>
      </h2>
    </div>
  );
}

export default LoadPage;
