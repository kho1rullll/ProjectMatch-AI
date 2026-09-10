/**
 * ProjectMatch AI - Asynchronous Mock API Client
 * Menggunakan Fetch API, async/await, simulasi latency jaringan,
 * penanganan status loading, dan error boundary untuk demonstrasi frontend.
 */

const LOCAL_STORAGE_KEY = 'projectmatch_custom_projects';

/**
 * Simulasi latency jaringan realistis
 * @param {number} ms - Milidetik delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mengambil dataset mock awal dari file JSON atau LocalStorage
 * @returns {Promise<Array>} Daftar seluruh proyek
 */
export async function getAllProjectsFromSource() {
  try {
    const response = await fetch('data/mock-projects.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat dataset: HTTP ${response.status}`);
    }
    const defaultProjects = await response.json();

    // Gabungkan dengan proyek buatan mitra yang tersimpan di localStorage
    const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localProjects = savedLocal ? JSON.parse(savedLocal) : [];

    return [...localProjects, ...defaultProjects];
  } catch (error) {
    console.error('API Error in getAllProjectsFromSource:', error);
    throw error;
  }
}

/**
 * Fetch proyek dengan simulasi latency AI & filter kemiripan semantik
 * @param {Object} options - Parameter filter & search
 * @param {string} [options.search=''] - Kata kunci pencarian
 * @param {string} [options.category='all'] - Kategori industri/teknologi
 * @param {string} [options.matchTier='all'] - Tingkat kecocokan ('all' | 'high' | 'medium' | 'low')
 * @param {boolean} [options.simulateError=false] - Opsi pengujian error state
 * @returns {Promise<Array>} Daftar proyek terfilter
 */
export async function fetchProjects({
  search = '',
  category = 'all',
  matchTier = 'all',
  simulateError = false
} = {}) {
  // Berikan simulasi waktu komputasi kemiripan semantik AI (750ms)
  await delay(750);

  if (simulateError) {
    throw new Error('Koneksi inferensi Vector Database terputus. Silakan klik muat ulang untuk mencoba kembali.');
  }

  const allProjects = await getAllProjectsFromSource();

  return allProjects.filter((project) => {
    // 1. Filter Pencarian Teks
    const query = search.toLowerCase().trim();
    const matchSearch =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.company.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.skillsRequired.some((skill) => skill.toLowerCase().includes(query));

    // 2. Filter Kategori
    const matchCategory =
      category === 'all' ||
      project.category.toLowerCase().includes(category.toLowerCase());

    // 3. Filter Tier Kecocokan (CVA Match Score)
    let matchTierCond = true;
    if (matchTier === 'high') {
      matchTierCond = project.matchScore >= 85;
    } else if (matchTier === 'medium') {
      matchTierCond = project.matchScore >= 60 && project.matchScore < 85;
    } else if (matchTier === 'low') {
      matchTierCond = project.matchScore < 60;
    }

    return matchSearch && matchCategory && matchTierCond;
  });
}

/**
 * Mengambil detail 1 proyek berdasarkan ID untuk Modal Drill-Down
 * @param {string} id - ID proyek
 * @returns {Promise<Object>} Data proyek
 */
export async function fetchProjectById(id) {
  await delay(200);
  const allProjects = await getAllProjectsFromSource();
  const project = allProjects.find((p) => p.id === id);
  if (!project) {
    throw new Error(`Proyek dengan ID '${id}' tidak ditemukan.`);
  }
  return project;
}

/**
 * Menyimpan proyek baru dari formulir mitra industri
 * @param {Object} formData - Data input form mitra
 * @returns {Promise<Object>} Proyek yang berhasil disimpan
 */
export async function createProject(formData) {
  await delay(500);

  // Kalkulasi estimasi match score acak berbobot untuk mock kemiripan
  const randomScore = Math.floor(Math.random() * (96 - 70 + 1)) + 70;
  
  const newProject = {
    id: `proj-${Date.now()}`,
    title: formData.title,
    company: formData.company || 'Mitra Industri Terverifikasi',
    category: formData.category || 'Teknologi Informasi',
    matchScore: randomScore,
    similarityMetric: (randomScore / 100).toFixed(3),
    workType: formData.workType || 'Hybrid',
    duration: formData.duration || '3-6 Bulan',
    stipend: formData.stipend || 'Tersedia Uang Saku & Mentoring',
    description: formData.description,
    videoUrl: formData.videoUrl || '',
    skillsRequired: formData.skillsRequired || [],
    requirementsBreakdown: {
      frontend: Math.floor(Math.random() * 40) + 60,
      backend: Math.floor(Math.random() * 40) + 60,
      uiux: Math.floor(Math.random() * 40) + 60,
      aiml: Math.floor(Math.random() * 40) + 60,
      architecture: Math.floor(Math.random() * 40) + 60
    },
    verified: true,
    postedAt: 'Baru saja'
  };

  const savedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
  const localProjects = savedLocal ? JSON.parse(savedLocal) : [];
  localProjects.unshift(newProject);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localProjects));

  return newProject;
}

/**
 * Mengambil proyek rekomendasi teratas untuk Dashboard
 * @param {number} [limit=3]
 * @returns {Promise<Array>}
 */
export async function getFeaturedProjects(limit = 3) {
  const all = await getAllProjectsFromSource();
  return all.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}
