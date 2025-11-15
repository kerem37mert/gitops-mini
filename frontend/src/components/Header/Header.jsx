import classes from "./Header.module.css";
import { Link } from "react-router";

const Header = () => {
    return(
        <header className={ classes.header }>
            <Link to="/" className={ classes.title }>GitOPS Mini</Link>
            <nav className={ classes.nav }>
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
                </ul>
            </nav>
        </header>
    );
}

export default Header;