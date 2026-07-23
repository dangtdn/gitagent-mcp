import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
let octokit = null;
let graphqlWithAuth = null;
function initializeGitHub(token) {
    if (!token) {
        // Don't log to stdout - it interferes with MCP stdio protocol
        return;
    }
    octokit = new Octokit({ auth: token });
    graphqlWithAuth = graphql.defaults({
        headers: { authorization: `token ${token}` },
    });
}
// Initialize GitHub on startup
initializeGitHub(GITHUB_TOKEN);
export function getOctokit() {
    return octokit;
}
export function getGraphQL() {
    return graphqlWithAuth;
}
//# sourceMappingURL=client.js.map