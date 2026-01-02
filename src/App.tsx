import { FormEvent, useEffect, useRef, useState } from "react";
import { ClipboardList, Clock4, History, Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Switch } from "./components/ui/switch";
import { Textarea } from "./components/ui/textarea";
import {
  absenceBalances,
  absenceRequests,
  companyProfile,
  employeeProfile,
  historyEntries,
  preferenceToggles,
  taskOptions,
  teamAlerts,
  teamStatus,
} from "./data/mock-data";
import logoIcon from "./assets/inout360.png";

type BottomNavId = "panel" | "historial" | "tareas" | "perfil" | "ausencias" | "solicitudAusencia" | "admin";

type BottomNavItem = {
  id: BottomNavId;
  label: string;
  icon: typeof Clock4;
};

type MenuAction = {
  id: string;
  label: string;
  targetNav?: BottomNavId;
};

const bottomNavItems: BottomNavItem[] = [
  { id: "panel", label: "Fichar", icon: Clock4 },
  { id: "historial", label: "Historial", icon: History },
  { id: "tareas", label: "Tarea", icon: ClipboardList },
];

const absenceStatusStyles: Record<string, { bg: string; text: string }> = {
  aprobada: { bg: "bg-emerald-50", text: "text-emerald-700" },
  pendiente: { bg: "bg-amber-50", text: "text-amber-700" },
  rechazada: { bg: "bg-rose-50", text: "text-rose-700" },
};

const teamStatusBadgeStyles: Record<string, string> = {
  "En turno": "bg-emerald-50 text-emerald-700",
  "Pendiente de fichar": "bg-amber-50 text-amber-700",
  Incidencia: "bg-rose-50 text-rose-700",
  Descanso: "bg-slate-100 text-slate-600",
};

const alertSeverityStyles: Record<string, { bg: string; text: string; label: string }> = {
  alta: { bg: "bg-rose-50", text: "text-rose-700", label: "Alta" },
  media: { bg: "bg-amber-50", text: "text-amber-700", label: "Media" },
  baja: { bg: "bg-blue-50", text: "text-blue-700", label: "Baja" },
};

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .padEnd(2, "");
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [preferenceState, setPreferenceState] = useState<Record<string, boolean>>(() =>
    preferenceToggles.reduce((acc, pref) => {
      acc[pref.id] = pref.defaultChecked;
      return acc;
    }, {} as Record<string, boolean>)
  );
  const [absenceForm, setAbsenceForm] = useState({ start: "", end: "", reason: "" });
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [previousTask, setPreviousTask] = useState<string>("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const weeklySummary = getWeeklySummaryMinutes();
  const varianceLabel = weeklySummary.variance > 0 ? `+${formatDuration(weeklySummary.variance)}` : formatDuration(weeklySummary.variance);
  const totalAbsenceRemaining = absenceBalances.reduce((sum, balance) => sum + balance.remaining, 0);
  const onShiftMembers = teamStatus.filter((member) => member.status === "En turno").length;
  const pendingEntries = teamStatus.filter((member) => member.status === "Pendiente de fichar").length;
  const incidentMembers = teamStatus.filter((member) => member.status === "Incidencia").length;
  const pendingAlerts = teamAlerts.length;
  const today = new Date();
  const currentMonthRaw = today.toLocaleDateString("es-ES", { month: "long" });
  const currentMonth = currentMonthRaw.charAt(0).toUpperCase() + currentMonthRaw.slice(1);
  const currentYear = today.getFullYear();
  const menuActions: MenuAction[] = [
    { id: "admin", label: "Mi equipo", targetNav: "admin" },
    { id: "ausencias", label: "Ausencias", targetNav: "ausencias" },
    { id: "perfil", label: "Perfil", targetNav: "perfil" },
  ];

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  const handleMenuAction = (action: MenuAction) => {
    if (action.targetNav) {
      setActiveNav(action.targetNav);
    }
    setIsMenuOpen(false);
  };

  const handlePreferenceChange = (id: string, checked: boolean) => {
    setPreferenceState((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAbsenceFormChange = (field: "start" | "end" | "reason", value: string) => {
    setAbsenceForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAbsenceFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveNav("ausencias");
  };

  const handleTaskSelect = (value: string) => {
    setPreviousTask(selectedTask);
    setSelectedTask(value);
  };

  const handleFinishTask = () => {
    setSelectedTask("");
    setPreviousTask("");
  };

  return (
    <div className="min-h-screen bg-background/80">
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-slate-100 bg-white/95 px-6 py-4 shadow-[0_18px_45px_rgba(80,64,172,0.18)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl bg-primary/15 p-2">
              <img src={logoIcon} alt="InOut360" className="h-10 w-10 object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">InOut360</p>
              <p className="text-xs text-slate-400">Control horario</p>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30"
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-14 w-48 space-y-2 rounded-2xl border border-slate-100 bg-white/95 p-2 text-left shadow-[0_18px_40px_rgba(15,23,42,0.15)]">
                {menuActions.map((action) => (
                  <button
                    key={action.id}
                    className="w-full rounded-xl bg-slate-900/5 px-3 py-2 text-center text-sm font-semibold text-slate-900 transition hover:bg-primary hover:text-white"
                    onClick={() => handleMenuAction(action)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-5xl px-6 pt-[110px] pb-36">
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

            <div className="rounded-[28px] bg-white px-6 py-5 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between text-sm uppercase tracking-wide text-slate-500">
                <span>Acumulados</span>
                
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Mes</p>
                  <p className="text-2xl font-semibold text-slate-900">{currentMonth}</p>
                  <p className="text-2xl font-semibold text-slate-900">145:00 h</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Año</p>
                  <p className="text-2xl font-semibold text-slate-900">{currentYear}</p>
                  <p className="text-2xl font-semibold text-slate-900">930:30 h</p>
                </div>
              </div>
              
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

        {activeNav === "admin" && (
          <div className="space-y-6">
            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Panel del equipo</p>
                  <h2 className="mt-2 text-2xl font-semibold">Situación general</h2>
                  <p className="text-sm text-slate-500">Supervisa asistencia, incidencias y alertas pendientes.</p>
                </div>
                <Button variant="outline" size="sm">
                  Exportar resumen
                </Button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase text-slate-500">En turno</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{onShiftMembers}</p>
                  <p className="text-sm text-slate-500">Operativos ahora mismo</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase text-slate-500">Pendientes</p>
                  <p className="mt-2 text-3xl font-semibold text-amber-600">{pendingEntries}</p>
                  <p className="text-sm text-slate-500">Sin fichar</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase text-slate-500">Incidencias</p>
                  <p className="mt-2 text-3xl font-semibold text-rose-600">{incidentMembers}</p>
                  <p className="text-sm text-slate-500">Bloqueos registrados</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase text-slate-500">Alertas</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{pendingAlerts}</p>
                  <p className="text-sm text-slate-500">Por revisar</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Mi equipo</p>
                  <p className="text-sm text-slate-500">Detalle de asistencia y actividad en curso.</p>
                </div>
                <Button size="sm" variant="outline">
                  Actualizar datos
                </Button>
              </div>
              <div className="mt-6 space-y-4">
                {teamStatus.map((member) => {
                  const statusClasses = teamStatusBadgeStyles[member.status] ?? "bg-slate-100 text-slate-600";
                  return (
                    <div key={member.id} className="rounded-2xl border border-slate-100 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={`Avatar de ${member.name}`}
                              className="h-12 w-12 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-base font-semibold text-slate-600">
                              {getInitials(member.name)}
                            </div>
                          )}
                          <div>
                            <p className="text-base font-semibold text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-500">
                              {member.role} · {member.shift}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}>{member.status}</span>
                      </div>
                      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase text-slate-400">Entrada</p>
                          <p className="text-base font-semibold text-slate-900">{member.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-400">Ubicación</p>
                          <p className="text-base font-semibold text-slate-900">{member.location || "No asignado"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-400">Actividad</p>
                          <p className="text-base font-semibold text-slate-900">{member.activeTask || "Sin tarea"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Alertas pendientes</p>
                  <p className="text-sm text-slate-500">Revisa las incidencias antes del cierre del turno.</p>
                </div>
                <Button variant="outline" size="sm">
                  Marcar como revisadas
                </Button>
              </div>
              <div className="mt-4 space-y-4">
                {teamAlerts.map((alert) => {
                  const severity = alertSeverityStyles[alert.severity] ?? alertSeverityStyles.baja;
                  return (
                    <div key={alert.id} className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{alert.title}</p>
                          <p className="text-sm text-slate-500">{alert.description}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${severity.bg} ${severity.text}`}>
                          Severidad {severity.label}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                        <span>{alert.area}</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {teamAlerts.length === 0 && <p className="text-sm text-slate-500">No hay alertas pendientes.</p>}
            </section>
          </div>
        )}

        {activeNav === "tareas" && (
          <section className="space-y-6 rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Gestión de tareas</p>
              <h2 className="mt-2 text-2xl font-semibold">Selecciona la actividad que vas a iniciar</h2>
              <p className="text-sm text-slate-500">Recuerda actualizarla cada vez que cambies de puesto para mantener la trazabilidad.</p>
            </div>
            {selectedTask && (
              <div className="rounded-2xl bg-slate-50 px-[0] py-3 text-left text-sm text-slate-600">
                <p className="text-left text-xs uppercase text-slate-400">Tarea actual</p>
                <p className="text-lg font-semibold text-slate-900">{selectedTask}</p>
              </div>
            )}
            {selectedTask && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleFinishTask}>
                  Finalizar tarea
                </Button>
              </div>
            )}
            <div>
              <label htmlFor="task-picker" className="text-xs uppercase tracking-wide text-slate-500">
                Seleccionar nueva tarea 
              </label>
              <Select value={selectedTask} onValueChange={handleTaskSelect}>
                <SelectTrigger id="task-picker" className="mt-2 h-12 w-full rounded-2xl border border-slate-200 text-left">
                  <SelectValue placeholder="Elige una tarea" />
                </SelectTrigger>
                <SelectContent className="w-[320px]">
                  {taskOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        )}

        {activeNav === "ausencias" && (
          <div className="space-y-6">
            <section className="flex flex-col gap-6 rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Resumen de ausencias</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{totalAbsenceRemaining} días disponibles</p>
                  <p className="text-sm text-slate-500">Incluye vacaciones, asuntos propios y formación</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {absenceBalances.map((balance) => (
                  <div
                    key={balance.id}
                    className="grid h-[200px] grid-rows-[minmax(48px,auto)_1fr_auto] place-items-center rounded-2xl bg-slate-50 px-4 py-5 text-center"
                  >
                    <p className="flex w-full items-center justify-center text-center text-xs uppercase leading-tight text-slate-500">{balance.label}</p>
                    <p className="self-center text-3xl font-semibold text-slate-900">{balance.remaining}</p>
                    <p className="text-xs text-slate-500">de {balance.total} días</p>
                  </div>
                ))}
              </div>
              <Button size="sm" className="self-end" onClick={() => setActiveNav("solicitudAusencia")}>
                Solicitar nueva ausencia
              </Button>
            </section>

            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Solicitudes recientes</p>
                  <p className="text-sm text-slate-500">Estado y detalles de tus últimas peticiones</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver historial completo
                </Button>
              </div>
              <div className="mt-4 space-y-4">
                {absenceRequests.map((request) => {
                  const styleKey = request.status.toLowerCase();
                  const statusStyle = absenceStatusStyles[styleKey] ?? { bg: "bg-slate-100", text: "text-slate-600" };
                  return (
                    <div key={request.id} className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{request.type}</p>
                          <p className="text-xs text-slate-500">{request.dateRange}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>{request.status}</span>
                      </div>
                      <div className="mt-3 grid gap-3 text-sm text-slate-600">
                        <div>
                          <p className="text-xs uppercase text-slate-400">Días</p>
                          <p className="text-base font-semibold text-slate-900">{request.days}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-400">Aprobador</p>
                          <p className="text-base font-semibold text-slate-900">{request.approver}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-400">Nota</p>
                          <p className="text-base font-semibold text-slate-900">{request.note}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeNav === "solicitudAusencia" && (
          <div className="space-y-6">
            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Nueva solicitud</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Registra tu ausencia</h2>
                <p className="text-sm text-slate-500">Indica el rango de fechas y el motivo para enviar la petición a RRHH.</p>
              </div>
              <form className="mt-6 space-y-5" onSubmit={handleAbsenceFormSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="absence-start" className="text-xs uppercase tracking-wide text-slate-500">
                      Desde
                    </label>
                    <Input
                      id="absence-start"
                      type="date"
                      value={absenceForm.start}
                      onChange={(event) => handleAbsenceFormChange("start", event.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="absence-end" className="text-xs uppercase tracking-wide text-slate-500">
                      Hasta
                    </label>
                    <Input
                      id="absence-end"
                      type="date"
                      value={absenceForm.end}
                      onChange={(event) => handleAbsenceFormChange("end", event.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="absence-reason" className="text-xs uppercase tracking-wide text-slate-500">
                    Motivo
                  </label>
                  <Textarea
                    id="absence-reason"
                    rows={5}
                    className="mt-2"
                    placeholder="Describe brevemente la razón de tu ausencia"
                    value={absenceForm.reason}
                    onChange={(event) => handleAbsenceFormChange("reason", event.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="outline" onClick={() => setActiveNav("ausencias")}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!absenceForm.start || !absenceForm.end || !absenceForm.reason.trim()}>
                    Enviar solicitud
                  </Button>
                </div>
              </form>
            </section>
          </div>
        )}

        {activeNav === "perfil" && (
          <div className="space-y-6">
            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <p className="text-xs uppercase tracking-wide text-slate-500">Datos de la empresa</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{companyProfile.name}</h2>
              <p className="text-sm text-slate-500">{companyProfile.sector}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase text-slate-400">CIF</dt>
                  <dd className="text-base font-semibold text-slate-900">{companyProfile.taxId}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Teléfono</dt>
                  <dd className="text-base font-semibold text-slate-900">{companyProfile.contactPhone}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase text-slate-400">Email</dt>
                  <dd className="text-base font-semibold text-slate-900">{companyProfile.contactEmail}</dd>
                  <dt className="mt-4 text-xs uppercase text-slate-400">Ubicación</dt>
                  <dd className="text-base font-semibold text-slate-900">{companyProfile.address}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Ficha del empleado</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{employeeProfile.name}</p>
                  <p className="text-sm text-slate-500">{employeeProfile.role}</p>
                </div>
                <Button variant="outline" size="sm">
                  Editar perfil
                </Button>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase text-slate-400">ID empleado</dt>
                  <dd className="text-base font-semibold text-slate-900">{employeeProfile.employeeId}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Departamento</dt>
                  <dd className="text-base font-semibold text-slate-900">{employeeProfile.department}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Responsable</dt>
                  <dd className="text-base font-semibold text-slate-900">{employeeProfile.manager}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Ubicación</dt>
                  <dd className="text-base font-semibold text-slate-900">{employeeProfile.location}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Turno</dt>
                  <dd className="text-base font-semibold text-slate-900">{employeeProfile.shift}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-400">Antigüedad</dt>
                  <dd className="text-base font-semibold text-slate-900">{employeeProfile.seniority}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-[28px] bg-white px-6 py-6 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Personalización</p>
                  <p className="mt-1 text-base text-slate-500">Activa o desactiva las opciones disponibles para tu jornada.</p>
                </div>
                <Button size="sm" variant="outline">
                  Guardar cambios
                </Button>
              </div>
              <div className="mt-4 space-y-4">
                {preferenceToggles.map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="pr-3">
                      <p className="text-sm font-semibold text-slate-900">{pref.label}</p>
                      <p className="text-xs text-slate-500">{pref.description}</p>
                    </div>
                    <Switch
                      checked={preferenceState[pref.id] ?? pref.defaultChecked}
                      onCheckedChange={(checked) => handlePreferenceChange(pref.id, checked)}
                      aria-label={`Cambiar ${pref.label}`}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 px-6 py-5">
        <div className="mx-auto flex w-full max-w-5xl gap-3 rounded-[32px] bg-slate-50 p-3 shadow-[0_18px_35px_rgba(15,23,42,0.15)]">
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
