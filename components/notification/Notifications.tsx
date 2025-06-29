"use client"
import { useState } from "react"
import Notification from "../icons/Notification"
import NotificationFlyout from "./NotificationFlyout"

export default function Notifications(){
    const [isNotifiOpen, setIsNotifiOpen] = useState(false)

    return (
        <div className="flex justify-center items-center">
            <Notification onClick={() => setIsNotifiOpen(!isNotifiOpen)} />

            {isNotifiOpen && <NotificationFlyout setIsNotifiOpen={setIsNotifiOpen} />}
        </div>
    )
}