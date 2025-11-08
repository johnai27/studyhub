"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Check, TrendingUp, Target, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface Habit {
  id: string
  name: string
  description: string
  frequency: "diario" | "semanal"
  targetDays: number
  color: string
  createdAt: Date
}

interface HabitLog {
  habitId: string
  date: Date
  completed: boolean
}

const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Estudiar 2 horas",
    description: "Dedicar al menos 2 horas de estudio concentrado",
    frequency: "diario",
    targetDays: 7,
    color: "bg-blue-500",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Hacer ejercicio",
    description: "30 minutos de actividad física",
    frequency: "diario",
    targetDays: 5,
    color: "bg-green-500",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Leer 30 minutos",
    description: "Lectura de libros o artículos académicos",
    frequency: "diario",
    targetDays: 7,
    color: "bg-purple-500",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Revisar apuntes",
    description: "Repasar apuntes de la semana",
    frequency: "semanal",
    targetDays: 3,
    color: "bg-orange-500",
    createdAt: new Date(),
  },
]

const colorOptions = [
  { value: "bg-blue-500", label: "Azul" },
  { value: "bg-green-500", label: "Verde" },
  { value: "bg-purple-500", label: "Morado" },
  { value: "bg-orange-500", label: "Naranja" },
  { value: "bg-pink-500", label: "Rosa" },
  { value: "bg-yellow-500", label: "Amarillo" },
  { value: "bg-red-500", label: "Rojo" },
  { value: "bg-teal-500", label: "Turquesa" },
]

export function HabitsTracker() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(new Date())

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getHabitCompletion = (habitId: string, date: Date) => {
    return logs.find((log) => log.habitId === habitId && isSameDay(log.date, date))?.completed || false
  }

  const getHabitStreak = (habitId: string) => {
    let streak = 0
    let currentDate = new Date()

    while (true) {
      const completed = logs.find((log) => log.habitId === habitId && isSameDay(log.date, currentDate))?.completed

      if (!completed) break
      streak++
      currentDate = addDays(currentDate, -1)
    }

    return streak
  }

  const getWeeklyProgress = (habitId: string) => {
    const completedDays = weekDays.filter((day) => getHabitCompletion(habitId, day)).length
    const habit = habits.find((h) => h.id === habitId)
    return habit ? (completedDays / habit.targetDays) * 100 : 0
  }

  const handleToggleHabit = (habitId: string, date: Date) => {
    const existingLog = logs.find((log) => log.habitId === habitId && isSameDay(log.date, date))

    if (existingLog) {
      setLogs(
        logs.map((log) =>
          log.habitId === habitId && isSameDay(log.date, date) ? { ...log, completed: !log.completed } : log,
        ),
      )
    } else {
      setLogs([...logs, { habitId, date, completed: true }])
    }
    toast.success("Hábito actualizado")
  }

  const handleAddHabit = (newHabit: Omit<Habit, "id" | "createdAt">) => {
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setHabits([...habits, habit])
    setIsAddDialogOpen(false)
    toast.success("Hábito creado exitosamente")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            Semana del {format(weekStart, "dd MMM", { locale: es })} -{" "}
            {format(addDays(weekStart, 6), "dd MMM yyyy", { locale: es })}
          </h2>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Hábito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Hábito</DialogTitle>
            </DialogHeader>
            <HabitForm onSubmit={handleAddHabit} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          const streak = getHabitStreak(habit.id)
          const progress = getWeeklyProgress(habit.id)
          const completedDays = weekDays.filter((day) => getHabitCompletion(habit.id, day)).length

          return (
            <Card key={habit.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full ${habit.color}`} />
                    <div>
                      <h3 className="font-semibold">{habit.name}</h3>
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const isCompleted = getHabitCompletion(habit.id, day)
                    const isToday = isSameDay(day, new Date())

                    return (
                      <div key={index} className="flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {format(day, "EEE", { locale: es })[0].toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleToggleHabit(habit.id, day)}
                          className={`h-8 w-8 rounded-lg border-2 transition-all ${
                            isCompleted
                              ? `${habit.color} border-transparent text-white`
                              : isToday
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary"
                          }`}
                        >
                          {isCompleted && <Check className="h-4 w-4 mx-auto" />}
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso semanal</span>
                    <span className="font-medium">
                      {completedDays}/{habit.targetDays} días
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{streak}</span>
                    <span className="text-muted-foreground">días de racha</span>
                  </div>
                  <Badge variant="secondary">{habit.frequency}</Badge>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resumen de la Semana</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{habits.filter((h) => getWeeklyProgress(h.id) >= 100).length}</p>
              <p className="text-sm text-muted-foreground">Hábitos completados</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.max(...habits.map((h) => getHabitStreak(h.id)))}</p>
              <p className="text-sm text-muted-foreground">Racha más larga</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round(habits.reduce((sum, h) => sum + getWeeklyProgress(h.id), 0) / habits.length)}%
              </p>
              <p className="text-sm text-muted-foreground">Progreso general</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function HabitForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (habit: Omit<Habit, "id" | "createdAt">) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    frequency: "diario" as "diario" | "semanal",
    targetDays: 7,
    color: "bg-blue-500",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Hábito</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="frequency">Frecuencia</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value: "diario" | "semanal") => setFormData({ ...formData, frequency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diario</SelectItem>
              <SelectItem value="semanal">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetDays">Días Objetivo</Label>
          <Input
            id="targetDays"
            type="number"
            min="1"
            max="7"
            value={formData.targetDays}
            onChange={(e) => setFormData({ ...formData, targetDays: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full ${option.value}`} />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Crear Hábito</Button>
      </DialogFooter>
    </form>
  )
}
