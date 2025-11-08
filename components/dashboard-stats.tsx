import { CheckCircle2, Clock, Flame, Calendar } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Tareas Completadas",
      value: "12",
      change: "+3 desde ayer",
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Horas Estudiadas",
      value: "24.5",
      change: "Esta semana",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Racha Actual",
      value: "7",
      change: "días consecutivos",
      icon: Flame,
      color: "text-orange-600",
    },
    {
      title: "Próximo Examen",
      value: "2",
      change: "días restantes",
      icon: Calendar,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.title} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
