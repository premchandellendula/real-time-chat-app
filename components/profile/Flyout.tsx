"use client"
import { useUser } from "@/hooks/useUser";
import { useEffect, useRef, useState } from "react";
import UserIcon from "../icons/UserIcon";
import LogoutIcon from "../icons/LogoutIcon";

interface IFlyout {
    setIsFlyoutOpen: (value: boolean) => void
}

export default function Flyout({setIsFlyoutOpen}: IFlyout){
    const { user, logout } = useUser()
    const ref = useRef<HTMLDivElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleClickOutside = (event: MouseEvent) => {
        if(ref.current && !ref.current.contains(event.target as Node)){
            setIsFlyoutOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    return (
        <div ref={ref} className="absolute left-10 bottom-2 bg-white dark:bg-gray-900 shadow-md text-black dark:text-gray-300 rounded-md w-36 py-2 px-2 z-50 flex flex-col gap-y-1">
            <div 
                onClick={() => {
                    setIsDialogOpen(!isDialogOpen)
                    document.body.style.overflow = 'hidden'
                }} 
                className="flex items-center justify-between gap-2 hover:bg-green-100/60 dark:hover:bg-gray-800 rounded-md p-2">
                <UserIcon />
                <span className="text-lg">Profile</span>
            </div>
            <div onClick={() => logout()} className="flex items-center justify-between gap-2 hover:bg-green-100/60 dark:hover:bg-gray-800 rounded-md p-2">
                <LogoutIcon />
                <span className="text-lg">Logout</span>
            </div>

            {/* {isDialogOpen && <ProfileDialog user={user} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />} */}
        </div>
    )
}