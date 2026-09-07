import { fetchProducts } from "@/libs/api";
import { ProductGrid } from "@/components/modules/product/ProductGrid";

export const revalidate = 60; // revalida el catálogo cada 60s

export default async function ProductosPage() {
  const { data: products, meta } = await fetchProducts({ limit: 24 });

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Catálogo
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {meta.totalItems} producto{meta.totalItems === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <ProductGrid products={products} />
    </main>
  );
}
