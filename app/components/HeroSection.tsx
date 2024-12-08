

import { useState } from 'react';

type Props = {
  onSearch: (preferences: string, isSeries: boolean) => void;
  loading: boolean;
};

export default function HeroSection({ onSearch, loading }: Props) {
  const [input, setInput] = useState('');
  const [isSeries, setIsSeries] = useState(true);

  const handleToggle = () => {
    setIsSeries(!isSeries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSearch(input.trim(), isSeries);
  };

  return (
    <div className="relative flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-blue-50 via-white to-white">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Find Your Next Favorite Movie or Series</h1>
      <p className="text-gray-600 max-w-2xl mb-10">
        Enter your favorite genres, actors, or moods, and let our AI suggest what to watch next!
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-xl w-full">
        <input
          type="text"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
          placeholder="e.g. Sci-fi with strong female leads..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Suggestions'}
        </button>
      </form>

      <div className="flex items-center space-x-4 mt-6 z-10">
        <span className={`text-lg ${isSeries ? "font-bold text-blue-300" : "text-gray-200"}`}>
          Series
        </span>
        <button
          onClick={handleToggle}
          className={`relative w-12 h-6 bg-gray-400 rounded-full focus:outline-none transition-colors duration-300 ${
            isSeries ? "bg-blue-300" : "bg-gray-500"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              isSeries ? "translate-x-6" : ""
            }`}
          />
        </button>
        <span className={`text-lg ${!isSeries ? "font-bold text-blue-300" : "text-gray-200"}`}>
          Movies
        </span>
      </div>
    </div>
  );
}
