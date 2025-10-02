"use client";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import FilterInput from "../FilterInput";
import SearchInput from "../SearchInput";
import { cn } from "@/lib/utils";

interface TasksToolbarProps {
  view: "kanban" | "list";
  setView: Dispatch<SetStateAction<"kanban" | "list">>;
}

const filterOptions = [
  {
    label: "To Do",
    value: "TO_DO",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Done",
    value: "DONE",
  },
];

const limitOptions = [
  { label: "6", value: "6" },
  { label: "12", value: "12" },
  { label: "24", value: "24" },
  { label: "60", value: "60" },
];

export default function TasksToolbar({ view, setView }: TasksToolbarProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex  gap-4 flex-row items-center justify-between w-full",
        view === "list" && "flex-wrap"
      )}
    >
      <div className="flex items-center gap-2 ">
        {view === "list" && (
          <>
            <FilterInput
              placeholder="Items per page"
              options={limitOptions}
              paramName="limit"
            />
            <FilterInput
              placeholder="Filter by Status"
              options={filterOptions}
              paramName="status"
            />
          </>
        )}

        <Button
          onClick={() => router.push("/tasks/create")}
          variant="default"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> New Task
        </Button>
      </div>
      <div className="flex items-center gap-2 ">
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("list")}
        >
          List
        </Button>
        <Button
          variant={view === "kanban" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("kanban")}
        >
          Kanban
        </Button>
      </div>
    </div>
  );
}
