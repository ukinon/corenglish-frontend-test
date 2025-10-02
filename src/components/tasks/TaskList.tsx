"use client";

import { useState } from "react";
import { Task } from "@/types";
import TaskCard from "./TaskCard";
import Paginator from "../Paginator";
import { usePaginatedTasksQuery } from "@/hooks/react-queries/useTasksQuery";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface TaskListProps {
  tasks: Task[];
  totalPages: number;
  total: number;
  onDelete: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  totalPages,
  total,
  onDelete,
}: TaskListProps) {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            variant="list"
          />
        ))}
      </div>

      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        data={tasks}
      />
    </div>
  );
}
