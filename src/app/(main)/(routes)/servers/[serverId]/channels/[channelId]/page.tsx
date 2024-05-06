import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

export async function generateMetadata({ params: { channelId, serverId } }: ChannelIdPageProps): Promise<Metadata> {
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
      serverId,
    },
  })

  if (!channel)
    return {
      title: {
        absolute: 'Channel not found',
      },
    }

  return {
    title: `${channel.type === 'TEXT' ? '#' : channel.type === 'AUDIO' ? '🎙️' : '📹'} ${channel.name}`,
  }
}

const ChannelIdPage = async ({ params: { channelId, serverId } }: ChannelIdPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    redirect('/api/auth/signin')
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) return redirect('/')

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={channel.name} serverId={serverId} type='channel' />
      {channel.type === 'TEXT' && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type='channel'
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey='channelId'
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}
      {channel.type === 'AUDIO' && <MediaRoom audio video={false} chatId={channelId} />}
      {channel.type === 'VIDEO' && <MediaRoom audio={false} video chatId={channelId} />}
    </div>
  )
}

export default ChannelIdPage
