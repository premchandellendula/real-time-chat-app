"use client"
import { useUser } from "@/hooks/useUser"
import { isSameUser } from "../config/chatLogics"
import { useEffect, useRef } from "react";
import TypingIndicator from "../animation/TypingIndicator";
import { MessageType } from "@/config";

interface IChatMessages {
    messages: MessageType[],
    isTyping: boolean
}

export default function ChatMessages({messages, isTyping}: IChatMessages){
    const messageEndRef = useRef<HTMLDivElement>(null)
    const { user } = useUser();

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "auto"})
    }, [messages])

    return (
        <div className="mb-2 flex flex-col overflow-y-auto px-1 py-2">
            {messages.map((message: MessageType, i: number) => (
                <div key={i} className="flex items-end">
                    <div style={{
                            marginTop: isSameUser(messages, message, i) ? 4 : 10
                        }} 
                        className={`rounded-br-xl rounded-bl-xl px-3 py-1 max-w-[50%] text-sm leading-relaxed ${
                            message.user.id === user?.id
                                ? "ml-auto bg-green-500 text-white dark:bg-green-600 rounded-tl-xl"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-tr-xl"
                        }`}>{message.message}
                    </div>
                </div>
            ))}

            {isTyping ? (
                <TypingIndicator />
            ) : (
                <></>
            )}
            <div ref={messageEndRef} ></div>
        </div>
    )
}