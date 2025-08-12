import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile, setUserProfile] = useState(null);
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/user/${userId}/profile`, {withCredentials: true});
                if (res.data.success) {
                    console.log(res.data.user);
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId]);
}
export default useGetUserProfile;