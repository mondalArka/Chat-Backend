export const Chats = {
    GROUP: "group",
    ONE: "one",
    ME: "me"
} as const

export type ChatTypes = typeof Chats[keyof typeof Chats];

export const FileType = {
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
    DOCUMENT: "document"
} as const

export type FileTypes = typeof FileType[keyof typeof FileType];

export const MessageType = {
    TEXT: "text",
    MEDIA: "media",
    MIXED: "mixed"
} as const

export type MessageTypes = typeof MessageType[keyof typeof MessageType];
