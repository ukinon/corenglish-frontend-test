"use client";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import FilterInput from "../FilterInput";
import SearchInput from "../SearchInput";

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="flex items-center gap-2 ">
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("list")}
          className="flex-1 sm:flex-none"
        >
          List
        </Button>
        <Button
          variant={view === "kanban" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("kanban")}
          className="flex-1 sm:flex-none"
        >
          Kanban
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ">
        {view === "list" && (
          <>
            <FilterInput
              placeholder="Items per page"
              options={limitOptions}
              includeAllOption={false}
              paramName="limit"
              width="100%"
            />
            <FilterInput
              placeholder="Filter by Status"
              options={filterOptions}
              paramName="status"
              className="w-full"
              width="100%"
            />
          </>
        )}

        <Button
          onClick={() => router.push("/tasks/create")}
          variant="default"
          size="sm"
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1" /> New Task
        </Button>
      </div>
    </div>
  );
}
