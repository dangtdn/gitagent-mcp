import * as z from "zod";
import { getOctokit } from "../client.js";
import { formatError, formatAuthError, formatJsonContent } from "../utils/formatters.js";
export function registerRepositoryTools(server) {
    // Tool: List Repositories
    server.registerTool("list_repositories", {
        title: "List Repositories",
        description: "List all repositories accessible to the authenticated user",
        inputSchema: {
            page: z.number().optional().describe("Page number (default: 1)"),
            perPage: z.number().optional().describe("Items per page (default: 30)"),
        },
    }, async ({ page = 1, perPage = 30 }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError();
        }
        try {
            const response = await octokit.repos.listForAuthenticatedUser({
                sort: "updated",
                per_page: perPage,
                page: page,
            });
            const repos = response.data.map((repo) => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                html_url: repo.html_url,
                stargazers_count: repo.stargazers_count,
                language: repo.language,
                updated_at: repo.updated_at,
                visibility: repo.visibility,
                default_branch: repo.default_branch,
            }));
            return formatJsonContent(repos);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Get Repository Info
    server.registerTool("get_repository", {
        title: "Get Repository",
        description: "Get detailed information about a repository",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
        },
    }, async ({ owner, repo }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const response = await octokit.repos.get({ owner, repo });
            const repoInfo = {
                id: response.data.id,
                name: response.data.name,
                full_name: response.data.full_name,
                description: response.data.description,
                html_url: response.data.html_url,
                clone_url: response.data.clone_url,
                default_branch: response.data.default_branch,
                language: response.data.language,
                stargazers_count: response.data.stargazers_count,
                forks_count: response.data.forks_count,
                open_issues_count: response.data.open_issues_count,
                visibility: response.data.visibility,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at,
                pushed_at: response.data.pushed_at,
            };
            return formatJsonContent(repoInfo);
        }
        catch (error) {
            return formatError(error);
        }
    });
}
//# sourceMappingURL=repository.js.map