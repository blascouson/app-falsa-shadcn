import { useState } from "react";
import { ClipboardList, Clock4, History, Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import { historyEntries } from "./data/mock-data";
import logoIcon from "./assets/icono_inout360.jpg";

type BottomNavId = "panel" | "historial" | "tareas";

type BottomNavItem = {
  id: BottomNavId;
  label: string;
  icon: typeof Clock4;
};

const bottomNavItems: BottomNavItem[] = [
  { id: "panel", label: "Fichar", icon: Clock4 },
  { id: "historial", label: "Historial", icon: History },
  { id: "tareas", label: "Tarea", icon: ClipboardList },
];

const WEEKLY_TARGET_MINUTES = 40 * 60;

function parseDurationToMinutes(value: string) {
  const match = value.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/i);
  if (!match) return 0;
  const hours = match[1] ? Number(match[1]) : 0;
  const minutes = match[2] ? Number(match[2]) : 0;
  return hours * 60 + minutes;
}

function formatDuration(totalMinutes: number) {
  const absoluteMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absoluteMinutes / 60);
  const minutes = absoluteMinutes % 60;
  const sign = totalMinutes < 0 ? "-" : "";
  return `${sign}${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function getWeeklySummaryMinutes() {
  const actualMinutes = historyEntries.reduce((sum, entry) => sum + parseDurationToMinutes(entry.total), 0);
  const variance = actualMinutes - WEEKLY_TARGET_MINUTES;
  const progress = Math.max(0, Math.min(100, Math.round((actualMinutes / WEEKLY_TARGET_MINUTES) * 100)));
  return {
    actualMinutes,
    variance,
    progress,
    formattedActual: formatDuration(actualMinutes),
    formattedTarget: formatDuration(WEEKLY_TARGET_MINUTES),
  };
}

export default function App() {
  const [activeNav, setActiveNav] = useState<BottomNavId>("panel");
  const weeklySummary = getWeeklySummaryMinutes();
  const varianceLabel = weeklySummary.variance > 0 ? `+${formatDuration(weeklySummary.variance)}` : formatDuration(weeklySummary.variance);

  return (
    <div className="min-h-screen bg-background/80">
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-slate-100 bg-white/95 px-4 py-4 shadow-[0_18px_45px_rgba(80,64,172,0.18)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl bg-primary/15 p-2">
              <img src={logoIcon} alt="InOut360" className="h-10 w-10 object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">InOut360</p>
              <p className="text-xs text-slate-400">Control horario</p>
            </div>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30" aria-label="Abrir menú">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-md px-4 pt-[100px] pb-32">
        {activeNav === "panel" && (
          <div className="space-y-4">
            <div className="rounded-[28px] bg-white/80 p-6 text-center shadow-[0_25px_60px_rgba(8,8,20,0.15)]">
              <p className="mb-6 text-2xl font-semibold text-slate-800">Registra tu jornada</p>
              <Button size="lg" className="h-16 w-full rounded-[32px] text-lg">
                Entrada / Salida
              </Button>
            </div>
            <div className="rounded-[28px] bg-white px-6 py-5 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between text-sm uppercase tracking-wide text-slate-500">
                <span>Turno actual</span>
                <span>08:00 - 16:00</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Inicio</p>
                  <p className="text-2xl font-semibold text-slate-900">08:02h</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Fin</p>
                  <p className="text-2xl font-semibold text-slate-900">2:30 Activo</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] bg-white px-6 py-5 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between text-sm uppercase tracking-wide text-slate-500">
                <span>Semana actual</span>
                <span>Horas</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Acumuladas</p>
                  <p className="text-2xl font-semibold text-slate-900">{weeklySummary.formattedTarget}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Realizadas</p>
                  <p className="text-2xl font-semibold text-slate-900">{weeklySummary.formattedActual}</p>
                </div>
              </div>
              <div className="mt-5 h-3 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary" style={{ width: `${weeklySummary.progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">{weeklySummary.progress}% completado · {varianceLabel} vs plan</p>
            </div>
          </div>
        )}

        {activeNav === "historial" && (
          <div className="space-y-6">
            <div className="rounded-[28px] bg-white px-6 py-5 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <p className="text-sm uppercase tracking-wide text-slate-500">Resumen semanal</p>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-500">Realizadas</p>
                  <p className="text-3xl font-semibold text-slate-900">{weeklySummary.formattedActual}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Objetivo</p>
                  <p className="text-lg font-semibold text-slate-700">{weeklySummary.formattedTarget}</p>
                  <p className="text-xs text-slate-500">{varianceLabel} vs plan</p>
                </div>
              </div>
              <div className="mt-5 h-3 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary" style={{ width: `${weeklySummary.progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-slate-500">{weeklySummary.progress}% de las horas planeadas completadas.</p>
            </div>
            <div className="space-y-3">
              {historyEntries.map((entry) => (
                <div key={entry.id} className="rounded-[24px] border border-slate-100 bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{entry.date}</p>
                      <p className="text-xs text-slate-500">{entry.location}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{entry.status}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <span>
                      {entry.checkIn} - {entry.checkOut}
                    </span>
                    <span>{entry.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeNav === "tareas" && (
          <div className="rounded-[28px] bg-white/90 p-8 text-center text-slate-600 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
            <p className="text-lg font-semibold text-slate-900">Gestión de tareas</p>
            <p className="mt-2 text-sm">Próximamente podrás seleccionar y pausar tareas desde esta vista.</p>
          </div>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-4 py-4">
        <div className="mx-auto flex w-full max-w-md gap-2 rounded-[32px] bg-slate-50 p-2 shadow-[0_18px_35px_rgba(15,23,42,0.15)]">
          {bottomNavItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                className={`flex-1 rounded-[24px] px-3 py-2 text-center text-xs font-semibold transition-all ${
                  isActive ? "bg-white text-primary shadow-[0_12px_20px_rgba(80,64,172,0.2)]" : "text-slate-500"
                }`}
                onClick={() => setActiveNav(item.id)}
              >
                <div className="flex flex-col items-center gap-1">
                  <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
