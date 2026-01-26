import { useState, useEffect } from 'react';
import { PAOData } from './types';
import { loadPAOData } from './utils/paoData';
import Header from './components/Header';
import EncodingMode from './components/EncodingMode';
import DecodingMode from './components/DecodingMode';

type Mode = 'encoding' | 'decoding';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading PAO data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentMode={currentMode} onModeChange={setCurrentMode} />
      <main>
        {currentMode === 'encoding' ? (
          <EncodingMode paoData={paoData} />
        ) : (
          <DecodingMode paoData={paoData} />
        )}
      </main>
    </div>
  );
}
