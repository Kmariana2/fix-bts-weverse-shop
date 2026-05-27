"use client";

import { useState, useMemo } from "react";
import { products } from "@/lib/data";
import FilterPills from "@/components/FilterPills";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "ALL") return products;
    return products.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <main>
      <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <ProductGrid products={filteredProducts} />
    </main>
  );
}
