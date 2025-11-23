import { useFetch } from "../../../hooks/useFetch";
import { FaBox, FaTag, FaSyncAlt } from "react-icons/fa";
import WelcomeSection from "../../components/WelcomeSection";
import StatCard from "../../components/StatCard";
import RecentApps from "../../components/RecentApps";
import classes from "./Home.module.css";

const Home = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const {
        isLoading,
        error,
        data
    } = useFetch(`${API_URL}/api/apps`, "GET", true);

    if (isLoading) {
        return <div className={classes.loading}>Yükleniyor...</div>;
    }

    if (error) {
        return <div className={classes.error}>Hata: {error.message || error}</div>;
    }

    const apps = data?.message || [];

    // İstatistikleri hesapla
    const totalApps = apps.length;
    const uniqueNamespaces = [...new Set(apps.map(app => app.namespace))].length;

    // En son senkronize edilen uygulamayı bul
    const lastSyncApp = apps.reduce((latest, app) => {
        const appSync = app.lastSync || app.createdAt;
        const latestSync = latest?.lastSync || latest?.createdAt;
        return !latest || new Date(appSync) > new Date(latestSync) ? app : latest;
    }, null);

    const lastSyncTime = lastSyncApp
        ? new Date(lastSyncApp.lastSync || lastSyncApp.createdAt).toLocaleString('tr-TR')
        : 'Henüz yok';

    // Son eklenen uygulamaları tarihe göre sırala
    const sortedApps = [...apps].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className={classes.home}>
            <WelcomeSection />

            <div className={classes.stats}>
                <StatCard
                    title="Toplam Uygulama"
                    value={totalApps}
                    icon={FaBox}
                    color="primary"
                />
                <StatCard
                    title="Aktif Namespace"
                    value={uniqueNamespaces}
                    icon={FaTag}
                    color="info"
                />
                <StatCard
                    title="Son Senkronizasyon"
                    value={lastSyncApp ? lastSyncApp.projectName : '-'}
                    icon={FaSyncAlt}
                    color="success"
                />
            </div>

            <RecentApps apps={sortedApps} />
        </div>
    );
}

export default Home;