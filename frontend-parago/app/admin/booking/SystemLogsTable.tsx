import type { LogStatus } from "@/lib/bookingData";

const statusStyles: Record<LogStatus, string> = {
  SYSTEM: "bg-blue-100 text-parago-blue",
  MANUAL: "bg-amber-100 text-amber-700",
  AUTO: "bg-slate-100 text-slate-600",
};

export default function SystemLogsTable({
  logs,
}: {
  logs: {
    event: string;
    timestamp: string;
    identity: string;
    status: LogStatus;
  }[];
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">System Logs</h2>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold tracking-wide text-slate-400">
              <th className="pb-3 pr-4 font-bold">EVENT</th>
              <th className="pb-3 pr-4 font-bold">TIMESTAMP</th>
              <th className="pb-3 pr-4 font-bold">IDENTITY</th>
              <th className="pb-3 font-bold">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.event + log.timestamp}>
                <td className="py-4 pr-4 text-[15px] font-semibold text-slate-900">
                  {log.event}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-500">
                  {log.timestamp}
                </td>
                <td className="py-4 pr-4 text-sm text-slate-500">
                  {log.identity}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-md px-2.5 py-1 text-[11px] font-extrabold tracking-wide ${
                      statusStyles[log.status]
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}