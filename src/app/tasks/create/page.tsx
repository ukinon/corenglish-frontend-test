"use client";

import { useRouter } from "next/navigation";
import { useCreateTaskMutation } from "@/hooks/react-queries/useTasksQuery";
import TaskForm from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/tasks")}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Create Task</CardTitle>
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
      </div>
    </div>
  );
}
