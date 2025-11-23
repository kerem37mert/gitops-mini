import { Link } from "react-router";
import { FaGitAlt } from "react-icons/fa6";
import formatDate from "../../../helpers/formatDate";
import classes from "./RecentApps.module.css";

const RecentApps = ({ apps }) => {
    if (!apps || apps.length === 0) {
        return (
            <div className={classes.container}>
                <h2 className={classes.heading}>Son Eklenen Uygulamalar</h2>
                <div className={classes.empty}>
                    <p>Henüz hiç uygulama eklenmemiş.</p>
                    <Link to="/newApp" className={classes.link}>İlk uygulamanı ekle →</Link>
                </div>
            </div>
        );
    }

    // Son 5 uygulamayı al
    const recentApps = apps.slice(0, 5);

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <h2 className={classes.heading}>Son Eklenen Uygulamalar</h2>
                <Link to="/apps" className={classes.link}>Tümünü Gör →</Link>
            </div>
            <div className={classes.list}>
                {recentApps.map(app => (
                    <div key={app.id} className={classes.item}>
                        <div className={classes.icon}>
                            <FaGitAlt />
                        </div>
                        <div className={classes.info}>
                            <p className={classes.name}>{app.projectName}</p>
                            <p className={classes.meta}>
                                {app.namespace} • {formatDate(app.createdAt)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentApps;
