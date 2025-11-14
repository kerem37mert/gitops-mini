import classes from "./FormInput.module.css";

const FormInput = ({ placeholder="", defaultValue="", onChange }) => {
    return (
        <input 
            type="text" 
            className={ classes["form-input"] } 
            placeholder={ placeholder }
            value={ defaultValue }
            onChange={ onChange }
        />
    );
}

export default FormInput;