import classes from "./AppCard.module.css";
import { FaGitAlt } from "react-icons/fa6";
import { FaSyncAlt } from "react-icons/fa";

const AppCard = ({ data }) => {

    const syncHandler = (id) => {
        alert(id)
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
                    className={ classes["btn-sync"] } 
                    onClick={ () => syncHandler(data.id) }
                >
                    <FaSyncAlt className={ classes["sync-icon"] } />
                    <span>SYNC</span>
                </button>
            </div>
        </div>
    );
}

export default AppCard;