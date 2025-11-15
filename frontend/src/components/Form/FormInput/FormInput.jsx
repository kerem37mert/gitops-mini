import classes from "./FormInput.module.css";

const FormInput = (props) => {
    return (
        <input 
            type="text" 
            className={ classes["form-input"] } 
            { ...props }
        />
    );
}

export default FormInput;