import * as z from "zod";
import { getOctokit } from "../client.js";
import { formatError, formatAuthError, formatJsonContent, formatTextContent } from "../utils/formatters.js";
export function registerReleaseTools(server) {
    // Tool: List Releases
    server.registerTool("list_releases", {
        title: "List Releases",
        description: "List releases in a repository",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            per_page: z.number().optional().describe("Items per page (default: 10)"),
        },
    }, async ({ owner, repo, per_page = 10 }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const response = await octokit.repos.listReleases({
                owner,
                repo,
                per_page,
            });
            const releases = response.data.map((release) => ({
                id: release.id,
                tag_name: release.tag_name,
                name: release.name,
                draft: release.draft,
                prerelease: release.prerelease,
                created_at: release.created_at,
                published_at: release.published_at,
                html_url: release.html_url,
                author: release.author?.login,
            }));
            return formatJsonContent(releases);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Create Release
    server.registerTool("create_release", {
        title: "Create Release",
        description: "Create a new release in the repository",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            tag_name: z
                .string()
                .describe("Tag name for the release (e.g., 'v1.0.0')"),
            name: z.string().optional().describe("Release title"),
            body: z.string().optional().describe("Release description/notes"),
            draft: z.boolean().optional().describe("Create as draft"),
            prerelease: z.boolean().optional().describe("Mark as pre-release"),
            target_commitish: z
                .string()
                .optional()
                .describe("Target branch or commit SHA"),
        },
    }, async ({ owner, repo, tag_name, name, body, draft, prerelease, target_commitish, }) => {
        const octokit = getOctokit();
        if (!octokit) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const response = await octokit.repos.createRelease({
                owner,
                repo,
                tag_name,
                name,
                body,
                draft,
                prerelease,
                target_commitish,
            });
            return formatTextContent(`✅ Release created: ${response.data.name || response.data.tag_name}\nURL: ${response.data.html_url}`);
        }
        catch (error) {
            return formatError(error);
        }
    });
}
//# sourceMappingURL=releases.js.map