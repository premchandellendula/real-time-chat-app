
import ChatIcon from "../icons/ChatIcon";
import Profile from "../profile/Profile";
import ThemeButton from "../theme/ThemeButton";

export default function Sidebar(){
    return (
        <div className="w-15 bg-gray-100 dark:bg-[#0a0b1b] h-screen py-3 flex flex-col justify-between border border-gray-300 dark:border-gray-900">
            <div className="flex justify-center">
                <ChatIcon />
            </div>

            <div className="flex flex-col items-center gap-2">
                <ThemeButton />
                <Profile />
            </div>
        </div>
    )
}