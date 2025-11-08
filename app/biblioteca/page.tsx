"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { LibraryManager } from "@/components/library-manager"

export default function BibliotecaPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
              <p className="text-muted-foreground">Gestiona tus recursos académicos y materiales de estudio</p>
            </div>

            <LibraryManager />
          </div>
        </main>
      </SidebarInset>
    </>
  )
}
