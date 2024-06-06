import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import getCurrentUser from '@/actions/getCurrentUser';
import catchAsync from '@/lib/catchAsync';
import ApiError from '@/lib/ApiError';

export const POST = catchAsync(async function (req: Request) {
  const user = await getCurrentUser();
  const { symbol } = await req.json();

  if (!user) {
    throw new ApiError(401, 'unauthorized');
  }

  if (!symbol) {
    throw new ApiError(400, 'symbol is required');
  }

  const watchlist = await db.watchList.create({
    data: {
      userId: user.id,
      symbol
    }
  });

  return NextResponse.json(watchlist);
});
