import { auth } from 'auth'
import { db } from './db'

export const currentProfile = async () => {
  const session = await auth()

  if (!session || !session.user?.email) {
    return null
  }

  const profile = await db.profile.findUnique({
    where: {
      email: session?.user?.email,
    },
  })

  return profile
}
