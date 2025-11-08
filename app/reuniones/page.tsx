"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { MeetingsManager } from "@/components/meetings-manager"

export default function ReunionesPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reuniones</h1>
              <p className="text-muted-foreground">Organiza reuniones con compañeros y profesores</p>
            </div>

            <MeetingsManager />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
