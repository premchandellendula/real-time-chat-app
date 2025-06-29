"use client"
import { useUser } from "@/hooks/useUser";
import ChatIcon from "../icons/ChatIcon";
import Profile from "../profile/Profile";
import ThemeButton from "../theme/ThemeButton";
import Notifications from "../notification/Notifications";

export default function Sidebar(){
    const { user } = useUser()
    return (
        <div className="w-15 bg-gray-100 dark:bg-[#06060b] h-screen py-3 flex flex-col justify-between border border-gray-300 dark:border-gray-900">
            <div className="flex justify-center">
                <ChatIcon />
            </div>

            <div className="flex flex-col items-center gap-2">
                <Notifications />
                <ThemeButton />
                {user?.name && <Profile /> }
            </div>
        </div>
    )
}