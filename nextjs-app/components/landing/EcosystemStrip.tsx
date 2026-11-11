import React from 'react';

export default function EcosystemStrip() {
  const partners = [
    { name: 'Kemendikbudristek', tag: 'DIKTI VOKASI' },
    { name: 'Politeknik Negeri', tag: 'CAMPUS NETWORK' },
    { name: 'BioFarmanusa', tag: 'GENOMICS LAB' },
    { name: 'Telkom Digital', tag: 'INDUSTRY PARTNER' },
    { name: 'Astra Ventura', tag: 'TALENT HUB' },
    { name: 'Nusantara AI', tag: 'RESEARCH LAB' },
    { name: 'AWS Academy', tag: 'CLOUD COMPUTE' },
  ];

  return (
    <div className="pt-10 sm:pt-14 pb-2 border-t border-slate-100/80 w-full text-center space-y-5">
      <p className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-normal">
        Dipercaya oleh 1.240+ Mahasiswa, Laboratorium Riset &amp; Mitra Industri Vokasi
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14 opacity-70 hover:opacity-100 transition-opacity">
        {partners.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-2 group transition-all"
            title={`${p.name} - ${p.tag}`}
          >
            <span className="font-display font-black text-xs sm:text-sm tracking-tight text-slate-700 group-hover:text-slate-900 transition-colors">
              {p.name}
            </span>
            <span className="text-[8px] font-bold tracking-widest text-slate-400 group-hover:text-blue-600 uppercase border-l border-slate-200 pl-2 transition-colors">
              {p.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
