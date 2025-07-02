"use client"

import { Chat, FullMessageType } from "@/config";
import { createContext, useContext, useState } from "react";

type SelectedChat = Chat | null;

interface ChatContextType {
    selectedChat: SelectedChat;
    setSelectedChat: React.Dispatch<React.SetStateAction<SelectedChat>>;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    notification: FullMessageType[],
    setNotification: React.Dispatch<React.SetStateAction<FullMessageType[]>>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({children}: {children: React.ReactNode}) => {
    const [selectedChat, setSelectedChat] = useState<SelectedChat>(null)
    const [chats, setChats] = useState<Chat[]>([])
    const [notification, setNotification] = useState<FullMessageType[]>([])

    return (
        <ChatContext.Provider value={{ selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}