"use client";

import React from "react";
import { Input } from "./ui/input";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchInput() {
  const { handlePageChange, filters, sort, order, search } = useSearchQuery();
  const [searchQuery, setSearchQuery] = React.useState(search);
  const path = usePathname();

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          const timer = setTimeout(() => {
            handlePageChange({
              page: 1,
              path,
              search: e.target.value,
              filters: filters || undefined,
              sort: sort || undefined,
              order: (order as "asc" | "desc") || undefined,
            });
          }, 300);
          return () => clearTimeout(timer);
        }}
        className="pl-8 h-10 bg-background/60 backdrop-blur-lg border border-border/50 hover:border-border/80 transition-colors"
      />
    </div>
  );
}
