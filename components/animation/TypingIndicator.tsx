export default function TypingIndicator() {
    return (
        <div className="flex space-x-1 items-end bg-gray-200 dark:bg-gray-700 w-15 p-3 rounded-br-xl rounded-bl-xl rounded-tr-xl mt-1.5">
            <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:0s]"></span>
            <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
    );
}
