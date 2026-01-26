import { PAOData } from '../../types';
import { NumberStats } from '../../utils/statistics';

interface StatsDetailViewProps {
  number: string;
  category: 'persons' | 'actions' | 'objects';
  stats: NumberStats;
  paoData: PAOData;
  onClose: () => void;
}

export default function StatsDetailView({
  number,
  category,
  stats,
  paoData,
  onClose,
}: StatsDetailViewProps) {
  const entry = paoData.get(number);
  const paoText = entry
    ? category === 'persons'
      ? entry.person
      : category === 'actions'
      ? entry.action
      : entry.object
    : '';

  const encodingSuccess = stats.encodingTotal - stats.encodingFailures;
  const decodingSuccess = stats.decodingTotal - stats.decodingFailures;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Number: {number}
              </h2>
              <p className="text-lg text-gray-300">{paoText}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-100 mb-3">Overall Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Total Attempts</div>
                  <div className="text-2xl font-bold text-gray-100">{stats.total}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                  <div className="text-2xl font-bold text-gray-100">
                    {isNaN(stats.successRate) ? 'N/A' : `${stats.successRate.toFixed(1)}%`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Successful</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {stats.total - stats.failures}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Failed</div>
                  <div className="text-2xl font-bold text-red-400">{stats.failures}</div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/50">
              <h3 className="font-semibold text-indigo-300 mb-3">Encoding Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Total Attempts</div>
                  <div className="text-xl font-bold text-gray-100">{stats.encodingTotal}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                  <div className="text-xl font-bold text-gray-100">
                    {stats.encodingTotal === 0
                      ? 'N/A'
                      : `${((encodingSuccess / stats.encodingTotal) * 100).toFixed(1)}%`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Successful</div>
                  <div className="text-xl font-bold text-emerald-400">{encodingSuccess}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Failed</div>
                  <div className="text-xl font-bold text-red-400">{stats.encodingFailures}</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700/50">
              <h3 className="font-semibold text-purple-300 mb-3">Decoding Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Total Attempts</div>
                  <div className="text-xl font-bold text-gray-100">{stats.decodingTotal}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                  <div className="text-xl font-bold text-gray-100">
                    {stats.decodingTotal === 0
                      ? 'N/A'
                      : `${((decodingSuccess / stats.decodingTotal) * 100).toFixed(1)}%`}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Successful</div>
                  <div className="text-xl font-bold text-emerald-400">{decodingSuccess}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Failed</div>
                  <div className="text-xl font-bold text-red-400">{stats.decodingFailures}</div>
                </div>
              </div>
            </div>

            <details className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
              <summary className="cursor-pointer font-semibold text-gray-200 hover:text-gray-100">
                Raw JSON Data
              </summary>
              <pre className="mt-4 text-xs overflow-x-auto text-gray-300">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
