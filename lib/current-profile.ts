import { getServerAuth } from '@/actions/getCurrentUser';
import { db } from '@/lib/db';

export const currentProfile = async () => {
  const { userId } = getServerAuth();

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
