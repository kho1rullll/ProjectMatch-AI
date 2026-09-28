export interface BuildMetric {
  tool: string;
  buildTimeMs: number;
  hmrTimeMs: number;
  satisfaction: string;
}

export interface ProjectMatchWorkspaceStat {
  module: string;
  componentCount: number;
  buildEngine: string;
  status: "Production" | "Experimental" | "Toolchain Demo";
}
