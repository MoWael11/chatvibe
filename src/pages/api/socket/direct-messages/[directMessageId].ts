import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { NextApiResponseServerIO } from '@/types';
import { NextApiRequest } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req, res);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) return res.status(401).json({ error: 'Unauthorized' });

    if (!conversationId) return res.status(400).json({ message: 'Conversation ID is required' });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profile: {
                id: profile.id,
              },
            },
          },
          {
            memberTwo: {
              profile: {
                id: profile.id,
              },
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: { profile: true },
        },
        memberTwo: {
          include: { profile: true },
        },
      },
    });

    if (!conversation) return res.status(404).json({ message: 'conversation not found' });

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if (!member) return res.status(401).json({ message: 'Unauthorized' });

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversation.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) return res.status(404).json({ message: 'Message not found' });

    const isMessageOwner = message.member.profileId === profile.id;
    const isAdmin = member.role === 'ADMIN';
    const isModarator = member.role === 'MODERATOR';
    const canModify = isMessageOwner || isAdmin || isModarator;

    if (!canModify) return res.status(401).json({ message: 'Unauthorized' });

    if (req.method === 'DELETE') {
      message = await db.directMessage.update({
        where: {
          id: message.id,
        },
        data: {
          deleted: true,
          fileUrl: null,
          content: 'This message has been deleted.',
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) return res.status(401).json({ message: 'Unauthorized' });

      message = await db.directMessage.update({
        where: {
          id: message.id,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res.socket.server.io.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
