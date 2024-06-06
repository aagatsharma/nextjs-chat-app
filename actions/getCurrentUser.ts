import { db as prisma } from '@/lib/db';
// import exclude from "@/utils/exclude";
import { User } from '@prisma/client';
import { cookies, headers } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '@/config/config';

import ApiError from '@/lib/ApiError';
import exclude from '@/lib/exclude';

export function getServerAuth() {
  let cookie = cookies().get('accessToken');

  let token = null;

  if (!cookie) {
    let header = headers().get('Authorization');
    if (header) {
      token = header.split(' ')[1];
    }
  } else {
    token = cookie.value;
  }

  if (!token) {
    return { userId: null };
  }

  let decoded = jwt.decode(token);

  return { userId: decoded?.sub as string };
}

export async function getSession() {
  let cookie = cookies().get('accessToken');

  let token = null;

  if (!cookie) {
    let header = headers().get('Authorization');
    if (header) {
      token = header.split(' ')[1];
    }
  } else {
    token = cookie.value;
  }

  if (!token) {
    return null;
  }

  // 2) Verification token

  try {
    let decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new ApiError(401, 'jwt expired, please login');
  }
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.sub
      }
    });

    if (!currentUser) {
      return null;
    }

    return exclude(currentUser, ['hashedPassword']);
  } catch (err: any) {
    return null;
  }
}
