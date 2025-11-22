import { useState } from "react";

import FormButton from "../../components/Form/FormButton";
import FormContainer from "../../components/Form/FormContainer";
import FormInput from "../../components/Form/FormInput";
import Message from "../../components/Message/Message";
import FormConstraint from "../../components/Form/FormConstraint";
import { useFetch } from "../../../hooks/useFetch";

const NewApp = () => {

    const API_URL = import.meta.env.VITE_API_URL;

    const [projectName, setProjectName] = useState("");
    const [repoURL, setRepoURL] = useState("");
    const [repoPath, setRepoPath] = useState("");
    const [branchName, setBranchName] = useState("");
    const [namespace, setNamespace] = useState("default");

    const { 
        isLoading, 
        error, 
        data, 
        request 
    } = useFetch(`${API_URL}/api/newApp`, "POST", false, {
        projectName,
        repoURL,
        repoPath,
        branchName,
        namespace
    });

    const changeProjectName = event => setProjectName(event.target.value);
    const changeRepoURL = event => setRepoURL(event.target.value);
    const changeRepoPath = event => setRepoPath(event.target.value);
    const changeBranchName = event => setBranchName(event.target.value);
    const changeNamespace = event => setNamespace(event.target.value);

    const submitHandler = (event) => {
        event.preventDefault();
        request();

        if(!error) {
            setProjectName("");
            setRepoURL("");
            setRepoPath("");
            setBranchName("");
            setNamespace("default");
        }
    }

    return (
        <>
            <FormContainer onSubmit={ submitHandler }>
                <FormInput 
                    placeholder="Proje İsmi" 
                    value={ projectName }
                    onChange={ changeProjectName } 
                />
                <FormInput 
                    placeholder="Github Repo URL" 
                    value={ repoURL }
                    onChange={ changeRepoURL } 
                />
                <FormInput 
                    placeholder="Github Repo Yol (Manifest dosyalarının bulunduğu dizin)" 
                    value={ repoPath }
                    onChange={ changeRepoPath } 
                />
                <FormInput 
                    placeholder="Branch İsmi (master)" 
                    value={ branchName }
                    onChange={ changeBranchName } 
                />
                <FormInput 
                    placeholder="Namespace" 
                    value={ namespace }
                    onChange={ changeNamespace } 
                />
                <FormButton text="Ekle" />
                <FormConstraint text="* Github reposu public erişime sahip olmalıdır." />
            </FormContainer>

            {
                error && (
                    <Message type="err" text={ `Hata: ${ error }` } />
                )
            }

            {
                data?.status && (
                    <Message type="sccs" text="Uygulama başarıyla eklendi." />
                )
            }
        </>
    );
}

export default NewApp;