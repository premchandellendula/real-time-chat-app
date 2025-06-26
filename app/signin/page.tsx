"use client"

import Sidebar from "@/components/sidebar/Sidebar"
import BottomWarning from "@/components/ui/BottomWarning"
import Button from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import InputBox from "@/components/ui/InputBox"
import PasswordInputBox from "@/components/ui/PasswordInputBox"
import { useUser } from "@/hooks/useUser"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"

export default function Signin(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { login } = useUser()

    const canSubmit = formData.email.trim() !== "" && formData.password.trim() !== "";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        try {
            await axios.post(`/api/auth/signin`, formData, {
                withCredentials: true
            })

            await login()

            toast.success("Signin successful")

            if(formData.email && formData.password){
                router.push('/chats')
            }
        }catch(err) {
            let errorMessage = "Something went wrong"

            if(axios.isAxiosError(err)){
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error signing up: ", err)
            setError(errorMessage);
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="dark:bg-[#06060b] flex h-screen">
            <div className="w-[4.5%]">
                <Sidebar />
            </div>
            <div className="w-[95.5%] flex justify-center items-center h-screen">
                <form onSubmit={handleSubmit}>
                    <div className="w-96 rounded-md px-6 py-4 shadow-lg border border-gray-200 dark:border-gray-900">
                        <Heading text="Signin" size="2xl" />
                        <InputBox type="text" placeholder="Email Address" name="email" id="email" onChange={handleChange} />
                        <PasswordInputBox placeholder="Password" name="password" id="password" onChange={handleChange} />
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" text="Signin" variant="primary" size="sm" width="full" />
                        <BottomWarning label="Don't have an account?" to="/signup" buttonText="Signup" />
                    </div>
                </form>
            </div>
        </div>
    )
}