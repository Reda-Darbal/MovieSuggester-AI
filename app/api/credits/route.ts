import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';

function getWeekStartDate(date: Date): Date {
  const dayOfWeek = date.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - daysSinceMonday);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export async function GET(req: NextRequest) {
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
    // Update the user's privateMetadata
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        usageData,
      },
    });
  }

  const creditsLeft = maxCredits - (usageData.count || 0);

  return NextResponse.json({ creditsLeft, maxCredits });
} 