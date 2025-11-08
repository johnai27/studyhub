import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const tasks = [
  {
    id: 1,
    title: "Completar ejercicios de Cálculo",
    subject: "Matemáticas",
    dueDate: "Hoy, 18:00",
    priority: "alta",
    completed: false,
  },
  {
    id: 2,
    title: "Leer capítulo 5 de Historia",
    subject: "Historia",
    dueDate: "Mañana, 10:00",
    priority: "media",
    completed: false,
  },
  {
    id: 3,
    title: "Preparar presentación de Física",
    subject: "Física",
    dueDate: "Viernes, 14:00",
    priority: "alta",
    completed: false,
  },
  {
    id: 4,
    title: "Revisar apuntes de Química",
    subject: "Química",
    dueDate: "Sábado, 12:00",
    priority: "baja",
    completed: true,
  },
]

export function UpcomingTasks() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tareas Próximas</h3>
        <Button variant="ghost" size="sm">
          Ver todas
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 rounded-lg border p-4 ${task.completed ? "opacity-60" : ""}`}
          >
            <button className="mt-0.5">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            <div className="flex-1 space-y-1">
              <p className={`font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{task.dueDate}</span>
                <span>•</span>
                <span>{task.subject}</span>
              </div>
            </div>

            <Badge
              variant={task.priority === "alta" ? "destructive" : task.priority === "media" ? "default" : "secondary"}
            >
              {task.priority}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
