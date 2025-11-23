import classes from "./FormSelect.module.css";

const FormSelect = ({ options, value, onChange, placeholder, disabled }) => {
    return (
        <select
            className={classes["form-select"]}
            value={value}
            onChange={onChange}
            disabled={disabled}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default FormSelect;
