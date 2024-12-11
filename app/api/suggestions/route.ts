import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { openai } from '../../lib/openai';
import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

function getWeekStartDate(date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - daysSinceMonday);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await clerkClient.users.getUser(userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Get maxCredits from privateMetadata, default to 3
  const maxCredits = (user.privateMetadata.maxCredits as number) || 3;

  // Get the current usage data from privateMetadata
  let usageData = user.privateMetadata.usageData as {
    count: number;
    weekStart: number;
  } | null;

  const now = new Date();
  const currentWeekStart = getWeekStartDate(now).getTime();

  if (!usageData || usageData.weekStart !== currentWeekStart) {
    // Reset usage data for a new week
    usageData = {
      count: 0,
      weekStart: currentWeekStart,
    };
  }

  if (usageData.count >= maxCredits) {
    return NextResponse.json(
      { error: `You have reached the weekly limit of ${maxCredits} generations.` },
      { status: 403 }
    );
  }

  // Increment the usage count
  usageData.count += 1;

  // Update the user's privateMetadata with the new usage data
  await clerkClient.users.updateUser(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      usageData,
    },
  });

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
            suggestion.imageUrl = null;
          }
        } else {
          suggestion.imageUrl = null;
        }
      } catch (error) {
        console.error(`Failed to fetch image for ${suggestion.title}:`, error);
        suggestion.imageUrl = null;
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch suggestions.' }, { status: 500 });
  }
}