import { products } from "@/lib/data";
import ProductPageClient from "./ProductPageClient";

export function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductPageClient id={Number(id)} />;
}
