"use client"

import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"

interface SearchBarProps {
    onResults: (users: any) => void;
    openModal: () => void;
}

export default function SearchBar({onResults, openModal}: SearchBarProps){
    const [name, setName] = useState("")

    const handleSearch = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault()

        if(!name){
            toast.warning("Please enter a name!")
        }

        try{
            const response = await axios.get(`/api/search/users?search=${name}`, {
                withCredentials: true
            })

            onResults(response.data.users)
            openModal()
        }catch(err){
            let errorMessage = "Something went wrong"

            if(axios.isAxiosError(err)){
                errorMessage = err.response?.data?.message || err.message
            }

            console.log("Error searching a user:", err)
            toast.error(errorMessage)
        }
    }
    return (
        <div className="flex items-center rounded-full relative w-full bg-gray-200/60 text-gray-800 shadow-inner dark:bg-gray-950 dark:text-gray-200 dark:shadow-md mt-1.5">
            <input 
                type="text" 
                onChange={(e) => setName(e.target.value)} 
                className="rounded-full px-4 md:py-2 py-2 w-full bg-transparent focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-200/70 dark:focus:ring-gray-800" placeholder="Search Users"
            />
            <span 
            onClick={handleSearch}
            className="absolute right-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-10 size-9 text-gray-500 dark:text-gray-400 p-2 rounded-r-md flex items-center justify-center cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </span>
        </div>
    )
}