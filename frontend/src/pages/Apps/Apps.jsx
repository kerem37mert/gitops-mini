import { useFetch } from "../../../hooks/useFetch";
import AppCard from "../../components/AppCard/AppCard";
import { AppCardContainer } from "../../components/AppCard";

const Apps = () => {

    const API_URL = import.meta.env.VITE_API_URL;

    const { 
        isLoading, 
        error, 
        data, 
        request 
    } = useFetch(`${API_URL}/api/apps`, "GET", true);

    if(isLoading) {
        return <p>yükleniyor...</p>;
    }

    if(error) {
        return <p>{ error }</p>;
    }

    return (
        <AppCardContainer>
            {
                !data?.message || data.message.length === 0 ? (
                    <p>Henüz hiç uygulaman yok</p>
                ) : (
                    data?.message?.map(item => (
                        <AppCard key={ item.id}  data={ item } />
                    ))
                )
            }
        </AppCardContainer>
    );
}

export default Apps;