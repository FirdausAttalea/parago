"use client";

import { Fragment } from "react";
import { X, CheckCircle2, Car, FileText, AlertTriangle } from "lucide-react";
import {
  notifications,
  type Notification,
  type NotificationType,
} from "@/lib/data";

type Props = {
  open: boolean;
  onClose: () => void;
};

const typeStyles: Record<
  NotificationType,
  {
    border: string;
    iconBg: string;
    iconColor: string;
    icon: React.ElementType;
    card: string;
  }
> = {
  approved: {
    border: "border-l-4 border-amber-400",
    iconBg: "bg-amber-400",
    iconColor: "text-slate-900",
    icon: CheckCircle2,
    card: "bg-white",
  },
  ready: {
    border: "border-l-4 border-parago-navy",
    iconBg: "bg-blue-100",
    iconColor: "text-parago-blue",
    icon: Car,
    card: "bg-white",
  },
  policy: {
    border: "border-l-4 border-slate-200",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    icon: FileText,
    card: "bg-white",
  },
  maintenance: {
    border: "border-l-4 border-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    icon: AlertTriangle,
    card: "bg-red-50/60",
  },
};

/** Renders "**bold**" segments inside a description string as <strong>. */
function renderDescription(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function NotificationCard({ notification }: { notification: Notification }) {
  const style = typeStyles[notification.type];
  const Icon = style.icon;
  const isMaintenance = notification.type === "maintenance";

  return (
    <div
      className={`rounded-2xl ${style.border} ${style.card} p-4 shadow-sm ring-1 ring-slate-100`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
        >
          <Icon className={`h-4.5 w-4.5 ${style.iconColor}`} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-[15px] font-bold ${
                isMaintenance ? "text-red-700" : "text-parago-navy"
              }`}
            >
              {notification.title}
            </h3>
            <span className="shrink-0 text-[11px] font-medium text-slate-400">
              {notification.timestamp}
            </span>
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {renderDescription(notification.description)}
          </p>

          <div className="mt-3 flex items-center gap-4">
            {notification.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={`text-xs font-bold tracking-wide ${
                  action.variant === "primary"
                    ? isMaintenance
                      ? "text-red-600 hover:underline"
                      : "text-parago-blue hover:underline"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationCenter({ open, onClose }: Props) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Notification Center"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 pb-5 pt-6">
          <div>
            <p className="text-xs font-bold tracking-widest2 text-amber-500">
              UPDATES
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-parago-navy">
              Notification Center
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification center"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-5">
          <button
            type="button"
            className="flex-1 rounded-xl bg-parago-navyDeep py-3 text-sm font-semibold text-white transition hover:bg-parago-navy"
          >
            Mark all as read
          </button>
          <button
            type="button"
            className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}