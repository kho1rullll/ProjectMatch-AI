<script>
  // ProjectMatch AI — Project Dashboard (Svelte 5, Runes Reactivity)
  // Padanan langsung dari versi React 19 & Vue 3 untuk perbandingan Modul 5.

  const MOCK_PROJECTS = [
    { id: 'proj-001', title: 'Engine NLP Riset Medis', company: 'BioInformatika Nusantara', category: 'AI & Machine Learning', matchScore: 94, workType: 'Hybrid' },
    { id: 'proj-002', title: 'Dashboard Telemetri IoT Smart Campus', company: 'Pusat Riset Smart City ITB', category: 'Frontend & UI/UX', matchScore: 88, workType: 'Remote' },
    { id: 'proj-003', title: 'Microservices Payment Gateway', company: 'Fintech DanaNusantara', category: 'Backend & Cloud', matchScore: 76, workType: 'Hybrid' },
  ];

  function fetchProjectsFromServer() {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PROJECTS), 700));
  }

  function createProjectOnServer(payload) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!payload.title || payload.title.length < 8) {
          reject(new Error('Judul proyek minimal 8 karakter.'));
          return;
        }
        resolve({ id: `proj-${Date.now()}`, matchScore: 70, ...payload });
      }, 500);
    });
  }

  // Server State (disimulasikan; produksi memakai TanStack Query — lihat Modul 7)
  let projects = $state([]);
  let isLoading = $state(true);
  let isError = $state(null);

  // Client UI State — primitif Runes
  let categoryFilter = $state('all');
  let formTitle = $state('');
  let formCompany = $state('');
  let formError = $state(null);
  let isSubmitting = $state(false);

  // Derived state — otomatis terbarui tanpa Virtual DOM
  let categories = $derived(['all', ...new Set(projects.map((p) => p.category))]);
  let filteredProjects = $derived(
    categoryFilter === 'all' ? projects : projects.filter((p) => p.category === categoryFilter)
  );

  $effect(() => {
    fetchProjectsFromServer()
      .then((data) => { projects = data; isError = null; })
      .catch((err) => { isError = err.message; })
      .finally(() => { isLoading = false; });
  });

  async function handleSubmit(e) {
    e.preventDefault();
    formError = null;
    isSubmitting = true;
    try {
      const created = await createProjectOnServer({ title: formTitle, company: formCompany, category: 'Umum' });
      projects = [created, ...projects];
      formTitle = '';
      formCompany = '';
    } catch (err) {
      formError = err.message;
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="dashboard-container">
  <h2>ProjectMatch AI — Dashboard Proyek (Svelte 5 Runes)</h2>
  <p class="subtitle">
    Filter kategori & form pasang lowongan adalah Client UI State lokal; daftar proyek adalah Server State.
  </p>

  <!-- MODULE: FORM ENTRY -->
  <form onsubmit={handleSubmit} class="form-row">
    <input type="text" placeholder="Judul proyek (min. 8 karakter)..." bind:value={formTitle} />
    <input type="text" placeholder="Nama mitra..." bind:value={formCompany} />
    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Mengirim…' : 'Pasang Lowongan'}</button>
  </form>
  {#if formError}
    <div class="form-error">{formError}</div>
  {/if}

  <!-- MODULE: DASHBOARD (filter) -->
  <div class="filter-row">
    {#each categories as cat}
      <button class:active={categoryFilter === cat} onclick={() => (categoryFilter = cat)}>
        {cat === 'all' ? 'Semua' : cat}
      </button>
    {/each}
  </div>

  <!-- MODULE: DATA TABLE / LIST — Penanganan Async UI -->
  {#if isLoading}
    <div class="status-loading">Memuat proyek dari server…</div>
  {:else if isError}
    <div class="status-error">Error: {isError}</div>
  {:else if filteredProjects.length === 0}
    <div class="status-empty">Belum ada proyek pada kategori ini.</div>
  {:else}
    <ul class="project-list">
      {#each filteredProjects as p (p.id)}
        <li class="project-item">
          <div>
            <strong>{p.title}</strong>
            <div class="meta">{p.company} • {p.workType}</div>
          </div>
          <span class="score" class:high={p.matchScore >= 85}>{p.matchScore}%</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dashboard-container { max-width: 720px; margin: auto; padding: 24px; font-family: system-ui, sans-serif; }
  .subtitle { color: #64748b; font-size: 13px; }
  .form-row { display: flex; gap: 8px; margin: 16px 0; flex-wrap: wrap; }
  .form-row input { padding: 8px; border-radius: 8px; border: 1px solid #cbd5e1; }
  .form-row input:first-child { flex: 2; }
  .form-row input:nth-child(2) { flex: 1; }
  .form-row button { padding: 8px 16px; background: #626CDA; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
  .form-error { color: #C95D36; font-size: 12px; margin-bottom: 12px; }
  .filter-row { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
  .filter-row button { padding: 6px 12px; border-radius: 999px; border: 1px solid #626CDA; background: #fff; color: #626CDA; font-size: 12px; font-weight: 700; cursor: pointer; }
  .filter-row button.active { background: #626CDA; color: #fff; }
  .status-loading { padding: 16px; background: #fef9c3; }
  .status-error { padding: 16px; background: #fee2e2; color: #b91c1c; }
  .status-empty { padding: 16px; background: #f1f5f9; }
  .project-list { list-style: none; padding: 0; }
  .project-item { display: flex; justify-content: space-between; padding: 12px; background: #f8fafc; margin-bottom: 8px; border-radius: 8px; }
  .meta { font-size: 12px; color: #64748b; }
  .score { font-weight: 800; color: #6b5800; }
  .score.high { color: #1e583c; }
</style>
