type Mode = 'encoding' | 'decoding';

interface HeaderProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function Header({ currentMode, onModeChange }: HeaderProps) {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex gap-4">
        <button
          onClick={() => onModeChange('encoding')}
          className={`px-4 py-2 rounded ${
            currentMode === 'encoding'
              ? 'bg-blue-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Encoding
        </button>
        <button
          onClick={() => onModeChange('decoding')}
          className={`px-4 py-2 rounded ${
            currentMode === 'decoding'
              ? 'bg-blue-600'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Decoding
        </button>
      </nav>
    </header>
  );
}
