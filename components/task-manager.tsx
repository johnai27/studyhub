"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Search, Filter, CheckCircle2, Circle, Clock, CalendarIcon, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  subject: string
  priority: "alta" | "media" | "baja"
  dueDate: Date
  completed: boolean
  createdAt: Date
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Completar ejercicios de Cálculo",
    description: "Ejercicios del capítulo 3, páginas 45-52",
    subject: "Matemáticas",
    priority: "alta",
    dueDate: new Date(Date.now() + 86400000),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Leer capítulo 5 de Historia",
    description: "La Revolución Industrial y sus consecuencias",
    subject: "Historia",
    priority: "media",
    dueDate: new Date(Date.now() + 172800000),
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Preparar presentación de Física",
    description: "Tema: Leyes de Newton",
    subject: "Física",
    priority: "alta",
    dueDate: new Date(Date.now() + 345600000),
    completed: false,
    createdAt: new Date(),
  },
]

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("todas")
  const [filterSubject, setFilterSubject] = useState<string>("todas")
  const [activeTab, setActiveTab] = useState("pendientes")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const subjects = Array.from(new Set(tasks.map((t) => t.subject)))

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = filterPriority === "todas" || task.priority === filterPriority
    const matchesSubject = filterSubject === "todas" || task.subject === filterSubject
    const matchesTab =
      activeTab === "todas" ||
      (activeTab === "pendientes" && !task.completed) ||
      (activeTab === "completadas" && task.completed)

    return matchesSearch && matchesPriority && matchesSubject && matchesTab
  })

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
    toast.success("Tarea actualizada")
  }

  const handleAddTask = (newTask: Omit<Task, "id" | "createdAt">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setTasks([...tasks, task])
    setIsAddDialogOpen(false)
    toast.success("Tarea creada exitosamente")
  }

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
    toast.success("Tarea actualizada exitosamente")
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    toast.success("Tarea eliminada")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar tareas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Tarea</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendientes">Pendientes ({tasks.filter((t) => !t.completed).length})</TabsTrigger>
          <TabsTrigger value="completadas">Completadas ({tasks.filter((t) => t.completed).length})</TabsTrigger>
          <TabsTrigger value="todas">Todas ({tasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredTasks.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No se encontraron tareas</p>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <button onClick={() => handleToggleComplete(task.id)} className="mt-1 flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingTask(task)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge variant="outline" className="gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(task.dueDate, "dd MMM yyyy", { locale: es })}
                        </Badge>
                        <Badge variant="secondary">{task.subject}</Badge>
                        <Badge
                          variant={
                            task.priority === "alta"
                              ? "destructive"
                              : task.priority === "media"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                        {task.dueDate < new Date() && !task.completed && (
                          <Badge variant="destructive" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Vencida
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Tarea</DialogTitle>
            </DialogHeader>
            <TaskForm initialData={editingTask} onSubmit={handleEditTask} onCancel={() => setEditingTask(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function TaskForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Task
  onSubmit: (task: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    subject: initialData?.subject || "",
    priority: initialData?.priority || "media",
    dueDate: initialData?.dueDate || new Date(),
    completed: initialData?.completed || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">Materia</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fecha de Entrega</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(formData.dueDate, "PPP", { locale: es })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.dueDate}
              onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Crear"} Tarea</Button>
      </DialogFooter>
    </form>
  )
}
