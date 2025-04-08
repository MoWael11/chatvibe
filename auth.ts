import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export const auth = async () => await getServerSession(authOptions);

export const authForPages = async (req: NextApiRequest, res: NextApiResponse) =>
  await getServerSession(req, res, authOptions);
