import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import { getOctokit } from "../client.js";
import { formatError, formatAuthError, formatTextContent } from "../utils/formatters.js";

export function registerLabelTools(server: McpServer) {
  // Tool: Add Labels to Issue/PR
  server.registerTool(
    "add_labels",
    {
      title: "Add Labels",
      description: "Add labels to an issue or pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue or PR number"),
        labels: z.array(z.string()).describe("Labels to add"),
      },
    },
    async ({ owner, repo, issue_number, labels }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.issues.addLabels({
          owner,
          repo,
          issue_number,
          labels,
        });

        const addedLabels = response.data.map((l) => l.name);
        return formatTextContent(
          `✅ Labels added to #${issue_number}: ${addedLabels.join(", ")}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Remove Labels from Issue/PR
  server.registerTool(
    "remove_labels",
    {
      title: "Remove Labels",
      description: "Remove a label from an issue or pull request",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        issue_number: z.number().describe("Issue or PR number"),
        name: z.string().describe("Label name to remove"),
      },
    },
    async ({ owner, repo, issue_number, name }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        await octokit.issues.removeLabel({
          owner,
          repo,
          issue_number,
          name,
        });

        return formatTextContent(
          `✅ Label "${name}" removed from #${issue_number}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );
}
