import { ChangeEvent } from "react";

interface IFileInput {
    name: string,
    id: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FileInput(props: IFileInput){
    return (
        <div className="flex flex-col gap-1.5 mt-3">
            <input 
                onChange={props.onChange} 
                type="file"
                name={props.name} 
                id={props.id}
                accept="image/*" 
                className="p-2 border border-green-200 dark:border-gray-900 rounded-md focus:ring-2 focus:ring-green-100/80 dark:focus:ring-gray-900 outline-none" 
            />
        </div>
    )
}