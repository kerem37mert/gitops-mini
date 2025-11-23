import { useEffect, useState } from "react"

export const useFetch = (url, method, isInitialCall = false, body = null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);


    const request = async (customUrl = url) => {

        setIsLoading(true);
        setError(null)

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
        }

        if (body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(customUrl, options);
            const responseData = await response.json();

            if (!response.ok) {
                const errorObj = {
                    message: responseData?.message || "Sunucuda bir hata oluştu",
                    stack: responseData?.stack,
                    details: responseData?.details
                };
                throw errorObj;
            }

            setData(responseData);

        } catch (err) {
            // Hata objesini veya mesajını set et
            setError(err);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        if (isInitialCall)
            request().catch(err => console.error("Initial fetch error:", err));
    }, []);

    return { isLoading, error, data, request };
}