// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold text-gray-900 hover:text-brand-blue transition-colors">MovieSuggester</span>
        </Link>
        <nav>
          <Link href="https://openai.com" target="_blank" rel="noreferrer">
            <span className="text-gray-700 hover:text-brand-blue transition-colors">Powered by OpenAI</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
