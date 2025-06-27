import { Plus } from "lucide-react";

export default function PlusIcon({onClick}: {onClick: () => void}){
    return (
        <div onClick={onClick}>
            <Plus size={"20"} className="dark:text-white mt-1 cursor-pointer" />
        </div>    )
}