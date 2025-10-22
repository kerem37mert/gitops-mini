import classes from "./FormButton.module.css";

const FormButton = ({ text }) => {
    return (
        <button 
            type="submit" 
            className={ classes["form-button"] }
        >
            { text }
        </button>
    );
}

export default FormButton;