"use client";

import { mainTabs } from "@/lib/data";

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-6 px-4 py-3 border-b border-[#E5E5E5] overflow-x-auto hide-scrollbar">
      {mainTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`whitespace-nowrap text-sm font-medium pb-2 transition ${
            activeTab === tab
              ? "text-black border-b-2 border-black"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
