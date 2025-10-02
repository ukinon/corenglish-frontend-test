export interface Task {
  id: string;
  title: string;
  description?: string;
  status?: "TO_DO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: "TO_DO" | "IN_PROGRESS" | "DONE";
}
