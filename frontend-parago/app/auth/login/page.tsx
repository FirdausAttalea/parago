"use client";

import { useState, Suspense } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid (misal: user@domain.com)"),
  password: z
    .string()
    .min(1, "Password wajib diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // REAL-TIME VALIDATION saat ngetik & blur
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      router.push("/dashboard/tracking");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Email atau password salah. Silakan periksa kembali data Anda.";
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#f5f6f8] p-4 md:p-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-panel md:grid md:grid-cols-2">
        {/* ---------------- LEFT PANEL ---------------- */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0A0E27] via-[#0A0E27] to-[#241305] p-10 md:flex lg:p-14">
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(217,185,138,0.35), transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 80%, white 0.5px, transparent 0.5px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <Image
              src="/logo-parago.png"
              alt="ParaGo Logo"
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>

          {/* Headline block */}
          <div className="relative z-10 mt-16">
            <p className="mb-5 text-xs font-semibold tracking-widest2 text-parago-gold">
              EXECUTIVE LOGISTICS
            </p>
            <h1 className="text-4xl font-bold leading-[1.15] text-white lg:text-5xl">
              Precision engineering
              <br />
              for your global
              <br />
              journey.
            </h1>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-300/80">
              Access your fleet management suite with institutional-grade
              security and architectural clarity.
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-16 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="h-9 w-9 rounded-full border-2 border-[#0A0E27] bg-gradient-to-br from-slate-600 to-slate-800" />
                <div className="h-9 w-9 rounded-full border-2 border-[#0A0E27] bg-gradient-to-br from-amber-700 to-amber-900" />
              </div>
              <p className="text-sm text-slate-300/80">
                Trusted by 500+ global enterprises.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT PANEL (FORM) ---------------- */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <Image
              src="/logo-parago.png"
              alt="ParaGo Logo"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>

          <div className="mx-auto w-full max-w-md">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Welcome Team!
            </h2>
            <p className="mt-2 text-[15px] font-medium text-parago-blue/90">
              Enter your credentials to manage your fleet.
            </p>

            {isRegistered && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.
              </div>
            )}

            {serverError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
                {serverError}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500"
                >
                  CORPORATE EMAIL
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 transition focus-within:ring-2 ${
                    errors.email
                      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200 bg-red-50/20"
                      : touchedFields.email && !errors.email
                      ? "border-emerald-500 focus-within:border-emerald-500 focus-within:ring-emerald-100 bg-emerald-50/10"
                      : "border-slate-200 focus-within:border-parago-blue focus-within:ring-parago-blue/20"
                  }`}
                >
                  <Mail className={`h-5 w-5 shrink-0 ${errors.email ? "text-red-400" : "text-slate-400"}`} />
                  <input
                    id="email"
                    type="email"
                    placeholder="executive@domain.com"
                    {...register("email")}
                    className="w-full bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {touchedFields.email && !errors.email && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500 animate-fadeIn">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500"
                >
                  PASSWORD
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 transition focus-within:ring-2 ${
                    errors.password
                      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200 bg-red-50/20"
                      : touchedFields.password && !errors.password
                      ? "border-emerald-500 focus-within:border-emerald-500 focus-within:ring-emerald-100 bg-emerald-50/10"
                      : "border-slate-200 focus-within:border-parago-blue focus-within:ring-parago-blue/20"
                  }`}
                >
                  <Lock className={`h-5 w-5 shrink-0 ${errors.password ? "text-red-400" : "text-slate-400"}`} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500 animate-fadeIn">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm font-medium text-parago-blue hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button - DISABLED JIKA TIDAK VALID */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-parago-peach to-parago-peachDark px-6 py-4 text-[15px] font-bold text-slate-900 shadow-md transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
              >
                {isLoading ? "Signing in..." : "Access Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 pt-2">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold tracking-wider text-slate-400">
                  ENTERPRISE ACCESS
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Register */}
              <Link
                href="/auth/register"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 py-4 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <UserPlus className="h-5 w-5 text-parago-blue" />
                Register
              </Link>
            </form>

            <p className="mt-10 text-center text-xs text-slate-400">
              Secure connection via TLS 1.3 • © {new Date().getFullYear()}{" "}
              Company Fleet Systems
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Memuat...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}