import { db } from '@/lib/db';
import { currentProfile } from './current-profile';
import getCurrentUser from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';

export const initialProfile = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect('sign-in');
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.name}`,
      imageUrl: user.imageUrl,
      email: user.email
    }
  });

  return newProfile;
};
