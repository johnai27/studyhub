"use client"
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  FileText,
  BookOpen,
  TrendingUp,
  Calendar,
  Target,
  Users,
  LayoutTemplate,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Pomodoro",
    url: "/pomodoro",
    icon: Timer,
  },
  {
    title: "Tareas",
    url: "/tareas",
    icon: CheckSquare,
  },
  {
    title: "Apuntes",
    url: "/apuntes",
    icon: FileText,
  },
  {
    title: "Biblioteca",
    url: "/biblioteca",
    icon: BookOpen,
  },
  {
    title: "Hábitos",
    url: "/habitos",
    icon: TrendingUp,
  },
  {
    title: "Horarios",
    url: "/horarios",
    icon: Calendar,
  },
  {
    title: "Exámenes",
    url: "/examenes",
    icon: Target,
  },
  {
    title: "Reuniones",
    url: "/reuniones",
    icon: Users,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: LayoutTemplate,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">StudyHub</h2>
            <p className="text-xs text-muted-foreground">Gestor de Estudiantes</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
