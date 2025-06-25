"use client"
import { useUser } from '@/hooks/useUser'
import Image from 'next/image'
import React, { useState } from 'react'
import Flyout from './Flyout'

export default function Profile(){
    const { user } = useUser()
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(false)
    return (
        <div className='dark:text-white rounded-full relative cursor-pointer pb-2'>
            <img src={"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} width={20} height={20} alt='profile' className="rounded-full h-8 w-8 object-cover" onClick={() => setIsFlyoutOpen(!isFlyoutOpen)} />

            {isFlyoutOpen && <Flyout setIsFlyoutOpen={setIsFlyoutOpen} />}
        </div>
    )
}