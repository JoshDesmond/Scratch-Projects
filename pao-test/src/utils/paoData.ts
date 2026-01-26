import { PAOData, PAOEntry } from '../types';

export async function loadPAOData(): Promise<PAOData> {
  const response = await fetch('/api/pao-data');
  const csvContent = await response.text();
  const lines = csvContent.split('\n');
  
  const data = new Map<string, PAOEntry>();
  
  // Skip header row (line 0)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing - split by comma
    const parts = line.split(',');
    if (parts.length >= 4) {
      const number = parts[0].trim();
      const person = parts[1].trim();
      const action = parts[2].trim();
      const object = parts[3].trim();
      
      if (number && person && action && object) {
        // Zero-pad the number to ensure 2-digit format (00-99)
        const paddedNumber = number.padStart(2, '0');
        data.set(paddedNumber, { number: paddedNumber, person, action, object });
      }
    }
  }
  
  return data;
}
