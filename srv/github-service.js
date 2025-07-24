"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cds_1 = __importDefault(require("@sap/cds"));
const axios_1 = __importDefault(require("axios"));
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;
module.exports = cds_1.default.service.impl(function () {
    const { Issue } = this.entities;
    this.on('READ', Issue, async () => {
        const res = await axios_1.default.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github+json'
            }
        });
        this.on(['CREATE', 'UPDATE', 'DELETE'], Issue, (req) => {
            return req.reject(405, 'Operation not supported');
        });
        return res.data.map((issue) => ({
            id: issue.id.toString(),
            number: issue.number,
            title: issue.title,
            state: issue.state,
            url: issue.html_url
        }));
    });
    this.on('createIssue', async (req) => {
        const { title, body } = req.data;
        const res = await axios_1.default.post(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, { title, body }, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github+json'
            }
        });
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
