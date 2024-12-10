import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <SignIn
      appearance={{
        
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          formFieldInput: 'border-gray-300 focus:ring-blue-500',
          headerTitle: 'text-2xl font-bold text-center text-blue-600',
        },
      }}
    />
  );
} 