import classes from "./Message.module.css";

const Message = ({ type, text }) => {
    return (
        <div 
            className={ `${ classes.message } ${ type === "err" ? classes.err : classes.sccs }` }
        >
            { text }
        </div>
    );
}

export default Message;