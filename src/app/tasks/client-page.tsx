"use client";

import { useState } from "react";
import {
  useTasksQuery,
  useDeleteTaskMutation,
} from "@/hooks/react-queries/useTasksQuery";
import TaskList from "@/components/tasks/TaskList";
import TasksToolbar from "@/components/tasks/TasksToolbar";
import Paginator from "@/components/Paginator";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import { Task } from "@/types";

export function TasksClient() {
  const { data, isLoading, error } = useTasksQuery();
  const deleteTaskMutation = useDeleteTaskMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleDeleteClick = (taskId: string) => {
    const task = data?.data.find((t) => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await deleteTaskMutation.mutateAsync(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-destructive/10 p-6 mb-4">
          <svg
            className="h-12 w-12 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Error loading tasks</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {error instanceof Error
            ? error.message
            : "Failed to load tasks. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <TasksToolbar />
        <TaskList
          tasks={data?.data || []}
          isLoading={isLoading}
          onDelete={handleDeleteClick}
        />
        {data && data.data?.length > 0 && (
          <Paginator
            currentPage={data.page}
            totalPages={data.totalPages}
            total={data.total}
            data={data.data}
          />
        )}
      </div>

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteTaskMutation.isPending}
        taskTitle={taskToDelete?.title}
      />
    </>
  );
}
