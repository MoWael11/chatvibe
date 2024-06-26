'use client'

import { Channel, ChannelType, Server } from '@prisma/client'
import { create } from 'zustand'

export type ModalType =
  | 'createServer'
  | 'editServer'
  | 'invite'
  | 'members'
  | 'createChannel'
  | 'leaveServer'
  | 'deleteServer'
  | 'deleteChannel'
  | 'editChannel'
  | 'messageFile'
  | 'deleteMessage'

interface ModalData {
  server?: Server
  channel?: Channel
  channelType?: ChannelType
  apiUrl?: string
  query?: Record<string, any>
}

interface ModalStrong {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStrong>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}))
