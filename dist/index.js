#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";
// Create MCP Server
const server = new McpServer({
    name: "gitagent-mcp-server",
    version: "1.0.0",
});
// Register all tools, resources, and prompts
registerAllTools(server);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    // Log errors to stderr, not stdout (stdout is for MCP protocol)
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map