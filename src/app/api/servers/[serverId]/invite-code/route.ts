import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile()
    if (!profile) return new NextResponse('Unauthorized', { status: 401 })
    const { serverId } = params

    if (!serverId) return new NextResponse('Server id missing', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: crypto.randomUUID(),
      },
    })

    return NextResponse.json(server)
  } catch (err) {
    console.log(err)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
