import classes from "./FormCheckbox.module.css";

const FormCheckbox = ({ label, checked, onChange }) => {
    return (
        <label className={classes["form-checkbox"]}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={classes.input}
            />
            <span className={classes.label}>{label}</span>
        </label>
    );
}

export default FormCheckbox;
