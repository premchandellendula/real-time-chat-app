"use client"
import { UserType } from "@/config"
import { useChat } from "@/other/ChatProvider"
import { useState } from "react"
import CrossIcon from "../icons/CrossIcon"
import InputBox from "../ui/InputBox"
import UserBadge from "../ui/UserBadge"
import UserListItem from "../ui/UserListItem"
import Spinner from "../loaders/Spinner"
import { toast } from "sonner"
import axios from "axios"
import { handleSearch } from "../config/chatLogics"

interface IGroupChatModalProps {
    setIsGroupChatModalOpen: (val: boolean) => void
    isGroupChatModalOpen: boolean
}

export default function GroupChatModal({isGroupChatModalOpen, setIsGroupChatModalOpen}: IGroupChatModalProps){
    const [groupChatName, setGroupChatName] = useState("")
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const { chats, setChats } = useChat() 

    const handleSubmit = async () => {
        setLoading(true)

        if(!groupChatName || !selectedUsers){
            toast.warning("Fields are missing")
            return
        }

        try {
            const response = await axios.post(`/api/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u.id))
            }, {
                withCredentials: true
            })

            setChats([response.data.groupChat, ...chats])
            setIsGroupChatModalOpen(!isGroupChatModalOpen)
            toast.success("Group created successfully")
        }catch(err) {
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error fetching chats: ", err)
            toast.error(errorMessage)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }
    
    const handleDelete = (userToDelete: UserType) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== userToDelete.id))
    }

    const handleGroup = (userToAdd: UserType) => {
        if(!userToAdd){
            toast.warning("Select a user")
        }
        if(selectedUsers.includes(userToAdd)){
            toast.warning("User already added")
        }else{
            setSelectedUsers([...selectedUsers, userToAdd])
        }
    }

    return (
        <div className="fixed inset-0 min-h-screen w-full flex justify-center items-center z-50 bg-black/80">
            <div className="bg-white dark:bg-gray-950 w-80 flex flex-col rounded-md p-6">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">New Group</span>
                    <CrossIcon onClick={() => { 
                            setIsGroupChatModalOpen(!isGroupChatModalOpen)
                            document.body.style.overflow = 'unset'
                        }} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <InputBox type="text" name="users" id="groupname" placeholder="Enter a Name" onChange={(e) => {
                            setGroupChatName(e.target.value)
                        }} />

                        <InputBox type="text" name="users" id="users" placeholder="Enter Users" onChange={(e) => {
                            handleSearch(e.target.value, search, setSearch, setSearchResult)
                        }} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user: UserType) => (
                            <UserBadge key={user.id} user={user} handleFunction={() => handleDelete(user)} />
                        ))}
                    </div>
                    
                    <div className="flex justify-end my-2">
                        <button type="submit" className="bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded-md cursor-pointer">
                            {loading ? (
                                <Spinner />
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>

                {search.length > 0 ? (
                    searchResult.slice(0,4).map((user: any) => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    ))
                ) : (
                    <span className="text-gray-300 text-center">loading</span>
                )}
            </div>
        </div>
    )
}