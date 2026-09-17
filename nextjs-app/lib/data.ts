export interface RequirementsBreakdown {
  frontend: number;
  backend: number;
  uiux: number;
  aiml: number;
  architecture: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  company: string;
  category: string;
  matchScore: number;
  similarityMetric: number;
  workType: string;
  duration: string;
  stipend: string;
  description: string;
  skillsRequired: string[];
  requirementsBreakdown: RequirementsBreakdown;
  verified: boolean;
  postedAt: string;
}

export const ALL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-001",
    title: "Pengembangan Engine NLP Berbasis Transformer untuk Riset Medis",
    company: "BioInformatika Nusantara & RS Cipto",
    category: "AI & Machine Learning",
    matchScore: 94,
    similarityMetric: 0.942,
    workType: "Hybrid (Jakarta Pusat)",
    duration: "4 Bulan",
    stipend: "Rp 4.500.000 / bln",
    description: "Membangun pipeline fine-tuning model LLM lokal untuk ekstraksi entitas klinis (NER) pada rekam medis elektronik berbahasa Indonesia. Mahasiswa akan bekerja langsung dengan tim data scientist dan spesialis klinis.",
    skillsRequired: ["Python", "PyTorch", "HuggingFace", "FastAPI", "Docker"],
    requirementsBreakdown: {
      frontend: 45,
      backend: 88,
      uiux: 35,
      aiml: 98,
      architecture: 82
    },
    verified: true,
    postedAt: "2 hari yang lalu"
  },
  {
    id: "proj-002",
    title: "Redesain Sistem Dashboard Telemetri IoT & Smart Campus",
    company: "Pusat Riset Smart City ITB",
    category: "Frontend & UI/UX",
    matchScore: 88,
    similarityMetric: 0.885,
    workType: "Remote",
    duration: "3 Bulan",
    stipend: "Rp 3.800.000 / bln",
    description: "Mengembangkan antarmuka monitoring sensor energi dan kualitas udara berbasis WebSocket real-time dengan visualisasi canvas interaktif serta standar aksesibilitas WCAG 2.1 AA.",
    skillsRequired: ["HTML5/CSS3", "JavaScript ES6+", "Tailwind CSS", "Chart.js", "Figma", "WebSocket"],
    requirementsBreakdown: {
      frontend: 95,
      backend: 60,
      uiux: 92,
      aiml: 40,
      architecture: 70
    },
    verified: true,
    postedAt: "1 hari yang lalu"
  },
  {
    id: "proj-003",
    title: "Microservices Payment Gateway & High-Throughput Ledger",
    company: "Fintech DanaNusantara Inc.",
    category: "Backend & Cloud",
    matchScore: 76,
    similarityMetric: 0.764,
    workType: "Hybrid (Bandung)",
    duration: "6 Bulan",
    stipend: "Rp 5.200.000 / bln",
    description: "Optimasi arsitektur perutean transaksi finansial dengan idempotency key, message broker Kafka, serta database transaction locking berskala ribuan QPS.",
    skillsRequired: ["Go / Golang", "PostgreSQL", "Kafka", "Redis", "gRPC", "Kubernetes"],
    requirementsBreakdown: {
      frontend: 30,
      backend: 96,
      uiux: 20,
      aiml: 50,
      architecture: 95
    },
    verified: true,
    postedAt: "3 hari yang lalu"
  },
  {
    id: "proj-004",
    title: "Computer Vision untuk Deteksi Cacat Mutu Produk Manufaktur Otomotif",
    company: "PT Rekayasa Industri Presisi",
    category: "AI & Machine Learning",
    matchScore: 91,
    similarityMetric: 0.912,
    workType: "Onsite (Cikarang)",
    duration: "5 Bulan",
    stipend: "Rp 4.800.000 / bln",
    description: "Implementasi model YOLOv8 / Segment Anything untuk inspeksi cacat mikro pada plat logam perakitan otomotif berkecepatan 60 frame per detik.",
    skillsRequired: ["Python", "OpenCV", "YOLOv8", "TensorRT", "Edge AI / Jetson"],
    requirementsBreakdown: {
      frontend: 40,
      backend: 75,
      uiux: 30,
      aiml: 96,
      architecture: 80
    },
    verified: true,
    postedAt: "4 hari yang lalu"
  },
  {
    id: "proj-005",
    title: "Platform Kolaborasi Riset Terbuka Dosen & Mahasiswa",
    company: "Lembaga Penelitian & Pengabdian Masyarakat",
    category: "Fullstack Web",
    matchScore: 82,
    similarityMetric: 0.825,
    workType: "Remote",
    duration: "3 Bulan",
    stipend: "Rp 3.500.000 / bln",
    description: "Pembuatan portal kolaborasi hibah penelitian terintegrasi dengan pengindeks publikasi SINTA & Scopus serta sistem peer-review otomatis.",
    skillsRequired: ["Next.js", "TypeScript", "Prisma ORM", "Tailwind CSS", "PostgreSQL"],
    requirementsBreakdown: {
      frontend: 88,
      backend: 85,
      uiux: 80,
      aiml: 60,
      architecture: 75
    },
    verified: true,
    postedAt: "5 hari yang lalu"
  },
  {
    id: "proj-006",
    title: "Smart Contract & Verifikasi Ijazah Digital Kampus",
    company: "EduChain Tech Labs",
    category: "Blockchain & Web3",
    matchScore: 68,
    similarityMetric: 0.680,
    workType: "Remote",
    duration: "4 Bulan",
    stipend: "Rp 4.000.000 / bln",
    description: "Pembangunan protokol verifikasi kredensial akademik terdesentralisasi menggunakan EVM smart contracts dengan bukti zk-SNARKs untuk privasi mahasiswa.",
    skillsRequired: ["Solidity", "Hardhat", "TypeScript", "Ethers.js", "IPFS"],
    requirementsBreakdown: {
      frontend: 60,
      backend: 85,
      uiux: 50,
      aiml: 30,
      architecture: 90
    },
    verified: true,
    postedAt: "1 minggu yang lalu"
  }
];

export const STUDENT_PROFILE = {
  name: "Raden Satria",
  title: "Fullstack & AI Engineering Student",
  university: "Institut Teknologi Bandung",
  semester: "Semester 6 - Teknik Informatika",
  gpa: "3.88 / 4.00",
  verifiedHero: true,
  radarStats: {
    frontend: 85,
    backend: 90,
    uiux: 78,
    aiml: 92,
    architecture: 84
  },
  badges: ["AI Enthusiast", "Fullstack Ready", "Top 5% Match", "Verified Coder"],
  totalMatches: 24,
  activeApplications: 3
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  await delay(150);
  return ALL_PROJECTS;
}

export async function getProjectById(id: string): Promise<ProjectItem | null> {
  await delay(100);
  return ALL_PROJECTS.find((p) => p.id === id) ?? null;
}
