import classes from "./AppCard.module.css"

const AppCardContainer = ({ children }) => {
    return (
        <div className={ classes["app-card-container"] }>
            { children }
        </div>
    );
}

export default AppCardContainer;