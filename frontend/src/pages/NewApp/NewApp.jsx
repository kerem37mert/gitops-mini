import { useState } from "react";

import FormButton from "../../components/Form/FormButton";
import FormContainer from "../../components/Form/FormContainer";
import FormInput from "../../components/Form/FormInput";
import FormTextarea from "../../components/Form/FormTextarea";
import FormCheckbox from "../../components/Form/FormCheckbox";
import Message from "../../components/Message/Message";
import FormConstraint from "../../components/Form/FormConstraint";

const NewApp = () => {

    const API_URL = import.meta.env.VITE_API_URL;

    const [projectName, setProjectName] = useState("");
    const [repoURL, setRepoURL] = useState("");
    const [repoPath, setRepoPath] = useState("");
    const [branchName, setBranchName] = useState("");
    const [namespace, setNamespace] = useState("default");
    const [description, setDescription] = useState("");
    const [autoSync, setAutoSync] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const changeProjectName = event => setProjectName(event.target.value);
    const changeRepoURL = event => setRepoURL(event.target.value);
    const changeRepoPath = event => setRepoPath(event.target.value);
    const changeBranchName = event => setBranchName(event.target.value);
    const changeNamespace = event => setNamespace(event.target.value);
    const changeDescription = event => setDescription(event.target.value);
    const changeAutoSync = event => setAutoSync(event.target.checked);

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${API_URL}/api/newApp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    projectName,
                    repoURL,
                    repoPath,
                    branchName,
                    namespace,
                    description,
                    autoSync
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Sunucuda bir hata oluştu");
            }

            setSuccess(true);
            setProjectName("");
            setRepoURL("");
            setRepoPath("");
            setBranchName("");
            setNamespace("default");
            setDescription("");
            setAutoSync(false);
        } catch (err) {
            setError(err.message);
            console.error("NewApp submit error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <FormContainer onSubmit={submitHandler}>
                <FormInput
                    placeholder="Proje İsmi"
                    value={projectName}
                    onChange={changeProjectName}
                />
                <FormInput
                    placeholder="Github Repo URL"
                    value={repoURL}
                    onChange={changeRepoURL}
                />
                <FormInput
                    placeholder="Github Repo Yol (Manifest dosyalarının bulunduğu dizin)"
                    value={repoPath}
                    onChange={changeRepoPath}
                />
                <FormInput
                    placeholder="Branch İsmi (main)"
                    value={branchName}
                    onChange={changeBranchName}
                />
                <FormInput
                    placeholder="Namespace"
                    value={namespace}
                    onChange={changeNamespace}
                />
                <FormTextarea
                    placeholder="Açıklama (opsiyonel)"
                    value={description}
                    onChange={changeDescription}
                    rows={3}
                />
                <FormCheckbox
                    label="Otomatik Senkronizasyon"
                    checked={autoSync}
                    onChange={changeAutoSync}
                />
                <FormButton text={isLoading ? "Ekleniyor..." : "Ekle"} />
                <FormConstraint text="* Github reposu public erişime sahip olmalıdır." />
            </FormContainer>

            {
                error && (
                    <Message type="err" text={`Hata: ${error}`} />
                )
            }

            {
                success && (
                    <Message type="sccs" text="Uygulama başarıyla eklendi." />
                )
            }
        </>
    );
}

export default NewApp;