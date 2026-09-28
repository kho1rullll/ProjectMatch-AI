import type React from "react";

export const Header: React.FC = () => {
  return (
    <header
      style={{
        borderBottom: "2px solid #1B365D",
        paddingBottom: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#1B365D", margin: 0, fontSize: "1.8rem" }}>
            UNS FastBuild Analytics Dashboard
          </h1>
          <p style={{ color: "#4A607A", margin: "0.5rem 0 0 0", fontSize: "0.95rem" }}>
            Laboratorium RPL — Sekolah Vokasi Universitas Sebelas Maret
          </p>
        </div>
        <div
          style={{
            background: "#E8F0FE",
            color: "#1B365D",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          ProjectMatch AI — Module 8
        </div>
      </div>
    </header>
  );
};
