"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, Phone, CheckCircle2, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .max(255, "Email maksimal 255 karakter")
      .email("Format email tidak valid (misal: user@domain.com)"),
    phoneNumber: z
      .string()
      .min(1, "Nomor telepon wajib diisi")
      .regex(/^[0-9]+$/, "Nomor telepon hanya boleh angka (numeric)")
      .min(10, "Nomor telepon minimal 10 digit")
      .max(15, "Nomor telepon maksimal 15 digit"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password wajib mengandung minimal 1 huruf besar (uppercase)")
      .regex(/[a-z]/, "Password wajib mengandung minimal 1 huruf kecil (lowercase)")
      .regex(/[0-9]/, "Password wajib mengandung minimal 1 angka")
      .regex(/[@$!%*?&]/, "Password wajib mengandung minimal 1 karakter spesial (@$!%*?&)"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password harus sama persis dengan Password",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const passwordRequirements = [
    { label: "Minimal 8 karakter", test: (pw: string) => pw.length >= 8 },
    { label: "Huruf besar (A-Z)", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "Huruf kecil (a-z)", test: (pw: string) => /[a-z]/.test(pw) },
    { label: "Angka (0-9)", test: (pw: string) => /[0-9]/.test(pw) },
    { label: "Simbol (@$!%*?&)", test: (pw: string) => /[@$!%*?&]/.test(pw) },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError("");
    localStorage.setItem("token", "bypass-mock-session-token");
    localStorage.setItem("user_email", data.email);
    router.push("/dashboard");
    setIsLoading(false);
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
              Enter your details to create a new fleet account.
            </p>

            {serverError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
                {serverError}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500"
                >
                  PHONE NUMBER (10 - 15 DIGITS)
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 transition focus-within:ring-2 ${
                    errors.phoneNumber
                      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200 bg-red-50/20"
                      : touchedFields.phoneNumber && !errors.phoneNumber
                      ? "border-emerald-500 focus-within:border-emerald-500 focus-within:ring-emerald-100 bg-emerald-50/10"
                      : "border-slate-200 focus-within:border-parago-blue focus-within:ring-parago-blue/20"
                  }`}
                >
                  <Phone className={`h-5 w-5 shrink-0 ${errors.phoneNumber ? "text-red-400" : "text-slate-400"}`} />
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="081234567890"
                    {...register("phoneNumber")}
                    className="w-full bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {touchedFields.phoneNumber && !errors.phoneNumber && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  )}
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.phoneNumber.message}
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
                    placeholder="Minimal 8 karakter"
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

                {/* Password Real-Time Requirement Checklist */}
                <div className="mt-2.5 rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    SYARAT KETENTUAN PASSWORD:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {passwordRequirements.map((req, idx) => {
                      const isFulfilled = req.test(passwordValue);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 transition-all ${
                            isFulfilled
                              ? "text-emerald-700 font-semibold"
                              : "text-slate-400"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] transition-all ${
                              isFulfilled
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {isFulfilled ? <Check className="h-3 w-3 stroke-[3]" /> : "•"}
                          </span>
                          <span>{req.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500"
                >
                  CONFIRM PASSWORD
                </label>
                <div
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 transition focus-within:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-200 bg-red-50/20"
                      : touchedFields.confirmPassword && !errors.confirmPassword
                      ? "border-emerald-500 focus-within:border-emerald-500 focus-within:ring-emerald-100 bg-emerald-50/10"
                      : "border-slate-200 focus-within:border-parago-blue focus-within:ring-parago-blue/20"
                  }`}
                >
                  <Lock className={`h-5 w-5 shrink-0 ${errors.confirmPassword ? "text-red-400" : "text-slate-400"}`} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Samakan dengan password"
                    {...register("confirmPassword")}
                    className="w-full bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="shrink-0 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Already have account */}
              <div className="flex justify-end pt-1">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-parago-blue hover:underline"
                >
                  Already have account?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-parago-peach to-parago-peachDark px-6 py-4 text-[15px] font-bold text-slate-900 shadow-md transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
              >
                {isLoading ? "Processing..." : "Create Account"}
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

              {/* Back to Login button */}
              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-6 py-4 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <LogIn className="h-5 w-5 text-parago-blue" />
                Sign in with Existing Account
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
