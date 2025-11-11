import classes from "./FormConstraint.module.css";

const FormConstraint = ({ text }) => {
    return (
        <div className={ classes["form-constraint"] }>{ text }</div>
    );
}

export default FormConstraint;