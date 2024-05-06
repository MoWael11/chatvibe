import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import { getOrCreteConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface MembmerIdPageProps {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}

const MembmerIdPage = async ({ params: { memberId, serverId }, searchParams: { video } }: MembmerIdPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    redirect('/api/auth/signin')
  }

  const currentMember = await db.member.findUnique({
    where: {
      profileId_serverId: {
        serverId,
        profileId: profile.id,
      },
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) {
    redirect('/api/auth/signin')
  }

  const conversation = await getOrCreteConversation(currentMember.id, memberId)

  if (!conversation) return redirect(`/server/${serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        type='conversation'
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
      />
      {video && <MediaRoom audio video chatId={conversation.id} />}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            type='conversation'
            chatId={conversation.id}
            apiUrl='/api/direct-messages'
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl='/api/socket/direct-messages'
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type='converstation'
            apiUrl='/api/socket/direct-messages'
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}

export default MembmerIdPage
