import React from 'react';
import FeatureSemanticShowcase from './FeatureSemanticShowcase';
import FeatureGamificationShowcase from './FeatureGamificationShowcase';
import WorkflowProcessGrid from './WorkflowProcessGrid';
import HeroCtaBanner from './landing/HeroCtaBanner';

export default function FeatureZigZag() {
  return (
    <div className="space-y-24 py-10">
      {/* SECTION 1: ZIG-ZAG ALTERNATING FEATURE ROWS */}
      {/* Row 1: AI Semantic Engine (Text Left, Card Right) */}
      <FeatureSemanticShowcase />

      {/* Row 2: RPG Stats & Gamifikasi (Card Left, Text Right) */}
      <FeatureGamificationShowcase />

      {/* SECTION 2: 4-STEP PROCESS GRID (01, 02, 03, 04) */}
      <WorkflowProcessGrid />

      {/* SECTION 3: DARK CALL TO ACTION BANNER (HIGH CONTRAST) */}
      <HeroCtaBanner />
    </div>
  );
}
