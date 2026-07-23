import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import { getOctokit } from "../client.js";
import { formatError, formatAuthError, formatJsonContent, formatTextContent } from "../utils/formatters.js";

export function registerWorkflowTools(server: McpServer) {
  // Tool: List Workflows (GitHub Actions)
  server.registerTool(
    "list_workflows",
    {
      title: "List Workflows",
      description: "List GitHub Actions workflows in a repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
      },
    },
    async ({ owner, repo }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.actions.listRepoWorkflows({
          owner,
          repo,
        });

        const workflows = response.data.workflows.map((wf) => ({
          id: wf.id,
          name: wf.name,
          path: wf.path,
          state: wf.state,
          created_at: wf.created_at,
          updated_at: wf.updated_at,
          html_url: wf.html_url,
        }));

        return formatJsonContent(workflows);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Trigger Workflow (GitHub Actions)
  server.registerTool(
    "trigger_workflow",
    {
      title: "Trigger Workflow",
      description: "Trigger a GitHub Actions workflow run",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        workflow_id: z
          .union([z.string(), z.number()])
          .describe("Workflow ID or filename (e.g., 'deploy.yml')"),
        ref: z.string().describe("Branch or tag to run the workflow on"),
        inputs: z
          .record(z.string())
          .optional()
          .describe("Workflow inputs as key-value pairs"),
      },
    },
    async ({ owner, repo, workflow_id, ref, inputs }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        await octokit.actions.createWorkflowDispatch({
          owner,
          repo,
          workflow_id,
          ref,
          inputs,
        });

        return formatTextContent(
          `✅ Workflow triggered successfully!\nWorkflow: ${workflow_id}\nRef: ${ref}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );
}
