// GitHub API helper functions

/**
 * Parse GitHub URL to extract owner and repo
 * Supports HTTPS and SSH formats
 */
export function parseGitHubUrl(url) {
    if (!url) return null;

    // Remove trailing .git if present
    url = url.replace(/\.git$/, '');

    // HTTPS format: https://github.com/owner/repo
    const httpsMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (httpsMatch) {
        return { owner: httpsMatch[1], repo: httpsMatch[2] };
    }

    // SSH format: git@github.com:owner/repo
    const sshMatch = url.match(/github\.com:([^\/]+)\/([^\/]+)/);
    if (sshMatch) {
        return { owner: sshMatch[1], repo: sshMatch[2] };
    }

    return null;
}

/**
 * Validate GitHub repository exists
 */
export async function validateRepo(repoURL) {
    const parsed = parseGitHubUrl(repoURL);

    if (!parsed) {
        throw new Error('Geçersiz GitHub URL formatı');
    }

    const { owner, repo } = parsed;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    try {
        const response = await fetch(apiUrl);

        if (response.status === 404) {
            throw new Error('Repository bulunamadı');
        }

        if (response.status === 403) {
            throw new Error('GitHub API rate limit aşıldı');
        }

        if (!response.ok) {
            throw new Error(`GitHub API hatası: ${response.status}`);
        }

        const data = await response.json();

        return {
            exists: true,
            defaultBranch: data.default_branch,
            isPrivate: data.private
        };
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Bağlantı hatası, internet bağlantınızı kontrol edin');
        }
        throw error;
    }
}

/**
 * Get list of branches for a repository
 */
export async function getBranches(repoURL) {
    const parsed = parseGitHubUrl(repoURL);

    if (!parsed) {
        throw new Error('Geçersiz GitHub URL formatı');
    }

    const { owner, repo } = parsed;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/branches`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Branch listesi alınamadı: ${response.status}`);
        }

        const data = await response.json();

        return data.map(branch => branch.name);
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Bağlantı hatası');
        }
        throw error;
    }
}
