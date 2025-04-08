import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheckIcon, Video } from 'lucide-react';
import { redirect } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { Separator } from '../ui/separator';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};

const roleIcon = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheckIcon className="w-4 h-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  const textChannels = server?.channels.filter((channel) => channel.type === 'TEXT');
  const voiceChannels = server?.channels.filter((channel) => channel.type === 'AUDIO');
  const videoChannels = server?.channels.filter((channel) => channel.type === 'VIDEO');
  const members = server?.members.filter((member) => member.profileId !== profile!.id);

  if (!server) return redirect('/');

  const role = server.members.find((member) => member.profileId === profile!.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: voiceChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIcon[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionsType={'channels'} channelType={'TEXT'} label="Text Channels" role={role} />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel channel={channel} server={server} role={role} key={channel.id} />
              ))}
            </div>
          </div>
        )}
        {!!voiceChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionsType={'channels'} channelType={'AUDIO'} label="Voice Channels" role={role} />
            <div className="space-y-[2px]">
              {voiceChannels.map((channel) => (
                <ServerChannel channel={channel} server={server} role={role} key={channel.id} />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection sectionsType={'channels'} channelType={'VIDEO'} label="Video Channels" role={role} />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel channel={channel} server={server} role={role} key={channel.id} />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection sectionsType={'members'} label="Members" server={server} role={role} />
            <div className="space-y-[2px]">
              {members.map((member) => (
                <ServerMember member={member} server={server} key={member.id} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
