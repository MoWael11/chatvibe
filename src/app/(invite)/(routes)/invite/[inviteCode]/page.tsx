import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface InviteCodeProps {
  params: {
    inviteCode: string
  }
}

const InviteCodePage = async ({ params: { inviteCode } }: InviteCodeProps) => {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  if (!inviteCode) return redirect('/')

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (existingServer) return redirect(`/servers/${existingServer.id}`)

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  })

  return redirect(`/servers/${server.id}`)
}

export default InviteCodePage
