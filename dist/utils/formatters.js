export function formatError(error) {
    return {
        content: [
            {
                type: "text",
                text: `Error: ${error?.message || String(error)}`,
            },
        ],
    };
}
export function formatAuthError(message = "Error: GitHub not authenticated. Please set GITHUB_TOKEN in mcp_config.json") {
    return {
        content: [
            {
                type: "text",
                text: message,
            },
        ],
    };
}
export function formatJsonContent(data) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}
export function formatTextContent(text) {
    return {
        content: [
            {
                type: "text",
                text,
            },
        ],
    };
}
//# sourceMappingURL=formatters.js.map