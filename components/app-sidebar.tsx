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
import Image from "next/image"
import { useState } from "react"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    gif: "/icons/dashboard.gif",
    scaleOnHover: true,
  },
  {
    title: "Pomodoro",
    url: "/pomodoro",
    icon: Timer,
    gif: "/icons/pomodoro.gif",
    scaleOnHover: true,
  },
  {
    title: "Tareas",
    url: "/tareas",
    icon: CheckSquare,
    gif: "/icons/tareas.gif",
    scaleOnHover: true,
  },
  {
    title: "Apuntes",
    url: "/apuntes",
    icon: FileText,
    gif: "/icons/apuntes.gif",
    scaleOnHover: true,
  },
  {
    title: "Biblioteca",
    url: "/biblioteca",
    icon: BookOpen,
    gif: "/icons/biblioteca.gif",
    scaleOnHover: true,
  },
  {
    title: "Hábitos",
    url: "/habitos",
    icon: TrendingUp,
    gif: "/icons/habitos.gif",
    scaleOnHover: true,
  },
  {
    title: "Horarios",
    url: "/horarios",
    icon: Calendar,
    gif: "/icons/horarios.gif",
    scaleOnHover: true,
  },
  {
    title: "Exámenes",
    url: "/examenes",
    icon: Target,
    gif: "/icons/examenes.gif",
    scaleOnHover: true,
  },
  {
    title: "Reuniones",
    url: "/reuniones",
    icon: Users,
    gif: "/icons/reuniones.gif",
    scaleOnHover: true,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: LayoutTemplate,
    gif: null,
    scaleOnHover: false,
  },
]

function SidebarItemIcon({ item, isHovered }: { item: (typeof items)[0]; isHovered: boolean }) {
  if (item.gif) {
    return (
      <div className={`h-6 w-6 relative ${isHovered ? "animate-bounce" : ""}`}>
        <Image
          src={item.gif || "/placeholder.svg"}
          alt={`${item.title} icon`}
          width={24}
          height={24}
          className="h-6 w-6"
          unoptimized
        />
      </div>
    )
  }

  const IconComponent = item.icon
  return <IconComponent className="h-6 w-6" />
}

export function AppSidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4 bg-yellow-900 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-800">
            <Image
              src="/icons/dashboard.gif"
              alt="StudyHub logo"
              width={20}
              height={20}
              className="h-5 w-5"
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">StudyHub</h2>
            <p className="text-xs opacity-90">Gestor de Estudiantes</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      transition-transform duration-200 origin-center 
                      text-base px-6 py-3 text-black
                      ${item.scaleOnHover ? "hover:scale-125 scale-115" : "scale-115"}
                      hover:bg-transparent hover:text-black
                    `}
                    onMouseEnter={() => setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link href={item.url}>
                      <SidebarItemIcon item={item} isHovered={hoveredItem === item.title} />
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
