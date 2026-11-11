/**
 * ProjectMatch AI - Temporary Frontend Application Logic
 * Full implementation for:
 * 1. GitHub Portfolio extraction & AI Skill synthesis
 * 2. Online Job Vacancies Ingestion (Upwork, Fiverr, LinkedIn)
 * 3. AI Semantic Matching Engine & Radar Chart Comparison
 * 4. Real-time WebSocket notifications & Admin Platform Dashboard
 */

// ==================== GLOBAL CONFIG & STATE ====================
let API_BASE_URL = window.location.origin.includes(':8000')
  ? window.location.origin
  : 'http://127.0.0.1:8000';

let authToken = localStorage.getItem('projectmatch_token') || null;
let currentUser = JSON.parse(localStorage.getItem('projectmatch_user') || 'null');
let currentProfile = null;
let allJobs = [];
let studentRadarChartInstance = null;
let comparisonRadarChartInstance = null;
let wsConnection = null;

// Color maps for languages
const LANG_COLORS = {
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'HTML/CSS': '#e34c26',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'JavaScript': '#f1e05a',
  'SQL': '#e38c00',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Java': '#b07219',
  'C++': '#f34b7d',
  'General': '#818cf8'
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('activeApiUrl').innerText = API_BASE_URL;
  const inputApi = document.getElementById('inputApiBaseUrl');
  if (inputApi) inputApi.value = API_BASE_URL;

    // Tampilkan data pengguna jika sudah pernah login, jika belum biarkan guest
    if (authToken && currentUser) {
      updateUserNavUI();
    }

    // Muat data awal
    await refreshAllData();

    // Inisialisasi WebSocket real-time
    initWebSocket();
  });

// ==================== AUTH & PERSONA SWITCHING ====================
async function quickLogin(email, password, notify = true) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error(`Gagal masuk (${res.status}): Cek kredensial server`);
    }

    const data = await res.json();
    authToken = data.access_token;
    currentUser = data.user;
    localStorage.setItem('projectmatch_token', authToken);
    localStorage.setItem('projectmatch_user', JSON.stringify(currentUser));

    updateUserNavUI();
    if (notify) showToast(`Berhasil masuk sebagai ${currentUser.full_name || currentUser.email}`, 'success');

    // Refresh data
    await refreshAllData();
    initWebSocket();
  } catch (err) {
    console.error('Login error:', err);
    showToast(`Autentikasi gagal: ${err.message}`, 'error');
  }
}

function updateUserNavUI() {
  if (!currentUser) return;
  const navName = document.getElementById('navUserName');
  const avatarText = document.getElementById('userAvatarText');
  const btnMahasiswa = document.getElementById('btnPersonaMahasiswa');
  const btnAdmin = document.getElementById('btnPersonaAdmin');
  const tabAdmin = document.getElementById('tabBtnAdmin');

  const initials = (currentUser.full_name || currentUser.email || 'US')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (avatarText) avatarText.innerText = initials;
  if (navName) navName.innerText = currentUser.full_name || currentUser.email;

  if (currentUser.role === 'admin') {
    if (btnAdmin) btnAdmin.classList.add('active');
    if (btnMahasiswa) btnMahasiswa.classList.remove('active');
    if (tabAdmin) tabAdmin.style.display = 'flex';
  } else {
    if (btnMahasiswa) btnMahasiswa.classList.add('active');
    if (btnAdmin) btnAdmin.classList.remove('active');
    if (tabAdmin) tabAdmin.style.display = 'flex'; // Tetap bisa dibuka di demo
  }
}

async function switchPersona(role) {
  if (role === 'admin') {
    await quickLogin('admin@projectmatch.ac.id', 'password123');
    switchTab('admin');
  } else {
    await quickLogin('satria@student.itb.ac.id', 'password123');
    switchTab('portfolio');
  }
}

function saveCustomApiUrl() {
  const input = document.getElementById('inputApiBaseUrl');
  if (input && input.value) {
    API_BASE_URL = input.value.trim().replace(/\/+$/, '');
    document.getElementById('activeApiUrl').innerText = API_BASE_URL;
    showToast(`Alamat API disetel ke: ${API_BASE_URL}`, 'info');
    refreshAllData();
    initWebSocket();
  }
}

// ==================== TAB NAVIGATION ====================
function switchTab(tabKey) {
  const tabs = ['portfolio', 'jobs', 'recommendations', 'bookmarks', 'admin'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn${capitalize(t)}`);
    const content = document.getElementById(`tabContent${capitalize(t)}`);
    if (btn) btn.classList.toggle('active', t === tabKey);
    if (content) content.classList.toggle('active', t === tabKey);
  });

  // Muat data khusus saat tab aktif
  if (tabKey === 'jobs') filterAndRenderJobs();
  if (tabKey === 'recommendations') loadRecommendations();
  if (tabKey === 'bookmarks') loadBookmarks();
  if (tabKey === 'admin') loadAdminDashboard();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ==================== DATA REFRESH ORCHESTRATION ====================
async function refreshAllData() {
  await Promise.allSettled([
    loadProfile(),
    loadJobs(),
    loadRecommendations(),
    loadBookmarks(),
    loadNotificationsCount()
  ]);
}

// ==================== 1. PORTOFOLIO GITHUB & AI SKILLS ====================
async function loadProfile() {
  if (!authToken) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) {
      if (res.status === 401) {
        await quickLogin('satria@student.itb.ac.id', 'password123', false);
        return;
      }
      return;
    }

    currentProfile = await res.json();
    renderProfileView(currentProfile);
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

function renderProfileView(profile) {
  if (!profile) return;

  // Basic Info
  document.getElementById('profileFullName').innerText = profile.full_name || 'Raden Satria';
  document.getElementById('profileNimProdi').innerText =
    `NIM: ${profile.nim || '-'} • ${profile.program_studi || 'D3 Teknik Informatika'} (${profile.angkatan || 2025})`;

  const githubUser = profile.github_username || 'kho1rullll';
  document.getElementById('profileGithubUsernameText').innerText = `@${githubUser}`;
  document.getElementById('profileGithubLink').href = `https://github.com/${githubUser}`;
  const inputEl = document.getElementById('inputGithubUsername');
  if (inputEl) {
    inputEl.value = githubUser;
    if (profile.github_username) {
      inputEl.readOnly = true;
      inputEl.title = 'Terkunci: 1 Akun hanya dapat menyinkronkan 1 akun GitHub permanen';
      inputEl.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      inputEl.style.cursor = 'not-allowed';
    }
  }

  const initials = (profile.full_name || 'RS').split(' ').map(n => n[0]).slice(0, 2).join('');
  document.getElementById('profileAvatarBig').innerText = initials;

  const statusPill = document.getElementById('processingStatusPill');
  statusPill.innerText = profile.processing_status || 'done';
  statusPill.className = `tag-pill ${profile.processing_status === 'done' ? 'emerald' : 'cyan'}`;

  // GitHub Data & Metrics
  const ghData = profile.github_data || {};
  const repos = ghData.top_repositories || [];
  const langs = ghData.languages_breakdown || {};

  document.getElementById('metricTotalRepos').innerText = ghData.total_repositories || repos.length || 0;
  document.getElementById('metricTotalCommits').innerText = ghData.total_commits || 0;

  let topLang = Object.keys(langs)[0] || 'Python';
  document.getElementById('metricTopLanguage').innerText = topLang;

  const totalStars = repos.reduce((sum, r) => sum + (r.stars || 0), 0);
  document.getElementById('metricTotalStars').innerText = totalStars;

  // Languages Multi Progress Bar
  renderLanguagesBreakdown(langs);

  // Repositories Grid
  renderRepositoriesGrid(repos, githubUser);

  // AI Extracted Skills
  const skills = profile.extracted_skills || {};
  renderAiSkills(skills);

  // Radar Chart
  renderStudentRadarChart(skills.radar_competencies || {});
}

function renderLanguagesBreakdown(langs) {
  const barContainer = document.getElementById('languagesProgressBar');
  const legendContainer = document.getElementById('languagesLegend');
  barContainer.innerHTML = '';
  legendContainer.innerHTML = '';

  const entries = Object.entries(langs);
  if (entries.length === 0) {
    barContainer.innerHTML = '<div class="progress-segment" style="width: 100%; background: #6366f1;"></div>';
    return;
  }

  entries.forEach(([lang, pct]) => {
    const color = LANG_COLORS[lang] || '#6366f1';

    // Bar segment
    const seg = document.createElement('div');
    seg.className = 'progress-segment';
    seg.style.width = `${pct}%`;
    seg.style.backgroundColor = color;
    seg.title = `${lang}: ${pct}%`;
    barContainer.appendChild(seg);

    // Legend item
    const leg = document.createElement('div');
    leg.className = 'lang-indicator';
    leg.innerHTML = `
      <span class="lang-dot" style="background-color: ${color};"></span>
      <span>${lang} <strong>${pct}%</strong></span>
    `;
    legendContainer.appendChild(leg);
  });
}

function renderRepositoriesGrid(repos, username) {
  const container = document.getElementById('reposGridContainer');
  container.innerHTML = '';

  if (!repos || repos.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📂</div>
        <h4>Belum ada repositori publik yang ditarik</h4>
        <p>Klik tombol "Tarik Repositori" di atas untuk mengambil data dari akun GitHub.</p>
      </div>
    `;
    return;
  }

  document.getElementById('reposCountIndicator').innerText = `Menampilkan ${repos.length} repositori publik terbaik`;

  repos.forEach(repo => {
    const lang = repo.language || 'General';
    const langColor = LANG_COLORS[lang] || '#818cf8';
    const topicsHtml = (repo.topics || []).map(t => `<span class="topic-tag">${t}</span>`).join('');
    const readmeSnippet = repo.readme_snippet
      ? `<div class="repo-readme-snippet">📄 README: ${escapeHtml(repo.readme_snippet.slice(0, 160))}...</div>`
      : '';

    const card = document.createElement('div');
    card.className = 'repo-card';
    card.innerHTML = `
      <div>
        <div class="repo-top">
          <div class="repo-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <a href="https://github.com/${username}/${repo.name}" target="_blank" style="color: #fff; text-decoration: none;">
              ${escapeHtml(repo.name)}
            </a>
          </div>
          <span class="stars-badge">⭐ ${repo.stars || 0}</span>
        </div>

        <p class="repo-desc">${escapeHtml(repo.description || 'Tidak ada deskripsi repositori.')}</p>
        ${readmeSnippet}
        <div class="repo-topics">${topicsHtml}</div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 8px;">
        <span style="font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background: ${langColor};"></span>
          ${lang}
        </span>
        <a href="https://github.com/${username}/${repo.name}" target="_blank" style="font-size: 0.8rem; color: #38bdf8; text-decoration: none;">
          Buka di GitHub ↗
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderAiSkills(skills) {
  document.getElementById('aiHeadlineText').innerText = skills.headline || 'Fullstack AI Engineer';
  document.getElementById('aiStrengthsSummaryText').innerText = skills.strengths_summary || 'Mampu mengintegrasikan arsitektur sistem tiga-tier dan AI semantic search.';

  // Primary domains
  const domainContainer = document.getElementById('primaryDomainsContainer');
  domainContainer.innerHTML = '';
  (skills.primary_domains || ['Fullstack Web', 'AI/ML', 'Backend Services']).forEach(d => {
    const badge = document.createElement('span');
    badge.className = 'tag-pill cyan';
    badge.innerText = d;
    domainContainer.appendChild(badge);
  });

  // Technical skills list
  const listContainer = document.getElementById('technicalSkillsList');
  listContainer.innerHTML = '';
  const techSkills = skills.technical_skills || [];

  techSkills.forEach(s => {
    const item = document.createElement('div');
    item.className = 'skill-bar-item';
    item.innerHTML = `
      <div class="skill-info">
        <span class="skill-name">
          ${escapeHtml(s.name)}
          <span class="skill-category-badge">${escapeHtml(s.category || 'Skill')}</span>
        </span>
        <span style="font-weight: 700; color: #818cf8;">${s.level}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" style="width: ${s.level}%;"></div>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

function renderStudentRadarChart(radar) {
  const ctx = document.getElementById('studentRadarChart');
  if (!ctx) return;

  const labels = ['AI & Machine Learning', 'Frontend Engineering', 'Backend Services', 'Database & Cloud', 'Software Architecture'];
  const dataValues = [
    radar.AI_ML || 88,
    radar.Frontend || 86,
    radar.Backend || 92,
    radar.Database_Cloud || 87,
    radar.Software_Architecture || 85
  ];

  if (studentRadarChartInstance) {
    studentRadarChartInstance.destroy();
  }

  studentRadarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tingkat Kompetensi Mahasiswa (%)',
        data: dataValues,
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#818cf8',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          pointLabels: {
            color: '#cbd5e1',
            font: { family: "'Outfit', sans-serif", size: 11, weight: '600' }
          },
          ticks: {
            display: false,
            min: 0,
            max: 100,
            stepSize: 20
          },
          suggestedMin: 40,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Trigger GitHub Sync
async function triggerGithubSync() {
  const btn = document.getElementById('btnSyncGithub');
  const btnText = document.getElementById('btnSyncGithubText');
  const inputUser = document.getElementById('inputGithubUsername');
  const username = inputUser ? inputUser.value.trim() : 'kho1rullll';

  btn.disabled = true;
  btnText.innerText = 'Menyinkronkan...';
  showToast(`Memicu sinkronisasi akun GitHub @${username}...`, 'info');

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/profiles/github/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ github_username: username })
    });

    if (!res.ok) throw new Error('Gagal memicu sinkronisasi');

    const result = await res.json();
    showToast(result.message || 'Sinkronisasi dijadwalkan', 'success');

    // Polling status hingga selesai
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      await loadProfile();
      if (currentProfile && currentProfile.processing_status === 'done') {
        clearInterval(interval);
        btn.disabled = false;
        btnText.innerText = 'Tarik Repositori';
        showToast('🎉 Portofolio dan AI Skill Radar berhasil diperbarui!', 'success');
        loadRecommendations(); // Hitung ulang rekomendasi
      } else if (attempts > 15) {
        clearInterval(interval);
        btn.disabled = false;
        btnText.innerText = 'Tarik Repositori';
      }
    }, 2000);

  } catch (err) {
    console.error('Sync error:', err);
    showToast(`Kendala sinkronisasi: ${err.message}`, 'error');
    btn.disabled = false;
    btnText.innerText = 'Tarik Repositori';
  }
}

// ==================== 2. EKSPLORASI LOWONGAN ONLINE ====================
async function loadJobs() {
  if (!authToken) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/jobs`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) return;

    allJobs = await res.json();
    document.getElementById('totalJobsBadge').innerText = allJobs.length;
    filterAndRenderJobs();
  } catch (err) {
    console.error('Error loading jobs:', err);
  }
}

function filterAndRenderJobs() {
  const container = document.getElementById('jobsGridContainer');
  if (!container) return;

  const searchQuery = (document.getElementById('inputJobSearch')?.value || '').toLowerCase();
  const platform = document.getElementById('selectPlatformFilter')?.value || 'semua';
  const jobType = document.getElementById('selectTypeFilter')?.value || 'semua';

  let filtered = allJobs.filter(job => {
    // Filter platform
    if (platform !== 'semua' && job.platform_source.toLowerCase() !== platform.toLowerCase()) {
      return false;
    }
    // Filter type
    if (jobType !== 'semua' && job.job_type.toLowerCase() !== jobType.toLowerCase()) {
      return false;
    }
    // Filter search text
    if (searchQuery) {
      const matchTitle = (job.title || '').toLowerCase().includes(searchQuery);
      const matchDesc = (job.description || '').toLowerCase().includes(searchQuery);
      const matchComp = (job.company_or_client || '').toLowerCase().includes(searchQuery);
      const matchSkills = (job.extracted_skills?.required_skills || [])
        .some(s => s.skill.toLowerCase().includes(searchQuery));
      return matchTitle || matchDesc || matchComp || matchSkills;
    }
    return true;
  });

  document.getElementById('filteredJobsCount').innerText = filtered.length;
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h4>Tidak ada lowongan yang sesuai kriteria filter</h4>
        <p>Coba sesuaikan kata kunci pencarian atau klik tombol "Tarik Lowongan Baru".</p>
      </div>
    `;
    return;
  }

  filtered.forEach(job => {
    container.appendChild(createJobCardElement(job));
  });
}

function createJobCardElement(job, highlightMatch = false) {
  const card = document.createElement('div');
  card.className = 'job-card';

  const platformClass = job.platform_source.toLowerCase();
  const isBookmarked = job.is_bookmarked;
  const bookmarkIcon = isBookmarked ? '⭐' : '☆';

  // Similarity Pill
  let matchPillHtml = '';
  if (job.similarity_score !== undefined && job.similarity_score !== null) {
    const pct = Math.round(job.similarity_score * 100);
    const pillClass = pct >= 75 ? 'high' : 'medium';
    matchPillHtml = `<span class="job-match-pill ${pillClass}">🎯 ${pct}% Cocok</span>`;
  }

  // Skills Badges
  const reqSkills = job.extracted_skills?.required_skills || [];
  const skillsHtml = reqSkills.slice(0, 4).map(s =>
    `<span class="job-skill-tag">${escapeHtml(s.skill)}</span>`
  ).join('');

  card.innerHTML = `
    <div>
      <div class="job-header">
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="platform-pill ${platformClass}">${job.platform_source}</span>
          <span class="job-type-pill">${job.job_type === 'freelance' ? 'Freelance / Remote' : 'Part-Time'}</span>
        </div>
        <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark('${job.id}', ${isBookmarked})" title="${isBookmarked ? 'Hapus Bookmark' : 'Simpan Lowongan'}">
          ${bookmarkIcon}
        </button>
      </div>

      <h3 class="job-title">${escapeHtml(job.title)}</h3>
      <div class="job-company">🏢 ${escapeHtml(job.company_or_client || 'Klien Industri')}</div>

      <div class="job-meta-pills">
        <span class="job-budget-pill">💰 ${escapeHtml(job.budget_or_salary || 'Kompetitif')}</span>
        ${matchPillHtml}
      </div>

      <p class="job-desc">${escapeHtml(job.description)}</p>

      <div class="job-skills-tags">
        ${skillsHtml}
      </div>
    </div>

    <div class="job-card-actions">
      <button class="btn-radar-modal" onclick="openRadarModal('${job.id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        Analisis AI & Radar
      </button>
      <a href="${job.external_url}" target="_blank" class="btn-apply-link">
        Lamar di ${capitalize(job.platform_source)} ↗
      </a>
    </div>
  `;

  return card;
}

// Ingest External Jobs
async function triggerJobsSync() {
  const btn = document.getElementById('btnSyncJobs');
  if (btn) btn.disabled = true;
  showToast('🔄 Menjalankan agregator lowongan (LinkedIn, Upwork, Fiverr)...', 'info');

  try {
    // Memerlukan admin token; jika saat ini mahasiswa, panggil login admin sementara
    let tokenToUse = authToken;
    if (currentUser?.role !== 'admin') {
      const loginAdm = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@projectmatch.ac.id', password: 'password123' })
      });
      const dataAdm = await loginAdm.json();
      tokenToUse = dataAdm.access_token;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/jobs/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenToUse}`
      }
    });

    if (!res.ok) throw new Error('Gagal menyinkronkan lowongan');

    const data = await res.json();
    showToast(`✅ ${data.message || 'Lowongan berhasil disinkronkan!'}`, 'success');

    await loadJobs();
    await loadRecommendations();
    if (currentUser?.role === 'admin') loadAdminDashboard();
  } catch (err) {
    console.error('Job sync error:', err);
    showToast(`Kendala sinkronisasi lowongan: ${err.message}`, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Bookmark Toggle
async function toggleBookmark(jobId, currentlyBookmarked) {
  try {
    const url = `${API_BASE_URL}/api/v1/jobs/${jobId}/bookmark`;
    const method = currentlyBookmarked ? 'DELETE' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (res.ok || res.status === 409) {
      showToast(currentlyBookmarked ? 'Lowongan dihapus dari bookmark' : '⭐ Lowongan berhasil disimpan!', 'success');
      await loadJobs();
      await loadBookmarks();
    }
  } catch (err) {
    console.error('Bookmark error:', err);
  }
}

// ==================== 3. REKOMENDASI AI (TOP MATCHES) ====================
async function loadRecommendations() {
  if (!authToken) return;
  const container = document.getElementById('recommendationsGridContainer');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/recommendations/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) return;

    const recommendations = await res.json();
    document.getElementById('recsCountBadge').innerText = recommendations.length;
    container.innerHTML = '';

    if (recommendations.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🎯</div>
          <h4>Belum ada rekomendasi terhitung</h4>
          <p>Tarik repositori GitHub terlebih dahulu untuk memicu perhitungan vektor embedding.</p>
        </div>
      `;
      return;
    }

    recommendations.forEach(rec => {
      const job = rec.job;
      job.similarity_score = rec.similarity_score;
      const card = createJobCardElement(job, true);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading recommendations:', err);
  }
}

// ==================== 4. LOWONGAN TERSIMPAN (BOOKMARKS) ====================
async function loadBookmarks() {
  if (!authToken) return;
  const container = document.getElementById('bookmarksGridContainer');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/bookmarks/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) return;

    const bookmarks = await res.json();
    document.getElementById('bookmarksCountBadge').innerText = bookmarks.length;
    container.innerHTML = '';

    if (bookmarks.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">⭐</div>
          <h4>Belum ada lowongan tersimpan</h4>
          <p>Beri tanda bintang pada lowongan yang ingin Anda simpan dari tab Eksplorasi Lowongan.</p>
        </div>
      `;
      return;
    }

    bookmarks.forEach(job => {
      job.is_bookmarked = true;
      container.appendChild(createJobCardElement(job));
    });
  } catch (err) {
    console.error('Error loading bookmarks:', err);
  }
}

// ==================== 5. DASHBOARD ADMIN & STATISTIK ====================
async function loadAdminDashboard() {
  let tokenToUse = authToken;
  // Jika saat ini user mahasiswa, ambil data menggunakan token admin
  if (currentUser?.role !== 'admin') {
    const loginAdm = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@projectmatch.ac.id', password: 'password123' })
    });
    const dataAdm = await loginAdm.json();
    tokenToUse = dataAdm.access_token;
  }

  try {
    const statsRes = await fetch(`${API_BASE_URL}/api/v1/admin/statistics`, {
      headers: { 'Authorization': `Bearer ${tokenToUse}` }
    });
    if (statsRes.ok) {
      const stats = await statsRes.json();
      document.getElementById('adminStatTotalUsers').innerText = stats.total_users;
      document.getElementById('adminStatTotalJobs').innerText = stats.total_jobs;
      document.getElementById('adminStatMatchesComputed').innerText = stats.total_matches_computed;
      document.getElementById('adminStatTotalBookmarks').innerText = stats.total_bookmarks;

      // Platform breakdown
      const pContainer = document.getElementById('adminPlatformBreakdown');
      pContainer.innerHTML = '';
      Object.entries(stats.jobs_by_platform || {}).forEach(([plat, count]) => {
        if (count === 0 && plat === 'manual') return;
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);';
        row.innerHTML = `
          <span style="text-transform: capitalize; font-weight: 600;">${plat}</span>
          <span class="tag-pill cyan">${count} lowongan</span>
        `;
        pContainer.appendChild(row);
      });

      // Type breakdown
      const tContainer = document.getElementById('adminTypeBreakdown');
      tContainer.innerHTML = '';
      Object.entries(stats.jobs_by_type || {}).forEach(([typ, count]) => {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);';
        row.innerHTML = `
          <span style="text-transform: capitalize; font-weight: 600;">${typ === 'freelance' ? 'Freelance / Remote' : 'Part-Time'}</span>
          <span class="tag-pill indigo">${count} lowongan</span>
        `;
        tContainer.appendChild(row);
      });
    }

    // Users table
    const usersRes = await fetch(`${API_BASE_URL}/api/v1/admin/users`, {
      headers: { 'Authorization': `Bearer ${tokenToUse}` }
    });
    if (usersRes.ok) {
      const users = await usersRes.json();
      const tbody = document.getElementById('adminUsersTableBody');
      tbody.innerHTML = '';
      users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <strong>${escapeHtml(u.full_name || u.email)}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(u.email)}</div>
          </td>
          <td><span class="tag-pill ${u.role === 'admin' ? 'indigo' : 'emerald'}">${u.role}</span></td>
          <td>${u.nim || '-'}</td>
          <td>${u.github_username ? `<a href="https://github.com/${u.github_username}" target="_blank" style="color: #38bdf8;">@${u.github_username}</a>` : '-'}</td>
          <td><span class="tag-pill ${u.is_active ? 'emerald' : 'amber'}">${u.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }

  } catch (err) {
    console.error('Admin dashboard error:', err);
  }
}

// ==================== RADAR CHART COMPARISON MODAL ====================
async function openRadarModal(jobId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/matches/${jobId}/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (!res.ok) throw new Error('Gagal mengambil rincian kecocokan');

    const detail = await res.json();

    document.getElementById('modalJobPlatform').innerText = detail.platform_source;
    document.getElementById('modalJobPlatform').className = `platform-pill ${detail.platform_source.toLowerCase()}`;
    document.getElementById('modalJobTitle').innerText = detail.job_title;
    document.getElementById('modalJobCompany').innerText = `🏢 ${detail.company || 'Industri Eksternal'}`;
    document.getElementById('modalSimilarityScore').innerText = detail.similarity_score.toFixed(4);
    document.getElementById('modalMatchPercentage').innerText = `${detail.match_percentage}%`;
    document.getElementById('modalSummaryReason').innerText = detail.summary_reason || 'Kecocokan semantik dihitung berdasarkan vektor keahlian dari portofolio repositori publik mahasiswa.';
    document.getElementById('modalApplyExternalLink').href = detail.external_url;

    // Rincian Breakdown
    const listContainer = document.getElementById('modalBreakdownList');
    listContainer.innerHTML = '';
    const breakdown = detail.score_breakdown || [];

    const labels = [];
    const studentScores = [];
    const requiredScores = [];

    breakdown.forEach(item => {
      labels.push(item.skill);
      studentScores.push(item.student_score);
      requiredScores.push(item.required_score);

      const row = document.createElement('div');
      row.className = 'breakdown-row';
      row.innerHTML = `
        <div class="breakdown-header">
          <span>${escapeHtml(item.skill)}</span>
          <span>
            <strong style="color: #818cf8;">${Math.round(item.student_score)}</strong> / 
            <span style="color: #f43f5e;">${Math.round(item.required_score)}</span>
          </span>
        </div>
        <div class="skill-track">
          <div class="skill-fill" style="width: ${item.student_score}%;"></div>
        </div>
        <div class="breakdown-desc">${escapeHtml(item.description || '')}</div>
      `;
      listContainer.appendChild(row);
    });

    // Render Comparison Radar Chart
    renderComparisonRadarChart(labels, studentScores, requiredScores);

    document.getElementById('modalRadarOverlay').classList.add('active');
  } catch (err) {
    console.error('Error opening radar modal:', err);
    showToast(`Kendala membuka rincian: ${err.message}`, 'error');
  }
}

function renderComparisonRadarChart(labels, studentData, requiredData) {
  const ctx = document.getElementById('comparisonRadarCanvas');
  if (!ctx) return;

  if (comparisonRadarChartInstance) {
    comparisonRadarChartInstance.destroy();
  }

  comparisonRadarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Portofolio Mahasiswa (GitHub)',
          data: studentData,
          backgroundColor: 'rgba(99, 102, 241, 0.3)',
          borderColor: '#818cf8',
          borderWidth: 2,
          pointBackgroundColor: '#6366f1',
          pointRadius: 4
        },
        {
          label: 'Kebutuhan Lowongan',
          data: requiredData,
          backgroundColor: 'rgba(244, 63, 94, 0.25)',
          borderColor: '#f43f5e',
          borderWidth: 2,
          pointBackgroundColor: '#f43f5e',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          pointLabels: {
            color: '#cbd5e1',
            font: { family: "'Outfit', sans-serif", size: 10, weight: '600' }
          },
          ticks: {
            display: false,
            min: 0,
            max: 100
          },
          suggestedMin: 40,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function closeRadarModal() {
  document.getElementById('modalRadarOverlay').classList.remove('active');
}

// ==================== EDIT PROFILE MODAL ====================
function openEditProfileModal() {
  if (!currentProfile) return;
  document.getElementById('editFullName').value = currentProfile.full_name || '';
  document.getElementById('editNim').value = currentProfile.nim || '';
  document.getElementById('editProgramStudi').value = currentProfile.program_studi || '';
  document.getElementById('editAngkatan').value = currentProfile.angkatan || 2025;
  document.getElementById('editGithubUsername').value = currentProfile.github_username || '';
  document.getElementById('modalEditProfileOverlay').classList.add('active');
}

function closeEditProfileModal() {
  document.getElementById('modalEditProfileOverlay').classList.remove('active');
}

async function saveProfileChanges() {
  const req = {
    full_name: document.getElementById('editFullName').value.trim(),
    program_studi: document.getElementById('editProgramStudi').value.trim(),
    angkatan: parseInt(document.getElementById('editAngkatan').value) || 2025,
    github_username: document.getElementById('editGithubUsername').value.trim()
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Gagal menyimpan');
    }

    showToast('Biodata profil berhasil disimpan!', 'success');
    closeEditProfileModal();
    await loadProfile();
  } catch (err) {
    showToast(`Gagal update biodata: ${err.message}`, 'error');
  }
}

// ==================== NOTIFICATIONS & WEBSOCKET ====================
function initWebSocket() {
  if (!authToken) return;

  const wsStatusText = document.getElementById('wsStatusText');
  const wsDot = document.getElementById('wsDot');

  const wsProto = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
  const host = API_BASE_URL.replace(/^https?:\/\//, '');
  const wsUrl = `${wsProto}://${host}/ws/notifications?token=${authToken}`;

  if (wsConnection) {
    try { wsConnection.close(); } catch (e) { }
  }

  try {
    wsConnection = new WebSocket(wsUrl);

    wsConnection.onopen = () => {
      if (wsStatusText) wsStatusText.innerText = 'WS Terhubung (Real-Time)';
      if (wsDot) {
        wsDot.style.backgroundColor = 'var(--success)';
        wsDot.style.boxShadow = '0 0 8px var(--success)';
      }
    };

    wsConnection.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.title || msg.message) {
          showToast(`🔔 ${msg.title || 'Notifikasi'}: ${msg.message || ''}`, 'info');
          loadNotificationsCount();
        }
      } catch (e) {
        console.log('WS text message:', event.data);
      }
    };

    wsConnection.onclose = () => {
      if (wsStatusText) wsStatusText.innerText = 'WS Terputus';
      if (wsDot) {
        wsDot.style.backgroundColor = 'var(--text-muted)';
        wsDot.style.boxShadow = 'none';
      }
      // Reconnect setelah 5 detik
      setTimeout(initWebSocket, 5000);
    };

    wsConnection.onerror = (e) => {
      console.warn('WebSocket error, continuing HTTP fallback:', e);
    };

  } catch (err) {
    console.warn('Could not establish WebSocket connection:', err);
  }
}

async function loadNotificationsCount() {
  if (!authToken) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (res.ok) {
      const list = await res.json();
      const unread = list.filter(n => !n.is_read).length;
      const badge = document.getElementById('notifBadgeCount');
      if (badge) badge.innerText = unread;
    }
  } catch (err) { }
}

async function openNotificationsModal() {
  const container = document.getElementById('notificationsListContainer');
  container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Memuat...</p>';
  document.getElementById('modalNotificationsOverlay').classList.add('active');

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) return;

    const list = await res.json();
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 20px;">Belum ada notifikasi.</p>';
      return;
    }

    list.forEach(n => {
      const item = document.createElement('div');
      item.style.cssText = `padding: 12px; border-radius: var(--radius-md); background: ${n.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.1)'}; border: 1px solid var(--border-color);`;
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <strong>${escapeHtml(n.title)}</strong>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${new Date(n.created_at).toLocaleTimeString()}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">${escapeHtml(n.message)}</p>
      `;
      container.appendChild(item);

      // Mark read
      if (!n.is_read) {
        fetch(`${API_BASE_URL}/api/v1/notifications/${n.id}/read`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      }
    });

    document.getElementById('notifBadgeCount').innerText = '0';
  } catch (err) {
    container.innerHTML = '<p style="color: var(--danger);">Gagal memuat notifikasi</p>';
  }
}

function closeNotificationsModal() {
  document.getElementById('modalNotificationsOverlay').classList.remove('active');
}

// ==================== LOGIN MODAL ====================
function openLoginModal() {
  document.getElementById('modalLoginOverlay').classList.add('active');
}
function closeLoginModal() {
  document.getElementById('modalLoginOverlay').classList.remove('active');
}

// ==================== TOAST HELPER ====================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Escape HTML utility
function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
