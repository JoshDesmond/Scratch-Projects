import { Stats } from '../types';

const API_BASE = '/api';

async function loadStats(file: string): Promise<Stats> {
  try {
    const response = await fetch(`${API_BASE}/stats/${file}`);
    if (!response.ok) {
      throw new Error('Failed to load stats');
    }
    const stats = await response.json() as Stats;
    
    // Ensure failures object exists
    if (!stats.failures) {
      stats.failures = {
        persons: {},
        actions: {},
        objects: {},
      };
    }
    
    return stats;
  } catch (error) {
    // Return empty stats if file doesn't exist
    return {
      persons: {},
      actions: {},
      objects: {},
      failures: {
        persons: {},
        actions: {},
        objects: {},
      },
    };
  }
}

export async function loadAggregatedStats(): Promise<{ encoding: Stats; decoding: Stats }> {
  const [encodingStats, decodingStats] = await Promise.all([
    loadStats('encoding_stats.json'),
    loadStats('decoding_stats.json'),
  ]);
  
  return { encoding: encodingStats, decoding: decodingStats };
}

export function calculateSuccessRate(total: number, failures: number): number {
  if (total === 0) return NaN;
  return ((total - failures) / total) * 100;
}

export interface NumberStats {
  number: string;
  total: number;
  failures: number;
  successRate: number;
  encodingTotal: number;
  encodingFailures: number;
  decodingTotal: number;
  decodingFailures: number;
}

export function getNumberStats(
  number: string,
  category: 'persons' | 'actions' | 'objects',
  encodingStats: Stats,
  decodingStats: Stats
): NumberStats {
  const encodingTotal = encodingStats[category][number] || 0;
  const encodingFailures = encodingStats.failures?.[category]?.[number] || 0;
  
  const decodingTotal = decodingStats[category][number] || 0;
  const decodingFailures = decodingStats.failures?.[category]?.[number] || 0;
  
  const total = encodingTotal + decodingTotal;
  const failures = encodingFailures + decodingFailures;
  const successRate = calculateSuccessRate(total, failures);
  
  return {
    number,
    total,
    failures,
    successRate,
    encodingTotal,
    encodingFailures,
    decodingTotal,
    decodingFailures,
  };
}

export function getAllNumberStats(
  category: 'persons' | 'actions' | 'objects',
  encodingStats: Stats,
  decodingStats: Stats
): NumberStats[] {
  const allNumbers: NumberStats[] = [];
  
  // Generate all numbers from 00 to 99
  for (let i = 0; i <= 99; i++) {
    const number = i.toString().padStart(2, '0');
    allNumbers.push(getNumberStats(number, category, encodingStats, decodingStats));
  }
  
  return allNumbers;
}
