import { IssueStatus, IssueType } from '@/types';
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: import.meta.env.TOKEN_GITHUB,
});

const fetchIssuesByParams = async (
  owner: string,
  repo: string,
  params: {
    state: 'all' | 'open' | 'closed';
    assignee?: string;
  },
  status: IssueStatus
): Promise<IssueType[]> => {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner,
      repo,
      ...params,
    });

    return response.data.map((issue: any) => ({
      id: issue.id,
      title: issue.title,
      createdAt: issue.created_at,
      author: issue.user?.login || 'Unknown',
      comments: issue.comments,
      state: issue.state,
      assignee: issue.assignee ? issue.assignee : null,
      status,
      owner,
      repo,
    }));
  } catch (error) {
    console.error('Error fetchIssues', error);

    throw error;
  }
};

export default fetchIssuesByParams;
