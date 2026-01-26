import { useState, useEffect } from 'react';
import { PAOData } from '../../types';
import { Stats } from '../../types';
import { loadAggregatedStats, getAllNumberStats, getNumberStats } from '../../utils/statistics';
import CategoryTabs from './CategoryTabs';
import NumberGrid from './NumberGrid';
import StatsDetailView from './StatsDetailView';

type Category = 'persons' | 'actions' | 'objects';

interface StatisticsModeProps {
  paoData: PAOData;
}

export default function StatisticsMode({ paoData }: StatisticsModeProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('persons');
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [encodingStats, setEncodingStats] = useState<Stats | null>(null);
  const [decodingStats, setDecodingStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadAggregatedStats().then(({ encoding, decoding }) => {
      setEncodingStats(encoding);
      setDecodingStats(decoding);
    });
  }, []);

  if (!encodingStats || !decodingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-xl text-gray-100">Loading statistics...</div>
      </div>
    );
  }

  const allStats = getAllNumberStats(selectedCategory, encodingStats, decodingStats);
  const selectedStats = selectedNumber
    ? getNumberStats(selectedNumber, selectedCategory, encodingStats, decodingStats)
    : null;

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Statistics</h1>
      
      <CategoryTabs
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <NumberGrid
        stats={allStats}
        paoData={paoData}
        category={selectedCategory}
        onNumberClick={setSelectedNumber}
      />

      {selectedNumber && selectedStats && (
        <StatsDetailView
          number={selectedNumber}
          category={selectedCategory}
          stats={selectedStats}
          paoData={paoData}
          onClose={() => setSelectedNumber(null)}
        />
      )}
    </div>
  );
}
