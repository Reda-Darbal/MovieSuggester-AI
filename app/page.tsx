// pages/index.tsx
'use client'
import { useState } from 'react';
import Head from 'next/head';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoadingSpinner from './components/LoadingSpinner';
import SuggestionCard from './components/SuggestionCard';
import './globals.css';
import { FaGithub } from 'react-icons/fa';
import XIcon from './components/XIcon';

type Suggestion = {
  title: string;
  type: string;
  description: string;
};

export default function HomePage() {
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async (preferences: string, isSeries: boolean) => {
    setLoading(true);
    setSuggestions(null);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, isSeries }),
      });
      const data = await res.json();
      if (res.ok && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Movie & Series Suggester</title>
        <meta name="description" content="Get recommendations for movies and series you’ll love" />
      </Head>
      <Header />
      <HeroSection onSearch={getSuggestions} loading={loading} />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <LoadingSpinner />
        ) : suggestions && suggestions.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion, i) => (
              <SuggestionCard key={i} suggestion={suggestion} />
            ))}
          </div>
        ) : suggestions && suggestions.length === 0 ? (
          <div className="text-center text-gray-600">No suggestions found. Try different preferences.</div>
        ) : (
          <div className="text-center text-gray-500 italic">Enter preferences above to get suggestions.</div>
        )}
      </main>

      <footer className="mt-auto py-8 text-center text-sm text-gray-500 bg-gray-50">
        &copy; {new Date().getFullYear()} MovieSuggester. All rights reserved.
        <div className="flex justify-center mt-4 space-x-4">
          <a
            href="https://github.com/Reda-Darbal/MovieSuggester-AI"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 bg-gray-200 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://x.com/RedaDarbal07"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="p-2 bg-gray-200 rounded-full text-gray-500 hover:text-white hover:bg-gray-800 transition"
          >
            <XIcon />
          </a>
        </div>
      </footer>
    </>
  );
}
