# gitagent-mcp-server

🚀 **MCP Server for GitAgent Manager** - Connect your GitHub repositories to AI editors like Cursor, VS Code, Claude Desktop, Antigravity, and more.

[![npm version](https://badge.fury.io/js/gitagent-mcp-server.svg)](https://www.npmjs.com/package/gitagent-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Why GitAgent MCP?

Compared to the official GitHub MCP server, **GitAgent MCP** is a native Node.js-based, feature-rich alternative designed specifically for advanced development workflows and automated project management.

### 🌟 Key Highlights & Benefits

* 🚀 **Massive Toolset (45 Tools)**: Covers everything from repository management, issues, PRs, commits, branches, releases, GitHub Actions workflows, to Projects v2. *(Official server only has 26 tools)*.
* 📦 **No Docker Required**: Runs natively on Windows, macOS, or Linux using standard Node.js/NPM. Perfect for lightweight IDE environments where running Docker is not preferred or possible.
* 🗂️ **GitHub Projects v2 Integration**: The only MCP server that provides full read/write access to GitHub Projects v2 custom fields (Status, Priority, Size, Estimate, Dates, etc.).
* ⚙️ **CI/CD & Release Automation**: Directly list workflows, trigger GitHub Actions pipelines, and manage releases through AI commands.
* ⏱️ **Development Analytics**: Retrieve commits from PRs and linked development info to analyze issue resolution times and developer activity.

### 👥 Who is it for?

* **Developers**: Who want AI coding assistants (like Cursor, VS Code, Claude Desktop, Antigravity) to perform direct Git operations (branching, file diffing, creating PRs, reading content) without leaving the editor.
* **Tech Leads & PMs**: Who want to automate issue tracking, status updates, or generate release notes directly by prompting their AI assistant.
* **DevOps Engineers**: Who want to check pipeline statuses or trigger deployments right from the chat interface.

### ❓ When to use?

* **Use GitAgent MCP if**:
  * You need integration with **GitHub Projects v2** or **GitHub Actions**.
  * You want a **lightweight, native Node.js** setup without installing Docker Desktop.
  * You want deep analytical insights into development progress (linked PRs, commit statistics).
* **Use Official GitHub MCP if**:
  * You need to perform massive file commits in a single action (`push_files`).
  * You need to search for GitHub users globally (`search_users`).

## 🌟 Features

- ✅ **Full GitHub Integration** - Issues, Pull Requests, Branches, Commits, Files
- ✅ **Project v2 Fields** - Access GitHub Project fields (Status, Priority, Size, etc.)
- ✅ **Write Operations** - Create issues, PRs, comments, merge PRs
- ✅ **Private Repos** - Access private repositories with your own token
- ✅ **Multiple Transports** - Stdio (for editors) and HTTP (for web apps)

## 📦 Installation

### Option 1: On-demand Execution (Recommended)

You can run the server directly using `npx` without installing it globally. This guarantees you are always running the latest version:

```json
{
  "mcpServers": {
    "gitagent": {
      "command": "npx",
      "args": ["-y", "gitagent-mcp-server"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_github_token_here"
      }
    }
  }
}
```

### Option 2: Global Installation

If you prefer to install it globally on your system:

```bash
npm install -g gitagent-mcp-server
```

#### Configure in your editor:

```json
{
  "mcpServers": {
    "gitagent": {
      "command": "gitagent-mcp",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "ghp_your_github_token_here"
      }
    }
  }
}
```

> 💡 **Tip (Updating):** To update the global installation to the latest version, run:
>
> ```bash
> npm install -g gitagent-mcp-server@latest
> ```

### Option 3: Local Installation (Clone & Build)

If you prefer to run it locally from a cloned directory:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dangtdn/gitagent-mcp.git
   cd gitagent-mcp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

4. **Configure in your editor** (using absolute path to `dist/index.js`):

   ```json
   {
     "mcpServers": {
       "gitagent": {
         "command": "node",
         "args": ["C:/path/to/gitagent-mcp/dist/index.js"],
         "env": {
           "GITHUB_TOKEN": "ghp_your_github_token_here"
         }
       }
     }
   }
   ```

   > **Note:** Replace `C:/path/to/gitagent-mcp` with the actual path to the cloned folder on your machine.

## 🔧 Configuration

### Getting a GitHub Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (classic)
3. Select scopes: `repo`, `read:user`, `read:org`
4. Copy the token and use it in your config

## 🛠️ Available Tools (44 tools)

> 📖 **Read the detailed usage guide:** [GUIDE.md](GUIDE.md)

### Read Operations (24 tools)

| Tool                              | Description                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| `list_repositories`               | List all repositories accessible to you                            |
| `get_repository`                  | Get detailed information about a repository                        |
| `list_issues`                     | List issues in a repository with filters (state, assignee, labels) |
| `get_issue`                       | Get detailed information about a specific issue                    |
| `list_issue_comments`             | List all comments on an issue or pull request                      |
| `get_issue_comment`               | Get detailed information about a specific issue comment            |
| `list_pull_requests`              | List pull requests in a repository                                 |
| `get_pull_request`                | Get detailed information about a pull request                      |
| `get_pr_files`                    | Get the list of files changed in a pull request                    |
| `get_pr_reviews`                  | Get the reviews on a pull request                                  |
| `get_pr_commits`                  | Get all commits from a PR with SHA, message, author, date          |
| `get_issue_linked_prs`            | Get PRs linked in issue's Development section                      |
| `get_issue_development_info`      | Get linked PRs with their commits for time analysis                |
| `list_branches`                   | List branches in a repository                                      |
| `list_commits`                    | List commits in a repository                                       |
| `get_file_content`                | Get content of a file from repository                              |
| `search_code`                     | Search for code in a repository                                    |
| `search_issues`                   | **NEW** Search for issues and pull requests across repositories    |
| `get_diff`                        | Compare two commits/branches/tags and get the diff                 |
| `list_releases`                   | List releases in a repository                                      |
| `list_workflows`                  | List GitHub Actions workflows                                      |
| `list_issues_with_project_fields` | List issues with GitHub Project v2 fields (Status, Priority, etc.) |
| `get_repository_projects`         | **NEW** Get all GitHub Projects v2 with fields and options         |
| `get_issue_project_items`         | **NEW** Get project items of an issue with field values            |

### Write Operations (21 tools)

| Tool                          | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| `create_issue`                | Create a new issue                                                  |
| `update_issue`                | Update issue (title, body, state, labels, assignees)                |
| `close_issue`                 | Close an issue (completed or not_planned)                           |
| `add_issue_comment`           | Add a comment to an issue                                           |
| `add_labels`                  | Add labels to an issue or pull request                              |
| `remove_labels`               | Remove a label from an issue or pull request                        |
| `create_pull_request`         | Create a new pull request                                           |
| `update_pull_request`         | Update PR (title, body, state, base branch)                         |
| `request_reviewers`           | Request reviewers for a pull request                                |
| `merge_pull_request`          | Merge a pull request (merge, squash, rebase)                        |
| `create_branch`               | Create a new branch from existing branch/commit                     |
| `delete_branch`               | Delete a branch from the repository                                 |
| `create_file`                 | Create a new file in the repository                                 |
| `update_file`                 | Update an existing file in the repository                           |
| `delete_file`                 | Delete a file from the repository                                   |
| `create_release`              | Create a new release with tag                                       |
| `trigger_workflow`            | Trigger a GitHub Actions workflow run                               |
| `update_project_item_field`   | **NEW** Update single-select field (Status, Priority) in Project v2 |
| `update_project_item_number`  | **NEW** Update number field (Estimate) in Project v2                |
| `update_project_item_date`    | **NEW** Update date field (Start date, Target date) in Project v2   |
| `update_issue_project_status` | **NEW** ⭐ Convenience tool to update issue Status in Project       |

## 💡 Usage Examples

Once connected to your AI editor, you can use natural language:

```
List all open issues in my-org/my-repo

Create an issue titled "Fix login bug" with label "bug"

Get issues assigned to @username with status "In Progress"

Merge PR #42 using squash method
```

## 📚 API Reference

### list_issues_with_project_fields

Get issues with GitHub Project v2 field values:

```typescript
{
  owner: string,           // Repository owner
  repo: string,            // Repository name
  assignee: string,        // Filter by assignee username
  projectStatus?: string,  // Filter by project status (e.g., "In Progress")
  first?: number           // Number of issues to fetch (default: 50)
}
```

**Example Response:**

```json
{
  "total": 1,
  "filter": { "assignee": "John", "projectStatus": "In Progress" },
  "issues": [
    {
      "number": 949,
      "title": "Universal Search - Handling No Results",
      "assignees": ["John"],
      "projectFields": {
        "Project-1": {
          "Status": "In Progress",
          "Priority": "P1",
          "Size": "L",
          "Stack": "FE"
        }
      }
    }
  ]
}
```

## 🔐 Security

- Your GitHub token is **never stored** on our servers
- Token is passed via environment variables
- All requests are made directly to GitHub API
- Supports private repositories

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
