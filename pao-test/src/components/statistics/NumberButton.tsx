import { useRef, useEffect, useState } from 'react';
import Tooltip from './Tooltip';

interface NumberButtonProps {
  number: string;
  successRate: number;
  paoText: string;
  onClick: () => void;
}

// Color stops matching tailwind.config.js
const colorStops: Record<number, string> = {
  0: 'oklch(0.45 0.18 15)',
  10: 'oklch(0.5 0.2 25)',
  20: 'oklch(0.55 0.19 40)',
  30: 'oklch(0.6 0.17 55)',
  40: 'oklch(0.65 0.15 70)',
  50: 'oklch(0.7 0.13 85)',
  60: 'oklch(0.75 0.11 100)',
  70: 'oklch(0.78 0.09 120)',
  80: 'oklch(0.82 0.07 140)',
  90: 'oklch(0.88 0.05 155)',
  95: 'oklch(0.92 0.03 160)',
  100: 'oklch(0.95 0.025 165)',
};

function getSuccessRateColor(successRate: number): string {
  if (isNaN(successRate)) {
    return 'oklch(0.4 0.05 0)'; // success-rate-nan from tailwind config
  }
  
  const rate = Math.max(0, Math.min(100, successRate));
  
  // Find the nearest color stop
  const stops = Object.keys(colorStops).map(Number).sort((a, b) => a - b);
  let nearestStop = stops[0];
  
  for (const stop of stops) {
    if (rate >= stop) {
      nearestStop = stop;
    } else {
      break;
    }
  }
  
  return colorStops[nearestStop];
}

export default function NumberButton({ number, successRate, paoText, onClick }: NumberButtonProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const color = getSuccessRateColor(successRate);
  const fillPercentage = isNaN(successRate) ? 0 : Math.max(0, Math.min(100, successRate));

  useEffect(() => {
    // Mark as mounted after first render
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (fillRef.current && isMounted) {
      // Parse OKLCH color and create gradient with transparency
      const oklchMatch = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
      if (oklchMatch) {
        const [, l, c, h] = oklchMatch;
        // Gradient from bottom (most opaque) to top (more transparent)
        const bottomColor = `oklch(${l} ${c} ${h} / 0.75)`;
        const topColor = `oklch(${l} ${c} ${h} / 0.25)`;
        fillRef.current.style.height = `${fillPercentage}%`;
        fillRef.current.style.background = `linear-gradient(to top, ${bottomColor} 0%, ${topColor} 100%)`;
      } else {
        // Fallback for non-OKLCH colors
        fillRef.current.style.height = `${fillPercentage}%`;
        fillRef.current.style.backgroundColor = color;
      }
    }
  }, [fillPercentage, color, isMounted]);

  return (
    <Tooltip content={paoText}>
      <button
        onClick={onClick}
        className="relative w-full aspect-square border-2 border-gray-600 rounded-lg bg-gray-800 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-[border-color,box-shadow] duration-200 flex items-center justify-center font-mono font-semibold text-gray-200 overflow-hidden"
      >
        {/* Fill visualization */}
        <div
          ref={fillRef}
          className={`absolute bottom-0 left-0 right-0 ${
            isMounted ? 'transition-[height] duration-500 ease-out' : ''
          }`}
        />
        
        {/* Number label */}
        <span className="relative z-10">{number}</span>
      </button>
    </Tooltip>
  );
}
