import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { fetchAllIssues } from '@/api';
import { ColumnType, IssueType, IssueStatus, RepoState } from '@/types';
import { persist } from 'zustand/middleware';

type IssuesStore = {
  currentIssues: IssueType[];
  repos: RepoState;
  columns: ColumnType[];
  isLoading: boolean;
  error: string | null;
  repoData: { owner: string; repo: string };
  loadIssues: (owner: string, repo: string) => Promise<void>;
  addToColumnWithReorder: (activeId: number, overId: number) => void;
  reorderIssue: (activeId: number, overId: number) => void;
  moveColumn: (activeId: IssueStatus, overId: IssueStatus) => void;
  addToColumn: (activeId: number, newStatus: IssueStatus) => void;
  saveCurrentIssuesToRepo: () => void;
};

export const useIssuesStore = create<IssuesStore>()(
  persist(
    (set, get) => ({
      currentIssues: [],
      repos: {},
      isLoading: false,
      error: null,
      columns: [
        { id: IssueStatus.TODO, title: 'To Do' },
        { id: IssueStatus.IN_PROGRESS, title: 'In Progress' },
        { id: IssueStatus.DONE, title: 'Done' },
      ],
      repoData: { owner: '', repo: '' },

      loadIssues: async (owner: string, repo: string) => {
        const key = `${owner}-${repo}`;
        const existingRepo = get().repos[key];

        set({ isLoading: true, error: null });

        try {
          const allIssues = await fetchAllIssues(owner, repo);

          if (existingRepo && allIssues.length === existingRepo.issues.length) {
            return set({
              isLoading: false,
              currentIssues: existingRepo.issues,
              repoData: { owner, repo },
            });
          }

          set({
            repos: {
              ...get().repos,
              [key]: { owner, repo, issues: allIssues },
            },
            isLoading: false,
            repoData: { owner, repo },
            currentIssues: allIssues,
          });
        } catch (error) {
          set({ error: 'Failed to load issues', isLoading: false });
        }
      },

      addToColumnWithReorder: (activeId, overId) => {
        set((state) => {
          const activeIndex = state.currentIssues.findIndex(
            (issue) => issue.id === activeId
          );
          const overIndex = state.currentIssues.findIndex(
            (issue) => issue.id === overId
          );

          if (
            state.currentIssues[activeIndex].status ===
            state.currentIssues[overIndex].status
          ) {
            return state;
          }

          const newIssues = [...state.currentIssues];
          newIssues[activeIndex] = {
            ...newIssues[activeIndex],
            status: newIssues[overIndex].status,
          };
          get().saveCurrentIssuesToRepo();
          return { currentIssues: newIssues };
        });

        get().saveCurrentIssuesToRepo();
      },

      reorderIssue: (activeId, overId) => {
        set((state) => {
          const activeIndex = state.currentIssues.findIndex(
            (issue) => issue.id === activeId
          );
          const overIndex = state.currentIssues.findIndex(
            (issue) => issue.id === overId
          );

          if (activeIndex === overIndex) return state;
          return {
            currentIssues: arrayMove(
              state.currentIssues,
              activeIndex,
              overIndex
            ),
          };
        });

        get().saveCurrentIssuesToRepo();
      },

      moveColumn: (activeId, overId) => {
        set((state) => {
          const activeColIndex = state.columns.findIndex(
            (col) => col.id === activeId
          );
          const overColIndex = state.columns.findIndex(
            (col) => col.id === overId
          );

          return {
            columns: arrayMove(state.columns, activeColIndex, overColIndex),
          };
        });
      },

      addToColumn: (activeId, newStatus) => {
        set((state) => {
          const activeIssue = state.currentIssues.find(
            (issue) => issue.id === activeId
          );
          if (!activeIssue) return state;

          return {
            currentIssues: state.currentIssues.map((issue) =>
              issue.id === activeId ? { ...issue, status: newStatus } : issue
            ),
          };
        });

        get().saveCurrentIssuesToRepo();
      },

      saveCurrentIssuesToRepo: () => {
        const state = get();
        const { owner, repo } = state.repoData;
        const key = `${owner}-${repo}`;

        const updatedRepo = {
          ...state.repos[key],
          issues: state.currentIssues,
        };

        set({
          repos: {
            ...state.repos,
            [key]: updatedRepo,
          },
        });
      },
    }),
    {
      name: 'issues-storage',
    }
  )
);
