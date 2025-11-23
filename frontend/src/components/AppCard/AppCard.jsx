import { Link, useNavigate } from "react-router";
import classes from "./AppCard.module.css";
import { FaGitAlt } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useFetch } from "../../../hooks/useFetch";
import { toast } from "react-toastify";
import formatDate from "../../../helpers/formatDate";
import StatusBadge from "../StatusBadge";

const AppCard = ({ data, onUpdate }) => {

    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // for sync
    const {
        isLoading: syncIsLoading,
        error: syncError,
        data: syncData,
        request: syncRequest
    } = useFetch(`${API_URL}/api/apps/`, "GET", false);

    // for remove app
    const {
        isLoading: removeIsLoading,
        error: removeError,
        data: removeData,
        request: removeRequest
    } = useFetch(`${API_URL}/api/`, "GET", false);

    const syncHandler = async (e, id) => {
        e.stopPropagation(); // Prevent card click
        try {
            await syncRequest(`${API_URL}/api/apps/${id}/sync`);
            toast.success(`${data.projectName} başarıyla senkronize edildi`);

            // Refresh the apps list
            if (onUpdate) {
                await onUpdate();
            }
        } catch (err) {
            const errorMessage = err.message || "Senkronizasyon hatası";
            const errorDetails = err.details ? `\nDetaylar: ${JSON.stringify(err.details)}` : "";
            toast.error(`${errorMessage}${errorDetails}`, {
                autoClose: 10000
            });

            // Refresh on error too to show updated status
            if (onUpdate) {
                await onUpdate();
            }
        }
    }

    const removeHandler = async (e, id) => {
        e.stopPropagation(); // Prevent card click
        try {
            await removeRequest(`${API_URL}/api/apps/${id}/remove`);
            toast.success(`${data.projectName} başarıyla kaldırıldı`);

            // Refresh the apps list
            if (onUpdate) {
                await onUpdate();
            }
        } catch (err) {
            toast.error(`Silme hatası: ${err.message || err}`);
        }
    }

    // Durum bazlı class
    const getStatusClass = () => {
        const status = data.status || 'pending';
        return classes[`status-${status}`];
    };

    const handleCardClick = () => {
        navigate(`/apps/${data.id}`);
    };

    return (
        <div
            className={`${classes["app-card"]} ${getStatusClass()}`}
            onClick={handleCardClick}
        >
            <div className={classes.header}>
                <FaGitAlt className={classes["git-icon"]} />
                <p className={classes.title}>{data.projectName}</p>
            </div>
            <div className={classes.body}>
                <div className={classes.labels}>
                    <p>Repository:</p>
                    <p>Branch:</p>
                    <p>Namespace:</p>
                    <p>Sync Sayısı:</p>
                    <p>Son Senkronizasyon:</p>
                </div>
                <div className={classes.values}>
                    <p className={classes.truncate}>{data.repoURL}</p>
                    <p>{data.branchName}</p>
                    <p>{data.namespace}</p>
                    <p>{data.syncCount || 0}</p>
                    <p>{data.lastSync ? formatDate(data.lastSync) : 'Henüz yok'}</p>
                </div>
            </div>
            <div className={classes.footer}>
                <button
                    disabled={syncIsLoading ? true : false}
                    className={classes["btn-footer"]}
                    onClick={(e) => syncHandler(e, data.id)}
                >
                    <FaSyncAlt
                        className={`${classes["sync-icon"]} ${syncIsLoading && classes.spin}`}
                    />
                    <span>SYNC</span>
                </button>
                <button
                    disabled={removeIsLoading ? true : false}
                    className={`${classes["btn-footer"]} ${classes["btn-cancel"]}`}
                    onClick={(e) => removeHandler(e, data.id)}
                >
                    <MdCancel className={classes["cancel-icon"]} />
                </button>
            </div>
        </div>
    );
}

export default AppCard;