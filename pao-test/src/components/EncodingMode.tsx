import { useState, useEffect } from 'react';
import { PAOData } from '../types';
import { encodeNumber, generateRandomNumber } from '../utils/encoding';
import { updateEncodingStats } from '../utils/stats';

interface EncodingModeProps {
  paoData: PAOData;
}

export default function EncodingMode({ paoData }: EncodingModeProps) {
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [correctMnemonic, setCorrectMnemonic] = useState<string>('');

  useEffect(() => {
    generateNewNumber();
  }, []);

  function generateNewNumber() {
    const newNumber = generateRandomNumber();
    setCurrentNumber(newNumber);
    setUserInput('');
    setShowAnswer(false);
    setCorrectMnemonic('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userInput.trim()) return;

    const correct = encodeNumber(currentNumber, paoData);
    setCorrectMnemonic(correct);
    setShowAnswer(true);
  }

  async function handleCorrect() {
    await updateEncodingStats(currentNumber, userInput, correctMnemonic, true);
    generateNewNumber();
  }

  async function handleIncorrect() {
    await updateEncodingStats(currentNumber, userInput, correctMnemonic, false);
    generateNewNumber();
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">Encoding Mode</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6 border border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Number to encode:</div>
        <div className="text-5xl font-mono font-bold text-center text-gray-100">
          {currentNumber}
        </div>
      </div>

      {!showAnswer ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Enter your mnemonic:
          </label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Type your mnemonic here..."
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
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-600 mb-4">
            <div className="text-sm text-gray-400 mb-2">Correct mnemonic:</div>
            <div className="text-xl font-semibold text-gray-100">{correctMnemonic}</div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleCorrect}
              className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 font-semibold transition-colors"
            >
              Correct
            </button>
            <button
              onClick={handleIncorrect}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-semibold transition-colors"
            >
              Incorrect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
