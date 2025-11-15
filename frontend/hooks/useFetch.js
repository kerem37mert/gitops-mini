import { useEffect, useState } from "react"

export const useFetch = (url, method, isInitialCall=false, body=null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(undefined);
    const [data, setData]= useState({});
    

    const request = async () => {

        setIsLoading(true);
        setError(undefined)

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json' 
            },
        }

        if(body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(url, options);

            if(!response.ok) 
                throw new Error("Sunucuda bir hata oluştu");

            const data = await response.json();
            setData(data);
            
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