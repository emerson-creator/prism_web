export function Newsletter() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-heading text-2xl font-semibold">
          Get 10% off your first order
        </h2>
        <p className="mt-2 text-primary-foreground/70">
          Join the list for new arrivals and early access to sales.
        </p>
        <form className="mt-6 flex max-w-sm mx-auto gap-2">
          <input
            type="email"
            required
            placeholder="you@email.com"
            className="flex-1 rounded-md bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-2 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
