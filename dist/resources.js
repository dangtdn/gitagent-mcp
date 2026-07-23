import { getOctokit } from "./client.js";
export function registerResources(server) {
    // Resource: Current GitHub User
    server.resource("github-user", "github://user", async (uri) => {
        const octokit = getOctokit();
        if (!octokit) {
            return {
                contents: [
                    { uri: uri.href, text: "Not authenticated", mimeType: "text/plain" },
                ],
            };
        }
        try {
            const { data } = await octokit.users.getAuthenticated();
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: JSON.stringify({
                            login: data.login,
                            name: data.name,
                            avatar_url: data.avatar_url,
                            public_repos: data.public_repos,
                            followers: data.followers,
                            following: data.following,
                        }, null, 2),
                        mimeType: "application/json",
                    },
                ],
            };
        }
        catch (error) {
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: `Error: ${error.message}`,
                        mimeType: "text/plain",
                    },
                ],
            };
        }
    });
}
//# sourceMappingURL=resources.js.map