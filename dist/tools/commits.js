import * as z from "zod";
import { getOctokit } from "../client.js";
import { formatError, formatAuthError, formatJsonContent } from "../utils/formatters.js";
export function registerCommitTools(server) {
    // Tool: List Commits
    server.registerTool("list_commits", {
        title: "List Commits",
        description: "List commits in a repository",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            sha: z.string().optional().describe("Branch name or commit SHA"),
            per_page: z.number().optional().describe("Items per page (default: 20)"),
        },
    }, async ({ owner, repo, sha, per_page = 20 }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const response = await octokit.repos.listCommits({
                owner,
                repo,
                sha,
                per_page,
            });
            const commits = response.data.map((commit) => ({
                sha: commit.sha.substring(0, 7),
                message: commit.commit.message.split("\n")[0],
                author: commit.commit.author?.name,
                date: commit.commit.author?.date,
                html_url: commit.html_url,
            }));
            return formatJsonContent(commits);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Get Diff (Compare commits/branches)
    server.registerTool("get_diff", {
        title: "Get Diff",
        description: "Compare two commits, branches, or tags and get the diff",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            base: z
                .string()
                .describe("Base commit/branch/tag (e.g., 'main', 'v1.0.0', 'abc123')"),
            head: z.string().describe("Head commit/branch/tag to compare"),
            include_files: z
                .boolean()
                .optional()
                .describe("Include file diffs (default: true)"),
        },
    }, async ({ owner, repo, base, head, include_files = true }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const response = await octokit.repos.compareCommitsWithBasehead({
                owner,
                repo,
                basehead: `${base}...${head}`,
            });
            const comparison = {
                status: response.data.status,
                ahead_by: response.data.ahead_by,
                behind_by: response.data.behind_by,
                total_commits: response.data.total_commits,
                html_url: response.data.html_url,
                commits: response.data.commits.slice(0, 10).map((c) => ({
                    sha: c.sha.substring(0, 7),
                    message: c.commit.message.split("\n")[0],
                    author: c.commit.author?.name,
                    date: c.commit.author?.date,
                })),
                files_summary: {
                    total: response.data.files?.length || 0,
                    additions: response.data.files?.reduce((sum, f) => sum + f.additions, 0) || 0,
                    deletions: response.data.files?.reduce((sum, f) => sum + f.deletions, 0) || 0,
                },
            };
            // Include file details if requested
            if (include_files && response.data.files) {
                comparison.files = response.data.files
                    .slice(0, 50)
                    .map((f) => ({
                    filename: f.filename,
                    status: f.status,
                    additions: f.additions,
                    deletions: f.deletions,
                    changes: f.changes,
                    patch: f.patch?.substring(0, 500) +
                        (f.patch && f.patch.length > 500 ? "\n...(truncated)" : ""),
                }));
            }
            return formatJsonContent(comparison);
        }
        catch (error) {
            return formatError(error);
        }
    });
}
//# sourceMappingURL=commits.js.map