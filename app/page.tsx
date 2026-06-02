"use client";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "@/lib/data";
import FilterPills from "@/components/FilterPills";
import ProductGrid from "@/components/ProductGrid";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A–Z",
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeFilter !== "ALL") {
      result = result.filter((p) => p.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [activeFilter, searchQuery, sortBy]);

  return (
    <main>
      {/* Search + Sort bar */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search merch…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00B8D4] focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-full transition ${
              sortBy !== "default"
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
            }`}
            aria-label="Sort products"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort</span>
          </button>

          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[180px]">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition ${
                      sortBy === opt
                        ? "text-[#00B8D4] font-semibold bg-[#00B8D4]/5"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {SORT_LABELS[opt]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <Search className="w-12 h-12 text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium">No items found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term or category</p>
          <button
            onClick={() => { setSearchQuery(""); setActiveFilter("ALL"); setSortBy("default"); }}
            className="mt-4 text-sm text-[#00B8D4] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {(searchQuery || activeFilter !== "ALL" || sortBy !== "default") && (
            <p className="px-4 pb-1 text-xs text-gray-400">
              {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}
          <ProductGrid products={filteredProducts} />
        </>
      )}
    </main>
  );
}
