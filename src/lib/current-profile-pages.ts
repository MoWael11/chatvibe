import { authForPages } from 'auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from './db';

export const currentProfilePages = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await authForPages(req, res);

  if (!session || !session.user?.email) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });

  return profile;
};
