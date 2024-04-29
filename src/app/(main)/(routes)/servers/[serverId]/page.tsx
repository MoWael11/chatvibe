import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { signIn } from 'auth'
import { redirect } from 'next/navigation'

const ServerIdPage = async ({ params }: { params: { serverId: string } }) => {
  const profile = await currentProfile()

  if (!profile) {
    await signIn()
    return
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profile: {
            id: profile.id,
          },
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') return null

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}
export default ServerIdPage
