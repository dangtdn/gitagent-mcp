import { Octokit } from "@octokit/rest";
import { graphql } from "@octokit/graphql";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

let octokit: Octokit | null = null;
let graphqlWithAuth: typeof graphql | null = null;

function initializeGitHub(token: string) {
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

export function getOctokit(): Octokit | null {
  return octokit;
}

export function getGraphQL(): typeof graphql | null {
  return graphqlWithAuth;
}
