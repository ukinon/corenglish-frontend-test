"use client";

import { useRouter } from "next/navigation";
import { useCreateTaskMutation } from "@/hooks/react-queries/useTasksQuery";
import TaskForm from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTaskMutation();

  const handleSubmit = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      await createTaskMutation.mutateAsync(data);
      toast.success("Task created successfully!", {
        description: "Your new task has been added.",
      });
      router.push("/tasks");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

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
          <CardTitle>Create Task</CardTitle>
          <CardDescription>
            Fill in the information below to create a new task
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm
            onSubmit={handleSubmit}
            isSubmitting={createTaskMutation.isPending}
            submitLabel="Create Task"
          />
        </CardContent>
      </Card>
    </div>
  );
}
