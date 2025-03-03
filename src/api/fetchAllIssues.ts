import { IssueStatus } from '@/types';
import { fetchIssuesByParams } from '@/api';

const fetchAllIssues = async (owner: string, repo: string) => {
  return Promise.all([
    fetchIssuesByParams(
      owner,
      repo,
      { state: 'open', assignee: 'none' },
      IssueStatus.TODO
    ),
    fetchIssuesByParams(
      owner,
      repo,
      { state: 'open', assignee: '*' },
      IssueStatus.IN_PROGRESS
    ),
    fetchIssuesByParams(owner, repo, { state: 'closed' }, IssueStatus.DONE),
  ]).then(([todoIssues, inProgressIssues, doneIssues]) => [
    ...todoIssues,
    ...inProgressIssues,
    ...doneIssues,
  ]);
};

export default fetchAllIssues;
