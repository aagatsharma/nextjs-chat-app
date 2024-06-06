import { NextApiRequest } from 'next';

import { db } from '@/lib/db';
import { getServerAuth } from '@/actions/getCurrentUser';
import jwt from 'jsonwebtoken';

export const currentProfilePages = async (req: NextApiRequest) => {
  //@ts-ignore
  const cookie = req.cookies.accessToken;
  if (!cookie) {
    return null;
  }
  let userId = jwt.decode(cookie)?.sub as string;

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  });

  return profile;
};
