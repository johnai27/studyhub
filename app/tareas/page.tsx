"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { TaskManager } from "@/components/task-manager"

export default function TareasPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tareas</h1>
              <p className="text-muted-foreground">Organiza y gestiona todas tus tareas académicas</p>
            </div>

            <TaskManager />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
