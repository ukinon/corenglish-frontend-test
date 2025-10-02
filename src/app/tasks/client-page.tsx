"use client";

import { useMemo, useState } from "react";
import {
  useTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  usePaginatedTasksQuery,
} from "@/hooks/react-queries/useTasksQuery";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskList from "@/components/tasks/TaskList";
import TasksToolbar from "@/components/tasks/TasksToolbar";
import { Task } from "@/types";
import { Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export function TasksClient() {
  const [view, setView] = useState<"kanban" | "list">("list");

  const activeQuery = useMemo(() => {
    return view === "kanban" ? useTasksQuery : usePaginatedTasksQuery;
  }, [view]);

  const { data, isLoading, error } = activeQuery();
  const deleteTaskMutation = useDeleteTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();

  const handleDeleteClick = async (taskId: string) => {
    const task = data?.data.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await deleteTaskMutation.mutateAsync(taskId);
      toast.success("Task deleted successfully!", {
        description: `"${task.title}" has been removed.`,
      });
    } catch (error) {
      toast.error("Failed to delete task", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        input: { status: newStatus },
      });
      toast.success("Task status updated!", {
        description: `Status changed to ${newStatus
          ?.replace("_", " ")
          .toLowerCase()}.`,
      });
    } catch (error) {
      toast.error("Failed to update task status", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <TasksToolbar view={view} setView={setView} />
      <div className="space-y-6">
        {view === "kanban" ? (
          <ScrollArea className="w-[90vw] md:w-[80vw] ">
            <ScrollBar orientation="horizontal" />
            <div className="flex w-full p-4">
              <KanbanBoard
                tasks={data?.data || []}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
              />
            </div>
          </ScrollArea>
        ) : (
          <TaskList
            tasks={data?.data || []}
            totalPages={data?.totalPages || 1}
            total={data?.total || 0}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
    </>
  );
}
