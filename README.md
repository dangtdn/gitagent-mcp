# @gitagent/gitagent-mcp-server

🚀 **MCP Server for GitAgent Manager** - Connect your GitHub repositories to AI editors like Cursor, VS Code, Claude Desktop, Antigravity, and more.

[![npm version](https://badge.fury.io/js/@gitagent%2Fgitagent-mcp-server.svg)](https://www.npmjs.com/package/@gitagent/gitagent-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- ✅ **Full GitHub Integration** - Issues, Pull Requests, Branches, Commits, Files
- ✅ **Project v2 Fields** - Access GitHub Project fields (Status, Priority, Size, etc.)
- ✅ **Write Operations** - Create issues, PRs, comments, merge PRs
- ✅ **Private Repos** - Access private repositories with your own token
- ✅ **Multiple Transports** - Stdio (for editors) and HTTP (for web apps)

## 📦 Installation

### Option 1: Via npm (Recommended)

```bash
npm install -g @gitagent/gitagent-mcp-server
```

### Option 2: Via npx (No installation)

```bash
npx @gitagent/gitagent-mcp-server
```

### Option 3: Manual Installation (Share folder)

Nếu bạn không muốn dùng npm, có thể cài đặt thủ công:

1. **Download/Copy folder `gitagent-mcp-server`** từ người share hoặc clone từ GitHub:

   ```bash
   Giải nén folder gitagent-mcp-server và mở terminal tại thư mục đó
   ```

2. **Cài đặt dependencies:**

   ```bash
   npm install
   ```

3. **Build project:**

   ```bash
   npm run build
   ```

4. **Cấu hình trong editor** (sử dụng đường dẫn tuyệt đối):

   ```json
   {
     "mcpServers": {
       "gitagent": {
         "command": "node",
         "args": ["C:/path/to/gitagent-mcp-server/dist/index.js"],
         "env": {
           "GITHUB_TOKEN": "ghp_your_github_token_here"
         }
       }
     }
   }
   ```

   > **Lưu ý:** Thay `C:/path/to/gitagent-mcp-server` bằng đường dẫn thực tế đến folder gitagent-mcp-server trên máy bạn.

## 🔧 Configuration

### Getting a GitHub Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (classic)
3. Select scopes: `repo`, `read:user`, `read:org`
4. Copy the token and use it in your config

## 🛠️ Available Tools (44 tools)

> 📖 **Xem hướng dẫn chi tiết:** [GUIDE.md](GUIDE.md)

### Read Operations (23 tools)

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
  "filter": { "assignee": "Ares-Nguyen", "projectStatus": "In Progress" },
  "issues": [
    {
      "number": 949,
      "title": "Universal Search - Handling No Results",
      "assignees": ["Ares-Nguyen"],
      "projectFields": {
        "KUP CX": {
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
