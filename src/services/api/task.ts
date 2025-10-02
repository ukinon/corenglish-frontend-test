import { $fetch } from "@/lib/fetch";
import { Task, PaginatedResponse, CreateTaskInput, UpdateTaskInput } from "@/types";

interface GetTasksParams {
  query?: string;
  filters?: Record<string, string | number | boolean>;
  sort?: string;
  order?: string;
  limit?: number;
  page?: number;
}

const taskService = {
  getTasks: async (params: GetTasksParams = {}): Promise<PaginatedResponse<Task>> => {
    const { filters = {}, limit = 10, page = 1 } = params;

    const queryParams = new URLSearchParams();
    
    if (page) queryParams.set("page", String(page));
    if (limit) queryParams.set("limit", String(limit));
    
    const statusFilter = filters["filter[status]"] as string;
    if (statusFilter) queryParams.set("status", statusFilter);

    const { data, error } = await $fetch<PaginatedResponse<Task>>("/tasks", {
      method: "GET",
      query: queryParams.toString(),
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
