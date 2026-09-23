import { BuildMetricsTable } from "@/components/BuildMetricsTable";
import { Header } from "@/components/Header";
import { HmrTester } from "@/components/HmrTester";
import { ProjectMatchStatsCard } from "@/components/ProjectMatchStatsCard";
import type { BuildMetric, ProjectMatchWorkspaceStat } from "@/types/metrics";
import type React from "react";
import { useEffect, useState } from "react";

export const App: React.FC = () => {
  const [metrics, setMetrics] = useState<BuildMetric[]>([]);
  const [workspaceStats, setWorkspaceStats] = useState<ProjectMatchWorkspaceStat[]>([]);

  useEffect(() => {
    // Data Indikator Benchmarking Toolchain 2026 (Modul 8 SV UNS)
    setMetrics([
      { tool: "Vite + Esbuild (Go)", buildTimeMs: 280, hmrTimeMs: 4, satisfaction: "98%" },
      { tool: "Tailwind v4 (Rust Oxide)", buildTimeMs: 8, hmrTimeMs: 2, satisfaction: "96%" },
      { tool: "Rolldown (Rust Bundler)", buildTimeMs: 90, hmrTimeMs: 3, satisfaction: "94%" },
      { tool: "Legacy Webpack (JS)", buildTimeMs: 14500, hmrTimeMs: 850, satisfaction: "26%" },
    ]);

    setWorkspaceStats([
      {
        module: "ProjectMatch AI Production",
        componentCount: 37,
        buildEngine: "Next.js 16 + Turbopack (Rust)",
        status: "Production",
      },
      {
        module: "Module 8 Build Workspace",
        componentCount: 5,
        buildEngine: "Vite 6 + Esbuild (Go) + Biome (Rust)",
        status: "Toolchain Demo",
      },
    ]);
  }, []);

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "2rem 1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
        color: "#24292F",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Header />
      <HmrTester />
      <BuildMetricsTable metrics={metrics} />
      <ProjectMatchStatsCard stats={workspaceStats} />
      <footer
        style={{
          borderTop: "1px solid #E1E4E8",
          paddingTop: "1rem",
          fontSize: "0.85rem",
          color: "#57606A",
          textAlign: "center",
        }}
      >
        ProjectMatch AI — Modul Praktikum Bab 8: Build Tools Modern &amp; Rust Toolchain
      </footer>
    </div>
  );
};

export default App;
