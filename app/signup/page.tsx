"use client"
import Sidebar from "@/components/sidebar/Sidebar";
import BottomWarning from "@/components/ui/BottomWarning";
import Button from "@/components/ui/Button";
import FileInput from "@/components/ui/FileInput";
import Heading from "@/components/ui/Heading";
import InputBox from "@/components/ui/InputBox";
import PasswordInputBox from "@/components/ui/PasswordInputBox";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

export default function Signup(){

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        imageUrl: ""
    })

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const router = useRouter();
    const { login } = useUser()

    const canSubmit =
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== "" &&
        formData.password === formData.confirmPassword;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if(name === "confirmPassword"){
            if(value !== formData.password){
                setConfirmPasswordError("Passwords do not match")
            }else{
                setConfirmPasswordError("")
            }
        }

        if (name === "password" && formData.confirmPassword.length > 0) {
            if (formData.confirmPassword !== value) {
                setConfirmPasswordError("Passwords do not match");
            } else {
                setConfirmPasswordError("");
            }
        }
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true)

        try{
            await axios.post(`/api/auth/signup`, formData, {
                withCredentials: true
            })

            await login()

            toast.success("Signup successful")

            if(formData.email && formData.password){
                router.push('/chats')
            }
        }catch(err){
            let errorMessage = "Something went wrong";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error signing up: ", err)
            setError(errorMessage);
            setLoading(false)
        }finally {
            setLoading(false);
        }
    }

    const postDetails = async (pics: any) => {
        if(!pics){
            toast.warning("Please select an image");
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData()
            data.append("file", pics)

            const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
            const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;

            if (!uploadPreset || !cloudName) {
                throw new Error("Missing environment variables for upload.");
            }
            data.append("upload_preset", uploadPreset)
            data.append("cloud_name", cloudName)

            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL ?? "", data)
                // console.log(response)
                const imageUrl = response.data.secure_url;
                setFormData(prev => ({
                    ...prev,
                    imageUrl: imageUrl,
                }));
            }catch(err){
                toast.error("Image upload failed");
                console.error(err);
            }
        }
    }    
    return (
        <div className="dark:bg-[#06060b] flex h-screen">
            <div className="w-[4.5%]">
                <Sidebar />
            </div>
            <div className="w-[95.5%] flex justify-center items-center h-screen">
                <form onSubmit={handleSubmit}>
                        <div className="w-86 rounded-md px-6 py-4 shadow-lg border border-gray-200 dark:border-gray-900">
                            <Heading text="Signup" size="2xl" />
                            <InputBox type="text" placeholder="Email Address" name="email" id="email" onChange={handleChange} />
                            <InputBox type="text" placeholder="Full Name" name="name" id="name" onChange={handleChange} />
                            <PasswordInputBox placeholder="Password" name="password" id="password" onChange={handleChange} />
                            <PasswordInputBox placeholder="Confirm Password" name="confirmPassword" id="confirmPassword" onChange={handleChange} />
                            <FileInput name="imageUrl" id="imageUrl" onChange={(e) => postDetails(e.target.files?.[0])} />
                            
                            {error && <p className="text-red-500">{error}</p>}

                            {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}

                            <Button type="submit" text="Signup" variant="primary" size="sm" width="full" />
                            <BottomWarning label="Already have an account?" to="/signin" buttonText="Signin" />
                        </div>
                </form>
            </div>
        </div>
    )
}