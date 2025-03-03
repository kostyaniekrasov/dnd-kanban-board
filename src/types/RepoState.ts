import IssueType from './IssueType';

type RepoState = {
  [key: string]: {
    owner: string;
    repo: string;
    issues: IssueType[];
  };
};

export default RepoState;
