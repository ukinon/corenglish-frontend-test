"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ComboboxItem {
  label: string;
  value: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  width?: string;
}

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyMessage = "No option found.",
  className,
  width = "200px",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedItem = items.find((item) => item.value === value);

  return (
    <div className="relative" style={{ width }}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn("w-full justify-between", className)}
        onClick={() => setOpen(!open)}
      >
        {selectedItem?.label || placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1  rounded-md border bg-popover p-1 text-popover-foreground shadow-md w-fit">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-48 rounded-sm border-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="max-h-[300px] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center text-sm">{emptyMessage}</div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => {
                      onValueChange?.(item.value === value ? "" : item.value);
                      setOpen(false);
                      setSearchValue("");
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === item.value && "bg-accent"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="w-full"> {item.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
