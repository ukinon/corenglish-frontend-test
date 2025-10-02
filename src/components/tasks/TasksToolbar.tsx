"use client";

import { Button } from "../ui/button";
import SearchInput from "../SearchInput";
import FilterInput from "../FilterInput";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TasksToolbar() {
  const router = useRouter();

  const statusOptions = [
    { label: "To Do", value: "TO_DO" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Done", value: "DONE" },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[300px]">
          <SearchInput />
        </div>
        <FilterInput
          options={statusOptions}
          placeholder="Filter by status"
          paramName="status"
          width="180px"
        />
      </div>
      <Button
        onClick={() => router.push("/tasks/create")}
        className="sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    </div>
  );
}
