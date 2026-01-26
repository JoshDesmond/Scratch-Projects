type Category = 'persons' | 'actions' | 'objects';

interface CategoryTabsProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-700">
      <button
        onClick={() => onCategoryChange('persons')}
        className={`px-6 py-3 font-medium transition-colors ${
          selectedCategory === 'persons'
            ? 'text-cyan-400 border-b-2 border-cyan-400'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        Persons
      </button>
      <button
        onClick={() => onCategoryChange('actions')}
        className={`px-6 py-3 font-medium transition-colors ${
          selectedCategory === 'actions'
            ? 'text-cyan-400 border-b-2 border-cyan-400'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        Actions
      </button>
      <button
        onClick={() => onCategoryChange('objects')}
        className={`px-6 py-3 font-medium transition-colors ${
          selectedCategory === 'objects'
            ? 'text-cyan-400 border-b-2 border-cyan-400'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        Objects
      </button>
    </div>
  );
}
