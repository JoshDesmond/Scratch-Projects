import { useState, useEffect } from 'react';
import { PAOData } from '../types';
import { encodeNumber, generateRandomNumber } from '../utils/encoding';
import { updateDecodingStats } from '../utils/stats';

interface DecodingModeProps {
  paoData: PAOData;
}

export default function DecodingMode({ paoData }: DecodingModeProps) {
  const [currentMnemonic, setCurrentMnemonic] = useState<string>('');
  const [correctNumber, setCorrectNumber] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [result, setResult] = useState<'success' | 'failure' | null>(null);

  useEffect(() => {
    generateNewMnemonic();
  }, []);

  function generateNewMnemonic() {
    const newNumber = generateRandomNumber();
    const mnemonic = encodeNumber(newNumber, paoData);
    setCorrectNumber(newNumber);
    setCurrentMnemonic(mnemonic);
    setUserInput('');
    setResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userNumber = userInput.trim().padStart(6, '0');
    const correct = correctNumber.padStart(6, '0');
    const isSuccess = userNumber === correct;

    setResult(isSuccess ? 'success' : 'failure');
    await updateDecodingStats(currentMnemonic, userNumber, correct);
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Decoding Mode</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Mnemonic to decode:</div>
        <div className="text-xl font-semibold text-center text-gray-100">
          {currentMnemonic}
        </div>
      </div>

      {result === null ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Enter the 6-digit number:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl font-mono"
            placeholder="000000"
            maxLength={6}
            autoFocus
          />
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="mb-6">
          <div
            className={`p-6 rounded-lg mb-4 border-2 ${
              result === 'success'
                ? 'bg-emerald-900/30 border-emerald-500'
                : 'bg-red-900/30 border-red-500'
            }`}
          >
            <div
              className={`text-2xl font-bold text-center ${
                result === 'success' ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {result === 'success' ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            {result === 'failure' && (
              <div className="text-center mt-2 text-gray-300">
                Correct answer: <span className="font-mono font-bold text-gray-100">{correctNumber}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={generateNewMnemonic}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
