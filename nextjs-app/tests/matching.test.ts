import { describe, it, expect } from 'vitest';

/**
 * Helper function implementing multi-dimensional vector cosine similarity
 * between student competency and project requirements breakdown.
 */
function calculateCosineSimilarity(
  studentVector: Record<string, number>,
  projectVector: Record<string, number>
): number {
  const keys = Object.keys(studentVector);
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const k of keys) {
    const a = studentVector[k] ?? 0;
    const b = projectVector[k] ?? 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

function getMatchTier(matchPercentage: number): string {
  if (matchPercentage >= 90) return 'Hero Tier S';
  if (matchPercentage >= 80) return 'Tier A';
  if (matchPercentage >= 70) return 'Tier B';
  return 'Tier C';
}

describe('AI Semantic Matching Engine & Cosine Similarity (SRS FR-06 & FR-07)', () => {
  const studentProfile = {
    aiml: 92,
    frontend: 85,
    uiux: 78,
    backend: 90,
    architecture: 84,
  };

  it('should yield high similarity for closely matching AI/NLP project requirements', () => {
    const aiProjectReqs = {
      aiml: 90,
      frontend: 75,
      uiux: 70,
      backend: 85,
      architecture: 80,
    };

    const similarity = calculateCosineSimilarity(studentProfile, aiProjectReqs);
    const matchPercentage = Math.round(similarity * 100);

    expect(similarity).toBeGreaterThan(0.95);
    expect(matchPercentage).toBeGreaterThanOrEqual(95);
    expect(getMatchTier(matchPercentage)).toBe('Hero Tier S');
  });

  it('should yield lower similarity for requirements with inverted priorities', () => {
    const skewedProjectReqs = {
      aiml: 20,
      frontend: 95,
      uiux: 95,
      backend: 30,
      architecture: 25,
    };

    const similarity = calculateCosineSimilarity(studentProfile, skewedProjectReqs);
    const matchPercentage = Math.round(similarity * 100);

    expect(similarity).toBeLessThan(0.95);
    expect(similarity).toBeGreaterThan(0.70);
    expect(['Tier A', 'Tier B']).toContain(getMatchTier(matchPercentage));
  });

  it('should return 1.0 for identical vector comparison', () => {
    const similarity = calculateCosineSimilarity(studentProfile, studentProfile);
    expect(Number(similarity.toFixed(4))).toBe(1.0);
  });

  it('should correctly categorize tiers based on percentage boundaries', () => {
    expect(getMatchTier(95)).toBe('Hero Tier S');
    expect(getMatchTier(90)).toBe('Hero Tier S');
    expect(getMatchTier(85)).toBe('Tier A');
    expect(getMatchTier(75)).toBe('Tier B');
    expect(getMatchTier(65)).toBe('Tier C');
  });
});
