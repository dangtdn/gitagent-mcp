import * as z from "zod";
import { getGraphQL } from "../client.js";
import { formatError, formatAuthError, formatJsonContent, formatTextContent } from "../utils/formatters.js";
export function registerProjectTools(server) {
    // Tool: Get Repository Projects (with fields and options)
    server.registerTool("get_repository_projects", {
        title: "Get Repository Projects",
        description: "Get all GitHub Projects v2 linked to a repository, including their fields and options. Use this to find project IDs, field IDs, and option IDs needed for updating project items.",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
        },
    }, async ({ owner, repo }) => {
        const graphqlWithAuth = getGraphQL();
        if (!graphqlWithAuth) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const query = `
          query($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
              projectsV2(first: 10) {
                nodes {
                  id
                  title
                  number
                  url
                  fields(first: 20) {
                    nodes {
                      ... on ProjectV2Field {
                        id
                        name
                        dataType
                      }
                      ... on ProjectV2SingleSelectField {
                        id
                        name
                        dataType
                        options {
                          id
                          name
                          color
                        }
                      }
                      ... on ProjectV2IterationField {
                        id
                        name
                        dataType
                      }
                    }
                  }
                }
              }
            }
          }
        `;
            const result = await graphqlWithAuth(query, { owner, repo });
            const projects = result.repository.projectsV2.nodes.map((project) => ({
                id: project.id,
                title: project.title,
                number: project.number,
                url: project.url,
                fields: project.fields.nodes.map((field) => ({
                    id: field.id,
                    name: field.name,
                    dataType: field.dataType,
                    options: field.options || null,
                })),
            }));
            return formatJsonContent(projects);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Get Issue Project Items (to find item IDs for updating)
    server.registerTool("get_issue_project_items", {
        title: "Get Issue Project Items",
        description: "Get all project items associated with an issue. Returns the project item IDs needed to update field values. Also shows current field values.",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            issue_number: z.number().describe("Issue number"),
        },
    }, async ({ owner, repo, issue_number }) => {
        const graphqlWithAuth = getGraphQL();
        if (!graphqlWithAuth) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const query = `
          query($owner: String!, $repo: String!, $issue_number: Int!) {
            repository(owner: $owner, name: $repo) {
              issue(number: $issue_number) {
                id
                number
                title
                projectItems(first: 10) {
                  nodes {
                    id
                    project {
                      id
                      title
                      number
                    }
                    fieldValues(first: 20) {
                      nodes {
                        ... on ProjectV2ItemFieldTextValue {
                          text
                          field { ... on ProjectV2Field { id name } }
                        }
                        ... on ProjectV2ItemFieldNumberValue {
                          number
                          field { ... on ProjectV2Field { id name } }
                        }
                        ... on ProjectV2ItemFieldDateValue {
                          date
                          field { ... on ProjectV2Field { id name } }
                        }
                        ... on ProjectV2ItemFieldSingleSelectValue {
                          name
                          optionId
                          field { ... on ProjectV2SingleSelectField { id name } }
                        }
                        ... on ProjectV2ItemFieldIterationValue {
                          title
                          startDate
                          duration
                          field { ... on ProjectV2IterationField { id name } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
            const result = await graphqlWithAuth(query, {
                owner,
                repo,
                issue_number,
            });
            const issue = result.repository.issue;
            const projectItems = issue.projectItems.nodes.map((item) => ({
                itemId: item.id,
                project: {
                    id: item.project.id,
                    title: item.project.title,
                    number: item.project.number,
                },
                fieldValues: item.fieldValues.nodes
                    .filter((fv) => fv.field)
                    .map((fv) => ({
                    fieldId: fv.field.id,
                    fieldName: fv.field.name,
                    value: fv.name || fv.text || fv.number || fv.date || fv.title || null,
                    optionId: fv.optionId || null,
                })),
            }));
            return formatJsonContent({
                issue: {
                    id: issue.id,
                    number: issue.number,
                    title: issue.title,
                },
                projectItems,
            });
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Update Project Item Field (Status or other single-select fields)
    server.registerTool("update_project_item_field", {
        title: "Update Project Item Field",
        description: "Update a field value on a GitHub Project v2 item. Use this to change Status, Priority, or other single-select fields. You must first use get_repository_projects to find the field ID and option ID, and get_issue_project_items to find the item ID.",
        inputSchema: {
            project_id: z
                .string()
                .describe("The Node ID of the project (starts with PVT_)"),
            item_id: z
                .string()
                .describe("The Node ID of the project item (starts with PVTI_)"),
            field_id: z
                .string()
                .describe("The Node ID of the field to update (starts with PVTF_ or PVTSSF_)"),
            option_id: z
                .string()
                .describe("The Node ID of the single-select option to set (e.g., for Status field values like 'In Progress', 'Done')"),
        },
    }, async ({ project_id, item_id, field_id, option_id }) => {
        const graphqlWithAuth = getGraphQL();
        if (!graphqlWithAuth) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const mutation = `
          mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
            updateProjectV2ItemFieldValue(
              input: {
                projectId: $projectId
                itemId: $itemId
                fieldId: $fieldId
                value: { singleSelectOptionId: $optionId }
              }
            ) {
              projectV2Item {
                id
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      optionId
                      field { ... on ProjectV2SingleSelectField { name } }
                    }
                  }
                }
              }
            }
          }
        `;
            const result = await graphqlWithAuth(mutation, {
                projectId: project_id,
                itemId: item_id,
                fieldId: field_id,
                optionId: option_id,
            });
            const updatedItem = result.updateProjectV2ItemFieldValue.projectV2Item;
            const updatedFields = updatedItem.fieldValues.nodes
                .filter((fv) => fv.field)
                .map((fv) => ({
                fieldName: fv.field.name,
                value: fv.name,
            }));
            return formatTextContent(`✅ Project item field updated successfully!\n${JSON.stringify({
                itemId: updatedItem.id,
                updatedFields,
            }, null, 2)}`);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Update Project Item Number Field (for fields like Estimate)
    server.registerTool("update_project_item_number", {
        title: "Update Project Item Number Field",
        description: "Update a number field value on a GitHub Project v2 item. Use this to set Estimate or other number fields. You must first use get_repository_projects to find the field ID and get_issue_project_items to find the item ID.",
        inputSchema: {
            project_id: z
                .string()
                .describe("The Node ID of the project (starts with PVT_)"),
            item_id: z
                .string()
                .describe("The Node ID of the project item (starts with PVTI_)"),
            field_id: z
                .string()
                .describe("The Node ID of the number field to update (starts with PVTF_)"),
            value: z.number().describe("The number value to set"),
        },
    }, async ({ project_id, item_id, field_id, value }) => {
        const graphqlWithAuth = getGraphQL();
        if (!graphqlWithAuth) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const mutation = `
          mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: Float!) {
            updateProjectV2ItemFieldValue(
              input: {
                projectId: $projectId
                itemId: $itemId
                fieldId: $fieldId
                value: { number: $value }
              }
            ) {
              projectV2Item {
                id
              }
            }
          }
        `;
            await graphqlWithAuth(mutation, {
                projectId: project_id,
                itemId: item_id,
                fieldId: field_id,
                value: value,
            });
            return formatTextContent(`✅ Project item number field updated to ${value}`);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Update Project Item Date Field (for fields like Start date, Target date)
    server.registerTool("update_project_item_date", {
        title: "Update Project Item Date Field",
        description: "Update a date field value on a GitHub Project v2 item. Use this to set Start date, Target date, or other date fields. You must first use get_repository_projects to find the field ID and get_issue_project_items to find the item ID.",
        inputSchema: {
            project_id: z
                .string()
                .describe("The Node ID of the project (starts with PVT_)"),
            item_id: z
                .string()
                .describe("The Node ID of the project item (starts with PVTI_)"),
            field_id: z
                .string()
                .describe("The Node ID of the date field to update (starts with PVTF_)"),
            date: z
                .string()
                .describe("The date value to set in ISO 8601 format (YYYY-MM-DD), e.g., '2024-12-25'"),
        },
    }, async ({ project_id, item_id, field_id, date }) => {
        const graphqlWithAuth = getGraphQL();
        if (!graphqlWithAuth) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            const mutation = `
          mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {
            updateProjectV2ItemFieldValue(
              input: {
                projectId: $projectId
                itemId: $itemId
                fieldId: $fieldId
                value: { date: $date }
              }
            ) {
              projectV2Item {
                id
              }
            }
          }
        `;
            await graphqlWithAuth(mutation, {
                projectId: project_id,
                itemId: item_id,
                fieldId: field_id,
                date: date,
            });
            return formatTextContent(`✅ Project item date field updated to ${date}`);
        }
        catch (error) {
            return formatError(error);
        }
    });
    // Tool: Update Project Item Status (convenience wrapper)
    server.registerTool("update_issue_project_status", {
        title: "Update Issue Project Status",
        description: "Convenience tool to update the Status field of an issue in a GitHub Project. Automatically finds the project, field, and option IDs. Provide the project name/number and the desired status name.",
        inputSchema: {
            owner: z.string().describe("Repository owner"),
            repo: z.string().describe("Repository name"),
            issue_number: z.number().describe("Issue number"),
            project_number: z
                .number()
                .optional()
                .describe("Project number (optional if issue is only in one project)"),
            status: z
                .string()
                .describe("New status value (e.g., 'In Progress', 'Done', 'In QA - Dev')"),
        },
    }, async ({ owner, repo, issue_number, project_number, status }) => {
        const graphqlWithAuth = getGraphQL();
        if (!graphqlWithAuth) {
            return formatAuthError("Error: GitHub not authenticated");
        }
        try {
            // Step 1: Get issue project items
            const issueQuery = `
          query($owner: String!, $repo: String!, $issue_number: Int!) {
            repository(owner: $owner, name: $repo) {
              issue(number: $issue_number) {
                id
                number
                title
                projectItems(first: 10) {
                  nodes {
                    id
                    project {
                      id
                      title
                      number
                    }
                  }
                }
              }
            }
          }
        `;
            const issueResult = await graphqlWithAuth(issueQuery, {
                owner,
                repo,
                issue_number,
            });
            const issue = issueResult.repository.issue;
            if (!issue) {
                return formatTextContent(`Error: Issue #${issue_number} not found`);
            }
            const projectItems = issue.projectItems.nodes;
            if (projectItems.length === 0) {
                return formatTextContent(`Error: Issue #${issue_number} is not linked to any GitHub Project`);
            }
            // Find the target project item
            let targetItem = projectItems[0];
            if (project_number) {
                targetItem = projectItems.find((item) => item.project.number === project_number);
                if (!targetItem) {
                    return formatTextContent(`Error: Issue #${issue_number} is not linked to project #${project_number}. Available projects: ${projectItems
                        .map((i) => `#${i.project.number} (${i.project.title})`)
                        .join(", ")}`);
                }
            }
            const projectId = targetItem.project.id;
            const itemId = targetItem.id;
            // Step 2: Get project fields to find Status field and options
            const projectQuery = `
          query($projectId: ID!) {
            node(id: $projectId) {
              ... on ProjectV2 {
                id
                title
                fields(first: 20) {
                  nodes {
                    ... on ProjectV2SingleSelectField {
                      id
                      name
                      options {
                        id
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `;
            const projectResult = await graphqlWithAuth(projectQuery, {
                projectId,
            });
            const project = projectResult.node;
            const statusField = project.fields.nodes.find((f) => f.name && f.name.toLowerCase() === "status" && f.options);
            if (!statusField) {
                return formatTextContent(`Error: No "Status" field found in project "${project.title}"`);
            }
            // Find the target status option
            const statusOption = statusField.options.find((opt) => opt.name.toLowerCase() === status.toLowerCase());
            if (!statusOption) {
                return formatTextContent(`Error: Status "${status}" not found. Available options: ${statusField.options
                    .map((o) => o.name)
                    .join(", ")}`);
            }
            // Step 3: Update the field
            const mutation = `
          mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
            updateProjectV2ItemFieldValue(
              input: {
                projectId: $projectId
                itemId: $itemId
                fieldId: $fieldId
                value: { singleSelectOptionId: $optionId }
              }
            ) {
              projectV2Item {
                id
              }
            }
          }
        `;
            await graphqlWithAuth(mutation, {
                projectId,
                itemId,
                fieldId: statusField.id,
                optionId: statusOption.id,
            });
            return formatTextContent(`✅ Issue #${issue_number} status updated to "${statusOption.name}" in project "${project.title}"`);
        }
        catch (error) {
            return formatError(error);
        }
    });
}
//# sourceMappingURL=projects.js.map