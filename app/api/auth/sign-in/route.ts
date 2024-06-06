import authServices from '@/services/auth.service';
import tokenServices from '@/services/token.service';
import catchAsync from '@/lib/catchAsync';
import { db as prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const POST = catchAsync(async (req: any) => {
  const { email, password } = await req.json();
  const user = await authServices.loginUserWithEmailAndPassword(
    email,
    password
  );
  const tokens = await tokenServices.generateAuthTokens(user);
  cookies().set('accessToken', tokens.access.token, {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    expires: tokens.access.expires
  });

  return NextResponse.json({ user, tokens });
});
