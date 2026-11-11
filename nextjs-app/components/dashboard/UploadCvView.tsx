'use client';

import React, { useState } from 'react';

export default function UploadCvView() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('https://github.com/radensatria');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const skills = [
    'Python & PyTorch',
    'FastAPI & Docker',
    'Next.js & React',
    'TypeScript & TailwindCSS',
    'PostgreSQL & Vector DB',
    'Computer Vision / YOLO',
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  const processUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleSyncGithub = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Sinkronisasi repositori GitHub (${githubUrl}) berhasil! Data portofolio telah diperbarui.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Upload CV &amp; Sinkronisasi Portofolio
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Unggah resume terbaru atau tautkan GitHub untuk meningkatkan skor rekomendasi proyek.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Dropzone */}
        <div className="lg:col-span-7 space-y-6">
          {/* File Upload Box */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_25px_rgba(15,23,42,0.04)] space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                1. Unggah Berkas CV (PDF / DOCX)
              </h3>
              <p className="text-xs text-slate-500">
                Maksimal ukuran file: 10 MB
              </p>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer relative ${
                dragActive
                  ? 'border-primary-container bg-purple-50/50'
                  : 'border-slate-300 hover:border-purple-300 bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Pilih file CV"
              />

              <div className="space-y-2">
                <div className="text-3xl">📄</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {file ? file.name : 'Klik untuk memilih berkas atau tarik ke sini'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format file yang didukung: PDF atau DOCX
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Mengekstrak informasi keahlian...</span>
                  <span className="font-bold text-primary-container">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container transition-all duration-200 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3.5 rounded-2xl bg-lime-100 border border-lime-300 text-lime-900 text-xs font-bold flex items-center gap-2">
                <span>✅</span>
                <span>Berkas CV berhasil dianalisis dan disimpan.</span>
              </div>
            )}
          </div>

          {/* GitHub Sync */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                2. Tautkan Akun GitHub
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan repositori untuk memvalidasi portofolio kode nyata.
              </p>
            </div>

            <form onSubmit={handleSyncGithub} className="space-y-3">
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 rounded-full bg-slate-50/60 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-container font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-primary-container hover:bg-primary-hover shadow-md shadow-purple-500/25 transition-all cursor-pointer"
              >
                Sinkronkan Repositori
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detected Skills */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Keahlian yang Terdeteksi
            </h3>
            <p className="text-xs text-slate-500">
              Hasil ekstraksi otomatis dari CV dan GitHub Anda:
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200"
              >
                ✓ {skill}
              </span>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-950 space-y-1">
            <p className="font-extrabold text-primary-container">💡 Tips Peningkatan Profil:</p>
            <p className="text-[11px] text-purple-900 leading-relaxed">
              Tambahkan detail proyek akhir atau kontribusi open-source untuk memaksimalkan peluang dipanggil wawancara oleh mitra industri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
