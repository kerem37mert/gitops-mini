import { useEffect, useState } from "react"

const useFetch = (url, method, isInitialCall=false) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData]= useState(null);
    

    const request = async () => {
        try {
            
        } catch(err) {
            setError(err.message);
        } 
    }

    useEffect(() => {
        if(isInitialCall)
            request();
    }, []);

    return { isLoading, error, data, request };
}