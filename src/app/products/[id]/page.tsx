import { notFound } from "next/navigation";
import { fetchProductById } from "@/libs/api";
import { AddToCartPanel } from "@/components/modules/product/AddToCartPanel";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("ProductDetailPage params:", params);

  let product;
  try {
    product = await fetchProductById(id);
  } catch {
    notFound();
  }

  if (!product || !product.isActive) {
    notFound();
  }

  const outOfStock = product.stock <= 0;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                width="56"
                height="52"
                viewBox="0 0 26 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-[0.12]"
              >
                <path
                  d="M9 12L1 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path d="M9 3L16.5 12L9 21Z" fill="currentColor" />
              </svg>
            </div>
          )}

          {outOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[12px] font-medium text-muted-foreground backdrop-blur-sm">
              Out of stock
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-[12.5px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-1.5 font-heading text-2xl font-semibold tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="mt-3 text-xl font-semibold text-foreground">
            {currency.format(product.price)}
          </p>

          <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartPanel product={product} />
          </div>

          <dl className="mt-8 space-y-2 border-t border-border pt-6 text-[12.5px]">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">SKU</dt>
              <dd className="text-foreground">{product.sku}</dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
