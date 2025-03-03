import IssueStatus from './IssueStatus';

type IssueType = {
  id: number;
  title: string;
  createdAt: string;
  author: string;
  comments: number;
  state: string;
  assignee: object;
  status: IssueStatus;
  owner: string;
  repo: string;
};

export default IssueType;
