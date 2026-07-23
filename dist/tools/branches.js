import * as z from "zod";
import { getOctokit } from "../client.js";
import { formatError, formatAuthError, formatJsonContent, formatTextContent } from "../utils/formatters.js";
export function registerBranchTools(server) {
    // Tool: List Branches
    server.registerTool("list_branches", {
        title: "List Branches",
        description: "List branches in a repository",
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
            const response = await octokit.repos.listBranches({
                owner,
                repo,
                per_page: 100,
            });
            const branches = response.data.map((branch) => ({
                name: branch.name,
                protected: branch.protected,
            }));
            return formatJsonContent(branches);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Create Branch
    server.registerTool("create_branch", {
        title: "Create Branch",
        description: "Create a new branch from an existing branch or commit",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            branch_name: z.string().describe("Name for the new branch"),
            from_branch: z
                .string()
                .optional()
                .describe("Source branch (default: default branch)"),
            from_sha: z
                .string()
                .optional()
                .describe("Source commit SHA (alternative to from_branch)"),
        },
    }, async ({ owner, repo, branch_name, from_branch, from_sha }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            let sha = from_sha;
            if (!sha) {
                // Get SHA from source branch
                const sourceBranch = from_branch ||
                    (await octokit.repos.get({ owner, repo })).data.default_branch;
                const ref = await octokit.git.getRef({
                    owner,
                    repo,
                    ref: `heads/${sourceBranch}`,
                });
                sha = ref.data.object.sha;
            }
            const response = await octokit.git.createRef({
                owner,
                repo,
                ref: `refs/heads/${branch_name}`,
                sha: sha,
            });
            return formatTextContent(`✅ Branch "${branch_name}" created successfully!\nSHA: ${response.data.object.sha}`);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Delete Branch
    server.registerTool("delete_branch", {
        title: "Delete Branch",
        description: "Delete a branch from the repository",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            branch_name: z.string().describe("Name of the branch to delete"),
        },
    }, async ({ owner, repo, branch_name }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            await octokit.git.deleteRef({
                owner,
                repo,
                ref: `heads/${branch_name}`,
            });
            return formatTextContent(`✅ Branch "${branch_name}" deleted successfully!`);
        }
        catch (error) {
            return formatError(error);
        }
    });
}
//# sourceMappingURL=branches.js.map