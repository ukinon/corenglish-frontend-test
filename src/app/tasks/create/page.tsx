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

export default function CreateTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTaskMutation();

  const handleSubmit = async (data: {
    title: string;
    description?: string;
  }) => {
    try {
      await createTaskMutation.mutateAsync(data);
      router.push("/tasks");
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Task</h1>
          <p className="text-muted-foreground">Add a new task to your list</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
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
