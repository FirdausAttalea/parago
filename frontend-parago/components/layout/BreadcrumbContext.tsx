"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Crumb = { label: string };

type BreadcrumbContextValue = {
  crumbs: Crumb[];
  setCrumbs: (crumbs: Crumb[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const value = useMemo(() => ({ crumbs, setCrumbs }), [crumbs]);
  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return ctx;
}

/** Call this in a page to set the topbar breadcrumb trail while it's mounted. */
export function usePageBreadcrumb(crumbs: Crumb[]) {
  const { setCrumbs } = useBreadcrumb();
  const key = crumbs.map((c) => c.label).join(">");

  useEffect(() => {
    setCrumbs(crumbs);
    return () => setCrumbs([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}