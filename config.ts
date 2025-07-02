export type UserType = {
    id: string,
    name: string,
    email: string,
    imageUrl: string
}

export interface Chat {
    id: string;
    users: UserType[];
    latestMessage?: string;
    isGroupChat: boolean,
    chatName: string
    groupAdmin: UserType,
    imageUrl?: string
}

export type MessageType = {
    id: string,
    message: string,
    user: UserType
}

export type FullMessageType = {
    id: string,
    message: string,
    user: UserType,
    createdAt: string,
    chat: Chat
}

export const SOCKET_URL = "https://socket-server-jshk.onrender.com/"