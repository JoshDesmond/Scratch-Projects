type Mode = 'encoding' | 'decoding' | 'stats';

interface HeaderProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function Header({ currentMode, onModeChange }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white p-4 border-b border-gray-700">
      <nav className="flex gap-4">
        <button
          onClick={() => onModeChange('encoding')}
          className={`px-4 py-2 rounded transition-colors ${
            currentMode === 'encoding'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          Encoding
        </button>
        <button
          onClick={() => onModeChange('decoding')}
          className={`px-4 py-2 rounded transition-colors ${
            currentMode === 'decoding'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          Decoding
        </button>
        <button
          onClick={() => onModeChange('stats')}
          className={`px-4 py-2 rounded transition-colors ${
            currentMode === 'stats'
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          Stats
        </button>
      </nav>
    </header>
  );
}
