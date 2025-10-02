"use client";

import { Task } from "@/types";
import TaskCard from "./TaskCard";
import { ScrollArea } from "../ui/scroll-area";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

interface KanbanBoardProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

const columns = [
  { id: "TO_DO", title: "To Do", color: "bg-gray-50" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-50" },
  { id: "DONE", title: "Done", color: "bg-green-50" },
] as const;

function DroppableColumn({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "ring-2 ring-blue-400" : ""}`}
    >
      {children}
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  onDelete,
  onStatusChange,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    let newStatus: Task["status"] | undefined;

    if (
      over.id === "TO_DO" ||
      over.id === "IN_PROGRESS" ||
      over.id === "DONE"
    ) {
      newStatus = over.id as Task["status"];
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && task.status !== newStatus) {
      onStatusChange?.(taskId, newStatus);
    }
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full w-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div
              key={column.id}
              className="flex-1 flex flex-col min-w-[280px] max-w-[400px]"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-700">
                  {column.title}
                </h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn
                  id={column.id}
                  className={`flex-1 rounded-lg ${column.color} p-3 border border-gray-200 transition-all`}
                >
                  <ScrollArea className="h-[500px]">
                    <div className="min-h-full pr-4">
                      {columnTasks.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                          No tasks
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={onDelete}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </DroppableColumn>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 scale-105">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
