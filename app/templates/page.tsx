"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { TemplatesManager } from "@/components/templates-manager"

export default function TemplatesPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6 animate-slide-in-bottom">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
              <p className="text-muted-foreground">Plantillas reutilizables para tus documentos y trabajos</p>
            </div>

            <TemplatesManager />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
