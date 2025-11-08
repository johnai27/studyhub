import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard-charts"
import { UpcomingTasks } from "@/components/upcoming-tasks"

export default function Page() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Bienvenido de nuevo, aquí está tu resumen de hoy</p>
              </div>
            </div>

            <DashboardStats />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Tareas Completadas</p>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold">12</p>
                  <p className="mt-1 text-xs text-muted-foreground">+3 desde ayer</p>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Horas Estudiadas</p>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold">24.5</p>
                  <p className="mt-1 text-xs text-muted-foreground">Esta semana</p>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Racha Actual</p>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold">7</p>
                  <p className="mt-1 text-xs text-muted-foreground">días consecutivos</p>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Próximo Examen</p>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold">2</p>
                  <p className="mt-1 text-xs text-muted-foreground">días restantes</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <DashboardCharts />
              <UpcomingTasks />
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Contenido en construcción</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Las secciones detalladas se están construyendo paso a paso
              </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
