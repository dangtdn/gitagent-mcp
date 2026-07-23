import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import { getOctokit, getGraphQL } from "../client.js";
import { formatError, formatAuthError, formatJsonContent, formatTextContent } from "../utils/formatters.js";

export function registerIssueTools(server: McpServer) {
  // Tool: List Issues
  server.registerTool(
    "list_issues",
    {
      title: "List Issues",
      description: "List issues in a repository with optional filters",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        state: z
          .enum(["open", "closed", "all"])
          .optional()
          .describe("Issue state filter"),
        labels: z.string().optional().describe("Comma-separated label names"),
        assignee: z
          .string()
          .optional()
          .describe(
            "Filter by assignee username. Use '*' for any assignee, 'none' for no assignee"
          ),
        per_page: z.number().optional().describe("Items per page (default: 30)"),
      },
    },
    async ({ owner, repo, state = "open", labels, assignee, per_page = 30 }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.listForRepo({
          owner,
          repo,
          state,
          labels,
          assignee,
          per_page,
        });

        const issues = response.data
          .filter((issue) => !issue.pull_request)
          .map((issue) => ({
            number: issue.number,
            title: issue.title,
            state: issue.state,
            user: issue.user?.login,
            assignees: issue.assignees?.map((a) => a.login) || [],
            labels: issue.labels.map((l: any) =>
              typeof l === "string" ? l : l.name
            ),
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            html_url: issue.html_url,
          }));

        return formatJsonContent(issues);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get Issue Details
  server.registerTool(
    "get_issue",
    {
      title: "Get Issue",
      description: "Get detailed information about a specific issue",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue number"),
      },
    },
    async ({ owner, repo, issue_number }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.get({
          owner,
          repo,
          issue_number,
        });

        const issue = {
          number: response.data.number,
          title: response.data.title,
          body: response.data.body,
          state: response.data.state,
          user: response.data.user?.login,
          labels: response.data.labels.map((l: any) =>
            typeof l === "string" ? l : l.name
          ),
          assignees: response.data.assignees?.map((a) => a.login),
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          html_url: response.data.html_url,
          comments: response.data.comments,
        };

        return formatJsonContent(issue);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Create Issue
  server.registerTool(
    "create_issue",
    {
      title: "Create Issue",
      description: "Create a new issue in a repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        title: z.string().describe("Issue title"),
        body: z.string().optional().describe("Issue body/description"),
        labels: z.array(z.string()).optional().describe("Labels to apply"),
        assignees: z
          .array(z.string())
          .optional()
          .describe("Usernames to assign"),
      },
    },
    async ({ owner, repo, title, body, labels, assignees }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.create({
          owner,
          repo,
          title,
          body,
          labels,
          assignees,
        });

        return formatTextContent(
          `✅ Issue #${response.data.number} created: ${response.data.html_url}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Add Issue Comment
  server.registerTool(
    "add_issue_comment",
    {
      title: "Add Issue Comment",
      description: "Add a comment to an issue",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue number"),
        body: z.string().describe("Comment text"),
      },
    },
    async ({ owner, repo, issue_number, body }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.createComment({
          owner,
          repo,
          issue_number,
          body,
        });

        return formatTextContent(`✅ Comment added: ${response.data.html_url}`);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: List Issue Comments
  server.registerTool(
    "list_issue_comments",
    {
      title: "List Issue Comments",
      description:
        "List all comments on an issue. Returns comments with author, body, and timestamps.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue number"),
        per_page: z.number().optional().describe("Items per page (default: 30)"),
        page: z.number().optional().describe("Page number (default: 1)"),
      },
    },
    async ({ owner, repo, issue_number, per_page = 30, page = 1 }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.listComments({
          owner,
          repo,
          issue_number,
          per_page,
          page,
        });

        const comments = response.data.map((comment) => ({
          id: comment.id,
          user: comment.user?.login,
          body: comment.body,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          html_url: comment.html_url,
        }));

        return formatJsonContent({
          total_comments: comments.length,
          page,
          per_page,
          comments,
        });
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get Issue Comment
  server.registerTool(
    "get_issue_comment",
    {
      title: "Get Issue Comment",
      description: "Get a specific comment on an issue by its comment ID",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        comment_id: z.number().describe("Comment ID"),
      },
    },
    async ({ owner, repo, comment_id }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.getComment({
          owner,
          repo,
          comment_id,
        });

        const comment = {
          id: response.data.id,
          user: response.data.user?.login,
          body: response.data.body,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          html_url: response.data.html_url,
          author_association: response.data.author_association,
        };

        return formatJsonContent(comment);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Update Issue
  server.registerTool(
    "update_issue",
    {
      title: "Update Issue",
      description:
        "Update an existing issue (title, body, state, labels, assignees)",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue number"),
        title: z.string().optional().describe("New issue title"),
        body: z.string().optional().describe("New issue body"),
        state: z.enum(["open", "closed"]).optional().describe("Issue state"),
        labels: z.array(z.string()).optional().describe("Labels to set"),
        assignees: z.array(z.string()).optional().describe("Assignees to set"),
      },
    },
    async ({
      owner,
      repo,
      issue_number,
      title,
      body,
      state,
      labels,
      assignees,
    }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.update({
          owner,
          repo,
          issue_number,
          title,
          body,
          state,
          labels,
          assignees,
        });

        return formatTextContent(
          `✅ Issue #${response.data.number} updated successfully!\n${JSON.stringify(
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

  // Tool: Close Issue
  server.registerTool(
    "close_issue",
    {
      title: "Close Issue",
      description: "Close an issue",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue number"),
        state_reason: z
          .enum(["completed", "not_planned"])
          .optional()
          .describe("Reason for closing"),
      },
    },
    async ({ owner, repo, issue_number, state_reason }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.update({
          owner,
          repo,
          issue_number,
          state: "closed",
          state_reason,
        });

        return formatTextContent(
          `✅ Issue #${response.data.number} closed successfully!`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: List Issues with Project Fields (using GraphQL)
  server.registerTool(
    "list_issues_with_project_fields",
    {
      title: "List Issues with Project Fields",
      description:
        "List issues with GitHub Project v2 field values (e.g., Status, Priority) using GraphQL. Requires assignee filter.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        assignee: z.string().describe("Filter by assignee username"),
        projectStatus: z
          .string()
          .optional()
          .describe(
            "Filter by project status field value (e.g., 'In Progress', 'Done')"
          ),
        first: z
          .number()
          .optional()
          .describe("Number of issues to fetch (default: 50)"),
      },
    },
    async ({ owner, repo, assignee, projectStatus, first = 50 }) => {
      const graphqlWithAuth = getGraphQL();
      if (!graphqlWithAuth) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const query = `
          query($owner: String!, $repo: String!, $first: Int!) {
            repository(owner: $owner, name: $repo) {
              issues(first: $first, states: [OPEN], orderBy: {field: UPDATED_AT, direction: DESC}) {
                nodes {
                  number
                  title
                  state
                  url
                  createdAt
                  updatedAt
                  author {
                    login
                  }
                  assignees(first: 10) {
                    nodes {
                      login
                    }
                  }
                  labels(first: 10) {
                    nodes {
                      name
                    }
                  }
                  projectItems(first: 5) {
                    nodes {
                      project {
                        title
                      }
                      fieldValues(first: 10) {
                        nodes {
                          ... on ProjectV2ItemFieldSingleSelectValue {
                            name
                            field {
                              ... on ProjectV2SingleSelectField {
                                name
                              }
                            }
                          }
                          ... on ProjectV2ItemFieldTextValue {
                            text
                            field {
                              ... on ProjectV2Field {
                                name
                              }
                            }
                          }
                        }
                      }
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
          first,
        });

        let issues = result.repository.issues.nodes.map((issue: any) => {
          const projectFields: Record<string, any> = {};
          issue.projectItems?.nodes?.forEach((item: any) => {
            const projectName = item.project?.title || "Unknown Project";
            projectFields[projectName] = {};
            item.fieldValues?.nodes?.forEach((field: any) => {
              if (field.field?.name && (field.name || field.text)) {
                projectFields[projectName][field.field.name] =
                  field.name || field.text;
              }
            });
          });

          return {
            number: issue.number,
            title: issue.title,
            state: issue.state,
            author: issue.author?.login,
            assignees: issue.assignees?.nodes?.map((a: any) => a.login) || [],
            labels: issue.labels?.nodes?.map((l: any) => l.name) || [],
            projectFields,
            created_at: issue.createdAt,
            updated_at: issue.updatedAt,
            html_url: issue.url,
          };
        });

        if (assignee) {
          issues = issues.filter((issue: any) =>
            issue.assignees.some(
              (a: string) => a.toLowerCase() === assignee.toLowerCase()
            )
          );
        }

        if (projectStatus) {
          issues = issues.filter((issue: any) => {
            for (const projectName in issue.projectFields) {
              const fields = issue.projectFields[projectName];
              if (
                fields.Status &&
                fields.Status.toLowerCase() === projectStatus.toLowerCase()
              ) {
                return true;
              }
            }
            return false;
          });
        }

        return formatJsonContent({
          total: issues.length,
          filter: { assignee, projectStatus },
          issues,
        });
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get Issue Linked PRs (from Development section)
  server.registerTool(
    "get_issue_linked_prs",
    {
      title: "Get Issue Linked PRs",
      description:
        "Get all Pull Requests linked to an issue in the Development section. Returns PRs that reference or are connected to this issue.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue number"),
      },
    },
    async ({ owner, repo, issue_number }) => {
      const graphqlWithAuth = getGraphQL();
      if (!graphqlWithAuth) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const query = `
          query($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
              issue(number: $number) {
                number
                title
                state
                timelineItems(first: 100, itemTypes: [CONNECTED_EVENT, CROSS_REFERENCED_EVENT, CLOSED_EVENT]) {
                  nodes {
                    __typename
                    ... on ConnectedEvent {
                      subject {
                        ... on PullRequest {
                          number
                          title
                          state
                          url
                          author { login }
                          createdAt
                          updatedAt
                          merged
                          mergedAt
                          headRefName
                          baseRefName
                        }
                      }
                    }
                    ... on CrossReferencedEvent {
                      source {
                        ... on PullRequest {
                          number
                          title
                          state
                          url
                          author { login }
                          createdAt
                          updatedAt
                          merged
                          mergedAt
                          headRefName
                          baseRefName
                        }
                      }
                    }
                    ... on ClosedEvent {
                      closer {
                        ... on PullRequest {
                          number
                          title
                          state
                          url
                          author { login }
                          createdAt
                          updatedAt
                          merged
                          mergedAt
                          headRefName
                          baseRefName
                        }
                      }
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
          number: issue_number,
        });

        const prMap = new Map<number, any>();

        result.repository.issue.timelineItems.nodes.forEach((node: any) => {
          let pr = null;

          if (node.__typename === "ConnectedEvent" && node.subject?.number) {
            pr = node.subject;
          } else if (
            node.__typename === "CrossReferencedEvent" &&
            node.source?.number
          ) {
            pr = node.source;
          } else if (node.__typename === "ClosedEvent" && node.closer?.number) {
            pr = node.closer;
          }

          if (pr && pr.number) {
            prMap.set(pr.number, {
              number: pr.number,
              title: pr.title,
              state: pr.state,
              url: pr.url,
              author: pr.author?.login,
              created_at: pr.createdAt,
              updated_at: pr.updatedAt,
              merged: pr.merged,
              merged_at: pr.mergedAt,
              head_branch: pr.headRefName,
              base_branch: pr.baseRefName,
            });
          }
        });

        const linkedPRs = Array.from(prMap.values());

        return formatJsonContent({
          issue: {
            number: result.repository.issue.number,
            title: result.repository.issue.title,
            state: result.repository.issue.state,
          },
          linked_prs_count: linkedPRs.length,
          linked_prs: linkedPRs,
        });
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Get Issue Development Info (Combined - Linked PRs with their Commits)
  server.registerTool(
    "get_issue_development_info",
    {
      title: "Get Issue Development Info",
      description:
        "Get comprehensive development information for an issue including all linked PRs and their commits. This is useful for tracking work progress and time analysis.",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue number"),
      },
    },
    async ({ owner, repo, issue_number }) => {
      const graphqlWithAuth = getGraphQL();
      if (!graphqlWithAuth) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const query = `
          query($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
              issue(number: $number) {
                number
                title
                state
                createdAt
                updatedAt
                author { login }
                assignees(first: 10) { nodes { login } }
                labels(first: 20) { nodes { name color } }
                timelineItems(first: 100, itemTypes: [CONNECTED_EVENT, CROSS_REFERENCED_EVENT, CLOSED_EVENT]) {
                  nodes {
                    __typename
                    ... on ConnectedEvent {
                      createdAt
                      subject {
                        ... on PullRequest {
                          number
                          title
                          state
                          url
                          author { login }
                          createdAt
                          updatedAt
                          merged
                          mergedAt
                          headRefName
                          baseRefName
                          commits(first: 100) {
                            totalCount
                            nodes {
                              commit {
                                abbreviatedOid
                                messageHeadline
                                author {
                                  name
                                  date
                                  user { login }
                                }
                                additions
                                deletions
                              }
                            }
                          }
                        }
                      }
                    }
                    ... on CrossReferencedEvent {
                      createdAt
                      source {
                        ... on PullRequest {
                          number
                          title
                          state
                          url
                          author { login }
                          createdAt
                          updatedAt
                          merged
                          mergedAt
                          headRefName
                          baseRefName
                          commits(first: 100) {
                            totalCount
                            nodes {
                              commit {
                                abbreviatedOid
                                messageHeadline
                                author {
                                  name
                                  date
                                  user { login }
                                }
                                additions
                                deletions
                              }
                            }
                          }
                        }
                      }
                    }
                    ... on ClosedEvent {
                      createdAt
                      closer {
                        ... on PullRequest {
                          number
                          title
                          state
                          url
                          author { login }
                          createdAt
                          updatedAt
                          merged
                          mergedAt
                          headRefName
                          baseRefName
                          commits(first: 100) {
                            totalCount
                            nodes {
                              commit {
                                abbreviatedOid
                                messageHeadline
                                author {
                                  name
                                  date
                                  user { login }
                                }
                                additions
                                deletions
                              }
                            }
                          }
                        }
                      }
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
          number: issue_number,
        });

        const issue = result.repository.issue;
        const prMap = new Map<number, any>();

        issue.timelineItems.nodes.forEach((node: any) => {
          let pr = null;
          let linkedAt = node.createdAt;

          if (node.__typename === "ConnectedEvent" && node.subject?.number) {
            pr = node.subject;
          } else if (
            node.__typename === "CrossReferencedEvent" &&
            node.source?.number
          ) {
            pr = node.source;
          } else if (node.__typename === "ClosedEvent" && node.closer?.number) {
            pr = node.closer;
          }

          if (pr && pr.number && !prMap.has(pr.number)) {
            const commits =
              pr.commits?.nodes?.map((n: any) => ({
                sha: n.commit.abbreviatedOid,
                message: n.commit.messageHeadline,
                author: n.commit.author?.user?.login || n.commit.author?.name,
                date: n.commit.author?.date,
                additions: n.commit.additions,
                deletions: n.commit.deletions,
              })) || [];

            prMap.set(pr.number, {
              number: pr.number,
              title: pr.title,
              state: pr.state,
              url: pr.url,
              author: pr.author?.login,
              created_at: pr.createdAt,
              merged: pr.merged,
              merged_at: pr.mergedAt,
              head_branch: pr.headRefName,
              base_branch: pr.baseRefName,
              linked_at: linkedAt,
              commits_count: pr.commits?.totalCount || 0,
              commits: commits,
            });
          }
        });

        const linkedPRs = Array.from(prMap.values());

        const totalCommits = linkedPRs.reduce(
          (sum, pr) => sum + pr.commits_count,
          0
        );
        const totalAdditions = linkedPRs.reduce(
          (sum, pr) =>
            sum +
            pr.commits.reduce((s: number, c: any) => s + (c.additions || 0), 0),
          0
        );
        const totalDeletions = linkedPRs.reduce(
          (sum, pr) =>
            sum +
            pr.commits.reduce((s: number, c: any) => s + (c.deletions || 0), 0),
          0
        );

        return formatJsonContent({
          issue: {
            number: issue.number,
            title: issue.title,
            state: issue.state,
            author: issue.author?.login,
            assignees: issue.assignees.nodes.map((a: any) => a.login),
            labels: issue.labels.nodes.map((l: any) => l.name),
            created_at: issue.createdAt,
            updated_at: issue.updatedAt,
          },
          summary: {
            linked_prs_count: linkedPRs.length,
            total_commits: totalCommits,
            total_additions: totalAdditions,
            total_deletions: totalDeletions,
          },
          linked_prs: linkedPRs,
        });
      } catch (error: any) {
        return formatError(error);
      }
    }
  );
}
