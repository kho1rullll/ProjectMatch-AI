/**
 * ProjectMatch AI - Master Application Controller
 * Mengatur interaktivitas DOM, Aksesibilitas (WAI-ARIA), Sistem Notifikasi Toast,
 * Modal Focus-Trap, dan Form Logic.
 */

import { badgeVariants, buttonVariants, renderMatchBadge } from './cva.js';

/* ==========================================================================
   1. SISTEM NOTIFIKASI TOAST (Aksesibel via WAI-ARIA role="status")
   ========================================================================== */
export function showToast(message, type = 'success', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

  // Skema ikon dan aksen warna berdasarkan tipe toast
  let iconSvg = '';
  let borderAccent = '';

  if (type === 'success') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-[#EAFFF5] border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>`;
    borderAccent = 'border-l-4 border-l-emerald-500';
  } else if (type === 'error') {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-[#FFF2EE] border border-red-300 flex items-center justify-center shrink-0 text-[#C95D36]">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </div>`;
    borderAccent = 'border-l-4 border-l-[#C95D36]';
  } else {
    iconSvg = `
      <div class="w-8 h-8 rounded-full bg-[#626CDA]/10 border border-[#626CDA]/30 flex items-center justify-center shrink-0 text-[#626CDA]">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>`;
    borderAccent = 'border-l-4 border-l-[#626CDA]';
  }

  toast.classList.add(...borderAccent.split(' '));

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 min-w-0">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${type === 'success' ? 'Berhasil' : type === 'error' ? 'Perhatian' : 'Informasi'}</p>
      <p class="text-sm font-medium text-slate-800 leading-snug mt-0.5 break-words">${message}</p>
    </div>
    <button type="button" class="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer" aria-label="Tutup notifikasi">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  container.appendChild(toast);

  // Animasi masuk
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  // Tombol close
  const closeBtn = toast.querySelector('button');
  const dismiss = () => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 400);
  };

  closeBtn.addEventListener('click', dismiss);

  // Auto dismiss
  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}

/* ==========================================================================
   2. SISTEM MODAL INTERAKTIF (WAI-ARIA & Keyboard Navigation)
   ========================================================================== */
let activeModal = null;
let previousActiveElement = null;

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  previousActiveElement = document.activeElement;
  activeModal = modal;

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    modal.classList.add('modal-open');
    // Autofokus pada elemen pertama yang dapat difokuskan atau tombol close
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  });
}

export function closeModal(modalId) {
  const modal = modalId ? document.getElementById(modalId) : activeModal;
  if (!modal) return;

  modal.classList.remove('modal-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  setTimeout(() => {
    modal.classList.add('hidden');
    activeModal = null;
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }, 250);
}

// Global modal event listener (ESC key & backdrop click)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeModal) {
    closeModal();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-modal-close]') || e.target.closest('[data-modal-close]')) {
    closeModal();
  } else if (activeModal && e.target.classList.contains('modal-backdrop')) {
    closeModal();
  }
});

/* ==========================================================================
   3. MIKRO-INTERAKSI RIPPLE PADA TOMBOL
   ========================================================================== */
export function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple-btn');
    if (!btn) return;

    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;

    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');

    const existingRipple = btn.querySelector('.ripple-effect');
    if (existingRipple) {
      existingRipple.remove();
    }

    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
}

/* ==========================================================================
   4. INTERACTIVE SKILL TAG BUILDER (Untuk post-project.html)
   ========================================================================== */
export function initSkillTagBuilder({
  inputSelector = '#skill-input',
  containerSelector = '#tags-container',
  hiddenInputSelector = '#skills-hidden',
  initialSkills = ['Python', 'FastAPI']
} = {}) {
  const input = document.querySelector(inputSelector);
  const container = document.querySelector(containerSelector);
  const hiddenInput = document.querySelector(hiddenInputSelector);

  if (!input || !container) return null;

  let tags = [...initialSkills];

  function renderTags() {
    container.innerHTML = '';
    tags.forEach((tag, index) => {
      const pill = document.createElement('span');
      pill.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#626CDA]/15 text-[#626CDA] border border-[#626CDA]/30 animate-fadeIn';
      pill.innerHTML = `
        <span>${escapeHtml(tag)}</span>
        <button type="button" data-index="${index}" class="text-[#626CDA] hover:text-[#C95D36] transition-colors cursor-pointer rounded-full p-0.5 focus:outline-none" aria-label="Hapus keahlian ${escapeHtml(tag)}">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      `;
      container.appendChild(pill);
    });

    if (hiddenInput) {
      hiddenInput.value = JSON.stringify(tags);
    }
  }

  function addTag(value) {
    const cleaned = value.trim();
    if (cleaned && !tags.includes(cleaned)) {
      tags.push(cleaned);
      renderTags();
      input.value = '';
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input.value);
    } else if (e.key === 'Backspace' && !input.value && tags.length > 0) {
      tags.pop();
      renderTags();
    }
  });

  container.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('button[data-index]');
    if (removeBtn) {
      const idx = parseInt(removeBtn.getAttribute('data-index'), 10);
      tags.splice(idx, 1);
      renderTags();
    }
  });

  renderTags();

  return {
    getTags: () => [...tags],
    clearTags: () => {
      tags = [];
      renderTags();
    },
    setTags: (newTags) => {
      tags = [...newTags];
      renderTags();
    }
  };
}

/* ==========================================================================
   5. TEMPLATE RENDERER KARTU PROYEK (Menggunakan CVA)
   ========================================================================== */
export function renderProjectCardHtml(project) {
  const matchBadge = renderMatchBadge(project.matchScore, 'sm');
  const skillsPills = project.skillsRequired
    .map(
      (skill) =>
        `<span class="${badgeVariants({ variant: 'skill', size: 'sm' })}">${escapeHtml(skill)}</span>`
    )
    .join('');

  return `
    <article class="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between relative group border border-white/60 focus-within:ring-2 focus-within:ring-[#626CDA]" data-project-id="${project.id}">
      <div>
        <div class="flex items-start justify-between gap-3 mb-3">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${escapeHtml(project.category)}</span>
          ${matchBadge}
        </div>

        <h3 class="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#626CDA] transition-colors mb-2">
          ${escapeHtml(project.title)}
        </h3>

        <div class="flex items-center gap-2 text-xs font-medium text-slate-600 mb-3">
          <span class="inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            ${escapeHtml(project.company)}
          </span>
          ${project.verified ? '<span class="text-emerald-600 font-bold" title="Mitra Terverifikasi">● Mitra Resmi</span>' : ''}
          <span class="text-slate-400">•</span>
          <span>${escapeHtml(project.workType)}</span>
        </div>

        <p class="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          ${escapeHtml(project.description)}
        </p>

        <div class="flex flex-wrap gap-1.5 mb-5" aria-label="Keahlian yang dibutuhkan">
          ${skillsPills}
        </div>
      </div>

      <div class="pt-4 border-t border-slate-200/60 flex items-center justify-between gap-3 mt-auto">
        <div class="text-xs text-slate-500">
          <span class="font-semibold text-slate-800">${escapeHtml(project.stipend || 'Tersedia Mentoring')}</span>
          <span class="block text-[11px]">${escapeHtml(project.duration)}</span>
        </div>
        <button type="button" class="${buttonVariants({ variant: 'glass', size: 'sm' })} view-detail-btn" data-project-id="${project.id}" aria-haspopup="dialog">
          <span>Drill-Down AI</span>
          <svg class="w-3.5 h-3.5 text-[#626CDA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </article>
  `;
}

/* ==========================================================================
   6. MODAL SKILL OVERLAY DRILL-DOWN POPULATOR
   ========================================================================== */
export function populateDrillDownModal(project, studentStats) {
  const modalContent = document.getElementById('drill-down-content');
  if (!modalContent) return;

  const req = project.requirementsBreakdown || {
    frontend: 80,
    backend: 75,
    uiux: 70,
    aiml: 85,
    architecture: 70
  };

  const student = studentStats || [92, 78, 85, 90, 72];
  const dims = [
    { name: 'Frontend Dev', student: student[0], req: req.frontend },
    { name: 'Backend Arch', student: student[1], req: req.backend },
    { name: 'UI/UX Design', student: student[2], req: req.uiux },
    { name: 'AI & Machine Learning', student: student[3], req: req.aiml },
    { name: 'System Architecture', student: student[4], req: req.architecture }
  ];

  modalContent.innerHTML = `
    <div class="space-y-6">
      <!-- Header Info Proyek -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs uppercase font-bold text-[#626CDA] tracking-wider">${escapeHtml(project.category)}</span>
          <span class="text-slate-300">•</span>
          <span class="text-xs text-slate-500">${escapeHtml(project.company)}</span>
        </div>
        <h2 id="modal-title" class="text-xl font-bold text-slate-900 leading-tight">
          ${escapeHtml(project.title)}
        </h2>
      </div>

      <!-- Skor Ringkasan Cosine Similarity -->
      <div class="p-4 rounded-xl bg-gradient-to-r from-[#EAFFF5] via-white to-[#FBFF96]/40 border border-[#626CDA]/20 flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-slate-500 uppercase">Cosine Similarity Match</p>
          <div class="flex items-baseline gap-2 mt-0.5">
            <span class="text-3xl font-extrabold text-[#626CDA]">${project.matchScore}%</span>
            <span class="text-xs font-medium text-slate-600">Skor Vektor Semantik: ${(project.similarityMetric || (project.matchScore / 100)).toFixed(3)}</span>
          </div>
        </div>
        <div>
          ${renderMatchBadge(project.matchScore, 'md')}
        </div>
      </div>

      <!-- Breakdown 5 Dimensi: Mahasiswa vs Kebutuhan Proyek -->
      <div>
        <h4 class="text-xs uppercase font-bold text-slate-700 tracking-wider mb-3">Analisis Kecocokan 5 Dimensi</h4>
        <div class="space-y-3.5">
          ${dims.map(d => {
            const isQualified = d.student >= d.req;
            const diff = d.student - d.req;
            return `
              <div>
                <div class="flex justify-between items-center text-xs mb-1 font-medium">
                  <span class="text-slate-800 font-semibold">${d.name}</span>
                  <span class="${isQualified ? 'text-emerald-700' : 'text-[#C95D36]'} font-bold">
                    ${isQualified ? `+${diff}% Memenuhi Syarat` : `${diff}% Defisit Kualifikasi`}
                  </span>
                </div>
                <!-- Dual Progress Bar -->
                <div class="h-3 w-full bg-slate-200/80 rounded-full overflow-hidden relative" title="Skill Kandidat: ${d.student}%, Standar Proyek: ${d.req}%">
                  <div class="h-full bg-[#626CDA] rounded-full transition-all duration-500" style="width: ${d.student}%" aria-valuenow="${d.student}" aria-valuemin="0" aria-valuemax="100"></div>
                  <!-- Marker kebutuhan proyek -->
                  <div class="absolute top-0 bottom-0 w-1 bg-[#FAA55A] shadow-sm" style="left: ${d.req}%;" title="Batas Minimal Kebutuhan: ${d.req}%"></div>
                </div>
                <div class="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>Kandidat: <strong>${d.student} pts</strong></span>
                  <span>Kebutuhan: <strong>${d.req} pts</strong></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Rincian Proyek & Tindakan -->
      <div class="pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-2">
        <p><strong>Deskripsi:</strong> ${escapeHtml(project.description)}</p>
        <p><strong>Bentuk Kerja:</strong> ${escapeHtml(project.workType)} | <strong>Durasi:</strong> ${escapeHtml(project.duration)}</p>
      </div>

      <div class="flex items-center justify-end gap-3 pt-2">
        <button type="button" data-modal-close class="${buttonVariants({ variant: 'ghost', size: 'sm' })}">
          Tutup
        </button>
        <button type="button" id="apply-project-btn" class="${buttonVariants({ variant: 'primary', size: 'sm' })}" data-project-id="${project.id}">
          <span>Lamar Proyek Ini</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    </div>
  `;

  // Listener tombol lamar
  const applyBtn = modalContent.querySelector('#apply-project-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      closeModal();
      showToast(`Lamaran untuk "${project.title}" berhasil dikirimkan ke mitra industri!`, 'success');
    });
  }
}

/* ==========================================================================
   7. UTILITY HELPER
   ========================================================================== */
function escapeHtml(unsafeStr) {
  if (typeof unsafeStr !== 'string') return '';
  return unsafeStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inisialisasi ripple effect saat dokumen siap
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initRippleEffect();
  });
}
