import { registerRepositoryTools } from "./repository.js";
import { registerIssueTools } from "./issues.js";
import { registerLabelTools } from "./labels.js";
import { registerPullRequestTools } from "./pull_requests.js";
import { registerBranchTools } from "./branches.js";
import { registerCommitTools } from "./commits.js";
import { registerFileTools } from "./files.js";
import { registerReleaseTools } from "./releases.js";
import { registerWorkflowTools } from "./workflows.js";
import { registerProjectTools } from "./projects.js";
import { registerResources } from "../resources.js";
import { registerPrompts } from "../prompts.js";
export function registerAllTools(server) {
    registerRepositoryTools(server);
    registerIssueTools(server);
    registerLabelTools(server);
    registerPullRequestTools(server);
    registerBranchTools(server);
    registerCommitTools(server);
    registerFileTools(server);
    registerReleaseTools(server);
    registerWorkflowTools(server);
    registerProjectTools(server);
    registerResources(server);
    registerPrompts(server);
}
//# sourceMappingURL=index.js.map