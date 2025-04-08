import { db } from '@/lib/db';
import { auth } from 'auth';
import { redirect } from 'next/navigation';

export const initialProfile = async () => {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect('/api/auth/signin');
  } else {
    const { user } = session;

    const profile = await db.profile.findFirst({
      where: {
        email: user?.email!,
      },
    });

    if (profile) return profile;

    const newProfile = await db.profile.create({
      data: {
        userId: user.id ?? crypto.randomUUID(),
        name: `${user.name}`,
        imageUrl: user.image!,
        email: user.email!,
      },
    });

    return newProfile;
  }
};
