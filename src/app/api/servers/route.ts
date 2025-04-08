import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: crypto.randomUUID(),
        channels: {
          create: [
            {
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: {
            profileId: profile.id,
            role: 'ADMIN',
          },
        },
      },
    });

    return NextResponse.json(server, { status: 201 });
  } catch (err) {
    console.log('[SERVERS_POST]', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
