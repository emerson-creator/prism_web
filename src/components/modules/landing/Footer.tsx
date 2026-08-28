// Footer.tsx
"use client";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} Prism Store. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
