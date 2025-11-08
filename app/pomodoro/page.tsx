"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { PomodoroTimer } from "@/components/pomodoro-timer"

export default function PomodoroPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pomodoro</h1>
              <p className="text-muted-foreground">Gestiona tu tiempo con la técnica Pomodoro</p>
            </div>

            <PomodoroTimer />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
