import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector((store) => store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                if (selectedUser?._id) {
                    const res = await axios.get(`http://localhost:8080/api/v1/message/all/${selectedUser?._id}`, {withCredentials: true});
                    if (res.data.success) {
                        console.log("Messages fetched:", res.data.messages);
                        dispatch(setMessages(res.data.messages));
                    }
                }
            } catch (error) {
                console.log("Error fetching messages:", error);
            }
        }
        fetchAllMessage();
    }, [selectedUser, dispatch]);
}
export default useGetAllMessage;