const items = [
  { label: "Free shipping", detail: "On orders over $75" },
  { label: "Easy returns", detail: "30 days, no questions" },
  { label: "Secure checkout", detail: "Powered by Stripe" },
];

export function TrustStrip() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid gap-8 sm:grid-cols-3 text-center sm:text-left">
        {items.map((item) => (
          <div key={item.label}>
            <p className="font-medium text-foreground">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
