import type { ProjectMatchWorkspaceStat } from "@/types/metrics";
import type React from "react";

interface ProjectMatchStatsCardProps {
  stats: ProjectMatchWorkspaceStat[];
}

export const ProjectMatchStatsCard: React.FC<ProjectMatchStatsCardProps> = ({ stats }) => {
  return (
    <section
      style={{
        background: "#FFFFFF",
        border: "1px solid #E1E4E8",
        borderRadius: "8px",
        padding: "1.2rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#1B365D", fontSize: "1.15rem" }}>
        Status Arsitektur ProjectMatch AI Workspaces
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {stats.map((item) => (
          <div
            key={item.module}
            style={{
              padding: "1rem",
              borderRadius: "6px",
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "#64748B",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {item.status}
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "#1E293B",
                marginTop: "0.25rem",
              }}
            >
              {item.module}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#475569", marginTop: "0.5rem" }}>
              <strong>Engine:</strong> {item.buildEngine}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#475569", marginTop: "0.2rem" }}>
              <strong>UI Components:</strong> {item.componentCount}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
