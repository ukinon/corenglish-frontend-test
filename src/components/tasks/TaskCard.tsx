"use client";

import { Task } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Edit, Trash2, Clock, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  variant?: "kanban" | "list";
}

const badgeColors: Record<string, string> = {
  TO_DO: "bg-gray-100",
  IN_PROGRESS: "bg-blue-100",
  DONE: "bg-green-100",
};

export default function TaskCard({
  task,
  onDelete,
  variant = "kanban",
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: variant === "list" });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 hover:shadow-md transition-all duration-200 bg-white border border-gray-200 cursor-default group"
    >
      <CardHeader className="p-3 pb-2 relative ">
        <div className="flex items-start gap-2 ">
          {variant === "kanban" && (
            <div
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight line-clamp-2 text-gray-900">
              {task.title}
            </h3>
          </div>
        </div>

        <div className="absolute top-2 right-1 hidden group-hover:flex">
          <div className="flex items-center gap-0 border rounded-lg ">
            <Link href={`/tasks/edit/${task.id}`}>
              <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">
                <Edit className="h-3 w-3 mr-1" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete?.(task.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`p-3 pt-0 space-y-3 ${variant === "kanban" ? "pl-9" : ""}`}
      >
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(task.updatedAt)}</span>
          </div>
          {variant === "list" && (
            <Badge
              variant="secondary"
              className={`${badgeColors[task.status as string]}`}
            >
              {task.status}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
