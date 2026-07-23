import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";

export function registerPrompts(server: McpServer) {
  server.prompt(
    "analyze-issue",
    "Analyze a GitHub issue and suggest solutions",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      issue_number: z.string().describe("Issue number"),
    },
    async ({ owner, repo, issue_number }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please analyze issue #${issue_number} in ${owner}/${repo} and suggest potential solutions or next steps.`,
          },
        },
      ],
    })
  );

  server.prompt(
    "review-pr",
    "Review a pull request and provide feedback",
    {
      owner: z.string().describe("Repository owner"),
      repo: z.string().describe("Repository name"),
      pr_number: z.string().describe("Pull request number"),
    },
    async ({ owner, repo, pr_number }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review pull request #${pr_number} in ${owner}/${repo}. Analyze the changes and provide constructive feedback.`,
          },
        },
      ],
    })
  );
}
