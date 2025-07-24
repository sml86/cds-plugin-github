# GitHubService CDS Plugin

This CAP CDS plugin provides a simple service interface to interact with GitHub Issues. It allows clients to retrieve a list of issues and create new issues via a RESTful API.

## Environment-Variablen

The following environment variables must be set to work properly:

```env
GITHUB_TOKEN=
GITHUB_REPO_OWNER=
GITHUB_REPO_NAME=
```

## API Endpoints

| Method | Path                  | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | /odata/v4/git-hub/Issue       | Retrieve a list of GitHub issues |
| POST   | /odata/v4/git-hub/createIssue | Create a new GitHub issue        |

