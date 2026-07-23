# 📚 GitAgent MCP Server - Usage Guide

Hướng dẫn chi tiết cách sử dụng tất cả 44 tools trong GitAgent MCP Server.

---

## 📋 Mục Lục

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

Liệt kê tất cả repositories mà bạn có quyền truy cập.

**Cách dùng:**

```
Liệt kê tất cả repositories của tôi
Show my repositories
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| page | number | ❌ | Số trang (mặc định: 1) |
| perPage | number | ❌ | Số items mỗi trang (mặc định: 30) |

---

### `get_repository`

Xem thông tin chi tiết của một repository.

**Cách dùng:**

```
Xem thông tin repo Ares-Nguyen/Order-App
Get repository info for Kinatico/kup-project-management
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |

---

## 2. Issue Tools

### `list_issues`

Liệt kê issues trong repository với các bộ lọc.

**Cách dùng:**

```
Liệt kê issues đang mở trong Ares-Nguyen/Order-App
Show closed issues with label "bug" in my-org/my-repo
List issues assigned to @username
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| state | "open" / "closed" / "all" | ❌ | Trạng thái (mặc định: open) |
| labels | string | ❌ | Labels (phân cách bằng dấu phẩy) |
| assignee | string | ❌ | Lọc theo assignee |
| per_page | number | ❌ | Số items mỗi trang |

---

### `get_issue`

Xem chi tiết một issue.

**Cách dùng:**

```
Xem chi tiết issue #123 trong Ares-Nguyen/Order-App
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue |

---

### `create_issue`

Tạo issue mới.

**Cách dùng:**

```
Tạo issue mới với title "Fix login bug" trong Ares-Nguyen/Order-App
Create issue "Add dark mode" with label "enhancement" and assign to @developer
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| title | string | ✅ | Tiêu đề issue |
| body | string | ❌ | Nội dung chi tiết |
| labels | string[] | ❌ | Danh sách labels |
| assignees | string[] | ❌ | Danh sách assignees |

---

### `update_issue`

Cập nhật issue.

**Cách dùng:**

```
Cập nhật title issue #123 thành "New Title"
Update issue #456 to add label "priority"
Assign issue #789 to @developer
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue |
| title | string | ❌ | Tiêu đề mới |
| body | string | ❌ | Nội dung mới |
| state | "open" / "closed" | ❌ | Trạng thái mới |
| labels | string[] | ❌ | Labels mới |
| assignees | string[] | ❌ | Assignees mới |

---

### `close_issue`

Đóng issue.

**Cách dùng:**

```
Đóng issue #123 với lý do completed
Close issue #456 as not_planned
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue |
| state_reason | "completed" / "not_planned" | ❌ | Lý do đóng |

---

### `add_issue_comment`

Thêm comment vào issue.

**Cách dùng:**

```
Thêm comment "Đã fix xong" vào issue #123
Add comment to PR #456: "LGTM, approved!"
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue hoặc PR |
| body | string | ✅ | Nội dung comment |

---

### `list_issues_with_project_fields`

Liệt kê issues với thông tin Project Fields (Status, Priority, Size...).

**Cách dùng:**

```
Lấy issues của Ares-Nguyen với status In Progress trong Kinatico/kup-project-management
Show issues assigned to @dev with project status Done
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| assignee | string | ✅ | Lọc theo assignee |
| projectStatus | string | ❌ | Lọc theo status (e.g., "In Progress") |
| first | number | ❌ | Số issues cần lấy (mặc định: 50) |

---

### `list_issue_comments`

Liệt kê tất cả comments trong một issue hoặc PR.

**Cách dùng:**

```
Liệt kê comments của issue #123 trong Ares-Nguyen/Order-App
List comments on PR #45
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue hoặc PR |
| per_page | number | ❌ | Số items mỗi trang (mặc định: 30) |
| page | number | ❌ | Số trang (mặc định: 1) |

---

### `get_issue_comment`

Xem chi tiết một comment cụ thể theo comment_id.

**Cách dùng:**

```
Xem chi tiết comment #987654321 trong Ares-Nguyen/Order-App
Get issue comment details for comment_id 123456
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| comment_id | number | ✅ | ID của comment |

---

### `get_issue_linked_prs`

Lấy danh sách các Pull Requests được liên kết trong mục Development của issue.

**Cách dùng:**

```
Lấy các PRs được link với issue #123 trong Ares-Nguyen/Order-App
Get linked PRs for issue #456
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue |

---

### `get_issue_development_info`

Lấy thông tin chi tiết về các linked PRs kèm danh sách commits của chúng để phân tích thời gian và tiến độ thực hiện issue.

**Cách dùng:**

```
Xem thông tin development và commits của issue #123
Get development info and commits for issue #456
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue |

---

## 3. Label Tools

### `add_labels`

Thêm labels vào issue hoặc PR.

**Cách dùng:**

```
Thêm label "bug" và "priority" vào issue #123
Add labels ["enhancement", "frontend"] to PR #456
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue/PR |
| labels | string[] | ✅ | Danh sách labels cần thêm |

---

### `remove_labels`

Xóa label khỏi issue hoặc PR.

**Cách dùng:**

```
Xóa label "wontfix" khỏi issue #123
Remove label "needs-review" from PR #456
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue/PR |
| name | string | ✅ | Tên label cần xóa |

---

## 4. Pull Request Tools

### `list_pull_requests`

Liệt kê pull requests.

**Cách dùng:**

```
Liệt kê PRs đang mở trong my-org/my-repo
Show all closed PRs
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| state | "open" / "closed" / "all" | ❌ | Trạng thái |
| per_page | number | ❌ | Số items mỗi trang |

---

### `get_pull_request`

Xem chi tiết một PR.

**Cách dùng:**

```
Xem chi tiết PR #42
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| pull_number | number | ✅ | Số PR |

---

### `create_pull_request`

Tạo pull request mới.

**Cách dùng:**

```
Tạo PR từ branch feature/new-login vào main
Create PR "Add dark mode" from feature-branch to develop
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| title | string | ✅ | Tiêu đề PR |
| head | string | ✅ | Branch nguồn (có changes) |
| base | string | ✅ | Branch đích (merge vào) |
| body | string | ❌ | Mô tả PR |

---

### `update_pull_request`

Cập nhật pull request.

**Cách dùng:**

```
Cập nhật title PR #42 thành "New Feature"
Change base branch of PR #42 to develop
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| pull_number | number | ✅ | Số PR |
| title | string | ❌ | Tiêu đề mới |
| body | string | ❌ | Mô tả mới |
| state | "open" / "closed" | ❌ | Trạng thái mới |
| base | string | ❌ | Branch đích mới |

---

### `request_reviewers`

Yêu cầu reviewer cho PR.

**Cách dùng:**

```
Yêu cầu @reviewer1 và @reviewer2 review PR #42
Request review from team "frontend-team" for PR #42
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| pull_number | number | ✅ | Số PR |
| reviewers | string[] | ❌ | Danh sách usernames |
| team_reviewers | string[] | ❌ | Danh sách team slugs |

---

### `merge_pull_request`

Merge pull request.

**Cách dùng:**

```
Merge PR #42 using squash
Merge PR #42 with rebase
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| pull_number | number | ✅ | Số PR |
| commit_title | string | ❌ | Tiêu đề commit |
| commit_message | string | ❌ | Message commit |
| merge_method | "merge" / "squash" / "rebase" | ❌ | Phương thức merge |

---

### `get_pr_files`

Xem danh sách files thay đổi trong PR.

**Cách dùng:**

```
Xem files thay đổi trong PR #42
Show changed files in PR #42
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| pull_number | number | ✅ | Số PR |

---

### `get_pr_reviews`

Xem reviews của PR.

**Cách dùng:**

```
Xem reviews của PR #42
Get all reviews for PR #42
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| pull_number | number | ✅ | Số PR |

---

### `get_pr_commits`

Lấy danh sách tất cả các commit thuộc một Pull Request (bao gồm SHA, message, author, date).

**Cách dùng:**

```
Xem tất cả commits trong PR #42
Get all commits from PR #100
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| pull_number | number | ✅ | Số PR |

---

## 5. Branch Tools

### `list_branches`

Liệt kê branches.

**Cách dùng:**

```
Liệt kê branches trong Ares-Nguyen/Order-App
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |

---

### `create_branch`

Tạo branch mới.

**Cách dùng:**

```
Tạo branch feature/new-login từ main
Create branch hotfix/fix-bug from develop
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| branch_name | string | ✅ | Tên branch mới |
| from_branch | string | ❌ | Branch nguồn |
| from_sha | string | ❌ | SHA commit nguồn |

---

### `delete_branch`

Xóa branch.

**Cách dùng:**

```
Xóa branch feature/old-feature
Delete branch hotfix/merged
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| branch_name | string | ✅ | Tên branch cần xóa |

---

## 6. Commit & Diff Tools

### `list_commits`

Liệt kê commits.

**Cách dùng:**

```
Liệt kê 10 commits gần nhất trong Ares-Nguyen/Order-App
Show commits on feature branch
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| sha | string | ❌ | Branch hoặc SHA |
| per_page | number | ❌ | Số items (mặc định: 20) |

---

### `get_diff`

So sánh 2 commits, branches, hoặc tags và lấy diff chi tiết.

**Cách dùng:**

```
So sánh branch main với develop trong Ares-Nguyen/Order-App
Get diff between v1.0.0 and v1.1.0
Compare commit abc123 with def456
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| base | string | ✅ | Base commit/branch/tag (e.g., 'main', 'v1.0.0') |
| head | string | ✅ | Head commit/branch/tag để so sánh |
| include_files | boolean | ❌ | Bao gồm chi tiết files (mặc định: true) |

**Response bao gồm:**

- `status`: ahead, behind, diverged, identical
- `ahead_by`, `behind_by`: Số commits ahead/behind
- `total_commits`: Tổng số commits khác biệt
- `commits`: Danh sách commits (tối đa 10)
- `files_summary`: Tổng additions/deletions
- `files`: Chi tiết từng file thay đổi với patch

---

## 7. File Tools

### `get_file_content`

Đọc nội dung file.

**Cách dùng:**

```
Đọc file README.md trong Ares-Nguyen/Order-App
Get content of src/index.ts on branch develop
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| path | string | ✅ | Đường dẫn file |
| ref | string | ❌ | Branch/tag/sha |

---

### `create_file`

Tạo file mới trong repository.

**Cách dùng:**

```
Tạo file src/new-component.tsx với nội dung "export default function NewComponent() {}"
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| path | string | ✅ | Đường dẫn file |
| content | string | ✅ | Nội dung file |
| message | string | ✅ | Commit message |
| branch | string | ❌ | Branch đích |

---

### `update_file`

Cập nhật file trong repository.

**Cách dùng:**

```
Cập nhật file README.md với nội dung mới
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| path | string | ✅ | Đường dẫn file |
| content | string | ✅ | Nội dung mới |
| message | string | ✅ | Commit message |
| branch | string | ❌ | Branch đích |

---

### `delete_file`

Xóa file trong repository.

**Cách dùng:**

```
Xóa file old-file.txt với message "Remove deprecated file"
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| path | string | ✅ | Đường dẫn file |
| message | string | ✅ | Commit message |
| branch | string | ❌ | Branch đích |

---

### `search_code`

Tìm kiếm code trong repository.

**Cách dùng:**

```
Tìm "useState" trong Ares-Nguyen/Order-App
Search for "export default" in src folder
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| query | string | ✅ | Từ khóa tìm kiếm |

---

## 8. Release Tools

### `list_releases`

Liệt kê releases.

**Cách dùng:**

```
Liệt kê releases trong Ares-Nguyen/Order-App
Show latest 5 releases
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| per_page | number | ❌ | Số items (mặc định: 10) |

---

### `create_release`

Tạo release mới.

**Cách dùng:**

```
Tạo release v1.0.0 với title "First Release"
Create pre-release v2.0.0-beta
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| tag_name | string | ✅ | Tag name (e.g., v1.0.0) |
| name | string | ❌ | Tên release |
| body | string | ❌ | Release notes |
| draft | boolean | ❌ | Tạo draft |
| prerelease | boolean | ❌ | Đánh dấu pre-release |
| target_commitish | string | ❌ | Branch/SHA đích |

---

## 9. GitHub Actions Tools

### `list_workflows`

Liệt kê GitHub Actions workflows.

**Cách dùng:**

```
Liệt kê workflows trong Ares-Nguyen/Order-App
Show all GitHub Actions
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |

---

### `trigger_workflow`

Chạy GitHub Actions workflow.

**Cách dùng:**

```
Trigger workflow deploy.yml on branch main
Run CI workflow on develop branch
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| workflow_id | string/number | ✅ | Workflow ID hoặc filename |
| ref | string | ✅ | Branch hoặc tag |
| inputs | object | ❌ | Workflow inputs |

---

## 10. Project Tools

### `list_issues_with_project_fields`

_(Đã mô tả ở phần Issue Tools)_

---

### `get_repository_projects`

Lấy danh sách tất cả GitHub Projects v2 được liên kết với repository, bao gồm thông tin về fields và options.

**Cách dùng:**

```
Lấy danh sách projects trong Kinatico/kup-project-management
Show all projects with their fields in my-org/my-repo
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |

**Response bao gồm:**

- `id`: Node ID của project (PVT\_...)
- `title`: Tên project
- `number`: Số project
- `url`: URL project
- `fields`: Danh sách fields với:
  - `id`: Node ID của field
  - `name`: Tên field (ví dụ: "Status", "Priority")
  - `dataType`: Loại field
  - `options`: Các options cho single-select fields (với id và name)

---

### `get_issue_project_items`

Lấy thông tin project items của một issue, bao gồm item ID và giá trị các fields hiện tại.

**Cách dùng:**

```
Lấy project items của issue #123 trong Kinatico/kup-project-management
Get project info for issue #456
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue |

**Response bao gồm:**

- `issue`: Thông tin issue (id, number, title)
- `projectItems`: Danh sách project items với:
  - `itemId`: Node ID của item (PVTI\_...) - **cần dùng cho update**
  - `project`: Thông tin project (id, title, number)
  - `fieldValues`: Các giá trị field hiện tại

---

### `update_project_item_field`

Update giá trị của một field trong GitHub Project v2 item. Dùng cho single-select fields như Status, Priority.

**Cách dùng:**

```
Update project item field với project_id PVT_xxx, item_id PVTI_xxx, field_id PVTSSF_xxx, option_id xxx
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| project*id | string | ✅ | Node ID của project (PVT*...) |
| item*id | string | ✅ | Node ID của project item (PVTI*...) |
| field*id | string | ✅ | Node ID của field (PVTF*... or PVTSSF\_...) |
| option_id | string | ✅ | Node ID của option muốn set |

**Lưu ý:** Cần lấy các IDs bằng cách sử dụng `get_repository_projects` và `get_issue_project_items` trước.

---

### `update_issue_project_status` ⭐ (Recommended)

**Tool tiện lợi để update Status của issue trong GitHub Project.** Tự động tìm project, field, và option IDs.

**Cách dùng:**

```
Cập nhật status issue #123 thành "In QA - Dev" trong project của Kinatico/kup-project-management
Update status of issue #456 to "Done"
Change issue #789 status to "In Progress" in project #2
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| owner | string | ✅ | Chủ repository |
| repo | string | ✅ | Tên repository |
| issue_number | number | ✅ | Số issue |
| project_number | number | ❌ | Số project (không bắt buộc nếu issue chỉ thuộc 1 project) |
| status | string | ✅ | Tên status mới (ví dụ: "In Progress", "Done", "In QA - Dev") |

**Ví dụ thực tế:**

```
Chuyển status issue #42 sang "In QA - Dev" trong Kinatico/kup-project-management
```

**Lưu ý:**

- Tool sẽ tự động tìm Status field trong project
- Nếu status không tồn tại, tool sẽ hiển thị danh sách các status có sẵn
- Case-insensitive khi so sánh status name

---

### `update_project_item_number`

Update giá trị của một NUMBER field trong GitHub Project v2 item (ví dụ: Estimate).

**Cách dùng:**

```
Update Estimate của issue #8 thành 5 trong project Ares-Nguyen/Order-App
Set estimate to 8 for project item
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| project*id | string | ✅ | Node ID của project (PVT*...) |
| item*id | string | ✅ | Node ID của project item (PVTI*...) |
| field*id | string | ✅ | Node ID của number field (PVTF*...) |
| value | number | ✅ | Giá trị số cần set |

**Lưu ý:** Cần lấy các IDs bằng cách sử dụng `get_repository_projects` và `get_issue_project_items` trước.

---

### `update_project_item_date`

Update giá trị của một DATE field trong GitHub Project v2 item (ví dụ: Start date, Target date).

**Cách dùng:**

```
Update Start date của issue #8 thành 2024-12-23
Set target date to 2024-12-31 for project item
```

**Parameters:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| project*id | string | ✅ | Node ID của project (PVT*...) |
| item*id | string | ✅ | Node ID của project item (PVTI*...) |
| field*id | string | ✅ | Node ID của date field (PVTF*...) |
| date | string | ✅ | Ngày theo định dạng ISO 8601 (YYYY-MM-DD), ví dụ: "2024-12-25" |

**Lưu ý:** Cần lấy các IDs bằng cách sử dụng `get_repository_projects` và `get_issue_project_items` trước.

---

## 💡 Tips & Best Practices

### 1. Sử dụng ngôn ngữ tự nhiên

Bạn không cần nhớ chính xác tên tool. Chỉ cần mô tả những gì bạn muốn làm:

```
Tôi muốn xem các issues đang được assign cho Ares-Nguyen với status In Progress
```

### 2. Kết hợp nhiều thao tác

```
Tạo branch feature/new-login từ main, sau đó tạo file src/Login.tsx với nội dung cơ bản
```

### 3. Sử dụng context

AI sẽ nhớ context từ các câu hỏi trước:

```
Liệt kê issues trong Ares-Nguyen/Order-App
Đóng issue #1 vừa liệt kê
```

### 4. Filters nâng cao

```
Lấy issues của @Ares-Nguyen với label "bug" có status "In Progress" trong project
```

---

## ⚠️ Lưu ý quan trọng

1. **GitHub Token**: Đảm bảo token có đủ quyền (scopes: `repo`, `read:user`, `workflow`)
2. **Rate Limiting**: GitHub có giới hạn requests, tránh gọi quá nhiều lần
3. **Write Operations**: Cẩn thận với các thao tác write (delete, update)
4. **Private Repos**: Cần token với quyền truy cập private repos

---

## 🔗 Resources

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Token Settings](https://github.com/settings/tokens)
- [MCP Protocol](https://modelcontextprotocol.io/)
