import { useParams, useNavigate, Link } from "react-router";
import { useFetch } from "../../../hooks/useFetch";
import { FaSyncAlt, FaArrowLeft } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import formatDate from "../../../helpers/formatDate";
import StatusBadge from "../../components/StatusBadge";
import classes from "./AppDetail.module.css";

const AppDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const {
        isLoading,
        error,
        data,
        request
    } = useFetch(`${API_URL}/api/apps/${id}`, "GET", true);

    const {
        isLoading: syncIsLoading,
        request: syncRequest
    } = useFetch(`${API_URL}/api/apps/`, "GET", false);

    const {
        isLoading: removeIsLoading,
        request: removeRequest
    } = useFetch(`${API_URL}/api/`, "GET", false);

    const syncHandler = async () => {
        try {
            await syncRequest(`${API_URL}/api/apps/${id}/sync`);
            toast.success("Senkronizasyon başarılı");
            // Refetch data instead of reloading
            await request();
        } catch (err) {
            toast.error(`Hata: ${err.message || err}`);
            // Refetch to show error status
            await request();
        }
    };

    const removeHandler = async () => {
        if (!confirm("Bu uygulamayı silmek istediğinizden emin misiniz?")) return;

        try {
            await removeRequest(`${API_URL}/api/apps/${id}/remove`);
            toast.success("Uygulama başarıyla silindi");
            navigate("/apps");
        } catch (err) {
            toast.error(`Hata: ${err.message || err}`);
        }
    };

    if (isLoading) {
        return <div className={classes.loading}>Yükleniyor...</div>;
    }

    if (error) {
        return <div className={classes.error}>Hata: {error.message || error}</div>;
    }

    const app = data?.message;

    if (!app) {
        return <div className={classes.error}>Uygulama bulunamadı</div>;
    }

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Link to="/apps" className={classes["back-btn"]}>
                    <FaArrowLeft /> Geri Dön
                </Link>
                <h1 className={classes.title}>{app.projectName}</h1>
                <StatusBadge status={app.status || 'pending'} size="medium" />
            </div>

            {app.description && (
                <div className={classes.description}>
                    <p>{app.description}</p>
                </div>
            )}

            {app.errorMessage && (
                <div className={classes["error-box"]}>
                    <strong>Hata:</strong> {app.errorMessage}
                </div>
            )}

            <div className={classes.grid}>
                <div className={classes.card}>
                    <h2>Repository Bilgileri</h2>
                    <div className={classes.info}>
                        <div className={classes.row}>
                            <span className={classes.label}>Repository URL:</span>
                            <span className={classes.value}>{app.repoURL}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.label}>Branch:</span>
                            <span className={classes.value}>{app.branchName}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.label}>Repo Path:</span>
                            <span className={classes.value}>{app.repoPath}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.label}>Namespace:</span>
                            <span className={classes.value}>{app.namespace}</span>
                        </div>
                    </div>
                </div>

                <div className={classes.card}>
                    <h2>Senkronizasyon Bİlgileri</h2>
                    <div className={classes.info}>
                        <div className={classes.row}>
                            <span className={classes.label}>Durum:</span>
                            <span className={classes.value}>
                                <StatusBadge status={app.syncStatus || 'pending'} />
                            </span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.label}>Toplam Sync:</span>
                            <span className={classes.value}>{app.syncCount || 0} kez</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.label}>Son Sync:</span>
                            <span className={classes.value}>
                                {app.lastSync ? formatDate(app.lastSync) : 'Henüz yapılmadı'}
                            </span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.label}>Son Sync Süresi:</span>
                            <span className={classes.value}>
                                {app.lastSyncDuration ? `${app.lastSyncDuration}ms` : '-'}
                            </span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.label}>Otomatik Sync:</span>
                            <span className={classes.value}>
                                {app.autoSync ? 'Aktif' : 'Pasif'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={classes.card}>
                    <h2>Tarihler</h2>
                    <div className={classes.info}>
                        <div className={classes.row}>
                            <span className={classes.label}>Oluşturulma:</span>
                            <span className={classes.value}>{formatDate(app.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.actions}>
                <button
                    onClick={syncHandler}
                    disabled={syncIsLoading}
                    className={`${classes.btn} ${classes["btn-sync"]}`}
                >
                    <FaSyncAlt className={syncIsLoading ? classes.spin : ''} />
                    {syncIsLoading ? 'Senkronize ediliyor...' : 'Senkronize Et'}
                </button>
                <button
                    onClick={removeHandler}
                    disabled={removeIsLoading}
                    className={`${classes.btn} ${classes["btn-delete"]}`}
                >
                    <MdCancel />
                    Sil
                </button>
            </div>
        </div>
    );
};

export default AppDetail;
