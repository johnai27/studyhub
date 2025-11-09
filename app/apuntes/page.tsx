"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { NotesManager } from "@/components/notes-manager"

export default function ApuntesPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6 animate-slide-in-bottom">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Apuntes</h1>
              <p className="text-muted-foreground">Toma y organiza tus apuntes de clase</p>
            </div>

            <NotesManager />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
