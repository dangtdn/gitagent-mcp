# 📚 GitAgent MCP Server - Usage Guide

Detailed guide on how to use all 44 tools in the GitAgent MCP Server.

---

## 📋 Table of Contents

1. [Repository Tools](#1-repository-tools)
2. [Issue Tools](#2-issue-tools)
3. [Label Tools](#3-label-tools)
4. [Pull Request Tools](#4-pull-request-tools)
5. [Branch Tools](#5-branch-tools)
6. [Commit Tools](#6-commit-tools)
7. [File Tools](#7-file-tools)
8. [Release Tools](#8-release-tools)
9. [GitHub Actions Tools](#9-github-actions-tools)
10. [Project Tools](#10-project-tools)

---

## 1. Repository Tools

### `list_repositories`

List all repositories that you have access to.

**Usage:**

```
List all my repositories
Show my repositories
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| page | number | ❌ | Page number (default: 1) |
| perPage | number | ❌ | Items per page (default: 30) |

---

### `get_repository`

Get detailed information about a repository.

**Usage:**

```
Get repository info for octocat/Hello-World
Get repository info for my-org/my-project
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |

---

## 2. Issue Tools

### `list_issues`

List issues in a repository with filters.

**Usage:**

```
List open issues in octocat/Hello-World
Show closed issues with label "bug" in my-org/my-repo
List issues assigned to @username
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| state | "open" / "closed" / "all" | ❌ | Issue state (default: open) |
| labels | string | ❌ | Labels (comma-separated) |
| assignee | string | ❌ | Filter by assignee |
| per_page | number | ❌ | Items per page |

---

### `get_issue`

Get detailed information about a specific issue.

**Usage:**

```
Get details of issue #123 in octocat/Hello-World
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue number |

---

### `create_issue`

Create a new issue.

**Usage:**

```
Create a new issue with title "Fix login bug" in octocat/Hello-World
Create issue "Add dark mode" with label "enhancement" and assign to @developer
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| title | string | ✅ | Issue title |
| body | string | ❌ | Detailed description/body |
| labels | string[] | ❌ | List of labels |
| assignees | string[] | ❌ | List of assignees |

---

### `update_issue`

Update an existing issue.

**Usage:**

```
Update title of issue #123 to "New Title"
Update issue #456 to add label "priority"
Assign issue #789 to @developer
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue number |
| title | string | ❌ | New title |
| body | string | ❌ | New description/body |
| state | "open" / "closed" | ❌ | New state |
| labels | string[] | ❌ | New labels |
| assignees | string[] | ❌ | New assignees |

---

### `close_issue`

Close an issue.

**Usage:**

```
Close issue #123 with reason completed
Close issue #456 as not_planned
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue number |
| state_reason | "completed" / "not_planned" | ❌ | Reason for closing |

---

### `add_issue_comment`

Add a comment to an issue.

**Usage:**

```
Add comment "Fixed" to issue #123
Add comment to PR #456: "LGTM, approved!"
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue or PR number |
| body | string | ✅ | Comment text |

---

### `list_issues_with_project_fields`

List issues with GitHub Project v2 field values (Status, Priority, Size...).

**Usage:**

```
Get issues of octocat with status In Progress in my-org/my-project
Show issues assigned to @dev with project status Done
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| assignee | string | ✅ | Filter by assignee |
| projectStatus | string | ❌ | Filter by project status (e.g., "In Progress") |
| first | number | ❌ | Number of issues to fetch (default: 50) |

### `search_issues`

Search for issues and pull requests across GitHub repositories using GitHub's advanced search query syntax.

**Usage:**

```
Search open bug issues: "is:issue is:open label:bug"
Search PRs created by octocat: "is:pr author:octocat"
Search issues with "database error" in my-org/my-project: "repo:my-org/my-project database error"
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| q | string | ✅ | The search query using GitHub search syntax |
| sort | string | ❌ | Sort field (`comments`, `reactions`, `reactions-+1`, `reactions--1`, `reactions-smile`, `reactions-thinking_face`, `reactions-heart`, `reactions-tada`, `interactions`, `created`, `updated`) |
| order | "asc" / "desc" | ❌ | Sort order |
| page | number | ❌ | Page number (default: 1) |
| per_page | number | ❌ | Items per page (max 100, default: 30) |

---

### `list_issue_comments`

List all comments on an issue or PR.

**Usage:**

```
List comments of issue #123 in octocat/Hello-World
List comments on PR #45
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue or PR number |
| per_page | number | ❌ | Items per page (default: 30) |
| page | number | ❌ | Page number (default: 1) |

---

### `get_issue_comment`

Get detailed information about a specific comment by comment_id.

**Usage:**

```
Get details of comment #987654321 in octocat/Hello-World
Get issue comment details for comment_id 123456
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| comment_id | number | ✅ | Comment ID |

---

### `get_issue_linked_prs`

Get the list of Pull Requests linked in the Development section of the issue.

**Usage:**

```
Get PRs linked with issue #123 in octocat/Hello-World
Get linked PRs for issue #456
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue number |

---

### `get_issue_development_info`

Get detailed development information for an issue, including all linked PRs and their commits for time and progress analysis.

**Usage:**

```
Get development info and commits for issue #123
Get development info and commits for issue #456
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue number |

---

## 3. Label Tools

### `add_labels`

Add labels to an issue or PR.

**Usage:**

```
Add labels "bug" and "priority" to issue #123
Add labels ["enhancement", "frontend"] to PR #456
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue or PR number |
| labels | string[] | ✅ | List of labels to add |

---

### `remove_labels`

Remove a label from an issue or PR.

**Usage:**

```
Remove label "wontfix" from issue #123
Remove label "needs-review" from PR #456
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue or PR number |
| name | string | ✅ | Label name to remove |

---

## 4. Pull Request Tools

### `list_pull_requests`

List pull requests.

**Usage:**

```
List open PRs in my-org/my-repo
Show all closed PRs
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| state | "open" / "closed" / "all" | ❌ | PR state filter |
| per_page | number | ❌ | Items per page |

---

### `get_pull_request`

Get detailed information about a PR.

**Usage:**

```
Get details of PR #42
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| pull_number | number | ✅ | PR number |

---

### `create_pull_request`

Create a new pull request.

**Usage:**

```
Create PR from branch feature/new-login to main
Create PR "Add dark mode" from feature-branch to develop
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| title | string | ✅ | PR title |
| head | string | ✅ | Source branch (with changes) |
| base | string | ✅ | Target branch (to merge into) |
| body | string | ❌ | PR description/body |

---

### `update_pull_request`

Update an existing pull request.

**Usage:**

```
Update title of PR #42 to "New Feature"
Change base branch of PR #42 to develop
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| pull_number | number | ✅ | PR number |
| title | string | ❌ | New title |
| body | string | ❌ | New description/body |
| state | "open" / "closed" | ❌ | New state |
| base | string | ❌ | New target branch |

---

### `request_reviewers`

Request reviewers for a PR.

**Usage:**

```
Request review from @reviewer1 and @reviewer2 for PR #42
Request review from team "frontend-team" for PR #42
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| pull_number | number | ✅ | PR number |
| reviewers | string[] | ❌ | List of reviewer usernames |
| team_reviewers | string[] | ❌ | List of team slugs |

---

### `merge_pull_request`

Merge a pull request.

**Usage:**

```
Merge PR #42 using squash
Merge PR #42 with rebase
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| pull_number | number | ✅ | PR number |
| commit_title | string | ❌ | Commit title |
| commit_message | string | ❌ | Commit message |
| merge_method | "merge" / "squash" / "rebase" | ❌ | Merge method |

---

### `get_pr_files`

Get the list of files changed in a PR.

**Usage:**

```
Get files changed in PR #42
Show changed files in PR #42
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| pull_number | number | ✅ | PR number |

---

### `get_pr_reviews`

Get reviews of a PR.

**Usage:**

```
Get reviews for PR #42
Get all reviews for PR #42
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| pull_number | number | ✅ | PR number |

---

### `get_pr_commits`

Get the list of all commits belonging to a Pull Request (including SHA, message, author, date).

**Usage:**

```
Get all commits in PR #42
Get all commits from PR #100
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| pull_number | number | ✅ | PR number |

---

## 5. Branch Tools

### `list_branches`

List branches in a repository.

**Usage:**

```
List branches in octocat/Hello-World
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |

---

### `create_branch`

Create a new branch.

**Usage:**

```
Create branch feature/new-login from main
Create branch hotfix/fix-bug from develop
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| branch_name | string | ✅ | New branch name |
| from_branch | string | ❌ | Source branch |
| from_sha | string | ❌ | Source commit SHA |

---

### `delete_branch`

Delete a branch.

**Usage:**

```
Delete branch feature/old-feature
Delete branch hotfix/merged
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| branch_name | string | ✅ | Name of branch to delete |

---

## 6. Commit & Diff Tools

### `list_commits`

List commits.

**Usage:**

```
List the latest 10 commits in octocat/Hello-World
Show commits on feature branch
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| sha | string | ❌ | Branch name or commit SHA |
| per_page | number | ❌ | Number of items (default: 20) |

---

### `get_diff`

Compare two commits, branches, or tags and get the detailed diff.

**Usage:**

```
Compare branch main with develop in octocat/Hello-World
Get diff between v1.0.0 and v1.1.0
Compare commit abc123 with def456
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| base | string | ✅ | Base commit/branch/tag (e.g., 'main', 'v1.0.0') |
| head | string | ✅ | Head commit/branch/tag to compare |
| include_files | boolean | ❌ | Include file details (default: true) |

**Response Includes:**

- `status`: ahead, behind, diverged, identical
- `ahead_by`, `behind_by`: Number of commits ahead/behind
- `total_commits`: Total number of differing commits
- `commits`: List of commits (max 10)
- `files_summary`: Total additions/deletions
- `files`: Detailed changes per file with patches

---

## 7. File Tools

### `get_file_content`

Read file content.

**Usage:**

```
Read README.md in octocat/Hello-World
Get content of src/index.ts on branch develop
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| path | string | ✅ | File path |
| ref | string | ❌ | Branch/tag/sha |

---

### `create_file`

Create a new file in the repository.

**Usage:**

```
Create src/new-component.tsx with content "export default function NewComponent() {}"
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| path | string | ✅ | File path |
| content | string | ✅ | File content |
| message | string | ✅ | Commit message |
| branch | string | ❌ | Target branch |

---

### `update_file`

Update an existing file in the repository.

**Usage:**

```
Update README.md with new content
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| path | string | ✅ | File path |
| content | string | ✅ | New content |
| message | string | ✅ | Commit message |
| branch | string | ❌ | Target branch |

---

### `delete_file`

Delete a file from the repository.

**Usage:**

```
Delete old-file.txt with message "Remove deprecated file"
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| path | string | ✅ | File path |
| message | string | ✅ | Commit message |
| branch | string | ❌ | Target branch |

---

### `search_code`

Search for code in a repository.

**Usage:**

```
Search for "useState" in octocat/Hello-World
Search for "export default" in src folder
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| query | string | ✅ | Search query |

---

## 8. Release Tools

### `list_releases`

List releases.

**Usage:**

```
List releases in octocat/Hello-World
Show latest 5 releases
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| per_page | number | ❌ | Items count (default: 10) |

---

### `create_release`

Create a new release.

**Usage:**

```
Create release v1.0.0 with title "First Release"
Create pre-release v2.0.0-beta
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| tag_name | string | ✅ | Tag name (e.g., v1.0.0) |
| name | string | ❌ | Release name |
| body | string | ❌ | Release notes |
| draft | boolean | ❌ | Create as draft |
| prerelease | boolean | ❌ | Mark as pre-release |
| target_commitish | string | ❌ | Target branch or commit SHA |

---

## 9. GitHub Actions Tools

### `list_workflows`

List GitHub Actions workflows.

**Usage:**

```
List workflows in octocat/Hello-World
Show all GitHub Actions
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |

---

### `trigger_workflow`

Trigger a GitHub Actions workflow.

**Usage:**

```
Trigger workflow deploy.yml on branch main
Run CI workflow on develop branch
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| workflow_id | string/number | ✅ | Workflow ID or filename |
| ref | string | ✅ | Branch or tag |
| inputs | object | ❌ | Workflow inputs |

---

## 10. Project Tools

### `list_issues_with_project_fields`

_(Described in the Issue Tools section)_

---

### `get_repository_projects`

Get all GitHub Projects v2 linked to a repository, including their fields and options.

**Usage:**

```
Get all projects in my-org/my-project
Show all projects with their fields in my-org/my-repo
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |

**Response Includes:**

- `id`: Project Node ID (PVT\_...)
- `title`: Project name
- `number`: Project number
- `url`: Project URL
- `fields`: List of fields with:
  - `id`: Field Node ID
  - `name`: Field name (e.g., "Status", "Priority")
  - `dataType`: Field type
  - `options`: Options for single-select fields (with id and name)

---

### `get_issue_project_items`

Get project items of an issue, including item ID and current field values.

**Usage:**

```
Get project items of issue #123 in my-org/my-project
Get project info for issue #456
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue number |

**Response Includes:**

- `issue`: Issue info (id, number, title)
- `projectItems`: List of project items with:
  - `itemId`: Project item Node ID (PVTI\_...) - **needed for updates**
  - `project`: Project info (id, title, number)
  - `fieldValues`: Current field values

---

### `update_project_item_field`

Update a field value on a GitHub Project v2 item. Used for single-select fields like Status, Priority.

**Usage:**

```
Update project item field with project_id PVT_xxx, item_id PVTI_xxx, field_id PVTSSF_xxx, option_id xxx
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| project_id | string | ✅ | Project Node ID (PVT_...) |
| item_id | string | ✅ | Project item Node ID (PVTI_...) |
| field_id | string | ✅ | Field Node ID (PVTF_... or PVTSSF_...) |
| option_id | string | ✅ | Node ID of single-select option to set |

**Note:** You must first obtain the IDs using `get_repository_projects` and `get_issue_project_items`.

---

### `update_issue_project_status` ⭐ (Recommended)

**Convenience tool to update status of an issue in a GitHub Project.** Automatically finds project, field, and option IDs.

**Usage:**

```
Update status of issue #123 to "In QA - Dev" in project my-org/my-project
Update status of issue #456 to "Done"
Change status of issue #789 to "In Progress" in project #2
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| owner | string | ✅ | Repository owner |
| repo | string | ✅ | Repository name |
| issue_number | number | ✅ | Issue number |
| project_number | number | ❌ | Project number (optional if issue is in only one project) |
| status | string | ✅ | New status name (e.g., "In Progress", "Done", "In QA - Dev") |

**Real Example:**

```
Move status of issue #42 to "In QA - Dev" in my-org/my-project
```

**Note:**

- Tool will automatically search for the "Status" field in the project.
- If status does not exist, the tool displays a list of available options.
- Comparison of status names is case-insensitive.

---

### `update_project_item_number`

Update a NUMBER field value on a GitHub Project v2 item (e.g., Estimate).

**Usage:**

```
Update Estimate of issue #8 to 5 in project octocat/Hello-World
Set estimate to 8 for project item
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| project_id | string | ✅ | Project Node ID (PVT_...) |
| item_id | string | ✅ | Project item Node ID (PVTI_...) |
| field_id | string | ✅ | Number field Node ID (PVTF_...) |
| value | number | ✅ | Number value to set |

**Note:** You must first obtain the IDs using `get_repository_projects` and `get_issue_project_items`.

---

### `update_project_item_date`

Update a DATE field value on a GitHub Project v2 item (e.g., Start date, Target date).

**Usage:**

```
Update Start date of issue #8 to 2024-12-23
Set target date to 2024-12-31 for project item
```

**Parameters:**
| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| project_id | string | ✅ | Project Node ID (PVT_...) |
| item_id | string | ✅ | Project item Node ID (PVTI_...) |
| field_id | string | ✅ | Date field Node ID (PVTF_...) |
| date | string | ✅ | Date in ISO 8601 format (YYYY-MM-DD), e.g., "2024-12-25" |

**Note:** You must first obtain the IDs using `get_repository_projects` and `get_issue_project_items`.

---

## 💡 Tips & Best Practices

### 1. Use Natural Language

You don't need to remember exact tool names. Just describe what you want to do:

```
I want to see issues assigned to octocat with status In Progress
```

### 2. Combine Multiple Actions

```
Create branch feature/new-login from main, then create file src/Login.tsx with basic content
```

### 3. Use Context

The AI remembers context from previous prompts:

```
List issues in octocat/Hello-World
Close issue #1 we just listed
```

### 4. Advanced Filters

```
Get issues of @octocat with label "bug" and status "In Progress" in the project
```

---

## ⚠️ Important Notes

1. **GitHub Token**: Ensure your token has enough permissions (scopes: `repo`, `read:user`, `workflow`).
2. **Rate Limiting**: GitHub has API request limits; avoid calling tools excessively.
3. **Write Operations**: Be careful with write operations (delete, update).
4. **Private Repos**: A token with private repo access is required.

---

## 🔗 Resources

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Token Settings](https://github.com/settings/tokens)
- [MCP Protocol](https://modelcontextprotocol.io/)
