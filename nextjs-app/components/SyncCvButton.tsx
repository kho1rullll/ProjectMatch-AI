'use client';

import React, { useState } from 'react';

export default function SyncCvButton() {
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 3500);
  };

  return (
    <button
      type="button"
      onClick={handleSync}
      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
    >
      {synced ? '✓ GitHub & CV Tersinkron' : '📁 Upload CV / Sync GitHub'}
    </button>
  );
}
