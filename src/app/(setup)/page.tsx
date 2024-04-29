import { InitialModal } from '@/components/modals/initial-modal'
import { db } from '@/lib/db'
import { initialProfile } from '@/lib/initial-profile'
import { redirect } from 'next/navigation'

const Page = async () => {
  const profile = await initialProfile()
  console.log(profile, 'f')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')
  console.log('i got you')

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  })

  if (server) return redirect(`/servers/${server.id}`)

  return <InitialModal />
}

export default Page
