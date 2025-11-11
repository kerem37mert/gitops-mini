import classes from "./Message.module.css";

/**
 * 
 * type: err | sccs | any
 * text: any 
 *  
 */
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