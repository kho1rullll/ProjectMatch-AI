<script setup>
/**
 * ProjectMatch AI — Project Dashboard (Vue 3, Composition API)
 * Padanan langsung dari ProjectDashboardReact19.jsx & TaskDashboardSvelte5.svelte
 * untuk perbandingan reaktivitas antar framework (Modul 5).
 */
import { ref, computed, onMounted } from 'vue';

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
const projects = ref([]);
const isLoading = ref(true);
const isError = ref(null);

// Client UI State
const categoryFilter = ref('all');
const formTitle = ref('');
const formCompany = ref('');
const formError = ref(null);
const isSubmitting = ref(false);

onMounted(async () => {
  try {
    projects.value = await fetchProjectsFromServer();
  } catch (err) {
    isError.value = err.message;
  } finally {
    isLoading.value = false;
  }
});

// Computed Property Reaktif (setara React Compiler auto-memo / Svelte $derived)
const categories = computed(() => ['all', ...new Set(projects.value.map((p) => p.category))]);
const filteredProjects = computed(() =>
  categoryFilter.value === 'all'
    ? projects.value
    : projects.value.filter((p) => p.category === categoryFilter.value)
);

async function handleSubmit() {
  formError.value = null;
  isSubmitting.value = true;
  try {
    const created = await createProjectOnServer({ title: formTitle.value, company: formCompany.value, category: 'Umum' });
    projects.value.unshift(created);
    formTitle.value = '';
    formCompany.value = '';
  } catch (err) {
    formError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="dashboard-container">
    <h2>ProjectMatch AI — Dashboard Proyek (Vue 3 Composition API)</h2>
    <p class="subtitle">
      Filter kategori & form pasang lowongan adalah Client UI State lokal; daftar proyek adalah Server State.
    </p>

    <!-- MODULE: FORM ENTRY -->
    <form @submit.prevent="handleSubmit" class="form-row">
      <input type="text" v-model="formTitle" placeholder="Judul proyek (min. 8 karakter)..." />
      <input type="text" v-model="formCompany" placeholder="Nama mitra..." />
      <button type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Mengirim…' : 'Pasang Lowongan' }}</button>
    </form>
    <div v-if="formError" class="form-error">{{ formError }}</div>

    <!-- MODULE: DASHBOARD (filter) -->
    <div class="filter-row">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="{ active: categoryFilter === cat }"
        @click="categoryFilter = cat"
      >
        {{ cat === 'all' ? 'Semua' : cat }}
      </button>
    </div>

    <!-- MODULE: DATA TABLE / LIST — Penanganan Async UI -->
    <div v-if="isLoading" class="status-loading">Memuat proyek dari server…</div>
    <div v-else-if="isError" class="status-error">Error: {{ isError }}</div>
    <div v-else-if="filteredProjects.length === 0" class="status-empty">Belum ada proyek pada kategori ini.</div>
    <ul v-else class="project-list">
      <li v-for="p in filteredProjects" :key="p.id" class="project-item">
        <div>
          <strong>{{ p.title }}</strong>
          <div class="meta">{{ p.company }} • {{ p.workType }}</div>
        </div>
        <span class="score" :class="{ high: p.matchScore >= 85 }">{{ p.matchScore }}%</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
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
