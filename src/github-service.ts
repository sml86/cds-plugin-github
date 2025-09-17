import cds, { predicate, Request } from "@sap/cds";
import axios, { AxiosResponse } from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;

module.exports = cds.service.impl(function () {
  const { Issue } = this.entities;

  this.on("READ", Issue, async (req: Request): Promise<Issue[] | Issue | number> => {
    const $count = !!req.query.SELECT?.columns?.find((col) => col?.as === "$count");
    const $filter = (req as any)?.req?.query?.$filter;
    const params = mapFilter($filter);
    const id = req.params[0]?.id;
    const url = id ? `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${id}` : `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
    const res = await axios.get<null, AxiosResponse<GitHubIssue[], Error>>(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      params,
    });

    if ($count) return res.data.length;

    const value = res.data.map((issue: GitHubIssue) => transformIssue(issue));
    (req as any)._count = res.data.length;
    if (params.type && !id) return value.filter((val) => val.type === params.type);
    return id ? value[0] : value;
  });

  this.on("createIssue", async (req: Request<{ title: string; body: string }>): Promise<Issue> => {
    const { title, body } = req.data;

    const res = await axios.post<{ title: string; body: string }, AxiosResponse<GitHubIssue, Error>>(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      { title, body, type: "Bug", owner: req.user?.id?.toLowerCase },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    return transformIssue(res.data);
  });
});

function transformIssue(issue: GitHubIssue): Issue {
  return {
    id: issue.id.toString(),
    number: issue.number,
    title: issue.title,
    state: issue.state,
    url: issue.html_url,
    createdAt: new Date(issue.created_at),
    modifiedAt: new Date(issue.updated_at),
    createdBy: issue.user.login,
    modifiedBy: issue.user.login,
    label: issue.labels?.map(({ name }) => name).join("; "),
    labels: issue.labels?.map(({ name, color, description }, index) => ({
      color,
      name,
      description,
      index,
    })),
    assignee: issue.assignees?.map(({ login }) => login).join("; "),
    assignees: issue.assignees?.map((usr) => ({
      name: usr.login,
      image: usr.avatar_url,
    })),
    milestone: issue.milestone?.title,
    body: issue.body,
    type: getIssueType(issue),
    type_criticality: getIssueTypeCriticality(issue),
    status_criticality: issue.state === "open" ? 5 : 3,
  };
}

function getIssueType(issue: GitHubIssue) {
  if (issue.type && issue.type.name) return issue.type.name;
  if (!issue.type && typeof issue.pull_request === "object") return "PullRequest";
  return null;
}

function getIssueTypeCriticality(issue: GitHubIssue) {
  const type = getIssueType(issue);
  if (type === "Bug") return 1;
  if (type === "Feature") return 3;
  if (type === "Task") return 5;
  if (type === "PullRequest") return 2;
  return 0;
}

function mapFilter($filter: string | undefined): Record<string, string> {
  const params: Record<string, string> = {};
  if (!$filter) return params;
  const conditions = $filter.replace(/\'/g, "").split(/and|or/gi);
  conditions.map((cond) => {
    if (!/eq/gi.test(cond)) return;
    const pairs = cond.split(" eq ");
    const prop = pairs[0].trim();
    const val = pairs[1].trim();
    if (prop === "label" && typeof val === "string") params.labels = val;
    else if (typeof prop === "string" && typeof val === "string") params[prop] = val;
  });
  return params;
}

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
