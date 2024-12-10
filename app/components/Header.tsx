
import Link from 'next/link';
import Image from 'next/image';

 

   export default function Header() {
    return (
      <header className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 shadow-sm animate-gradient">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8 mr-2"
              />
              <span className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
                MovieSuggester
              </span>
            </div>
          </Link>
          <nav>
            <Link
              href="https://openai.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline"
            >
              <span className="text-white hover:text-gray-200 transition-colors">
                Powered by OpenAI
              </span>
            </Link>
          </nav>
        </div>
      </header>
    );
  }