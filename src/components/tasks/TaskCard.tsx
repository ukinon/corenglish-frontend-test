"use client";

import { Task } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, Trash2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  TO_DO: {
    label: "To Do",
    variant: "outline" as const,
    color: "text-gray-600 border-gray-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "default" as const,
    color: "bg-blue-500 text-white",
  },
  DONE: {
    label: "Done",
    variant: "secondary" as const,
    color: "bg-green-500 text-white",
  },
};

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const router = useRouter();
  const statusInfo = statusConfig[task.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {task.title}
          </CardTitle>
          <Badge className={cn(statusInfo.color)}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {formatDate(task.updatedAt)}</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => router.push(`/tasks/edit/${task.id}`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete?.(task.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
