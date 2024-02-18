import { db } from '@/lib/db'

export const getOrCreteConversation = async (memberOneId: string, memberTwoId: string) => {
  const conversation =
    (await findConversation(memberOneId, memberTwoId)) || (await findConversation(memberTwoId, memberOneId))
  if (conversation) {
    return conversation
  }
  return createNewConversation(memberOneId, memberTwoId)
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch (err) {
    return null
  }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  } catch (err) {
    return null
  }
}
