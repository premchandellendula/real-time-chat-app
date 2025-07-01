"use client"
import { useUser } from '@/hooks/useUser'
import React, { useState } from 'react'
import Flyout from './Flyout'

export default function Profile(){
    const { user } = useUser()
    // console.log(user?.imageUrl)
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(false)
    return (
        <div className='dark:text-white rounded-full relative cursor-pointer pb-2'>
            <img src={user?.imageUrl} width={20} height={20} alt='profile' className="rounded-full h-8 w-8 object-cover" onClick={() => setIsFlyoutOpen(!isFlyoutOpen)} />

            {isFlyoutOpen && <Flyout setIsFlyoutOpen={setIsFlyoutOpen} />}
        </div>
    )
}