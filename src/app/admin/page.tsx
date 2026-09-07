import Link from "next/link";
import { Package, Tag } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Admin overview
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Manage your store&apos;s products and categories.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="flex items-center gap-3 rounded-2xl border border-border p-5 transition-colors hover:bg-muted/40"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Package
              className="h-[18px] w-[18px] text-foreground"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <p className="text-[13.5px] font-medium text-foreground">
              Products
            </p>
            <p className="text-[12px] text-muted-foreground">
              Add, edit, or remove products
            </p>
          </div>
        </Link>

        <Link
          href="/admin/categories"
          className="flex items-center gap-3 rounded-2xl border border-border p-5 transition-colors hover:bg-muted/40"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Tag
              className="h-[18px] w-[18px] text-foreground"
              strokeWidth={1.75}
            />
          </div>
          <div>
            <p className="text-[13.5px] font-medium text-foreground">
              Categories
            </p>
            <p className="text-[12px] text-muted-foreground">
              Organize your product catalog
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
