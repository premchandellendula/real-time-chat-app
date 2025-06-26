import { ChangeEvent } from "react"

interface IInputBox {
    placeholder: string
    name: string
    id: string
    type: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function InputBox(props: IInputBox){
    return (
        <div className="flex flex-col gap-1.5 mt-2">
            <input type={props.type} placeholder={props.placeholder} name={props.name} id={props.id} onChange={props.onChange} className="p-2 border border-green-200 dark:border-gray-900 rounded-md focus:ring-2 focus:ring-green-100/80 dark:focus:ring-gray-900 outline-none" />
        </div>
    )
}