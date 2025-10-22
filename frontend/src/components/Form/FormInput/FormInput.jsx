import classes from "./FormInput.module.css";

const FormInput = ({ placeholder, onChange }) => {
    return (
        <input 
            type="text" 
            className={ classes["form-input"] } 
            placeholder={ placeholder }
            onChange={ onChange }
        />
    );
}

export default FormInput;