"use client";

import React, { useEffect, useState } from "react";
import { Combobox, ComboboxItem } from "./ui/combobox";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { usePathname, useSearchParams } from "next/navigation";

interface FilterInputProps {
  options: ComboboxItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  paramName?: string;
  className?: string;
  width?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  includeAllOption?: boolean;
}

export default function FilterInput({
  options,
  placeholder = "Select filter...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found.",
  paramName = "filter",
  className,
  width = "200px",
  value,
  onValueChange,
  defaultValue,
  includeAllOption = true,
}: FilterInputProps) {
  const { handlePageChange, filters } = useSearchQuery();
  const searchParams = useSearchParams();
  const [selectedValue, setSelectedValue] = useState<string>(value || "");
  const path = usePathname();

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (
      !value &&
      defaultValue &&
      !filters[`${paramName}`] &&
      selectedValue !== defaultValue
    ) {
      handleValueChange(defaultValue);
    }
  }, [defaultValue, filters, paramName]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);

    if (onValueChange) {
      onValueChange(newValue);
    }

    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");
    const orderParam = searchParams.get("order");

    const existingFilters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (
        !["page", "search", "sort", "order"].includes(key) &&
        key !== paramName
      ) {
        existingFilters[key] = value;
      }
    });

    if (newValue) {
      existingFilters[paramName] = newValue;
    }

    handlePageChange({
      page: 1,
      path,
      search: searchParam || undefined,
      filters: existingFilters,
      sort: sortParam || undefined,
      order: (orderParam as "asc" | "desc") || undefined,
    });
  };

  return (
    <Combobox
      items={[
        ...(includeAllOption
          ? [
              {
                label: "All",
                value: "",
              } as ComboboxItem,
            ]
          : []),
        ...options,
      ]}
      value={selectedValue || searchParams.get(paramName) || ""}
      onValueChange={handleValueChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
      className={className}
      width={width}
    />
  );
}
