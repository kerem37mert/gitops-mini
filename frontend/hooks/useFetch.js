import { useEffect, useState } from "react"

export const useFetch = (url, method, isInitialCall = false, body = null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);


    const request = async (customUrl = url) => {

        setIsLoading(true);
        setError(null)

        const token = localStorage.getItem('token');

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
        }

        // Add authentication token if available
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (body)
            options.body = JSON.stringify(body);

        try {
            const response = await fetch(customUrl, options);

            // If unauthorized, redirect to login
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }

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
            return responseData;

        } catch (err) {
            // Hata objesini state'e set et
            setError(err);
            // Hatayı tekrar fırlat ki çağıran taraf yakalayabilsin
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isInitialCall)
            request().catch(err => console.error("Initial fetch error:", err));
    }, []);

    return { isLoading, error, data, request };
}