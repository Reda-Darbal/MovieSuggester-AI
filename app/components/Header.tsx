'use client';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

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
        <nav className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition">
                Sign In
              </button>
            </SignInButton>
            {/* <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition">
                Sign Up
              </button>
            </SignUpButton> */}
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements:{
                  userButtonAvatarBox: 'w-10 h-10',
                },
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}