/**
 * ProjectMatch AI - Hero RPG Stats Radar Chart Configuration
 * Menggunakan Chart.js untuk memvisualisasikan 5 dimensi keahlian mahasiswa:
 * 1. Frontend Development
 * 2. Backend Architecture
 * 3. UI/UX Design
 * 4. AI & Machine Learning
 * 5. System Architecture
 */

let heroChartInstance = null;

// Dataset default mahasiswa
export const defaultStudentStats = {
  labels: [
    'Frontend Dev',
    'Backend Arch',
    'UI/UX Design',
    'AI & Machine Learning',
    'System Architecture'
  ],
  studentValues: [92, 78, 85, 90, 72],
  industryBenchmark: [75, 80, 70, 75, 70]
};

// Preset role RPG untuk pengujian interaktif
export const rolePresets = {
  ai_specialist: {
    name: 'AI & Data Specialist',
    values: [65, 85, 60, 96, 80]
  },
  fullstack_hero: {
    name: 'Fullstack Hero',
    values: [92, 88, 85, 75, 82]
  },
  uiux_wizard: {
    name: 'UI/UX & Design Wizard',
    values: [95, 55, 98, 60, 65]
  },
  cloud_architect: {
    name: 'Systems & Cloud Architect',
    values: [60, 94, 50, 78, 96]
  }
};

/**
 * Inisialisasi Chart.js Radar Chart
 * @param {HTMLCanvasElement} canvasEl - Elemen canvas target
 * @param {Object} [customData] - Data nilai kustom (opsional)
 * @returns {Chart} Instance Chart.js
 */
export function initHeroRadarChart(canvasEl, customData = {}) {
  if (!canvasEl) {
    console.warn('Canvas radar chart tidak ditemukan.');
    return null;
  }

  // Jika sudah pernah ada instance, hancurkan terlebih dahulu
  if (heroChartInstance) {
    heroChartInstance.destroy();
  }

  const studentData = customData.studentValues || defaultStudentStats.studentValues;
  const benchmarkData = customData.industryBenchmark || defaultStudentStats.industryBenchmark;

  const data = {
    labels: defaultStudentStats.labels,
    datasets: [
      {
        label: 'Stat Mahasiswa (Kandidat)',
        data: studentData,
        fill: true,
        backgroundColor: 'rgba(98, 108, 218, 0.28)', // Royal Blue translusen
        borderColor: '#626CDA', // Royal Blue
        pointBackgroundColor: '#626CDA',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#626CDA',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2.5
      },
      {
        label: 'Benchmark Rata-rata Industri',
        data: benchmarkData,
        fill: true,
        backgroundColor: 'rgba(250, 165, 90, 0.15)', // Sandy Brown translusen
        borderColor: '#FAA55A', // Sandy Brown
        borderDash: [5, 5],
        pointBackgroundColor: '#FAA55A',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#FAA55A',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2
      }
    ]
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 14,
            padding: 16,
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              size: 12,
              weight: '500'
            },
            color: '#334155'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          titleFont: {
            family: "'Outfit', sans-serif",
            size: 13,
            weight: 'bold'
          },
          bodyFont: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12
          },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.r} / 100 PTS`;
            }
          }
        }
      },
      scales: {
        r: {
          angleLines: {
            color: 'rgba(98, 108, 218, 0.15)'
          },
          grid: {
            color: 'rgba(98, 108, 218, 0.12)'
          },
          pointLabels: {
            font: {
              family: "'Outfit', sans-serif",
              size: 12,
              weight: '600'
            },
            color: '#1e293b'
          },
          ticks: {
            backdropColor: 'transparent',
            color: '#64748b',
            stepSize: 20,
            font: {
              size: 10
            }
          },
          min: 0,
          max: 100
        }
      }
    }
  };

  // @ts-ignore (Chart didapat dari global CDN)
  heroChartInstance = new window.Chart(canvasEl, config);
  return heroChartInstance;
}

/**
 * Update nilai radar chart dengan animasi halus
 * @param {number[]} newValues - Nilai 5 dimensi baru
 * @param {string} [presetName] - Nama preset role (opsional)
 */
export function updateHeroStats(newValues, presetName = '') {
  if (!heroChartInstance) return;

  heroChartInstance.data.datasets[0].data = newValues;
  if (presetName) {
    heroChartInstance.data.datasets[0].label = `Stat Mahasiswa (${presetName})`;
  }
  heroChartInstance.update();
}

/**
 * Toggle visibilitas dataset benchmark industri
 */
export function toggleBenchmarkDataset() {
  if (!heroChartInstance) return false;
  const isHidden = !heroChartInstance.isDatasetVisible(1);
  heroChartInstance.setDatasetVisibility(1, isHidden);
  heroChartInstance.update();
  return isHidden;
}
