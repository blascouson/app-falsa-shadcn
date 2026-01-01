export const quickInsights = [
  {
    label: "Turno actual",
    metric: "08:05 - 16:30",
    delta: "+15 min vs plan",
    trend: "positive" as const,
  },
  {
    label: "Horas semana",
    metric: "32h 40m",
    delta: "83% completado",
    trend: "neutral" as const,
  },
  {
    label: "Detección incendios",
    metric: "Activo",
    delta: "Zona C1",
    trend: "warning" as const,
  },
];

export const historyEntries = [
  {
    id: "E-9845",
    date: "Lun, 23 Dic",
    checkIn: "07:58",
    checkOut: "16:32",
    total: "8h 34m",
    location: "Puerta Norte",
    status: "Validado",
  },
  {
    id: "E-9844",
    date: "Dom, 22 Dic",
    checkIn: "09:02",
    checkOut: "13:15",
    total: "4h 13m",
    location: "App móvil",
    status: "Corrección",
  },
  {
    id: "E-9843",
    date: "Sáb, 21 Dic",
    checkIn: "07:50",
    checkOut: "15:58",
    total: "8h 08m",
    location: "Puerta Sur",
    status: "Validado",
  },
  {
    id: "E-9842",
    date: "Vie, 20 Dic",
    checkIn: "07:55",
    checkOut: "16:41",
    total: "8h 46m",
    location: "Puerta Norte",
    status: "Validado",
  },
];

export const preferenceToggles = [
  { id: "geo", label: "Geolocalización obligatoria", description: "Exige posición verificada al fichar", defaultChecked: true },
  { id: "offline", label: "Modo offline", description: "Permite registrar jornadas sin cobertura", defaultChecked: false },
  { id: "alerts", label: "Alertas push", description: "Recibe avisos de turnos y incidencias", defaultChecked: true },
];

export const taskOptions = [
  "Inventario pasillo 4",
  "Recepción camiones",
  "Verificación cámaras",
  "Supervisión accesos",
];

export const companyProfile = {
  name: "InOut360 Logistics",
  taxId: "B-98412345",
  address: "Av. de la Industria 25, Madrid",
  contactEmail: "rrhh@inout360.com",
  contactPhone: "+34 910 123 456",
  sector: "Operaciones y logística",
};

export const employeeProfile = {
  name: "Laura Gómez",
  role: "Supervisora de almacén",
  employeeId: "EMP-2045",
  department: "Operaciones",
  manager: "Alberto Ruiz",
  location: "Madrid · Plataforma Central",
  shift: "Mañana (07:00 - 15:00)",
  seniority: "3 años en la compañía",
};
