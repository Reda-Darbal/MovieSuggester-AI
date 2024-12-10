'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/nextjs';

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
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                
                variables: {
                  borderRadius: '0.5rem',
                },
                elements: {
                  // Style the container of the entire dropdown
                  card: 'bg-white shadow-xl rounded-xl border-0 bg-gradient-to-t from-blue-100 to-white',

                  // Style the user info section
                  userPreviewMainIdentifier: 'text-gray-900 font-semibold',
                  userPreviewSecondaryIdentifier: 'text-gray-500',

                  // Style the avatar
                  avatarBox: 'w-10 h-10',

                  // Style the menu items (Sign Out and Settings)
                  userButtonPopoverActionButton:
                    'hover:bg-blue-50 text-blue-600 px-4 py-2 w-full text-left',
                  userButtonPopoverActionButtonText: 'font-medium text-blue-600', // Ensures text is blue
                  userButtonPopoverActionButtonIcon: 'text-blue-600', // Ensures icons are blue

                  // Hide the footer link
                  userButtonPopoverFooter: 'hidden',

                  // Style individual buttons
                  userPreviewAvatarBox: 'border-2 border-blue-100',

                  // Style the main section and actions
                  userButtonPopoverMain: 'p-2',
                  userButtonPopoverActions: 'space-y-1',

                  // Hide development mode badge
                  badge: 'hidden',
                },
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}