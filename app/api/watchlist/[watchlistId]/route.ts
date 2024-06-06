import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import getCurrentUser from '@/actions/getCurrentUser';
import catchAsync from '@/lib/catchAsync';
import ApiError from '@/lib/ApiError';

export const DELETE = catchAsync(
  async (req: Request, { params }: { params: { watchlistId: number } }) => {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);

    const watchlistId = params.watchlistId;

    if (!user) {
      throw new ApiError(401, 'unauthorized');
    }

    if (!watchlistId) {
      throw new ApiError(400, 'watchlist id is required');
    }

    await db.watchList.delete({
      where: { id: +watchlistId, userId: user.id }
    });

    return NextResponse.json({ success: true, message: 'watchlist removed' });
  }
);
