export const TASKS_QUERY_KEYS = {
  all: ["tasks"] as const,
  lists: () => [...TASKS_QUERY_KEYS.all, "list"] as const,
  list: (query: string) => [...TASKS_QUERY_KEYS.lists(), query] as const,
  detail: (taskId: string) => [...TASKS_QUERY_KEYS.all, taskId, "detail"] as const,
};
