'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { ALL_PROJECTS } from '@/lib/data';

interface EvidenceDetail {
  key: string;
  name: string;
  score: number;
  evidence: string;
  githubRepo: string;
  academicCourses: string;
  projectsCompleted: string[];
}

export interface BenchmarkData {
  aiml: number;
  frontend: number;
  uiux: number;
  backend: number;
  architecture: number;
  name: string;
  company: string;
  [key: string]: number | string;
}

export interface MeshUserData {
  title: string;
  type: 'Mahasiswa' | 'Industri';
  dimensionKey: string;
  score: number;
  isStudent: boolean;
  isSub?: boolean;
  ratio?: number;
}

export default function HeroRpg3DChart() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Selected Target Project for Overlay Matching (SKPL Pillar 2)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-001');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | 'radar'>('3d');
  
  // Selected Node for Drill-down Portfolio Evidence (SKPL Pillar 1)
  const [activeDrilldown, setActiveDrilldown] = useState<EvidenceDetail | null>(null);

  const [hoveredInfo, setHoveredInfo] = useState<{
    title: string;
    type: 'Mahasiswa' | 'Industri';
    score: number;
    benchmark: number;
    x: number;
    y: number;
  } | null>(null);

  // Student 5-Dimensional Competency state
  const [studentStats, setStudentStats] = useState({
    aiml: 92,
    frontend: 85,
    uiux: 78,
    backend: 90,
    architecture: 84,
  });

  // Detailed portfolio evidence data for drill-down (SKPL Specification)
  const portfolioEvidences: Record<string, EvidenceDetail> = {
    aiml: {
      key: 'aiml',
      name: 'AI & Machine Learning',
      score: studentStats.aiml,
      evidence: 'Model Transformer IndoBERT fine-tuned untuk ekstraksi entitas medis (NER) dengan F1-Score 93.4%.',
      githubRepo: 'github.com/radensatria/medical-nlp-transformer',
      academicCourses: 'Kecerdasan Buatan (Nilai A), Pembelajaran Mesin (Nilai A)',
      projectsCompleted: ['IndoBERT Clinical NER', 'YOLOv8 Plate Detection', 'Sentiment Analysis Pilkada'],
    },
    frontend: {
      key: 'frontend',
      name: 'Frontend & Web Development',
      score: studentStats.frontend,
      evidence: 'Dashboard analitik real-time berbasis Next.js App Router, Tailwind CSS, dan visualisasi WebGL/Canvas.',
      githubRepo: 'github.com/radensatria/smart-campus-dashboard',
      academicCourses: 'Pemrograman Web (Nilai A), Desain Web Responsif (Nilai A)',
      projectsCompleted: ['ProjectMatch AI Web Client', 'E-Commerce UMKM Vokasi', 'Telemetri IoT Web App'],
    },
    uiux: {
      key: 'uiux',
      name: 'UI / UX & Multimedia Design',
      score: studentStats.uiux,
      evidence: 'Design system terstandarisasi di Figma, wireframe interaktif, pengujian kegunaan SUS Skor 82.5 (Grade A).',
      githubRepo: 'figma.com/@radensatria/projectmatch-design-system',
      academicCourses: 'Interaksi Manusia dan Komputer (Nilai A-), Grafika Komputer (Nilai A)',
      projectsCompleted: ['Figma Hero RPG Design Kit', 'Smart Kiosk Touch Interface', 'Mobile KTM UX'],
    },
    backend: {
      key: 'backend',
      name: 'Backend & Cloud Services',
      score: studentStats.backend,
      evidence: 'REST API & WebSocket berkecepatan tinggi dengan FastAPI & Go, PostgreSQL pgvector, dan caching Redis.',
      githubRepo: 'github.com/radensatria/fastapi-vector-matching-engine',
      academicCourses: 'Basis Data Terdistribusi (Nilai A), Rekayasa Perangkat Lunak (Nilai A)',
      projectsCompleted: ['Vector Similarity API', 'Payment Gateway Microservice', 'JWT Auth Service'],
    },
    architecture: {
      key: 'architecture',
      name: 'System Architecture & DevOps',
      score: studentStats.architecture,
      evidence: 'Arsitektur microservices ter-kontainerisasi Docker & Kubernetes, pipeline CI/CD GitHub Actions, & IoT ESP32 integration.',
      githubRepo: 'github.com/radensatria/esp32-kiosk-firmware',
      academicCourses: 'Arsitektur Komputer & Jaringan (Nilai A), Manajemen Proyek PL (Nilai A)',
      projectsCompleted: ['ESP32 RFID Kiosk Node', 'Dockerized Vector Engine', 'Kubernetes Helm Cluster'],
    },
  };

  // Current project benchmark values
  const currentBenchmark: BenchmarkData = useMemo(() => {
    if (selectedProjectId === 'benchmark') {
      return {
        aiml: 85,
        frontend: 70,
        uiux: 65,
        backend: 80,
        architecture: 75,
        name: 'Standar Rata-Rata Industri (Baseline)',
        company: 'Standar Nasional',
      };
    }
    const proj = ALL_PROJECTS.find((p) => p.id === selectedProjectId);
    if (!proj) {
      return {
        aiml: 85,
        frontend: 70,
        uiux: 65,
        backend: 80,
        architecture: 75,
        name: 'Standar Industri',
        company: 'Standar Baseline',
      };
    }
    return {
      aiml: proj.requirementsBreakdown.aiml,
      frontend: proj.requirementsBreakdown.frontend,
      uiux: proj.requirementsBreakdown.uiux,
      backend: proj.requirementsBreakdown.backend,
      architecture: proj.requirementsBreakdown.architecture,
      name: proj.title,
      company: proj.company,
    };
  }, [selectedProjectId]);

  // Cosine Similarity Calculation (SKPL Section 6.3)
  const cosineSimilarity = useMemo(() => {
    const v1 = [
      studentStats.aiml,
      studentStats.frontend,
      studentStats.uiux,
      studentStats.backend,
      studentStats.architecture,
    ];
    const v2 = [
      currentBenchmark.aiml,
      currentBenchmark.frontend,
      currentBenchmark.uiux,
      currentBenchmark.backend,
      currentBenchmark.architecture,
    ];

    let dot = 0;
    let mag1 = 0;
    let mag2 = 0;
    for (let i = 0; i < 5; i++) {
      const a = v1[i] ?? 0;
      const b = v2[i] ?? 0;
      dot += a * b;
      mag1 += a * a;
      mag2 += b * b;
    }
    if (mag1 === 0 || mag2 === 0) return '0.0';
    const sim = dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
    return (sim * 100).toFixed(1);
  }, [studentStats, currentBenchmark]);

  // Three.js Scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesRef = useRef<{ mesh: THREE.Mesh; targetHeight: number; initialY: number; data: MeshUserData }[]>([]);

  useEffect(() => {
    if (viewMode !== '3d') return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 440;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#F8FAFC');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(24, 28, 30);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(20, 40, 20);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.6);
    dirLight2.position.set(-20, 20, -20);
    scene.add(dirLight2);

    const orangeRimLight = new THREE.DirectionalLight(0xfdba74, 0.5);
    orangeRimLight.position.set(10, 10, -15);
    scene.add(orangeRimLight);

    // Floor Grid
    const gridHelper = new THREE.GridHelper(30, 24, 0x93c5fd, 0xe2e8f0);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.08 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    const studentMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.35,
      metalness: 0.1,
    });

    const industryMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.35,
      metalness: 0.1,
    });

    const dimensionsConfig = [
      { key: 'aiml' as const, name: 'AI & Data Science', cx: -6, cz: -6 },
      { key: 'frontend' as const, name: 'Frontend & UI', cx: 6, cz: -6 },
      { key: 'uiux' as const, name: 'UI/UX Design', cx: 8, cz: 4 },
      { key: 'backend' as const, name: 'Backend & Cloud', cx: -6, cz: 6 },
      { key: 'architecture' as const, name: 'System Architecture', cx: 0, cz: 0 },
    ];

    const boxGeo = new THREE.BoxGeometry(1.6, 1, 1.6);
    const subBoxGeo = new THREE.BoxGeometry(1.1, 1, 1.1);

    meshesRef.current = [];

    dimensionsConfig.forEach((dim) => {
      // Main Student Column (Blue)
      const sVal = studentStats[dim.key] / 10;
      const studentMesh = new THREE.Mesh(boxGeo, studentMat.clone());
      studentMesh.scale.set(1, sVal, 1);
      studentMesh.position.set(dim.cx - 1.1, sVal / 2, dim.cz);
      studentMesh.castShadow = true;
      studentMesh.receiveShadow = true;
      studentMesh.userData = {
        title: dim.name,
        type: 'Mahasiswa',
        dimensionKey: dim.key,
        score: studentStats[dim.key],
        isStudent: true,
      };
      scene.add(studentMesh);
      meshesRef.current.push({
        mesh: studentMesh,
        targetHeight: sVal,
        initialY: dim.cx,
        data: studentMesh.userData as MeshUserData,
      });

      // Main Industry Column (Orange)
      const iVal = Number(currentBenchmark[dim.key] ?? 75) / 10;
      const industryMesh = new THREE.Mesh(boxGeo, industryMat.clone());
      industryMesh.scale.set(1, iVal, 1);
      industryMesh.position.set(dim.cx + 1.1, iVal / 2, dim.cz);
      industryMesh.castShadow = true;
      industryMesh.receiveShadow = true;
      industryMesh.userData = {
        title: dim.name,
        type: 'Industri',
        dimensionKey: dim.key,
        score: Number(currentBenchmark[dim.key] ?? 75),
        isStudent: false,
      };
      scene.add(industryMesh);
      meshesRef.current.push({
        mesh: industryMesh,
        targetHeight: iVal,
        initialY: dim.cx,
        data: industryMesh.userData as MeshUserData,
      });

      // Sub-pillars cluster
      const subOffsets = [
        { dx: -1.1, dz: 1.5, ratio: 0.75, isStud: true },
        { dx: 1.1, dz: -1.5, ratio: 0.65, isStud: false },
        { dx: 0, dz: 1.8, ratio: 0.5, isStud: false },
      ];

      subOffsets.forEach((sub) => {
        const baseScore = sub.isStud
          ? studentStats[dim.key]
          : Number(currentBenchmark[dim.key] ?? 75);
        const subVal = (baseScore * sub.ratio) / 10;
        const subMesh = new THREE.Mesh(
          subBoxGeo,
          sub.isStud ? studentMat.clone() : industryMat.clone()
        );
        subMesh.scale.set(1, subVal, 1);
        subMesh.position.set(dim.cx + sub.dx, subVal / 2, dim.cz + sub.dz);
        subMesh.castShadow = true;
        subMesh.receiveShadow = true;
        subMesh.userData = {
          title: `${dim.name} (Sub-Skill)`,
          type: sub.isStud ? 'Mahasiswa' : 'Industri',
          dimensionKey: dim.key,
          score: Math.round(baseScore * sub.ratio),
          isStudent: sub.isStud,
          isSub: true,
          ratio: sub.ratio,
        };
        scene.add(subMesh);
        meshesRef.current.push({
          mesh: subMesh,
          targetHeight: subVal,
          initialY: dim.cx,
          data: subMesh.userData as MeshUserData,
        });
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationAngle = 0.8;
    let cameraHeight = 26;
    let cameraRadius = 38;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotationAngle -= deltaX * 0.008;
        cameraHeight = Math.max(10, Math.min(45, cameraHeight + deltaY * 0.08));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes = meshesRef.current.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0 && intersects[0]) {
        const hit = intersects[0].object as THREE.Mesh;
        const udata = hit.userData as MeshUserData;
        if (udata && udata.title) {
          setHoveredInfo({
            title: udata.title,
            type: udata.type,
            score: udata.score,
            benchmark: Number(currentBenchmark[udata.dimensionKey] ?? 80),
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          document.body.style.cursor = 'pointer';
        }
      } else {
        if (!isDragging) {
          setHoveredInfo(null);
          document.body.style.cursor = 'default';
        }
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes = meshesRef.current.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0 && intersects[0]) {
        const hit = intersects[0].object as THREE.Mesh;
        const udata = hit.userData as MeshUserData;
        if (udata && udata.dimensionKey) {
          const ev = portfolioEvidences[udata.dimensionKey as keyof typeof portfolioEvidences];
          if (ev) setActiveDrilldown(ev);
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraRadius = Math.max(20, Math.min(60, cameraRadius + e.deltaY * 0.03));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    domElem.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (autoRotate) {
        rotationAngle += 0.004;
      }

      camera.position.x = Math.sin(rotationAngle) * cameraRadius;
      camera.position.z = Math.cos(rotationAngle) * cameraRadius;
      camera.position.y = cameraHeight;
      camera.lookAt(0, 3.5, 0);

      meshesRef.current.forEach(({ mesh, targetHeight }) => {
        mesh.scale.y += (targetHeight - mesh.scale.y) * 0.1;
        mesh.position.y = mesh.scale.y / 2;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      domElem.removeEventListener('mousedown', onMouseDown);
      domElem.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [autoRotate, viewMode]);

  // Update target heights in Three.js scene
  useEffect(() => {
    meshesRef.current.forEach((item) => {
      const udata = item.mesh.userData;
      if (!udata) return;

      let score = 0;
      if (udata.isStudent) {
        score = studentStats[udata.dimensionKey as keyof typeof studentStats];
      } else {
        score = Number(currentBenchmark[udata.dimensionKey] ?? 75);
      }

      if (udata.isSub) {
        score = score * (udata.ratio || 0.7);
      }

      udata.score = Math.round(score);
      item.targetHeight = Math.max(0.5, score / 10);
    });
  }, [studentStats, currentBenchmark]);

  // 2D Radar Spider Points Calculation for alternate view mode
  const dimensions = [
    { key: 'aiml' as const, label: 'AI & Data', angle: -90 },
    { key: 'frontend' as const, label: 'Frontend', angle: -18 },
    { key: 'uiux' as const, label: 'UI / UX', angle: 54 },
    { key: 'backend' as const, label: 'Backend', angle: 126 },
    { key: 'architecture' as const, label: 'System Arch', angle: 198 },
  ];
  const size = 320;
  const center = size / 2;
  const maxRadius = 110;

  const getCoordinates = (angleInDegrees: number, value: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    const r = (value / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angleInRadians),
      y: center + r * Math.sin(angleInRadians),
    };
  };

  const makePoints = (data: Record<string, number | string>) => {
    return dimensions
      .map((d) => {
        const { x, y } = getCoordinates(d.angle + 90, Number(data[d.key] ?? 50));
        return `${x},${y}`;
      })
      .join(' ');
  };

  const student2DPolygon = makePoints(studentStats);
  const benchmark2DPolygon = makePoints(currentBenchmark);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xl relative overflow-hidden space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Hero RPG Multi-Dimensional Matrix (SKPL Spesifikasi)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Menerapkan 3 Pilar Interaktivitas SKPL: <em>Touch Drill-down Bukti Portofolio</em>, <em>Automatic Overlay Project Matching</em>, &amp; <em>Vektor Cosine Similarity</em>.
          </p>
        </div>

        {/* View Mode & Project Overlay Target Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Switch 3D vs 2D Radar */}
          <div className="p-1 bg-slate-100 rounded-xl border border-slate-200 flex items-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === '3d' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              🎮 3D Voxel
            </button>
            <button
              type="button"
              onClick={() => setViewMode('radar')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'radar' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              🕸️ Radar 2D
            </button>
          </div>

          {/* Project Target Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <label className="font-bold text-slate-600">Overlay Proyek:</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[220px]"
            >
              <option value="benchmark">Standar Rata-Rata Industri (Baseline)</option>
              {ALL_PROJECTS.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.company.slice(0, 18)} - {proj.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {viewMode === '3d' && (
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                autoRotate
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {autoRotate ? '⏸ Hentikan Putar' : '🔄 Putar 3D Otomatis'}
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Canvas or Radar Area */}
        <div className="lg:col-span-8 relative bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[440px]">
          
          {/* Overlay Cosine Badge */}
          <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-blue-100 shadow-md text-right pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Cosine Similarity (SKPL §6.3)</span>
            <span className="text-xl font-black gradient-text-blue font-display">
              {cosineSimilarity}%
            </span>
          </div>

          {/* Interaction Instruction pill */}
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center gap-1.5 shadow-xs">
            <span>💡 Klik pilar/simpul untuk membuka <strong>Bukti Nyata Portofolio (Drill-Down)</strong></span>
          </div>

          {viewMode === '3d' ? (
            <>
              {/* Three.js 3D Viewport */}
              <div ref={mountRef} className="w-full h-[440px] select-none" />

              {/* Hover Tooltip Overlay */}
              {hoveredInfo && (
                <div
                  className="absolute pointer-events-none z-20 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700 -translate-x-1/2 -translate-y-12"
                  style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
                >
                  <p className="font-bold text-white text-[11px]">{hoveredInfo.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span
                      className={`px-1.5 py-0.5 rounded font-black ${
                        hoveredInfo.type === 'Mahasiswa' ? 'bg-blue-600' : 'bg-orange-500'
                      }`}
                    >
                      {hoveredInfo.type}
                    </span>
                    <span className="font-bold">{hoveredInfo.score} / 100</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* 2D Interactive Radar SVG View */
            <div className="py-8 flex flex-col items-center justify-center">
              <svg width={size} height={size} className="overflow-visible select-none">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, idx) => {
                  const points = dimensions
                    .map((d) => {
                      const { x, y } = getCoordinates(d.angle + 90, level * 100);
                      return `${x},${y}`;
                    })
                    .join(' ');
                  return (
                    <polygon
                      key={idx}
                      points={points}
                      fill={idx === 4 ? 'rgba(239, 246, 255, 0.4)' : 'transparent'}
                      stroke="rgba(203, 213, 225, 0.7)"
                      strokeWidth="1"
                      strokeDasharray={idx < 4 ? '3,3' : 'none'}
                    />
                  );
                })}

                {dimensions.map((d, idx) => {
                  const { x, y } = getCoordinates(d.angle + 90, 100);
                  return (
                    <line
                      key={idx}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="rgba(203, 213, 225, 0.8)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Benchmark Polygon */}
                <polygon
                  points={benchmark2DPolygon}
                  fill="rgba(249, 115, 22, 0.2)"
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />

                {/* Student Polygon */}
                <polygon
                  points={student2DPolygon}
                  fill="rgba(37, 99, 235, 0.25)"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />

                {dimensions.map((d, idx) => {
                  const { x, y } = getCoordinates(d.angle + 90, studentStats[d.key]);
                  const labelPos = getCoordinates(d.angle + 90, 126);
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onClick={() => setActiveDrilldown(portfolioEvidences[d.key] ?? null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#1D4ED8"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="hover:scale-125 transition-transform"
                      />
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[11px] font-bold fill-slate-700 font-sans hover:fill-blue-600"
                      >
                        {d.label} ({studentStats[d.key]})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Color Legend Bar */}
          <div className="w-full py-3 px-6 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-blue-600 border border-blue-400 shadow-xs" />
                <span className="text-slate-800">Raden Satria (V3925028)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-orange-500 border border-orange-400 shadow-xs" />
                <span className="text-slate-700">{currentBenchmark.name}</span>
              </div>
            </div>

            <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <span>🎯 Automatic Overlay Skill Matching Active</span>
            </div>
          </div>
        </div>

        {/* Real-time Interactive Sliders Column (SKPL Specification) */}
        <div className="lg:col-span-4 space-y-4 bg-slate-50/90 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Uji Penyesuaian Vektor Mahasiswa
              </h4>
              <p className="text-[10px] text-slate-500">Klik dimensi untuk rincian bukti portofolio</p>
            </div>
            <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
              Hero Lv.4
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(portfolioEvidences).map(([key, item]) => {
              const k = key as keyof typeof studentStats;
              const studScore = studentStats[k];
              const benchScore = Number(currentBenchmark[k] ?? 75);
              const isSurplus = studScore >= benchScore;

              return (
                <div key={key} className="space-y-1 p-2 rounded-xl hover:bg-white/80 transition-colors">
                  <div className="flex justify-between font-bold text-slate-700 items-center">
                    <button
                      type="button"
                      onClick={() => setActiveDrilldown(item)}
                      className="text-left font-bold text-slate-800 hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔍 {item.name}</span>
                    </button>
                    <span className="text-blue-700 font-black">{studScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={studScore}
                    onChange={(e) =>
                      setStudentStats((prev) => ({ ...prev, [k]: Number(e.target.value) }))
                    }
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Target Proyek: {benchScore}</span>
                    <span className={isSurplus ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                      {isSurplus ? `+${studScore - benchScore} (Surplus)` : `-${benchScore - studScore} (Skill Gap)`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={() =>
                setStudentStats({
                  aiml: 92,
                  frontend: 85,
                  uiux: 78,
                  backend: 90,
                  architecture: 84,
                })
              }
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              ↺ Reset Nilai Portofolio
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SKPL PILLAR 1: DRILL-DOWN PORTFOLIO EVIDENCE MODAL / DRAWER               */}
      {/* ========================================================================= */}
      {activeDrilldown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-blue-200 space-y-5 relative">
            <button
              type="button"
              onClick={() => setActiveDrilldown(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <span>SKPL Pilar 1: Interactive Drill-Down Tooltip</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 font-display">
                {activeDrilldown.name}
              </h3>
              <p className="text-xs text-slate-500">
                Skor Kompetensi Terhitung: <strong className="text-blue-600">{activeDrilldown.score} / 100</strong>
              </p>
            </div>

            {/* Evidence details */}
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="font-bold text-slate-700 block">📌 Dasar Penilaian AI (Evidence):</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{activeDrilldown.evidence}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">🔗 Tautan Repositori / Bukti Karya:</span>
                <span className="text-blue-600 font-mono text-[11px] block mt-0.5">{activeDrilldown.githubRepo}</span>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">📚 Mata Kuliah Terkait:</span>
                <p className="text-slate-600 mt-0.5">{activeDrilldown.academicCourses}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">🏆 Proyek Selesai:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeDrilldown.projectsCompleted.map((p, i) => (
                    <span key={i} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-semibold text-[10px]">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveDrilldown(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                Tutup Drill-Down
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
