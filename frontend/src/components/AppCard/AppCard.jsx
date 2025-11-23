import classes from "./AppCard.module.css";
import { FaGitAlt } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useFetch } from "../../../hooks/useFetch";
import { toast } from "react-toastify";
import formatDate from "../../../helpers/formatDate";

const AppCard = ({ data, onUpdate }) => {

    const API_URL = import.meta.env.VITE_API_URL;

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

    const syncHandler = async (id) => {
        try {
            await syncRequest(`${API_URL}/api/apps/${id}/sync`);
            toast.success(`${data.projectName} başarıyla senkronize edildi`);

            // Refresh the apps list
            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            const errorMessage = err.message || "Senkronizasyon hatası";
            const errorDetails = err.details ? `\nDetaylar: ${JSON.stringify(err.details)}` : "";
            toast.error(`${errorMessage}${errorDetails}`, {
                autoClose: 10000
            });
        }
    }

    const removeHandler = async (id) => {
        try {
            await removeRequest(`${API_URL}/api/apps/${id}/remove`);
            toast.success(`${data.projectName} başarıyla kaldırıldı`);

            // Refresh the apps list
            if (onUpdate) {
                onUpdate();
            }
        } catch (err) {
            toast.error(`Silme hatası: ${err.message || err}`);
        }
    }

    return (
        <div className={classes["app-card"]}>
            <div className={classes.header}>
                <FaGitAlt className={classes["git-icon"]} />
                <p className={classes.title}>{data.projectName}</p>
            </div>
            <div className={classes.body}>
                <div className={classes.labels}>
                    <p>Proje İsmi:</p>
                    <p>Repository:</p>
                    <p>Yol:</p>
                    <p>Branch İsmi:</p>
                    <p>Namespace: </p>
                    <p>Oluşturulma Tarihi: </p>
                    <p>Son Senkronizasyon</p>
                </div>
                <div className={classes.values}>
                    <p>{data.projectName}</p>
                    <p>{data.repoURL}</p>
                    <p>{data.repoPath}</p>
                    <p>{data.branchName}</p>
                    <p>{data.namespace}</p>
                    <p>{formatDate(data.createdAt)}</p>
                    <p>
                        {data.lastSync ? formatDate(data.lastSync) : formatDate(data.createdAt)}
                    </p>
                </div>
            </div>
            <div className={classes.footer}>
                <button
                    disabled={syncIsLoading ? true : false}
                    className={classes["btn-footer"]}
                    onClick={() => syncHandler(data.id)}
                >
                    <FaSyncAlt
                        className={`${classes["sync-icon"]} ${syncIsLoading && classes.spin}`}
                    />
                    <span>SYNC</span>
                </button>
                <button
                    disabled={removeIsLoading ? true : false}
                    className={`${classes["btn-footer"]} ${classes["btn-cancel"]}`}
                    onClick={() => removeHandler(data.id)}
                >
                    <MdCancel className={classes["cancel-icon"]} />
                </button>
            </div>
        </div>
    );
}

export default AppCard;