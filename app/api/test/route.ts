import { getServerAuth } from '@/actions/getCurrentUser';
import { NextResponse } from 'next/server';

export const GET = async () => {
  console.log(await getServerAuth());
  return NextResponse.json({ status: 'success' });
};
