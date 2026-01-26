import { useState, useEffect } from 'react';
import { PAOData } from './types';
import { loadPAOData } from './utils/paoData';
import Header from './components/Header';
import EncodingMode from './components/EncodingMode';
import DecodingMode from './components/DecodingMode';
import StatisticsMode from './components/statistics/StatisticsMode';

type Mode = 'encoding' | 'decoding' | 'stats';

export default function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('encoding');
  const [paoData, setPaoData] = useState<PAOData | null>(null);

  useEffect(() => {
    // Load PAO data on mount
    loadPAOData().then((data) => {
      setPaoData(data);
    });
  }, []);

  if (!paoData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-xl text-gray-100">Loading PAO data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentMode={currentMode} onModeChange={setCurrentMode} />
      <main>
        {currentMode === 'encoding' ? (
          <EncodingMode paoData={paoData} />
        ) : currentMode === 'decoding' ? (
          <DecodingMode paoData={paoData} />
        ) : (
          <StatisticsMode paoData={paoData} />
        )}
      </main>
    </div>
  );
}
