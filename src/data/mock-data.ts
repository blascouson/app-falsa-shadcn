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
  "Mostrador",
  "Recepción pedidos",
  "Inventario",
  "Gestión de recetas",
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

export const absenceBalances = [
  { id: "vacaciones", label: "Vacaciones", remaining: 8, total: 22 },
  { id: "asuntos", label: "Asuntos propios", remaining: 3, total: 5 },
  { id: "formacion", label: "Formación", remaining: 4, total: 8 },
];

export const absenceRequests = [
  {
    id: "SOL-24018",
    type: "Vacaciones",
    dateRange: "12 - 16 Feb",
    days: 5,
    status: "Aprobada",
    approver: "RRHH",
    note: "Viaje familiar",
  },
  {
    id: "SOL-24009",
    type: "Asuntos propios",
    dateRange: "29 Ene",
    days: 1,
    status: "Pendiente",
    approver: "Jefe de equipo",
    note: "Gestión bancaria",
  },
  {
    id: "SOL-23988",
    type: "Recuperación",
    dateRange: "18 Dic",
    days: 0.5,
    status: "Rechazada",
    approver: "RRHH",
    note: "Solapada con inventario",
  },
];

export const teamStatus = [
  {
    id: "EMP-2045",
    name: "Laura Gómez",
    role: "Supervisora de almacén",
    shift: "Mañana",
    status: "En turno",
    checkIn: "07:48",
    location: "Dock A2",
    activeTask: "Recepción pedidos",
  },
  {
    id: "EMP-2098",
    name: "Carlos Muñoz",
    role: "Operario de expediciones",
    shift: "Mañana",
    status: "Pendiente de fichar",
    checkIn: "Pendiente",
    location: "Zona C",
    activeTask: "",
  },
  {
    id: "EMP-2104",
    name: "Paula Rivas",
    role: "Control de calidad",
    shift: "Partido",
    status: "Incidencia",
    checkIn: "08:10",
    location: "Célula QC",
    activeTask: "Revisión caducidades",
  },
  {
    id: "EMP-1987",
    name: "Miguel Aroca",
    role: "Carretillero",
    shift: "Noche",
    status: "Descanso",
    checkIn: "Descanso",
    location: "",
    activeTask: "",
  },
  {
    id: "EMP-2015",
    name: "Sara Velasco",
    role: "Backoffice RRHH",
    shift: "Mañana",
    status: "En turno",
    checkIn: "07:55",
    location: "Oficina 2",
    activeTask: "Mostrador",
  },
];

export const teamAlerts = [
  {
    id: "AL-9812",
    title: "Fichaje pendiente",
    description: "Carlos Muñoz no ha registrado su entrada y figura en turno.",
    area: "Expediciones",
    severity: "alta",
    timestamp: "08:20",
  },
  {
    id: "AL-9807",
    title: "Incidencia en calidad",
    description: "Paula Rivas reporta bloqueo por lote con temperatura fuera de rango.",
    area: "Calidad",
    severity: "media",
    timestamp: "08:05",
  },
  {
    id: "AL-9793",
    title: "Permiso pendiente",
    description: "Validar solicitud urgente de asuntos propios enviada ayer por Sara Velasco.",
    area: "RRHH",
    severity: "baja",
    timestamp: "07:40",
  },
];
