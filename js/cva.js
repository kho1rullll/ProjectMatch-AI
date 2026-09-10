/**
 * ProjectMatch AI - Class Variance Authority (CVA) Pattern Engine
 * Menerapkan simulasi Headless UI / CVA menggunakan Vanilla JavaScript ES6+
 * untuk mengisolasi logika variasi komponen styling secara modular.
 */

/**
 * CVA Factory Function
 * @param {string} baseClasses - Kelas CSS dasar yang selalu diterapkan
 * @param {Object} config - Konfigurasi varian dan default
 * @returns {Function} Fungsi generator kelas CSS berdasarkan properti
 */
export function cva(baseClasses = '', config = {}) {
  const { variants = {}, defaultVariants = {} } = config;

  return function (props = {}) {
    const classList = [baseClasses];

    // Evaluasi setiap kategori varian
    for (const [variantName, variantOptions] of Object.entries(variants)) {
      const selectedOption = props[variantName] !== undefined 
        ? props[variantName] 
        : defaultVariants[variantName];

      if (selectedOption && variantOptions[selectedOption]) {
        classList.push(variantOptions[selectedOption]);
      }
    }

    // Tambahkan kustom class tambahan bila ada
    if (props.className) {
      classList.push(props.className);
    }

    return classList.filter(Boolean).join(' ').trim();
  };
}

/**
 * 1. Badge Variants (CVA)
 * Mengontrol tampilan pill tag, status verifikasi, dan Match Tier
 */
export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors leading-none',
  {
    variants: {
      variant: {
        // High Match Tier (≥ 85%) - Aksen Royal Blue & Honeydew
        high: 'bg-[#EAFFF5] text-[#1e583c] border border-[#626CDA]/40 shadow-xs shadow-[#626CDA]/10 font-bold',
        // Medium Match Tier (60% - 84%) - Aksen Lime Cream & Sandy Brown
        medium: 'bg-[#FBFF96] text-[#6b5800] border border-[#FAA55A]/50 shadow-xs font-semibold',
        // Low Match Tier (< 60%) - Aksen Spicy Paprika
        low: 'bg-[#FFF2EE] text-[#C95D36] border border-[#C95D36]/40 shadow-xs font-semibold',
        // Skill Pill Tag di kartu lowongan & detail
        skill: 'bg-white/70 text-slate-700 border border-white/80 hover:bg-white/90 hover:border-[#626CDA]/40 text-slate-800 shadow-xs',
        // Role Profile Badge
        role: 'bg-[#626CDA]/10 text-[#626CDA] border border-[#626CDA]/25 font-semibold',
        // Status Tag Netral / Verified
        verified: 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 font-medium',
        unverified: 'bg-slate-200/70 text-slate-600 border border-slate-300 font-medium'
      },
      size: {
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-xs sm:text-sm',
        lg: 'px-4 py-2 text-sm sm:text-base font-semibold'
      }
    },
    defaultVariants: {
      variant: 'skill',
      size: 'sm'
    }
  }
);

/**
 * 2. Button Variants (CVA)
 * Mengontrol styling button semantik dengan micro-interaction ripple
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ripple-btn',
  {
    variants: {
      variant: {
        // Primary: Royal Blue Brand Action
        primary: 'bg-[#626CDA] hover:bg-[#5059be] text-white shadow-md shadow-[#626CDA]/25 active:scale-[0.98]',
        // Secondary: Sandy Brown Warm Accent
        secondary: 'bg-[#FAA55A] hover:bg-[#ea9346] text-slate-900 shadow-md shadow-[#FAA55A]/25 active:scale-[0.98]',
        // Destructive / Warning: Spicy Paprika
        destructive: 'bg-[#C95D36] hover:bg-[#b04f2c] text-white shadow-md shadow-[#C95D36]/25 active:scale-[0.98]',
        // Glassmorphism Light Button
        glass: 'bg-white/75 hover:bg-white/90 text-slate-800 border border-white/80 shadow-sm backdrop-blur-md active:scale-[0.98]',
        // Outline Button
        outline: 'border-1.5 border-[#626CDA]/40 text-[#626CDA] hover:bg-[#626CDA]/10 active:scale-[0.98]',
        // Ghost Button
        ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 active:scale-[0.98]'
      },
      size: {
        sm: 'px-3 py-1.5 text-xs font-semibold',
        md: 'px-4 py-2 text-sm font-semibold',
        lg: 'px-6 py-3 text-base font-bold'
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false
    }
  }
);

/**
 * 3. Card Variants (CVA)
 */
export const cardVariants = cva(
  'rounded-2xl transition-all duration-300',
  {
    variants: {
      variant: {
        glass: 'glass-card',
        elevated: 'glass-card-elevated',
        interactive: 'glass-card glass-card-hover'
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
      }
    },
    defaultVariants: {
      variant: 'glass',
      padding: 'md'
    }
  }
);

/**
 * Helper: Penentu Match Tier berdasarkan persentase
 * @param {number} score - Skor kecocokan (0 - 100)
 * @returns {'high' | 'medium' | 'low'}
 */
export function getMatchTier(score) {
  if (score >= 85) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

/**
 * Helper: Render HTML Badge Kecocokan Menggunakan CVA
 * @param {number} score - Skor kecocokan
 * @param {string} [customSize='sm'] - Ukuran badge
 * @returns {string} Markup string HTML badge
 */
export function renderMatchBadge(score, customSize = 'sm') {
  const tier = getMatchTier(score);
  const classes = badgeVariants({ variant: tier, size: customSize });
  
  let iconMarkup = '';
  let tierLabel = '';

  if (tier === 'high') {
    iconMarkup = `<svg class="w-3.5 h-3.5 text-[#626CDA]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`;
    tierLabel = 'High Match';
  } else if (tier === 'medium') {
    iconMarkup = `<svg class="w-3.5 h-3.5 text-[#FAA55A]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>`;
    tierLabel = 'Medium Match';
  } else {
    iconMarkup = `<svg class="w-3.5 h-3.5 text-[#C95D36]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`;
    tierLabel = 'Low Match';
  }

  return `
    <span class="${classes}" title="Tingkat Kemiripan Semantik AI: ${score}%" aria-label="${tierLabel} ${score}%">
      ${iconMarkup}
      <span>${score}%</span>
      <span class="opacity-75 text-[10px] uppercase font-bold tracking-wider hidden sm:inline">(${tierLabel})</span>
    </span>
  `;
}
