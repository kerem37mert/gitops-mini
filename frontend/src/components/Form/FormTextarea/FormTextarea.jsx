import classes from "./FormTextarea.module.css";

const FormTextarea = ({ placeholder, value, onChange, rows = 3 }) => {
    return (
        <textarea
            className={classes["form-textarea"]}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={rows}
        />
    );
}

export default FormTextarea;
