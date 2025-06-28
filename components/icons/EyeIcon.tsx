import { Eye } from "lucide-react";

export default function EyeIcon({onClick}: {onClick: () => void}){
    return (
        <div onClick={onClick}>
            <Eye className="cursor-pointer text-gray-700 dark:text-gray-300" />
        </div>
    )
}