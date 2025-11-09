"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { HabitsTracker } from "@/components/habits-tracker"

export default function HabitosPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6 animate-slide-in-bottom">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hábitos</h1>
              <p className="text-muted-foreground">Rastrea y mejora tus hábitos de estudio diarios</p>
            </div>

            <HabitsTracker />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
