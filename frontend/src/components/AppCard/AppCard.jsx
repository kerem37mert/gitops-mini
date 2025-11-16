import classes from "./AppCard.module.css";
import { FaGitAlt } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useFetch } from "../../../hooks/useFetch";

const AppCard = ({ data }) => {

    // for sync
    const { 
            isLoading: syncIsLoading, 
            error: syncError, 
            data: syncData, 
            request: syncRequest
        } = useFetch(`http://localhost:3000/api/apps/`, "GET", false);

    // for remove app
    const {
        isLoading: removeIsLoading,
        error: removeError,
        data: removeData,
        request: removeRequest
    } = useFetch(`http://localhost:3000/api/apps/`, "GET", false);

    const syncHandler = (id) => {
        syncRequest(`http://localhost:3000/api/apps/${id}/sync`);
    }

    return (
        <div className={ classes["app-card"] }>
            <div className={ classes.header }>
                <FaGitAlt className={ classes["git-icon"] } />
                <p className={ classes.title }>{ data.projectName }</p>
            </div>
            <div className={ classes.body }>
                <div className={ classes.labels }>
                    <p>Proje İsmi:</p>
                    <p>Repository:</p>
                    <p>Yol:</p>
                    <p>Branch İsmi:</p>
                    <p>Namespace: </p>
                </div>
                <div className={ classes.values }>
                    <p>{ data.projectName }</p>
                    <p>{ data.repoURL }</p>
                    <p>{ data.repoPath }</p>
                    <p>{ data.branchName }</p>
                    <p>{ data.namespace }</p>
                </div>
            </div>
            <div className={ classes.footer }>
                <button
                    disabled={ syncIsLoading ? true : false } 
                    className={ classes["btn-footer"] } 
                    onClick={ () => syncHandler(data.id) }
                >
                    <FaSyncAlt 
                        className={ `${classes["sync-icon"]} ${syncIsLoading && classes.spin}` } 
                    />
                    <span>SYNC</span>
                </button>
                <button
                    className={ `${classes["btn-footer"]} ${classes["btn-cancel"]}` }
                >
                    <MdCancel className={ classes["cancel-icon"] } />
                </button>
            </div>
        </div>
    );
}

export default AppCard;