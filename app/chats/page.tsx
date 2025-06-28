"use client"
import ChatBox from "@/components/chat/ChatBox";
import MyChats from "@/components/chat/MyChats";
import Sidebar from "@/components/sidebar/Sidebar";
import { useState } from "react";

export default function Chats(){
    const [fetchAgain, setFetchAgain] = useState(false)
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex w-full">
                <MyChats fetchAgain={fetchAgain} />
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
        </div>
    )
}