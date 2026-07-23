export function formatError(error: any) {
  return {
    content: [
      {
        type: "text" as const,
        text: `Error: ${error?.message || String(error)}`,
      },
    ],
  };
}

export function formatAuthError(
  message: string = "Error: GitHub not authenticated. Please set GITHUB_TOKEN in mcp_config.json"
) {
  return {
    content: [
      {
        type: "text" as const,
        text: message,
      },
    ],
  };
}

export function formatJsonContent(data: any) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export function formatTextContent(text: string) {
  return {
    content: [
      {
        type: "text" as const,
        text,
      },
    ],
  };
}
