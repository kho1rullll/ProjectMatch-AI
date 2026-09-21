// lib/db.ts - Persistent Embedded Local Database for ProjectMatch AI
import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'MAHASISWA' | 'MITRA' | 'ADMIN';
  university?: string;
  nim?: string;
  semester?: string;
  gpa?: string;
  companyName?: string;
  rfidUid?: string;
  academicVerified?: boolean;
  createdAt: string;
}

export interface CompetencyVectorRecord {
  id: string;
  userId: string;
  aiml: number;
  frontend: number;
  uiux: number;
  backend: number;
  architecture: number;
  updatedAt: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  company: string;
  category: string;
  workType: string;
  duration: string;
  stipend: string;
  description: string;
  skillsRequired: string[];
  matchScore: number;
  requirementsBreakdown: {
    aiml: number;
    frontend: number;
    uiux: number;
    backend: number;
    architecture: number;
  };
  verified: boolean;
  postedAt: string;
  createdBy?: string;
}

export interface ApplicationRecord {
  id: string;
  projectId: string;
  userId: string;
  studentName?: string;
  projectTitle?: string;
  companyName?: string;
  matchScore: number;
  status: 'SUBMITTED' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
}

export interface KioskTerminalRecord {
  id: string;
  name: string;
  location: string;
  ipAddress: string;
  firmware: string;
  status: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  lastHeartbeat: string;
  totalTapsToday: number;
}

interface DatabaseSchema {
  users: UserRecord[];
  competencyVectors: CompetencyVectorRecord[];
  projects: ProjectRecord[];
  applications: ApplicationRecord[];
  kiosks: KioskTerminalRecord[];
}

// Default Seed Data matching SKPL
const defaultData: DatabaseSchema = {
  users: [
    {
      id: 'usr-student-001',
      name: 'Raden Satria',
      nim: 'V3925028',
      email: 'satria@student.itb.ac.id',
      password: 'password123',
      role: 'MAHASISWA',
      university: 'D3 Teknik Informatika PSDKU Madiun, UNS',
      semester: 'Semester 6',
      gpa: '3.88 / 4.00',
      rfidUid: '0x8F3A29B1',
      academicVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-student-002',
      name: 'Abdullah Abil Abi Yoso',
      nim: 'V3925001',
      email: 'abil@student.uns.ac.id',
      password: 'password123',
      role: 'MAHASISWA',
      university: 'D3 Teknik Informatika PSDKU Madiun, UNS',
      semester: 'Semester 6',
      gpa: '3.92 / 4.00',
      rfidUid: '0x4E7B12C9',
      academicVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-student-003',
      name: 'Nabila Putri Azzahra',
      nim: 'V3925044',
      email: 'nabila@student.uns.ac.id',
      password: 'password123',
      role: 'MAHASISWA',
      university: 'D3 Teknik Informatika PSDKU Madiun, UNS',
      semester: 'Semester 4',
      gpa: '3.75 / 4.00',
      rfidUid: '0x99A1BC33',
      academicVerified: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-partner-001',
      name: 'Dr. Hendra Gunawan',
      email: 'hr@bioinformatika.co.id',
      password: 'password123',
      role: 'MITRA',
      companyName: 'BioInformatika Nusantara & RS Cipto',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-admin-001',
      name: 'Biro Kerjasama & Kemahasiswaan',
      email: 'admin@projectmatch.ac.id',
      password: 'password123',
      role: 'ADMIN',
      university: 'Universitas Sebelas Maret (UNS)',
      createdAt: new Date().toISOString(),
    },
  ],
  competencyVectors: [
    {
      id: 'vec-001',
      userId: 'usr-student-001',
      aiml: 92,
      frontend: 85,
      uiux: 78,
      backend: 90,
      architecture: 84,
      updatedAt: new Date().toISOString(),
    },
  ],
  projects: [
    {
      id: 'proj-001',
      title: 'Pengembangan Engine NLP Berbasis Transformer untuk Riset Medis',
      company: 'BioInformatika Nusantara & RS Cipto',
      category: 'AI & Machine Learning',
      workType: 'Hybrid (Jakarta Pusat)',
      duration: '4 Bulan',
      stipend: 'Rp 4.500.000 / bln',
      description:
        'Membangun pipeline fine-tuning model LLM lokal untuk ekstraksi entitas klinis (NER) pada rekam medis elektronik berbahasa Indonesia. Mahasiswa akan bekerja langsung dengan tim data scientist dan spesialis klinis.',
      skillsRequired: ['Python', 'PyTorch', 'HuggingFace', 'FastAPI', 'Docker'],
      matchScore: 94,
      requirementsBreakdown: {
        aiml: 98,
        frontend: 45,
        uiux: 35,
        backend: 88,
        architecture: 82,
      },
      verified: true,
      postedAt: '2 hari yang lalu',
      createdBy: 'usr-partner-001',
    },
    {
      id: 'proj-002',
      title: 'Redesain Sistem Dashboard Telemetri IoT & Smart Campus',
      company: 'Pusat Riset Smart City ITB',
      category: 'Frontend & UI/UX',
      workType: 'Remote',
      duration: '3 Bulan',
      stipend: 'Rp 3.800.000 / bln',
      description:
        'Mengembangkan antarmuka monitoring sensor energi dan kualitas udara berbasis WebSocket real-time dengan visualisasi canvas interaktif serta standar aksesibilitas WCAG 2.1 AA.',
      skillsRequired: ['HTML5/CSS3', 'JavaScript ES6+', 'Tailwind CSS', 'Chart.js', 'Figma', 'WebSocket'],
      matchScore: 88,
      requirementsBreakdown: {
        aiml: 40,
        frontend: 95,
        uiux: 92,
        backend: 60,
        architecture: 70,
      },
      verified: true,
      postedAt: '1 hari yang lalu',
    },
    {
      id: 'proj-003',
      title: 'Microservices Payment Gateway & High-Throughput Ledger',
      company: 'Fintech DanaNusantara Inc.',
      category: 'Backend & Cloud',
      workType: 'Hybrid (Bandung)',
      duration: '6 Bulan',
      stipend: 'Rp 5.200.000 / bln',
      description:
        'Optimasi arsitektur perutean transaksi finansial dengan idempotency key, message broker Kafka, serta database transaction locking berskala ribuan QPS.',
      skillsRequired: ['Go / Golang', 'PostgreSQL', 'Kafka', 'Redis', 'gRPC', 'Kubernetes'],
      matchScore: 76,
      requirementsBreakdown: {
        aiml: 50,
        frontend: 30,
        uiux: 20,
        backend: 96,
        architecture: 95,
      },
      verified: true,
      postedAt: '3 hari yang lalu',
    },
    {
      id: 'proj-004',
      title: 'Computer Vision untuk Deteksi Cacat Mutu Produk Manufaktur Otomotif',
      company: 'PT Rekayasa Industri Presisi',
      category: 'AI & Machine Learning',
      workType: 'Onsite (Cikarang)',
      duration: '5 Bulan',
      stipend: 'Rp 4.800.000 / bln',
      description:
        'Implementasi model YOLOv8 / Segment Anything untuk inspeksi cacat mikro pada plat logam perakitan otomotif berkecepatan 60 frame per detik.',
      skillsRequired: ['Python', 'OpenCV', 'YOLOv8', 'TensorRT', 'Edge AI / Jetson'],
      matchScore: 91,
      requirementsBreakdown: {
        aiml: 96,
        frontend: 40,
        uiux: 30,
        backend: 75,
        architecture: 80,
      },
      verified: true,
      postedAt: '4 hari yang lalu',
    },
    {
      id: 'proj-005',
      title: 'Platform Kolaborasi Riset Terbuka Dosen & Mahasiswa',
      company: 'Lembaga Penelitian & Pengabdian Masyarakat',
      category: 'Fullstack Web',
      workType: 'Remote',
      duration: '3 Bulan',
      stipend: 'Rp 3.500.000 / bln',
      description:
        'Pembuatan portal kolaborasi hibah penelitian terintegrasi dengan pengindeks publikasi SINTA & Scopus serta sistem peer-review otomatis.',
      skillsRequired: ['Next.js', 'TypeScript', 'Prisma ORM', 'Tailwind CSS', 'PostgreSQL'],
      matchScore: 82,
      requirementsBreakdown: {
        aiml: 60,
        frontend: 88,
        uiux: 80,
        backend: 85,
        architecture: 75,
      },
      verified: true,
      postedAt: '5 hari yang lalu',
    },
    {
      id: 'proj-006',
      title: 'Smart Contract & Verifikasi Ijazah Digital Kampus',
      company: 'EduChain Tech Labs',
      category: 'Blockchain & Web3',
      workType: 'Remote',
      duration: '4 Bulan',
      stipend: 'Rp 4.000.000 / bln',
      description:
        'Pembangunan protokol verifikasi kredensial akademik terdesentralisasi menggunakan EVM smart contracts dengan bukti zk-SNARKs untuk privasi mahasiswa.',
      skillsRequired: ['Solidity', 'Hardhat', 'TypeScript', 'Ethers.js', 'IPFS'],
      matchScore: 68,
      requirementsBreakdown: {
        aiml: 30,
        frontend: 60,
        uiux: 50,
        backend: 85,
        architecture: 90,
      },
      verified: true,
      postedAt: '1 minggu yang lalu',
    },
  ],
  applications: [
    {
      id: 'app-001',
      projectId: 'proj-001',
      userId: 'usr-student-001',
      studentName: 'Raden Satria (V3925028)',
      projectTitle: 'Pengembangan Engine NLP Berbasis Transformer',
      companyName: 'BioInformatika Nusantara & RS Cipto',
      matchScore: 94,
      status: 'REVIEWING',
      appliedAt: '2 hari yang lalu',
    },
    {
      id: 'app-002',
      projectId: 'proj-002',
      userId: 'usr-student-001',
      studentName: 'Raden Satria (V3925028)',
      projectTitle: 'Redesain Sistem Dashboard Telemetri IoT',
      companyName: 'Pusat Riset Smart City ITB',
      matchScore: 88,
      status: 'ACCEPTED',
      appliedAt: '1 minggu yang lalu',
    },
    {
      id: 'app-003',
      projectId: 'proj-004',
      userId: 'usr-student-002',
      studentName: 'Abdullah Abil (V3925001)',
      projectTitle: 'Computer Vision Deteksi Cacat Mutu Otomotif',
      companyName: 'PT Rekayasa Industri Presisi',
      matchScore: 91,
      status: 'SUBMITTED',
      appliedAt: '3 jam yang lalu',
    },
  ],
  kiosks: [
    {
      id: 'KIOSK-UNS-01',
      name: 'Smart Kiosk Lobby Utama',
      location: 'Gedung Rektorat & PSDKU Madiun Lantai 1',
      ipAddress: '192.168.1.101',
      firmware: 'v2.4.1-ESP32-RC522',
      status: 'ONLINE',
      lastHeartbeat: '2 detik yang lalu',
      totalTapsToday: 142,
    },
    {
      id: 'KIOSK-UNS-02',
      name: 'Smart Kiosk Laboratorium Komputer',
      location: 'Lab Terpadu Teknik Informatika Lt. 2',
      ipAddress: '192.168.1.102',
      firmware: 'v2.4.1-ESP32-RC522',
      status: 'ONLINE',
      lastHeartbeat: '6 detik yang lalu',
      totalTapsToday: 98,
    },
    {
      id: 'KIOSK-UNS-03',
      name: 'Smart Kiosk Career Center & Perpustakaan',
      location: 'Perpustakaan Kampus Pusat',
      ipAddress: '192.168.1.105',
      firmware: 'v2.4.0-ESP32-RC522',
      status: 'STANDBY',
      lastHeartbeat: '1 menit yang lalu',
      totalTapsToday: 64,
    },
  ],
};

function getDbFilePath(): string {
  const insideApp = path.join(process.cwd(), 'nextjs-app', 'projectmatch-db.json');
  if (fs.existsSync(insideApp)) {
    return insideApp;
  }
  return path.join(process.cwd(), 'projectmatch-db.json');
}

function readDatabase(): DatabaseSchema {
  const filePath = getDbFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.kiosks) {
      data.kiosks = defaultData.kiosks;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    return data;
  } catch {
    return defaultData;
  }
}

function writeDatabase(data: DatabaseSchema): void {
  const filePath = getDbFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database:', err);
  }
}

// =========================================================================
// DATA ACCESS METHODS
// =========================================================================

export function getAllProjects(): ProjectRecord[] {
  const db = readDatabase();
  return db.projects;
}

export function getAllUsers(): UserRecord[] {
  const db = readDatabase();
  return db.users;
}

export function getAllStudents(): UserRecord[] {
  const db = readDatabase();
  return db.users.filter((u) => u.role === 'MAHASISWA');
}

export function getAllApplications(): ApplicationRecord[] {
  const db = readDatabase();
  return db.applications;
}

export function getAllKiosks(): KioskTerminalRecord[] {
  const db = readDatabase();
  return db.kiosks || defaultData.kiosks;
}

export function verifyStudent(userId: string, verified: boolean): UserRecord | null {
  const db = readDatabase();
  const student = db.users.find((u) => u.id === userId);
  if (student) {
    student.academicVerified = verified;
    writeDatabase(db);
    return student;
  }
  return null;
}

export function updateKioskStatus(kioskId: string, status: 'ONLINE' | 'STANDBY' | 'OFFLINE'): KioskTerminalRecord | null {
  const db = readDatabase();
  const kiosk = db.kiosks.find((k) => k.id === kioskId);
  if (kiosk) {
    kiosk.status = status;
    kiosk.lastHeartbeat = 'Baru saja';
    writeDatabase(db);
    return kiosk;
  }
  return null;
}

export function getProjectById(id: string): ProjectRecord | null {
  const db = readDatabase();
  return db.projects.find((p) => p.id === id) || null;
}

export interface CreateProjectData {
  title: string;
  company: string;
  category?: string;
  workType?: string;
  duration?: string;
  stipend?: string;
  skillsRequired?: string;
  description: string;
  reqAiml?: number;
  reqFrontend?: number;
  reqUiux?: number;
  reqBackend?: number;
  reqArchitecture?: number;
  [key: string]: unknown;
}

export function createProject(data: CreateProjectData): ProjectRecord {
  const db = readDatabase();
  const id = `proj-${Date.now().toString(36)}`;
  const skillsArray = data.skillsRequired
    ? data.skillsRequired.split(',').map((s: string) => s.trim())
    : ['General Tech'];

  const newProj: ProjectRecord = {
    id,
    title: data.title,
    company: data.company,
    category: data.category || 'AI & Machine Learning',
    workType: data.workType || 'Hybrid',
    duration: data.duration || '3 Bulan',
    stipend: data.stipend || 'Rp 4.000.000 / bln',
    description: data.description,
    skillsRequired: skillsArray,
    matchScore: 90,
    requirementsBreakdown: {
      aiml: data.reqAiml || 85,
      frontend: data.reqFrontend || 70,
      uiux: data.reqUiux || 65,
      backend: data.reqBackend || 80,
      architecture: data.reqArchitecture || 75,
    },
    verified: true,
    postedAt: 'Baru saja',
  };

  db.projects.unshift(newProj);
  writeDatabase(db);
  return newProj;
}

export function getUserByEmail(email: string): UserRecord | null {
  const db = readDatabase();
  return db.users.find((u) => u.email === email) || null;
}

export function createUser(data: {
  name: string;
  email: string;
  password?: string;
  role: 'MAHASISWA' | 'MITRA' | 'ADMIN';
  companyName?: string;
}): UserRecord {
  const db = readDatabase();
  const id = `usr-${Date.now().toString(36)}`;
  const newUser: UserRecord = {
    id,
    name: data.name,
    email: data.email,
    password: data.password || 'password123',
    role: data.role,
    companyName: data.companyName,
    academicVerified: data.role === 'MAHASISWA' ? true : undefined,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  if (data.role === 'MAHASISWA') {
    db.competencyVectors.push({
      id: `vec-${id}`,
      userId: id,
      aiml: 92,
      frontend: 85,
      uiux: 78,
      backend: 90,
      architecture: 84,
      updatedAt: new Date().toISOString(),
    });
  }

  writeDatabase(db);
  return newUser;
}
