import React, { useState, useEffect } from 'react';

/**
 * ProjectMatch AI — Project Dashboard (React 19)
 * Memetakan 3 modul SRS: Dashboard (ringkasan+filter), Form Entry (pasang lowongan),
 * Data Table/List (grid proyek dengan match score).
 *
 * Catatan React 19: tidak ada useMemo/useCallback manual — React Compiler
 * menganalisis filteredProjects & handler secara otomatis pada build-time.
 */

// ------- Simulasi Server State (menggantikan fetch ke FastAPI backend) -------
const MOCK_PROJECTS = [
  { id: 'proj-001', title: 'Engine NLP Riset Medis', company: 'BioInformatika Nusantara', category: 'AI & Machine Learning', matchScore: 94, workType: 'Hybrid', verified: true },
  { id: 'proj-002', title: 'Dashboard Telemetri IoT Smart Campus', company: 'Pusat Riset Smart City ITB', category: 'Frontend & UI/UX', matchScore: 88, workType: 'Remote', verified: true },
  { id: 'proj-003', title: 'Microservices Payment Gateway', company: 'Fintech DanaNusantara', category: 'Backend & Cloud', matchScore: 76, workType: 'Hybrid', verified: true },
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
      resolve({ id: `proj-${Date.now()}`, matchScore: 70, verified: true, ...payload });
    }, 500);
  });
}

// ------- Komponen Utama -------
export default function ProjectDashboardReact19() {
  // Server State (disimulasikan manual — di produksi ProjectMatch AI memakai TanStack Query, lihat Modul 7)
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  // Client UI State
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchProjectsFromServer()
      .then((data) => { setProjects(data); setIsError(null); })
      .catch((err) => setIsError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Di-memoize otomatis oleh React Compiler (React 19) — tanpa useMemo eksplisit
  const filteredProjects = projects.filter((p) =>
    categoryFilter === 'all' ? true : p.category === categoryFilter
  );

  const categories = ['all', ...new Set(projects.map((p) => p.category))];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      const created = await createProjectOnServer({ title: formTitle, company: formCompany, category: 'Umum' });
      setProjects((prev) => [created, ...prev]);
      setFormTitle('');
      setFormCompany('');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontWeight: 800 }}>ProjectMatch AI — Dashboard Proyek (React 19)</h2>
      <p style={{ color: '#64748b', fontSize: 13 }}>
        Filter kategori dan penambahan lowongan dikelola sebagai Client UI State lokal; daftar proyek
        adalah Server State yang disimulasikan.
      </p>

      {/* MODULE: FORM ENTRY */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Judul proyek (min. 8 karakter)..."
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          style={{ flex: 2, padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }}
        />
        <input
          type="text"
          placeholder="Nama mitra..."
          value={formCompany}
          onChange={(e) => setFormCompany(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #cbd5e1' }}
        />
        <button type="submit" disabled={isSubmitting} style={{ padding: '8px 16px', background: '#626CDA', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700 }}>
          {isSubmitting ? 'Mengirim…' : 'Pasang Lowongan'}
        </button>
      </form>
      {formError && <div style={{ color: '#C95D36', fontSize: 12, marginBottom: 12 }}>{formError}</div>}

      {/* MODULE: DASHBOARD (filter) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '6px 12px', borderRadius: 999, border: '1px solid #626CDA',
              background: categoryFilter === cat ? '#626CDA' : '#fff',
              color: categoryFilter === cat ? '#fff' : '#626CDA', fontSize: 12, fontWeight: 700, cursor: 'pointer'
            }}
          >
            {cat === 'all' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {/* MODULE: DATA TABLE / LIST — Penanganan Async UI */}
      {isLoading && <div style={{ padding: 16, background: '#fef9c3' }}>Memuat proyek dari server…</div>}
      {isError && <div style={{ padding: 16, background: '#fee2e2', color: '#b91c1c' }}>Error: {isError}</div>}
      {!isLoading && !isError && filteredProjects.length === 0 && (
        <div style={{ padding: 16, background: '#f1f5f9' }}>Belum ada proyek pada kategori ini.</div>
      )}
      {!isLoading && !isError && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredProjects.map((p) => (
            <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#f8fafc', marginBottom: 8, borderRadius: 8 }}>
              <div>
                <strong>{p.title}</strong>
                <div style={{ fontSize: 12, color: '#64748b' }}>{p.company} • {p.workType}</div>
              </div>
              <span style={{ fontWeight: 800, color: p.matchScore >= 85 ? '#1e583c' : '#6b5800' }}>{p.matchScore}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
