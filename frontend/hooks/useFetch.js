import { useEffect, useState } from "react"

export const useFetch = (url, method, isInitialCall=false, body=null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData]= useState(null);
    

    const request = async (customUrl = url) => {

        setIsLoading(true);
        setError(null)

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json' 
            },
        }

        if(body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(customUrl, options);
            const responseData = await response.json();

            if(!response.ok) 
                throw new Error(responseData?.message || "Sunucuda bir hata oluştu");

            setData(responseData);
            
        } catch(err) {
            setError(err.message);
        } 

        setIsLoading(false);
    }

    useEffect(() => {
        if(isInitialCall)
            request();
    }, []);

    return { isLoading, error, data, request };
}