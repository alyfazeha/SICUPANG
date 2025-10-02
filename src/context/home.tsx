"use client";

import { createContext, type ReactNode, type RefObject, useContext, useRef } from "react";

type ScrollReferences = {
  hero: RefObject<HTMLElement | null>;
  benefits: RefObject<HTMLElement | null>;
  about: RefObject<HTMLElement | null>;
}

const ScrollContext = createContext<ScrollReferences | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const hero = useRef<HTMLElement>(null);
  const benefits = useRef<HTMLElement>(null);
  const about = useRef<HTMLElement>(null);

  return (
    <ScrollContext.Provider value={{ hero, benefits, about }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) throw new Error("useScroll must be used within a ScrollProvider");
  return context;
}