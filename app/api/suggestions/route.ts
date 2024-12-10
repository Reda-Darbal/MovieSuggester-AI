import { NextRequest, NextResponse } from 'next/server';
import { openai } from '../../lib/openai';
import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function POST(req: NextRequest) {
  const { preferences, isSeries } = await req.json();

  if (!preferences || preferences.trim().length === 0) {
    return NextResponse.json({ error: 'No preferences provided.' }, { status: 400 });
  }

  const contentType = isSeries ? 'Series' : 'Movie';

  const prompt = `
  You are a movie and TV recommendation assistant.
  User is interested in: ${preferences}
  User wants recommendations for ${isSeries ? 'series' : 'movies'}.

  Return exactly 6 recommendations as a JSON array. Each element should be an object with keys: "title", "type" (must be "${contentType}"), and "description".
  Only include ${isSeries ? 'series' : 'movies'} in your recommendations.
  Do not include anything other than the JSON array in your response.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 700,
    });

    const content = completion.choices[0]?.message?.content?.trim() || '';
    let suggestions;
    try {
      suggestions = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      return NextResponse.json({ error: 'Failed to parse suggestions from AI.' }, { status: 500 });
    }

    // Fetch image URLs from TMDb
    for (const suggestion of suggestions) {
      const query = encodeURIComponent(suggestion.title);
      const type = isSeries ? 'tv' : 'movie';
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/${type}`, {
          params: {
            api_key: TMDB_API_KEY,
            query,
          },
        });
        const results = response.data.results;
        if (results && results.length > 0) {
          const firstResult = results[0];
          const imagePath = firstResult.poster_path;
          if (imagePath) {
            suggestion.imageUrl = `https://image.tmdb.org/t/p/w500${imagePath}`;
          } else {
            suggestion.imageUrl = null; // No image available
          }
        } else {
          suggestion.imageUrl = null; // No results found
        }
      } catch (error) {
        console.error(`Failed to fetch image for ${suggestion.title}:`, error);
        suggestion.imageUrl = null; // Error occurred
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch suggestions.' }, { status: 500 });
  }
}