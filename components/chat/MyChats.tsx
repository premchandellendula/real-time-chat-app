"use client"
import { useEffect, useState } from "react";
import SearchBar from "../search/SearchBar";
import { useChat } from "@/other/ChatProvider";
import Plus from "../icons/PlusIcon";
import SearchResultModal from "../dialog/SearchResultModal";
import axios from "axios";
import { toast } from "sonner";
import { getSender, getSenderFullDetails } from "../config/chatLogics";
import { useUser } from "@/hooks/useUser";
import GroupChatModal from "../dialog/GroupChatModal";
import { Chat, UserType } from "@/config";

export default function MyChats({fetchAgain}: {fetchAgain: boolean}){
    const [searchResults, setSearchResults] = useState<UserType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false)
    const { selectedChat, setSelectedChat, chats, setChats } = useChat()

    const { user } = useUser()

    const handleUserSelect = async (userId: string) => {
        try {
            const response = await axios.post(`/api/chat`, {
                user_id: userId
            }, {withCredentials: true})

            if(!chats.find((c) => c.id === response.data.chat.id)){
                setChats([response.data.chats, ...chats])
            }

            setSelectedChat(response.data.chat)
            setIsModalOpen(false)
        }catch(err) {
            let errorMessage = "Something went wrong";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error creating or fetching chat: ", err)
            toast.error(errorMessage)
        }
    }

    const fetchChats = async () => {
        try {
            const response = await axios.get(`/api/chat`, {
                withCredentials: true
            })

            setChats(response.data.chats)
        }catch(err) {
            let errorMessage = "Something went wrong";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error fetching chats: ", err)
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        fetchChats()
    }, [fetchAgain])

    return (
        <section className="dark:text-white dark:bg-[#06060b] relative w-[30%] p-2 border-r border-gray-300 dark:border-gray-800">
            <div className="flex justify-between py-2.5 px-2">
                <h2 className="text-xl font-semibold">Spot</h2>
                <Plus onClick={() => setIsGroupChatModalOpen(!isGroupChatModalOpen)} />
            </div>
            <SearchBar 
                onResults={(users) => setSearchResults(users)}
                openModal={() => setIsModalOpen(true)} />

            {chats.length === 0 ? (
                <p className="text-gray-500">No chats found.</p>
            ) : (
                <ul className="flex flex-col gap-1.5 mt-4">
                    {chats.map((chat: Chat) => (
                        <li
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`cursor-pointer p-1 rounded-md mx-2 dark:text-white ${selectedChat === chat ? "bg-gray-400/80 dark:bg-gray-700" : "bg-gray-200/80 dark:bg-gray-900/50 hover:bg-gray-300/60 dark:hover:bg-gray-900"}`}>
                            <div className="flex items-center gap-3">
                                {!chat.isGroupChat ? (
                                    <>
                                        <img src={getSenderFullDetails(user, chat.users).imageUrl} alt={getSenderFullDetails(user, chat.users).name} className="w-10 h-10 rounded-full object-cover" />
                                        <span>{getSender(user, chat.users)}</span>
                                    </>
                                ) : (
                                    <>
                                        <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="group image" className="rounded-full w-10 h-10 object-cover" />
                                        <span className="h-10 flex items-center">{chat.chatName}</span>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            
            {isModalOpen && <SearchResultModal users={searchResults} onClose={() => setIsModalOpen(false)} onUserSelect={handleUserSelect} />}

            {isGroupChatModalOpen && <GroupChatModal isGroupChatModalOpen={isGroupChatModalOpen} setIsGroupChatModalOpen={setIsGroupChatModalOpen} />}
        </section>
    )
}