import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import { getOctokit, getGraphQL } from "../client.js";
import { formatError, formatAuthError, formatJsonContent, formatTextContent } from "../utils/formatters.js";

export function registerPullRequestTools(server: McpServer) {
  // Tool: List Pull Requests
  server.registerTool(
    "list_pull_requests",
    {
      title: "List Pull Requests",
      description: "List pull requests in a repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        state: z
          .enum(["open", "closed", "all"])
          .optional()
          .describe("PR state filter"),
        per_page: z.number().optional().describe("Items per page (default: 30)"),
      },
    },
    async ({ owner, repo, state = "open", per_page = 30 }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.list({
          owner,
          repo,
          state,
          per_page,
        });

        const prs = response.data.map((pr) => ({
          number: pr.number,
          title: pr.title,
          state: pr.state,
          user: pr.user?.login,
          head: pr.head.ref,
          base: pr.base.ref,
          created_at: pr.created_at,
          updated_at: pr.updated_at,
          html_url: pr.html_url,
          draft: pr.draft,
        }));

        return formatJsonContent(prs);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get Pull Request
  server.registerTool(
    "get_pull_request",
    {
      title: "Get Pull Request",
      description: "Get detailed information about a pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pull_number: z.number().describe("Pull request number"),
      },
    },
    async ({ owner, repo, pull_number }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.get({
          owner,
          repo,
          pull_number,
        });

        const pr = {
          number: response.data.number,
          title: response.data.title,
          body: response.data.body,
          state: response.data.state,
          user: response.data.user?.login,
          head: response.data.head.ref,
          base: response.data.base.ref,
          mergeable: response.data.mergeable,
          merged: response.data.merged,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          html_url: response.data.html_url,
          additions: response.data.additions,
          deletions: response.data.deletions,
          changed_files: response.data.changed_files,
        };

        return formatJsonContent(pr);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Create Pull Request
  server.registerTool(
    "create_pull_request",
    {
      title: "Create Pull Request",
      description: "Create a new pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        title: z.string().describe("PR title"),
        head: z.string().describe("Head branch (the branch with changes)"),
        base: z.string().describe("Base branch (the branch to merge into)"),
        body: z.string().optional().describe("PR description"),
      },
    },
    async ({ owner, repo, title, head, base, body }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.create({
          owner,
          repo,
          title,
          head,
          base,
          body,
        });

        return formatTextContent(
          `✅ PR #${response.data.number} created: ${response.data.html_url}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Update Pull Request
  server.registerTool(
    "update_pull_request",
    {
      title: "Update Pull Request",
      description:
        "Update an existing pull request (title, body, state, base branch)",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pull_number: z.number().describe("Pull request number"),
        title: z.string().optional().describe("New PR title"),
        body: z.string().optional().describe("New PR description"),
        state: z.enum(["open", "closed"]).optional().describe("PR state"),
        base: z.string().optional().describe("Base branch to change to"),
        maintainer_can_modify: z
          .boolean()
          .optional()
          .describe("Allow maintainers to modify"),
      },
    },
    async ({
      owner,
      repo,
      pull_number,
      title,
      body,
      state,
      base,
      maintainer_can_modify,
    }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.update({
          owner,
          repo,
          pull_number,
          title,
          body,
          state,
          base,
          maintainer_can_modify,
        });

        return formatTextContent(
          `✅ PR #${response.data.number} updated successfully!\n${JSON.stringify(
            {
              number: response.data.number,
              title: response.data.title,
              state: response.data.state,
              html_url: response.data.html_url,
            },
            null,
            2
          )}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Request Reviewers for Pull Request
  server.registerTool(
    "request_reviewers",
    {
      title: "Request Reviewers",
      description: "Request reviewers for a pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pull_number: z.number().describe("Pull request number"),
        reviewers: z
          .array(z.string())
          .optional()
          .describe("List of reviewer usernames"),
        team_reviewers: z
          .array(z.string())
          .optional()
          .describe("List of team slugs to request review from"),
      },
    },
    async ({ owner, repo, pull_number, reviewers, team_reviewers }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.requestReviewers({
          owner,
          repo,
          pull_number,
          reviewers,
          team_reviewers,
        });

        const requestedReviewers =
          response.data.requested_reviewers?.map((r: any) => r.login) || [];
        const requestedTeams =
          response.data.requested_teams?.map((t: any) => t.slug) || [];

        return formatTextContent(
          `✅ Reviewers requested for PR #${pull_number}!\nReviewers: ${
            requestedReviewers.join(", ") || "None"
          }\nTeams: ${requestedTeams.join(", ") || "None"}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Merge Pull Request
  server.registerTool(
    "merge_pull_request",
    {
      title: "Merge Pull Request",
      description: "Merge a pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pull_number: z.number().describe("Pull request number"),
        commit_title: z
          .string()
          .optional()
          .describe("Title for the merge commit"),
        commit_message: z
          .string()
          .optional()
          .describe("Extra detail for merge commit message"),
        merge_method: z
          .enum(["merge", "squash", "rebase"])
          .optional()
          .describe("Merge method (default: merge)"),
      },
    },
    async ({
      owner,
      repo,
      pull_number,
      commit_title,
      commit_message,
      merge_method = "merge",
    }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.merge({
          owner,
          repo,
          pull_number,
          commit_title,
          commit_message,
          merge_method,
        });

        return formatTextContent(
          `✅ PR #${pull_number} merged successfully!\nSHA: ${response.data.sha}\nMessage: ${response.data.message}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get PR Files
  server.registerTool(
    "get_pr_files",
    {
      title: "Get PR Files",
      description: "Get the list of files changed in a pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pull_number: z.number().describe("Pull request number"),
      },
    },
    async ({ owner, repo, pull_number }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.listFiles({
          owner,
          repo,
          pull_number,
          per_page: 100,
        });

        const files = response.data.map((file) => ({
          filename: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
        }));

        const summary = {
          total_files: files.length,
          total_additions: files.reduce((sum, f) => sum + f.additions, 0),
          total_deletions: files.reduce((sum, f) => sum + f.deletions, 0),
          files,
        };

        return formatJsonContent(summary);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get PR Reviews
  server.registerTool(
    "get_pr_reviews",
    {
      title: "Get PR Reviews",
      description: "Get the reviews on a pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pull_number: z.number().describe("Pull request number"),
      },
    },
    async ({ owner, repo, pull_number }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.pulls.listReviews({
          owner,
          repo,
          pull_number,
        });

        const reviews = response.data.map((review) => ({
          id: review.id,
          user: review.user?.login,
          state: review.state,
          body: review.body,
          submitted_at: review.submitted_at,
          html_url: review.html_url,
        }));

        const summary = {
          total_reviews: reviews.length,
          approved: reviews.filter((r) => r.state === "APPROVED").length,
          changes_requested: reviews.filter(
            (r) => r.state === "CHANGES_REQUESTED"
          ).length,
          commented: reviews.filter((r) => r.state === "COMMENTED").length,
          reviews,
        };

        return formatJsonContent(summary);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get PR Commits
  server.registerTool(
    "get_pr_commits",
    {
      title: "Get PR Commits",
      description:
        "Get all commits from a specific Pull Request. Returns commit SHA, message, author, and date.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        pull_number: z.number().describe("Pull request number"),
      },
    },
    async ({ owner, repo, pull_number }) => {
      const graphqlWithAuth = getGraphQL();
      if (!graphqlWithAuth) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const query = `
          query($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
              pullRequest(number: $number) {
                number
                title
                state
                merged
                mergedAt
                headRefName
                baseRefName
                commits(first: 250) {
                  totalCount
                  nodes {
                    commit {
                      oid
                      abbreviatedOid
                      message
                      messageHeadline
                      author {
                        name
                        email
                        date
                        user {
                          login
                        }
                      }
                      additions
                      deletions
                      changedFilesIfAvailable
                      url
                    }
                  }
                }
              }
            }
          }
        `;

        const result: any = await graphqlWithAuth(query, {
          owner,
          repo,
          number: pull_number,
        });

        const pr = result.repository.pullRequest;

        const commits = pr.commits.nodes.map((node: any) => ({
          sha: node.commit.oid,
          short_sha: node.commit.abbreviatedOid,
          message: node.commit.message,
          message_headline: node.commit.messageHeadline,
          author: {
            name: node.commit.author?.name,
            email: node.commit.author?.email,
            username: node.commit.author?.user?.login,
            date: node.commit.author?.date,
          },
          additions: node.commit.additions,
          deletions: node.commit.deletions,
          changed_files: node.commit.changedFilesIfAvailable,
          url: node.commit.url,
        }));

        return formatJsonContent({
          pull_request: {
            number: pr.number,
            title: pr.title,
            state: pr.state,
            merged: pr.merged,
            merged_at: pr.mergedAt,
            head_branch: pr.headRefName,
            base_branch: pr.baseRefName,
          },
          commits_count: pr.commits.totalCount,
          commits: commits,
        });
      } catch (error: any) {
        return formatError(error);
      }
    }
  );
}
