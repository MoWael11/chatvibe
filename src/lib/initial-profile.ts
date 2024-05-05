import { db } from '@/lib/db'
import { auth, signIn } from 'auth'

export const initialProfile = async () => {
  const session = await auth()

  if (!session || !session.user?.email) {
    await signIn()
  } else {
    const { user } = session

    const profile = await db.profile.findFirst({
      where: {
        email: user?.email!,
      },
    })

    if (profile) return profile

    const newProfile = await db.profile.create({
      data: {
        userId: user.id ?? crypto.randomUUID(),
        name: `${user.name}`,
        imageUrl: user.image!,
        email: user.email!,
      },
    })

    return newProfile
  }
}
