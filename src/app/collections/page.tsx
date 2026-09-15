// app/collections/page.tsx
import { fetchCategories } from "@/libs/api";
import { CollectionsGrid } from "@/components/modules/collections/CollectionsGrid";

export const revalidate = 60;

export default async function CollectionsPage() {
  const { data: categories } = await fetchCategories({ limit: 100 });

  return (
    <main>
      <section className="relative overflow-hidden">
        <RefractionBackdrop />

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mb-12 md:mb-16">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Collections
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Browse products by collection.
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              No collections available yet.
            </p>
          ) : (
            <CollectionsGrid categories={categories} />
          )}
        </div>
      </section>
    </main>
  );
}

/**
 * Pure CSS/SVG stand-in for a photo: the PrismMark's single beam,
 * entering from the left edge and splitting into the spectrum,
 * rendered large and soft as the section's backdrop. No image asset.
 */
function RefractionBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 bg-background"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <filter id="beam-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>

        {/* soft glow pass — the color */}
        <g filter="url(#beam-blur)" opacity="0.4">
          <line
            x1="-100"
            y1="360"
            x2="620"
            y2="360"
            stroke="#0a0a0a"
            strokeWidth="4"
          />
          <line
            x1="620"
            y1="360"
            x2="1700"
            y2="40"
            stroke="#6366f1"
            strokeWidth="12"
          />
          <line
            x1="620"
            y1="360"
            x2="1700"
            y2="360"
            stroke="#ec4899"
            strokeWidth="12"
          />
          <line
            x1="620"
            y1="360"
            x2="1700"
            y2="680"
            stroke="#f59e0b"
            strokeWidth="12"
          />
        </g>

        {/* crisp trace on top, faint — reads as intentional linework, not just a blur */}
        <g opacity="0.14" strokeLinecap="round">
          <line
            x1="-100"
            y1="360"
            x2="620"
            y2="360"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <line
            x1="620"
            y1="360"
            x2="1700"
            y2="40"
            stroke="#6366f1"
            strokeWidth="1.5"
          />
          <line
            x1="620"
            y1="360"
            x2="1700"
            y2="360"
            stroke="#ec4899"
            strokeWidth="1.5"
          />
          <line
            x1="620"
            y1="360"
            x2="1700"
            y2="680"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}
