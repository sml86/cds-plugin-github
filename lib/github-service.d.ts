export interface Issue {
    id: string;
    number: number;
    title: string;
    state: "open" | "closed";
    url: string;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date;
    label?: string;
    labels: IssueLabel[];
    assignee?: string;
    assignees: IssueUser[];
    milestone?: string;
    body: string;
    type: "Bug" | "Task" | "Feature" | "PullRequest" | null;
    type_criticality: number;
    status_criticality: number;
}
export interface IssueUser {
    name: string;
    image: string;
}
export interface IssueLabel {
    name: string;
    color: string;
    description: string;
    index: number;
}
export interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
}
export interface GitHubLabel {
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string;
}
export interface GitHubPullRequestLinks {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    merged_at: string | null;
}
export interface GitHubReactions {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
}
export interface GitHubMilestone {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    description: string;
    creator: GitHubUser;
    open_issues: number;
    closed_issues: number;
    state: "open" | "closed";
    created_at: string;
    updated_at: string;
    due_on: string;
    closed_at: string;
}
export interface GitHubType {
    id: number;
    node_id: string;
    name: "Task" | "Bug" | "Feature";
    description: string;
    color: string;
    created_at: string;
    updated_at: string;
    is_enabled: boolean;
}
export interface GitHubIssue {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: GitHubUser;
    labels: GitHubLabel[];
    state: "open" | "closed";
    locked: boolean;
    assignee: GitHubUser | null;
    assignees: GitHubUser[];
    milestone: GitHubMilestone | null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    author_association: string;
    draft: boolean;
    pull_request: GitHubPullRequestLinks;
    body: string;
    closed_by: GitHubUser | null;
    reactions: GitHubReactions;
    timeline_url: string;
    performed_via_github_app: any;
    state_reason: string | null;
    type: GitHubType | null;
}
