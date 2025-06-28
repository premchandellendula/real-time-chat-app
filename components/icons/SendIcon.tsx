import { Send } from "lucide-react";

export default function SendIcon({onClick}: {onClick: (e: React.KeyboardEvent | React.MouseEvent) => {}}){
    return (
        <button onClick={onClick} className="absolute right-5 top-5 cursor-pointer">
            <Send size={"22px"} className="hover:text-green-600 text-gray-400" /> 
        </button>
    )
}