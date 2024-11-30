import { useEffect, useState } from "react";
import { GetAllPosts } from "./appwrite";

export const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fn();
            setData(response);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData()

    return { data,loading,refetch }
}