import type { BuildMetric } from "@/types/metrics";
import type React from "react";

interface BuildMetricsTableProps {
  metrics: BuildMetric[];
}

export const BuildMetricsTable: React.FC<BuildMetricsTableProps> = ({ metrics }) => {
  return (
    <section style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ color: "#1B365D", fontSize: "1.2rem", marginBottom: "0.8rem" }}>
        Metrik Performa Build Tools Modern (2026 Reference)
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#1B365D", color: "#fff" }}>
              <th style={{ padding: "0.6rem" }}>Build Toolchain</th>
              <th style={{ padding: "0.6rem" }}>Build Time</th>
              <th style={{ padding: "0.6rem" }}>HMR Latency</th>
              <th style={{ padding: "0.6rem" }}>Kepuasan</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, idx) => {
              const isEven = idx % 2 === 0;
              const isLegacy = m.tool.toLowerCase().includes("legacy");
              return (
                <tr
                  key={m.tool}
                  style={{
                    background: isEven ? "#fff" : "#F4F6F9",
                    borderBottom: "1px solid #D0D7DE",
                  }}
                >
                  <td style={{ padding: "0.6rem", fontWeight: "bold" }}>{m.tool}</td>
                  <td style={{ padding: "0.6rem" }}>{m.buildTimeMs} ms</td>
                  <td style={{ padding: "0.6rem" }}>{m.hmrTimeMs} ms</td>
                  <td
                    style={{
                      padding: "0.6rem",
                      color: isLegacy ? "#D73A49" : "#28A745",
                      fontWeight: "bold",
                    }}
                  >
                    {m.satisfaction}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
