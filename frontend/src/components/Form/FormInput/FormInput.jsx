import classes from "./FormInput.module.css";

const FormInput = ({ placeholder, value, onChange, onBlur, className }) => {
    return (
        <input
            className={`${classes["form-input"]} ${className ? classes[className] : ''}`}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
}

export default FormInput;