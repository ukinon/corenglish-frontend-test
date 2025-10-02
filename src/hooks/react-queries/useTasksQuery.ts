import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TASKS_QUERY_KEYS } from "@/lib/query-keys";
import taskService from "@/services/api/task";
import { CreateTaskInput, UpdateTaskInput } from "@/types/task";
import { useSearchQuery } from "../useSearchQuery";

export function useTasksQuery() {
  const { search, filters } = useSearchQuery();

  const queryString = new URLSearchParams({
    ...(search && { search }),
    ...filters,
    limit: "100",
    page: "1",
  }).toString();

  return useQuery({
    queryKey: TASKS_QUERY_KEYS.list(queryString),
    queryFn: () =>
      taskService.getTasks({
        query: queryString,
        limit: 100,
        page: 1,
      }),
    staleTime: 10 * 1000,
  });
}

export function usePaginatedTasksQuery() {
  const { search, filters, limit, page } = useSearchQuery();

  const queryString = new URLSearchParams({
    ...(search && { search }),
    ...filters,
    limit: limit.toString(),
    page: page.toString(),
  }).toString();

  return useQuery({
    queryKey: TASKS_QUERY_KEYS.list(queryString),
    queryFn: () =>
      taskService.getTasks({
        query: queryString,
        limit,
        page,
      }),
    staleTime: 10 * 1000,
  });
}

export function useTaskQuery(id: string) {
  return useQuery({
    queryKey: TASKS_QUERY_KEYS.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEYS.lists() });
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      taskService.updateTask(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: TASKS_QUERY_KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEYS.lists() });
    },
  });
}
