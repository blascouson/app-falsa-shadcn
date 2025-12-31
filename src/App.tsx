import { useState } from "react";
import { ClipboardList, Clock4, History, Menu } from "lucide-react";
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

export default function App() {
  const [activeNav, setActiveNav] = useState<BottomNavId>("tareas");

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

      <main className="mx-auto w-full max-w-md px-4 pt-44 pb-32" />

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
