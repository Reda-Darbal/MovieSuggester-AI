import { NextRequest, NextResponse } from 'next/server';
import { openai } from '../../lib/openai';

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

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch suggestions.' }, { status: 500 });
  }
}
