import { Link } from "react-router";
import classes from "./WelcomeSection.module.css";

const WelcomeSection = () => {
    return (
        <div className={classes.welcome}>
            <div className={classes.content}>
                <h1 className={classes.title}>GitOps Mini'ye Hoş Geldin</h1>
                <p className={classes.description}>
                    Kubernetes uygulamalarını Git repository'lerinden otomatik olarak deploy et ve yönet.
                    GitOps prensipleriyle altyapını kod olarak yönetmenin gücünü keşfet.
                </p>
                <div className={classes.actions}>
                    <Link to="/newApp" className={classes["btn-primary"]}>
                        Yeni Uygulama Ekle
                    </Link>
                    <Link to="/apps" className={classes["btn-secondary"]}>
                        Uygulamalarımı Gör
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default WelcomeSection;
