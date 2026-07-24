export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  error?: string | null;
  message: string | null;
  data?: T;
  [key: string]: any;
};

export type NotificationParticipant = {
  chatId: string;
  user: {
    name: string;
  };
};

export type NotificationChat = {
  id: string;
  type: 'one' | 'group'; // adjust if there are other chat types in your app
  chatName: string;
  participants: NotificationParticipant[];
};

export type NotificationChatSend = {
  id: string;
  userId: string;
  name: string;
  chat: NotificationChat;
  isRead: boolean;
  createdAt: string;
};

export type ChatParticipant = {
  userId: number;
  name: string;
  email: string;
  unreadCount: number;
};

export type NewChatType = {
  chatId: string;
  chatName: string;
  lastMessageContent: string | null;
  lastMessageTime: string | null;
  participants: ChatParticipant[];
  createdAt: Date;
  updatedAt: Date;
  chatType: string;
};
