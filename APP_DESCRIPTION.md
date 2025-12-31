# InOut360 App Description

## Purpose
InOut360 simulates a modern employee time-tracking console built with React + Vite. The single-page interface in [src/App.tsx](src/App.tsx) manages all views locally via the `activeView` state and never calls an API. It focuses on presenting mock scheduling data, collecting manual inputs for absences and shift logs, and letting the user swap between focused workflows without leaving the shell layout.

## Global Structure
- **Shell layout:** Fixed header with branding, contextual action menu, scrollable content area, and a persistent bottom tab bar for the primary journeys (fichar, historial, tarea).
- **Stateful navigation:** `handleNavigate()` flips the `activeView` state and collapses the header menu, imitating in-app routing without touching the browser history.
- **Quick data scaffolding:** Arrays such as `quickInsights`, `historyEntries`, `preferenceToggles`, and `taskOptions` seed the UI with realistic but static business data.

## View Breakdown
### Home ("Panel principal")
- Greets "María López" with the current day/time, a suggestion for the next break, and a quick CTA to open the Entrar/Salir flow.
- Shows live confirmation status that the latest punch was accepted.
- Renders "Indicadores rápidos" cards summarizing shift span, weekly hours, and deltas versus the staffing plan.
- Highlights the most recent clock-in/out event with labels, timestamps, and qualitative context (door used, hours worked).

### Historial ("Resumen semanal")
- Displays total hours accumulated during the current week along with variance to plan.
- Lists the five most recent shifts with entry, exit, total hours, and optional status badges (e.g., "Activo" for the ongoing shift).

### Perfil
- Splits the card grid into company metadata (name, ID, timezone, address) and employee details (role, work center, employment status).
- Enumerates configurable preferences, each rendered as a pill that reflects whether alerts, offline mode, or mandatory geolocation is active.

### Ausencias y permisos
- Accessible through the header "Acciones rápidas" menu.
- Provides a form with select dropdowns for absence type, start/end dates, and a textarea for the justification, capped with a CTA to request authorization.

### Tareas en curso
- Lets the user pick the current task from a predefined list and shows the selection in a status pill.
- Includes a `taskRunning` toggle button that flips between "Pendiente" and "En ejecución" to simulate starting or ending the operational task.

### Entrar / Salir
- Activated from the main CTA on the home view.
- Surfaces read-only context (date/time and location) and captures an optional comment before submitting a new clock event.

## Interaction Flow
1. The user lands on the home view to check current shift status and available insights.
2. From the home screen, they can either log a time event (Entrar/Salir), review recent punches (Historial), update the active task, or open the quick menu to manage absences and profiles.
3. Each view keeps its state until the user navigates away, giving a lightweight dashboard experience suitable for kiosk or mobile scenarios.

## Limitations
- No persistence or backend calls; all information resets on refresh.
- Forms submit nowhere—they exist purely for visual walkthroughs.
- Accessibility is basic (aria labels on navigation/menu buttons) and would need more work for production.
