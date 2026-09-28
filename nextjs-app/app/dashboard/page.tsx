import React from 'react';
import type { Metadata } from 'next';
import StudentDashboardContainer from '@/components/dashboard/StudentDashboardContainer';

export const metadata: Metadata = {
  title: 'Dashboard Mahasiswa & Hero RPG | ProjectMatch AI',
  description:
    'Portal terpadu mahasiswa untuk upload CV, melihat profil, eksplorasi project industri tersedia, dan apply project mitra.',
};

export default function DashboardPage() {
  return <StudentDashboardContainer />;
}
