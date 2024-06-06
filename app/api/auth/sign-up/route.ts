import { NextResponse } from 'next/server';
import catchAsync from '@/lib/catchAsync';
// import validate from '@/lib/validate'
// import { registerSchema } from '@/validations/validations'
import exclude from '@/lib/exclude';
import userServices from '@/services/user.service';

export const POST = catchAsync(async (request: Request) => {
  const body = await request.json();
  const { email, password, name, phoneNumber } = body;
  if (!email || !password || !name) {
    return NextResponse.json({
      status: 'fail',
      message: 'plesase provide name, email and password'
    });
  }
  const user = await userServices.createUser(
    email,
    password,
    name,
    phoneNumber
  );

  return NextResponse.json(exclude(user, ['hashedPassword']));
});
