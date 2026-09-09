"use client";

import { Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Testimonial {
  name: string;
  handle: string;
  avatar: string;
  stars: number;
  quote: string;
  product: {
    name: string;
    image: string;
  };
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    handle: "@sarahcreates",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    stars: 5,
    quote: "The Glide Gimbal transformed my vlogs. Smooth footage, zero setup. Worth every penny.",
    product: {
      name: "Glide 3-Axis Gimbal",
      image: "https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=80&h=80&fit=crop"
    }
  },
  {
    name: "Marcus Reid",
    handle: "@makermarcus",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    stars: 5,
    quote: "Prism makes it easy to find tools I actually use every day. The quality has been consistently excellent.",
    product: {
      name: "Orbit Desk Light",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop"
    }
  },
  {
    name: "Amelia Torres",
    handle: "@ameliamakes",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    stars: 5,
    quote: "Thoughtful gear, quick delivery, and support that feels human. Prism is now my first stop for studio essentials.",
    product: {
      name: "Focus Wireless Mic",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=80&h=80&fit=crop"
    }
  }
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = () => {
    const container = scrollRef.current;
    if (!container) return;
    // Calculate current slide index based on scroll position
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setActive(index);
  };

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: "smooth"
    });
    setActive(index);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <header className="text-center">
        <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
          Loved by creators
        </h2>
        <p className="mt-4 text-muted-foreground">
          See what our community is building with Prism gear.
        </p>
      </header>

      {/* Carousel container */}
      <div
        ref={scrollRef}
        onScroll={updateActive}
        className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible"
      >
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.handle}
            className="w-[85vw] shrink-0 snap-center rounded-xl border border-zinc-200 bg-white p-6 md:w-auto hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                loading="lazy"
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-zinc-900 truncate">
                  {testimonial.name}
                </h3>
                <p className="text-xs text-zinc-500 truncate">{testimonial.handle}</p>
              </div>
              <div className="flex shrink-0 gap-0.5" aria-label={`${testimonial.stars} out of 5 stars`}>
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>

            <blockquote className="mt-4 text-sm italic leading-relaxed text-zinc-700">
              “{testimonial.quote}”
            </blockquote>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-50 border border-zinc-100 px-3 py-1.5">
              <img
                src={testimonial.product.image}
                alt={testimonial.product.name}
                loading="lazy"
                className="h-6 w-6 rounded object-cover"
              />
              <span className="text-xs font-medium text-zinc-800">
                {testimonial.product.name}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile dots indicator */}
      <div className="mt-6 flex justify-center gap-2 md:hidden">
        {testimonials.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show testimonial ${index + 1}`}
            aria-current={active === index}
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all duration-200 ${
              active === index ? "bg-black w-4" : "bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
