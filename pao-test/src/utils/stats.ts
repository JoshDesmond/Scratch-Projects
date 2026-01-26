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

async function saveStats(file: string, stats: Stats): Promise<void> {
  await fetch(`${API_BASE}/stats/${file}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stats),
  });
}

function incrementCounter(record: Record<string, number>, key: string): void {
  record[key] = (record[key] || 0) + 1;
}

export async function updateEncodingStats(
  number: string,
  userMnemonic: string,
  correctMnemonic: string,
  isCorrect: boolean
): Promise<void> {
  const stats = await loadStats('encoding_stats.json');
  
  // Ensure failures object exists
  if (!stats.failures) {
    stats.failures = {
      persons: {},
      actions: {},
      objects: {},
    };
  }
  
  // Ensure failure nested objects exist
  if (!stats.failures.persons) stats.failures.persons = {};
  if (!stats.failures.actions) stats.failures.actions = {};
  if (!stats.failures.objects) stats.failures.objects = {};
  
  // Extract person/action/object numbers from 6-digit number
  const paddedNumber = number.padStart(6, '0');
  const personNum = paddedNumber.substring(0, 2);
  const actionNum = paddedNumber.substring(2, 4);
  const objectNum = paddedNumber.substring(4, 6);
  
  // Always increment main counters (track all attempts)
  incrementCounter(stats.persons, personNum);
  incrementCounter(stats.actions, actionNum);
  incrementCounter(stats.objects, objectNum);
  
  // If incorrect, also track failures
  if (!isCorrect) {
    // Compare user vs correct mnemonic to identify which parts were wrong
    const userParts = userMnemonic.trim().split(/\s+/);
    const correctParts = correctMnemonic.trim().split(/\s+/);
    
    // Simple comparison: if parts don't match, mark as failure
    // For simplicity, we'll mark all three as failures if any part is wrong
    // A more sophisticated approach would parse and compare person/action/object separately
    if (userMnemonic.trim().toLowerCase() !== correctMnemonic.trim().toLowerCase()) {
      incrementCounter(stats.failures.persons, personNum);
      incrementCounter(stats.failures.actions, actionNum);
      incrementCounter(stats.failures.objects, objectNum);
    }
  }
  
  await saveStats('encoding_stats.json', stats);
}

export async function updateDecodingStats(
  mnemonic: string,
  userNumber: string,
  correctNumber: string
): Promise<void> {
  const stats = await loadStats('decoding_stats.json');
  
  // Ensure failures object exists
  if (!stats.failures) {
    stats.failures = {
      persons: {},
      actions: {},
      objects: {},
    };
  }
  
  // Ensure failure nested objects exist
  if (!stats.failures.persons) stats.failures.persons = {};
  if (!stats.failures.actions) stats.failures.actions = {};
  if (!stats.failures.objects) stats.failures.objects = {};
  
  // Extract person/action/object numbers from correct number
  const paddedCorrect = correctNumber.padStart(6, '0');
  const personNum = paddedCorrect.substring(0, 2);
  const actionNum = paddedCorrect.substring(2, 4);
  const objectNum = paddedCorrect.substring(4, 6);
  
  // Always increment main counters (track all attempts)
  incrementCounter(stats.persons, personNum);
  incrementCounter(stats.actions, actionNum);
  incrementCounter(stats.objects, objectNum);
  
  // Compare user number vs correct number digit-pair by digit-pair
  const paddedUser = userNumber.padStart(6, '0');
  const userPersonNum = paddedUser.substring(0, 2);
  const userActionNum = paddedUser.substring(2, 4);
  const userObjectNum = paddedUser.substring(4, 6);
  
  const isCorrect = paddedUser === paddedCorrect;
  
  // If incorrect, track which parts were wrong
  if (!isCorrect) {
    if (userPersonNum !== personNum) {
      incrementCounter(stats.failures.persons, personNum);
    }
    if (userActionNum !== actionNum) {
      incrementCounter(stats.failures.actions, actionNum);
    }
    if (userObjectNum !== objectNum) {
      incrementCounter(stats.failures.objects, objectNum);
    }
  }
  
  await saveStats('decoding_stats.json', stats);
}
