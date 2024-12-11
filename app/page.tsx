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
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';

type Suggestion = {
  title: string;
  type: string;
  description: string;
  imageUrl: string | null;
};

export default function HomePage() {
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getSuggestions = async (preferences: string, isSeries: boolean) => {
    setLoading(true);
    setSuggestions(null);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, isSeries }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setErrorMessage(data.error || 'An error occurred.');
        setSuggestions(null);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred.');
      setSuggestions(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Movies & Series Suggester</title>
        <meta name="description" content="Get recommendations for movies and series you’ll love" />
      </Head>
      <Header />

      <main className="w-full mx-auto px-4 py-10 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 shadow-sm animate-gradient">
        <SignedIn>
          <HeroSection onSearch={getSuggestions} loading={loading} />

          {loading && <LoadingSpinner />}

          <div className="flex items-center justify-center h-full">
  {errorMessage && (
    <div className="text-center rounded-lg w-96 bg-red-300 border-red-500 text-red-600 opacity-85 ">
      {errorMessage}
    </div>
  )}
</div>

          {suggestions && suggestions.length > 0 && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {suggestions.map((suggestion, i) => (
                <SuggestionCard key={i} suggestion={suggestion} />
              ))}
            </div>
          )}

          {suggestions && suggestions.length === 0 && !loading && !errorMessage && (
            <div className="flex items-center justify-center">
              <div className="text-center flex items-center justify-center rounded-lg w-96 bg-gray-600 border-gray-300 opacity-90 text-gray-50">
                No suggestions found. Try different preferences.
              </div>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          <div className="text-center text-gray-100 mt-20">
            <h2 className="text-3xl font-bold mb-4">Welcome to MovieSuggester!</h2>
            <p className="mb-6">
              Please sign in to get personalized movie and series recommendations.
            </p>
            <div className="flex justify-center space-x-4">
              <SignInButton mode="modal">
                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition">
                  Sign In
                </button>
              </SignInButton>
              {/* <SignUpButton mode="modal">
                <button className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400 transition">
                  Sign Up
                </button>
              </SignUpButton> */}
            </div>
          </div>
        </SignedOut>
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