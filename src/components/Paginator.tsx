import React from "react";
import { Button } from "./ui/button";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  total: number;
  data: unknown[];
}

export default function Paginator({
  data,
  totalPages,
  total,
  currentPage,
}: PaginatorProps) {
  const { handlePageChange } = useSearchQuery();
  const path = usePathname();
  const searchParams = useSearchParams();

  const handlePageNavigation = (page: number) => {
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");
    const orderParam = searchParams.get("order");

    const existingFilters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (!["page", "search", "sort", "order"].includes(key)) {
        existingFilters[key] = value;
      }
    });

    handlePageChange({
      page,
      path,
      search: searchParam || undefined,
      filters: existingFilters,
      sort: sortParam || undefined,
      order: (orderParam as "asc" | "desc") || undefined,
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    pages.push(1);

    if (totalPages <= maxVisiblePages) {
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Showing {data.length} of {total} items
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageNavigation(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageNavigation(page as number)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlePageNavigation(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
