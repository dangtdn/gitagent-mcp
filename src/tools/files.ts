import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import { getOctokit } from "../client.js";
import { formatError, formatAuthError, formatJsonContent, formatTextContent } from "../utils/formatters.js";

export function registerFileTools(server: McpServer) {
  // Tool: Get File Content
  server.registerTool(
    "get_file_content",
    {
      title: "Get File Content",
      description: "Get content of a file from repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        path: z.string().describe("File path"),
        ref: z
          .string()
          .optional()
          .describe("Git reference (branch, tag, commit SHA)"),
      },
    },
    async ({ owner, repo, path, ref }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref,
        });

        if (Array.isArray(response.data)) {
          // Directory listing
          const items = response.data.map((item) => ({
            name: item.name,
            type: item.type,
            path: item.path,
          }));
          return formatJsonContent(items);
        }

        if ("content" in response.data) {
          const content = Buffer.from(response.data.content, "base64").toString(
            "utf-8"
          );
          return formatTextContent(content);
        }

        return formatTextContent("Unable to read file content");
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Search Code in Repository
  server.registerTool(
    "search_code",
    {
      title: "Search Code",
      description: "Search for code in a repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        query: z.string().describe("Search query"),
      },
    },
    async ({ owner, repo, query }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.search.code({
          q: `${query} repo:${owner}/${repo}`,
          per_page: 20,
        });

        const results = response.data.items.map((item) => ({
          name: item.name,
          path: item.path,
          html_url: item.html_url,
        }));

        return formatTextContent(
          `Found ${response.data.total_count} results:\n${JSON.stringify(
            results,
            null,
            2
          )}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Create File
  server.registerTool(
    "create_file",
    {
      title: "Create File",
      description: "Create a new file in the repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        path: z.string().describe("File path (e.g., 'src/new-file.ts')"),
        content: z.string().describe("File content"),
        message: z.string().describe("Commit message"),
        branch: z
          .string()
          .optional()
          .describe("Branch name (default: default branch)"),
      },
    },
    async ({ owner, repo, path, content, message, branch }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        const response = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content: Buffer.from(content).toString("base64"),
          branch,
        });

        return formatTextContent(
          `✅ File created: ${path}\nCommit: ${response.data.commit.sha}\nURL: ${response.data.content?.html_url}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Update File
  server.registerTool(
    "update_file",
    {
      title: "Update File",
      description: "Update an existing file in the repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        path: z.string().describe("File path"),
        content: z.string().describe("New file content"),
        message: z.string().describe("Commit message"),
        branch: z.string().optional().describe("Branch name"),
      },
    },
    async ({ owner, repo, path, content, message, branch }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        // Get current file to get SHA
        const currentFile = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });

        if (Array.isArray(currentFile.data) || !("sha" in currentFile.data)) {
          return formatTextContent("Error: Path is a directory, not a file");
        }

        const response = await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path,
          message,
          content: Buffer.from(content).toString("base64"),
          sha: currentFile.data.sha,
          branch,
        });

        return formatTextContent(
          `✅ File updated: ${path}\nCommit: ${response.data.commit.sha}`
        );
      } catch (error: any) {
        return formatError(error);
      }
    }
  );

  // Tool: Delete File
  server.registerTool(
    "delete_file",
    {
      title: "Delete File",
      description: "Delete a file from the repository",
      inputSchema: {
        owner: z.string().describe("Repository owner"),
        repo: z.string().describe("Repository name"),
        path: z.string().describe("File path to delete"),
        message: z.string().describe("Commit message"),
        branch: z.string().optional().describe("Branch name"),
      },
    },
    async ({ owner, repo, path, message, branch }) => {
      const octokit = getOctokit();
      if (!octokit) {
        return formatAuthError("Error: GitHub not authenticated");
      }
      try {
        // Get current file to get SHA
        const currentFile = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });

        if (Array.isArray(currentFile.data) || !("sha" in currentFile.data)) {
          return formatTextContent("Error: Path is a directory, not a file");
        }

        await octokit.repos.deleteFile({
          owner,
          repo,
          path,
          message,
          sha: currentFile.data.sha,
          branch,
        });

        return formatTextContent(`✅ File deleted: ${path}`);
      } catch (error: any) {
        return formatError(error);
      }
    }
  );
}
