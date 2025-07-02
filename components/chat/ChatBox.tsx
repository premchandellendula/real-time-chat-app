import { useChat } from "@/other/ChatProvider"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { getSender, getSenderFullDetails } from "../config/chatLogics"
import { useUser } from "@/hooks/useUser"
import EyeIcon from "../icons/EyeIcon"
import ProfileDialog from "../dialog/ProfileDialog"
import UpdateGroupChatModal from "../dialog/UpdateGroupChatModal"
import Spinner from "../loaders/Spinner"
import SendIcon from "../icons/SendIcon"
import { toast } from "sonner"
import axios from "axios"
import ChatMessages from "./ChatMessages"
import { io, Socket } from "socket.io-client"
import { Chat, MessageType, SOCKET_URL } from "@/config"

interface IChatsProps {
    fetchAgain: boolean,
    setFetchAgain: (e: boolean) => void
}

export default function ChatBox({fetchAgain, setFetchAgain}: IChatsProps){
    const [messages, setMessages] = useState<MessageType[]>([])
    const [newMessage, setNewMessage] = useState<string>("")
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { selectedChat, notification, setNotification } = useChat()
    const { user } = useUser()

    const socketRef = useRef<Socket | null>(null)
    const selectedChatRef = useRef<Chat | null>(null)

    useEffect(() => {
        if(!user || socketRef.current?.connected) return;
        
        socketRef.current = io(SOCKET_URL)
        socketRef.current.emit("setup", user)
        socketRef.current.on("connected", () => setSocketConnected(true))

        socketRef.current.on("typing", () => setIsTyping(true))
        socketRef.current.on("stop typing", () => setIsTyping(false))

        socketRef.current.on("message received", (newMessageReceived) => {
            // console.log("Message received:", newMessageReceived)

            if(!selectedChatRef.current || selectedChatRef.current.id !== newMessageReceived.chat.id){
                console.log("Message not for current chat, showing notification");

                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            }
            setMessages((prevMessages: MessageType[]) => [...prevMessages, newMessageReceived])
        })

        socketRef.current.on("disconnect", () => {
            console.log("Socket disconnected")
            setSocketConnected(false)
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null
                setSocketConnected(false)
            }
        };
    }, [user])

    useEffect(() => {
        if(!selectedChat){
            selectedChatRef.current = null
            return
        }

        console.log("Selected chat changes: ", selectedChat.id)
        selectedChatRef.current = selectedChat
        fetchMessages()
    }, [selectedChat])

    const fetchMessages = async () => {
        if(!selectedChat || !socketRef.current) return;
        setLoading(true)

        try {
            const response = await axios.get(`/api/message/${selectedChat.id}`, {
                withCredentials: true
            })

            setMessages(response.data.messages)
            socketRef.current?.emit("join chat", selectedChat.id)
        }catch(err) {
            const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : "Something went wrong";
            
            console.log("Error fetcing message: ", err)
            toast.error(errorMessage)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }

    const handleSendMessage = async (e?: React.KeyboardEvent | React.MouseEvent) => {
        e?.preventDefault()

        if(!newMessage.trim()){
            toast.warning("Please enter a message!")
            return
        }

        if(!selectedChat || !socketRef.current){
            toast.error("Chat not selected or connection lost")
            return;
        }

        const messageToSend = newMessage.trim()
        setNewMessage("")

        try {
            const response = await axios.post(`/api/message`, {
                chat_id: selectedChat.id,
                message: messageToSend
            }, {withCredentials: true})

            socketRef.current.emit("new message", response.data.fullMessage)
            setMessages((prevMessages: MessageType[]) => [...prevMessages, response.data.fullMessage])
            socketRef.current.emit("stop typing", selectedChat.id)
        }catch(err) {
            const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : "Something went wrong";
            
            console.log("Error sending message: ", err)
            toast.error(errorMessage)

            setNewMessage(messageToSend)
        }
    }

    const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)

        if(!socketConnected) return

        if(!typing){
            setTyping(true)
            socketRef.current?.emit("typing", selectedChat?.id)
        }

        if(typingTimeoutRef.current){
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("stop typing", selectedChat?.id)
            setTyping(false)
        }, 3000)
    }

    return (
        <section className="w-[70%] dark:bg-[#06060b] flex flex-col border-l border-gray-300 dark:border-gray-800 h-full">
            {selectedChat ? (
                <>
                    <div className="flex justify-between items-center px-3 py-2 border-b border-gray-300 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            {!selectedChat.isGroupChat ? (
                                <div className="flex items-center gap-1">
                                    <img src={getSenderFullDetails(user, selectedChat.users).imageUrl} alt={getSenderFullDetails(user, selectedChat.users).name} className="w-7 h-7 rounded-full" />
                                    <span className="text-2xl mb-1">
                                        {getSender(user, selectedChat.users)}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <img src={selectedChat.imageUrl} alt={selectedChat.chatName} className="w-7 h-7 rounded-full" />
                                    <span className="text-2xl mb-1">{selectedChat.chatName}</span>
                                </div>
                            )}
                        </h2>

                        <EyeIcon
                            onClick={() =>
                                selectedChat.isGroupChat
                                ? setIsGroupChatModalOpen(true)
                                : setIsProfileDialogOpen(true)
                            }
                        />
                    </div>

                    {isProfileDialogOpen && <ProfileDialog user={getSenderFullDetails(user, selectedChat.users)} isDialogOpen={isProfileDialogOpen} setIsDialogOpen={setIsProfileDialogOpen} />}

                    {isGroupChatModalOpen && <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} isGroupChatModalOpen={isGroupChatModalOpen} setIsGroupChatModalOpen={setIsGroupChatModalOpen} />}

                    <div className="flex-grow overflow-y-auto px-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner />
                            </div>
                        ) : (
                            <ChatMessages messages={messages} isTyping={isTyping} />
                        )}
                    </div>

                    <div className="relative border-t border-gray-300 dark:border-gray-800 px-2 py-1.5">
                        <input
                        type="text" 
                        name="newmessage" 
                        id="newmessage" 
                        placeholder="Enter a message"
                        onChange={typingHandler}
                        value={newMessage}
                        className="p-2 w-full h-12 border border-gray-200 dark:border-gray-800 dark:text-white dark:bg-[#16172b] bg-gray-100 rounded-md focus:ring-2 focus:ring-green-100/80 dark:focus:ring-gray-800 outline-none pr-10"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage(e);
                        }}
                        />

                        <SendIcon onClick={handleSendMessage} />
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center text-2xl font-semibold text-gray-600 dark:text-gray-300 h-full">
                    Click on a user to start chatting
                </div>
            )}
        </section>
    )
}