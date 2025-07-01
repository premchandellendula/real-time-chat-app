import { UserType } from "@/config";
import axios from "axios";
import { toast } from "sonner";

export const getSender = (loggedUser: UserType | null, users: UserType[]) => {
    return users[0].id === loggedUser?.id ? users[1].name : users[0].name
}

export const getSenderFullDetails = (loggedUser: UserType | null, users: UserType[]) => {
    return users[0].id === loggedUser?.id ? users[1] : users[0]
}
//ts-ignore
export const handleSearch = async (query: string, search: string, setSearch: (val: string) => void, setSearchResult: (val: any) => void) => {
    setSearch(query)

    if(!query){
        return;
    }

    try {
        const response = await axios.get(`api/search/users?search=${search}`, {
            withCredentials: true
        })

        setSearchResult(response.data.users)
        console.log(response.data.users)
    } catch (err) {
        let errorMessage = "Something went wrong";

        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || err.message;
        }
        console.log("Error fetching users: ", err)
        toast.error(errorMessage)
    }
}
//ts-ignore
export const isSameUser = (messages: any, m: any, i: any) => {
    return i > 0 && messages[i-1].user.id === m.user.id
}