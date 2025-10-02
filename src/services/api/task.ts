import { $fetch } from "@/lib/fetch";
import { PaginatedResponse } from "@/types";
import { Task, CreateTaskInput, UpdateTaskInput } from "@/types/task";

interface GetTasksParams {
  query?: string;
  filters?: Record<string, string | number | boolean>;
  sort?: string;
  order?: string;
  limit?: number;
  page?: number;
}

const taskService = {
  getTasks: async (
    params: GetTasksParams = {}
  ): Promise<PaginatedResponse<Task>> => {
    const { data, error } = await $fetch<PaginatedResponse<Task>>("/tasks", {
      method: "GET",
      query: params.query,
    });

    if (error) throw error;
    return data as PaginatedResponse<Task>;
  },

  getTask: async (id: string): Promise<Task> => {
    const { data, error } = await $fetch<Task>(`/tasks/${id}`, {
      method: "GET",
    });

    if (error) throw error;
    return data as Task;
  },

  createTask: async (input: CreateTaskInput): Promise<Task> => {
    const { data, error } = await $fetch<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (error) throw error;
    return data as Task;
  },

  updateTask: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const { data, error } = await $fetch<Task>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });

    if (error) throw error;
    return data as Task;
  },

  deleteTask: async (id: string): Promise<void> => {
    const { error } = await $fetch<void>(`/tasks/${id}`, {
      method: "DELETE",
    });

    if (error) throw error;
  },
};

export default taskService;
