import { useState } from "react";

import FormButton from "../../components/Form/FormButton";
import FormContainer from "../../components/Form/FormContainer";
import FormInput from "../../components/Form/FormInput";
import FormSelect from "../../components/Form/FormSelect";
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

    // Repo validation states
    const [isValidatingRepo, setIsValidatingRepo] = useState(false);
    const [repoValid, setRepoValid] = useState(false);
    const [repoError, setRepoError] = useState(null);
    const [branches, setBranches] = useState([]);

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

    // Validate repo when URL input loses focus
    const handleRepoBlur = async () => {
        if (!repoURL || repoURL.trim() === "") {
            setRepoValid(false);
            setRepoError(null);
            setBranches([]);
            return;
        }

        setIsValidatingRepo(true);
        setRepoError(null);
        setRepoValid(false);
        setBranches([]);

        try {
            // Validate repo
            const validateResponse = await fetch(`${API_URL}/api/github/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoURL })
            });

            const validateData = await validateResponse.json();

            if (!validateResponse.ok) {
                throw new Error(validateData.message);
            }

            if (validateData.isPrivate) {
                throw new Error("Private repository'ler desteklenmiyor");
            }

            // Fetch branches
            const branchesResponse = await fetch(`${API_URL}/api/github/branches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoURL })
            });

            const branchesData = await branchesResponse.json();

            if (!branchesResponse.ok) {
                throw new Error(branchesData.message);
            }

            setBranches(branchesData.branches);
            setBranchName(validateData.defaultBranch || branchesData.branches[0] || "");
            setRepoValid(true);
        } catch (err) {
            setRepoError(err.message);
            setRepoValid(false);
            setBranches([]);
        } finally {
            setIsValidatingRepo(false);
        }
    };

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
            setRepoValid(false);
            setBranches([]);
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
                    onBlur={handleRepoBlur}
                />

                {isValidatingRepo && (
                    <Message type="info" text="Repository kontrol ediliyor..." />
                )}

                {repoError && (
                    <Message type="err" text={`Repo Hatası: ${repoError}`} />
                )}

                {repoValid && (
                    <Message type="sccs" text="✓ Repository bulundu!" />
                )}

                {repoValid && branches.length > 0 && (
                    <FormSelect
                        options={branches}
                        value={branchName}
                        onChange={changeBranchName}
                        placeholder="Branch seçin"
                    />
                )}

                <FormInput
                    placeholder="Github Repo Yol (Manifest dosyalarının bulunduğu dizin)"
                    value={repoPath}
                    onChange={changeRepoPath}
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
                <FormButton
                    text={isLoading ? "Ekleniyor..." : "Ekle"}
                    disabled={!repoValid}
                />
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