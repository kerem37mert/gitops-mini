import classes from "./Header.module.css";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
    const { user, logout, isSuperuser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={classes.header}>
            <Link to="/" className={classes.title}>GitOPS Mini</Link>
            <nav className={classes.nav}>
                <ul>
                    <li>
                        <Link to="/">Ana Sayfa</Link>
                    </li>
                    <li>
                        <Link to="/newapp">Yeni Proje</Link>
                    </li>
                    <li>
                        <Link to="/apps">Uygulamalar</Link>
                    </li>
                    {isSuperuser() && (
                        <li>
                            <Link to="/users">Kullanıcılar</Link>
                        </li>
                    )}
                </ul>
            </nav>
            {user && (
                <div className={classes.userSection}>
                    <span className={classes.username}>
                        {user.username}
                        {user.role === 'superuser' && (
                            <span className={classes.superBadge}>SUPER</span>
                        )}
                    </span>
                    <button className={classes.logoutButton} onClick={handleLogout}>
                        Çıkış
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;