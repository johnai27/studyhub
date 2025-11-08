"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { ScheduleManager } from "@/components/schedule-manager"

export default function HorariosPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Horarios</h1>
              <p className="text-muted-foreground">Organiza tu horario semanal de clases y actividades</p>
            </div>

            <ScheduleManager />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
