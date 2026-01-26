import { PAOData } from '../../types';
import { NumberStats } from '../../utils/statistics';
import NumberButton from './NumberButton';

interface NumberGridProps {
  stats: NumberStats[];
  paoData: PAOData;
  category: 'persons' | 'actions' | 'objects';
  onNumberClick: (number: string) => void;
}

export default function NumberGrid({ stats, paoData, category, onNumberClick }: NumberGridProps) {
  const getPAOText = (number: string): string => {
    const entry = paoData.get(number);
    if (!entry) return '';
    
    switch (category) {
      case 'persons':
        return entry.person;
      case 'actions':
        return entry.action;
      case 'objects':
        return entry.object;
    }
  };

  return (
    <div className="grid grid-cols-10 gap-2">
      {stats.map((stat) => (
        <NumberButton
          key={`${category}-${stat.number}`}
          number={stat.number}
          successRate={stat.successRate}
          paoText={getPAOText(stat.number)}
          onClick={() => onNumberClick(stat.number)}
        />
      ))}
    </div>
  );
}
