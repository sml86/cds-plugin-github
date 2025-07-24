import cds from '@sap/cds';
import axios from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;

module.exports = cds.service.impl(function () {
  const { Issue } = this.entities;

  this.on('READ', Issue, async () => {
    const res = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json'
      }
    });


    this.on(['CREATE', 'UPDATE', 'DELETE'], Issue, (req) => {
      return req.reject(405, 'Operation not supported');
    });


    return res.data.map((issue: any) => ({
      id: issue.id.toString(),
      number: issue.number,
      title: issue.title,
      state: issue.state,
      url: issue.html_url
    }));
  });

  this.on('createIssue', async (req: any) => {
    const { title, body } = req.data;

    const res = await axios.post(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      { title, body },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json'
        }
      }
    );

    const issue = res.data;
    return {
      id: issue.id.toString(),
      number: issue.number,
      title: issue.title,
      state: issue.state,
      url: issue.html_url
    };
  });
});
