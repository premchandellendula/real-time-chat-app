export type UserType = {
    id: string,
    name: string,
    email: string,
    imageUrl: string
}

export interface LatestMessage {
    id: string,
    message: string,
    created: string,
    user: {
        id: string,
        name: string
    }
}

export interface Chat {
    id: string;
    users: UserType[];
    latestMessage?: LatestMessage;
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

export const SOCKET_URL = "https://socket-server-jshk.onrender.com"