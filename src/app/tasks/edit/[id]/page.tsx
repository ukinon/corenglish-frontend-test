"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useTaskQuery,
  useUpdateTaskMutation,
} from "@/hooks/react-queries/useTasksQuery";
import TaskForm from "@/components/tasks/TaskForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileArchive, Loader2 } from "lucide-react";
import { UpdateTaskInput } from "@/types";
import { toast } from "sonner";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { data: task, isLoading, error } = useTaskQuery(taskId);
  const updateTaskMutation = useUpdateTaskMutation();

  const handleSubmit = async (formData: UpdateTaskInput) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        input: formData,
      });
      toast.success("Task updated successfully!", {
        description: "Your changes have been saved.",
      });
      router.push("/tasks");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className=" flex items-center justify-center h-screen">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className=" flex items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileArchive className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Task not found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            The task {"you're"} looking for {"doesn't"} exist or has been
            deleted.
          </p>
          <Button onClick={() => router.push("/tasks")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/tasks")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tasks
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Update the details of your task</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm
            initialData={task}
            onSubmit={handleSubmit}
            isSubmitting={updateTaskMutation.isPending}
            submitLabel="Update Task"
          />
        </CardContent>
      </Card>
    </div>
  );
}
