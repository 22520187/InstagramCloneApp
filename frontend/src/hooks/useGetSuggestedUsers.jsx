import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/v1/user/suggested', {withCredentials: true});
                if (res.data.success) {
                    console.log(res.data.suggestedUsers);
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSuggestedUsers();
    }, []);
}
export default useGetSuggestedUsers;