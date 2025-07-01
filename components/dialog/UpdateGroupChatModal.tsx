import { useChat } from "@/other/ChatProvider"
import CrossIcon from "../icons/CrossIcon"
import UserBadge from "../ui/UserBadge"
import { UserType } from "@/config"
import InputBox from "../ui/InputBox"
import { useState } from "react"
import Spinner from "../loaders/Spinner"
import { handleSearch } from "../config/chatLogics"
import UserListItem from "../ui/UserListItem"
import { useUser } from "@/hooks/useUser"
import axios from "axios"
import { toast } from "sonner"

interface IUpdateGroupChatModalProps {
    fetchAgain: boolean,
    setFetchAgain: (val: boolean) => void
    isGroupChatModalOpen: boolean
    setIsGroupChatModalOpen: (val: boolean) => void
}

export default function UpdateGroupChatModal({fetchAgain, setFetchAgain, isGroupChatModalOpen, setIsGroupChatModalOpen}: IUpdateGroupChatModalProps){
    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [renameLoading, setRenameLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const { selectedChat, setSelectedChat } = useChat();
    const { user } = useUser()

    const handleRemove = async (userToRemove: UserType | null) => {
        if(selectedChat?.groupAdmin.id !== user?.id && userToRemove?.id !== user?.id){
            toast.error("Only admins can remove")
        }
        setLoading(true)

        try{
            const response = await axios.put(`/api/chat/removeuserfromgroup`, {
                chatId: selectedChat?.id,
                user_id: userToRemove?.id
            }, {
                withCredentials: true
            })

            userToRemove?.id === user?.id ? setSelectedChat(null) : setSelectedChat(response.data.groupChat)
            setFetchAgain(!fetchAgain)
        }catch(err){
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error remover user from the chat: ", err)
            toast.error(errorMessage)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }

    const handleAddUser = async (userToAdd: UserType) => {
        if(selectedChat?.users.find((user: UserType | null) => user?.id === userToAdd.id)){
            toast.warning("User already exists")
        }

        if(selectedChat?.groupAdmin.id !== user?.id){
            toast.error("Only Admins can add")
        }

        try{
            const response = await axios.put('/api/chat/addusertogroup', {
                user_id: userToAdd.id,
                chat_id: selectedChat?.id
            }, {withCredentials: true})

            setSelectedChat(response.data.groupChat)
            setFetchAgain(!fetchAgain)
        }catch(err){
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error adding user to the chat: ", err)
            toast.error(errorMessage)
        }

    }

    const handleRename = async () => {
        if(!groupChatName){
            return
        }
        setRenameLoading(true)

        try {
            const response = await axios.put(`/api/chat/renamegroup`, {
                chat_id: selectedChat?.id,
                chatName: groupChatName
            }, {
                withCredentials: true
            })

            setSelectedChat(response.data.groupChat)
            setFetchAgain(!fetchAgain)
            toast.success("Updated the group name")
        }catch(err) {
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error renaming the chat: ", err)
            toast.error(errorMessage)
            setRenameLoading(false)
        }finally{
            setRenameLoading(false)
        }

        setGroupChatName("")
    }
    return (
        <div className="fixed inset-0 min-h-screen w-full flex justify-center items-center z-50 bg-black/80">
            <div className="bg-white dark:bg-gray-950 w-80 flex flex-col rounded-md p-6">
                <div className="flex justify-between">
                    <h2>{selectedChat?.chatName}</h2>
                    <CrossIcon onClick={() => { 
                        setIsGroupChatModalOpen(!isGroupChatModalOpen)
                        document.body.style.overflow = 'unset'
                    }} />
                </div>

                <div>
                    <div className="flex flex-wrap gap-1 mt-4">
                        {selectedChat?.users.map((user: UserType) => (
                            <UserBadge key={user.id} user={user} handleFunction={() => handleRemove(user)} />
                        ))}
                    </div>

                    <form className="flex justify-center items-center gap-2 mt-2" onSubmit={handleRename}>
                        <InputBox type="text" name="renamegroup" id="renamegroup" placeholder="Rename group" onChange={(e) => setGroupChatName(e.target.value)} />

                        <button type="submit" className="bg-green-500 cursor-pointer text-white rounded-md px-2 py-1">
                            {renameLoading ? (
                                <Spinner />
                            ) : (
                                "Update"
                            )}
                        </button>
                    </form>

                    <form className="my-2">
                        <InputBox type="text" name="users" id="users" placeholder="Enter Users" onChange={(e) => {
                            handleSearch(e.target.value, search, setSearch, setSearchResult)
                        }} />
                    </form>

                    {search.length > 0 ? (
                        searchResult.slice(0,4).map((user: UserType) => (
                            <UserListItem key={user.id} user={user} handleFunction={() => handleAddUser(user)} />
                        ))
                    ) : (
                        <span className="text-gray-300 text-center">loading</span>
                    )}

                    <div className="flex justify-end mt-2">
                        <button onClick={() => handleRemove(user)} type="submit" className="bg-red-500 text-white px-2 py-1 rounded-md">
                            {loading ? (
                                <Spinner />
                            ) : (
                                "Leave Group"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}