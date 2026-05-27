"use client";

import { ChevronDown } from "lucide-react";
import { categories } from "@/lib/data";

interface FilterPillsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar items-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition flex items-center gap-1 ${
            activeFilter === cat
              ? "bg-black text-white"
              : "bg-white text-black border border-black"
          } ${cat === "HOPE ON THE STAGE" ? "max-w-[140px]" : ""}`}
        >
          {cat === "HOPE ON THE STAGE" ? (
            <>
              <span className="truncate">HOPE ON THE STAGE</span>
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            </>
          ) : (
            cat
          )}
        </button>
      ))}
    </div>
  );
}
