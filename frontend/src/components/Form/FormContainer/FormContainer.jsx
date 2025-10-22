import classes from "./FormContainer.module.css";

const FormContainer = ({ onSubmit, children }) => {
    return ( 
        <form method="POST" action="/" className={ classes["form-container"] } onSubmit={ onSubmit }>
            { children }
        </form>
    );
}

export default FormContainer;