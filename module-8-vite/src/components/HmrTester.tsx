import type React from "react";
import { useState } from "react";

export const HmrTester: React.FC = () => {
  const [renderCount, setRenderCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("Not triggered yet");

  const handleTrigger = () => {
    setRenderCount((prev) => prev + 1);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  return (
    <section
      style={{
        background: "#F4F6F9",
        padding: "1.2rem",
        borderRadius: "8px",
        marginBottom: "1.5rem",
        border: "1px solid #E1E4E8",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1B365D", fontSize: "1.2rem" }}>
        Pengujian Interaktivitas HMR (Native ESM) — Verified
      </h3>
      <p style={{ color: "#333", lineHeight: 1.5 }}>
        Ubah teks pada berkas ini dan simpan. Perhatikan pemutakhiran tampilan secara instan
        (&lt;5ms) tanpa me-reload seluruh halaman atau mereset application state!
      </p>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          type="button"
          onClick={handleTrigger}
          style={{
            background: "#1B365D",
            color: "#fff",
            border: "none",
            padding: "0.6rem 1.2rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "background 0.2s ease",
          }}
        >
          Trigger State Render: {renderCount}
        </button>
        <span style={{ fontSize: "0.85rem", color: "#555" }}>
          Terakhir dipicu: <strong>{lastUpdated}</strong>
        </span>
      </div>
    </section>
  );
};
