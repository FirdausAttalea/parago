"use client";

import { ReactNode } from "react";
import { AuthProvider as AuthProviderBase } from "@/lib/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderBase>{children}</AuthProviderBase>;
}
