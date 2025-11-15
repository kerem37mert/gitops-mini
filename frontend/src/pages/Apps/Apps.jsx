import { useFetch } from "../../../hooks/useFetch";
import AppCard from "../../components/AppCard/AppCard";

const Apps = () => {

    const { 
            isLoading, 
            error, 
            data, 
            request 
        } = useFetch("http://localhost:3000/api/apsps", "GET", true);
    return (
        <>
            { 
                isLoading && (
                    <p>yükleniyor...</p>
                )
            }

            {
                error && (
                    <p>{ error }</p>
                )   
            }
        </>
    );
}

export default Apps;