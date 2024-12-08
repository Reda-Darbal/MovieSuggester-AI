// components/SuggestionCard.tsx

type Suggestion = {
    title: string;
    type: string;
    description: string;
  };
  
  export default function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
    return (
      <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{suggestion.title}</h3>
        <span className="text-sm text-brand-blue font-semibold uppercase">{suggestion.type}</span>
        <p className="mt-3 text-gray-700">{suggestion.description}</p>
      </div>
    );
  }
  