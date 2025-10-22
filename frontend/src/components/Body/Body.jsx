import classes from "./Body.module.css";

const Body = ({ children }) => {
    return (
        <div className={ classes.body }>
            { children }
        </div>
    );
}

export default Body;