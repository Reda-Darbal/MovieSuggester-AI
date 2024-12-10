import Image from 'next/image';

type Suggestion = {
  title: string;
  type: string;
  description: string;
  imageUrl: string | null;
};

export default function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 animate-fade-in-up">
      {suggestion.imageUrl && (
        <Image
          src={suggestion.imageUrl}
          alt={suggestion.title}
          width={500}
          height={750}
          className="mb-4 rounded-md"
        />
      )}
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{suggestion.title}</h3>
      <span className="text-sm text-blue-600 font-semibold uppercase">{suggestion.type}</span>
      <p className="mt-3 text-gray-700">{suggestion.description}</p>
    </div>
  );
}