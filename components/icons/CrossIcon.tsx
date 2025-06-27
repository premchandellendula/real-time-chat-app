import { X } from 'lucide-react'
import React from 'react'

const CrossIcon = ({onClick}: {onClick: () => void}) => {
    return (
        <div onClick={onClick} className='cursor-pointer'>
            <X />
        </div>
    )
}

export default CrossIcon