import { useState } from "react";

import FormButton from "../../components/Form/FormButton";
import FormContainer from "../../components/Form/FormContainer";
import FormInput from "../../components/Form/FormInput";
import Message from "../../components/Message/Message";

const NewApp = () => {

    const [projectName, setProjectName] = useState("");
    const [repoURL, setRepoURL] = useState("");
    const [branchName, setBranchName] = useState("");

    const changeProjectName = event => setProjectName(event.target.value);
    const changeRepoURL = event => setRepoURL(event.target.value);
    const changeBranchName = event => setBranchName(event.target.value);

    const submitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <>
            <FormContainer onSubmit={ submitHandler }>
                <FormInput placeholder="Proje İsmi" onChange={ changeProjectName } />
                <FormInput placeholder="Github Repo URL" onChange={ changeRepoURL } />
                <FormInput placeholder="Branch İsmi (master)" onChange={ changeBranchName } />
                <FormButton text="Ekle" />
            </FormContainer>

            <Message type="sccs" text="Hata oldu" />
        </>
    );
}

export default NewApp;