"use client"
import { UserType } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

type UserContextType = {
    user: UserType | null
    login: () => Promise<void>
    logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | null>(null)

interface UserProviderProps {
    children: React.ReactNode
}

export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<UserType | null>(null)
    const router = useRouter()

    const login = async () => {
        try {
            const res = await axios.get(`/api/auth/me`, {
                withCredentials: true
            });

            // console.log(res)
            setUser(res.data.user)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setUser(null);
                } else {
                    console.error("Failed to fetch user", err);
                }
            } else {
                console.error("Failed to fetch user", err);
            }
        }
    }

    const logout = async () => {
        try {
            await axios.post(`/api/auth/logout`, {}, {
                withCredentials: true
            })
            setUser(null)
            router.push('/')
        } catch (err) {
            console.error("Failed to logout", err)
        }
    }

    useEffect(() => {
        login()
    }, [])

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}