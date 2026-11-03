'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

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
      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm ${
        synced
          ? 'text-lime-900 bg-lime-100 border border-lime-300 shadow-xs'
          : 'text-white bg-purple-600 hover:bg-purple-700 border-transparent shadow-purple-600/25'
      }`}
    >
      {synced ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-lime-700" />
          <span>GitHub &amp; CV Tersinkron</span>
        </>
      ) : (
        <>
          <UploadCloud className="w-4 h-4" />
          <span>Upload CV / Sync GitHub</span>
        </>
      )}
    </button>
  );
}
