"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Clock, MapPin, User, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ClassSchedule {
  id: string
  subject: string
  professor: string
  room: string
  day: number // 0 = Monday, 6 = Sunday
  startTime: string // "09:00"
  endTime: string // "10:30"
  color: string
  notes?: string
}

const initialSchedule: ClassSchedule[] = [
  {
    id: "1",
    subject: "Cálculo I",
    professor: "Dr. García",
    room: "Aula 301",
    day: 0,
    startTime: "09:00",
    endTime: "10:30",
    color: "bg-blue-500",
  },
  {
    id: "2",
    subject: "Física I",
    professor: "Dra. Martínez",
    room: "Lab 201",
    day: 0,
    startTime: "11:00",
    endTime: "12:30",
    color: "bg-green-500",
  },
  {
    id: "3",
    subject: "Química General",
    professor: "Dr. López",
    room: "Aula 105",
    day: 1,
    startTime: "10:00",
    endTime: "11:30",
    color: "bg-purple-500",
  },
  {
    id: "4",
    subject: "Cálculo I",
    professor: "Dr. García",
    room: "Aula 301",
    day: 2,
    startTime: "09:00",
    endTime: "10:30",
    color: "bg-blue-500",
  },
  {
    id: "5",
    subject: "Historia Universal",
    professor: "Prof. Rodríguez",
    room: "Aula 210",
    day: 3,
    startTime: "14:00",
    endTime: "15:30",
    color: "bg-orange-500",
  },
]

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = 7 + i
  return `${hour.toString().padStart(2, "0")}:00`
})

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

export function ScheduleManager() {
  const [schedule, setSchedule] = useState<ClassSchedule[]>(initialSchedule)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null)
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null)

  const handleAddClass = (newClass: Omit<ClassSchedule, "id">) => {
    const classItem: ClassSchedule = {
      ...newClass,
      id: Date.now().toString(),
    }
    setSchedule([...schedule, classItem])
    setIsAddDialogOpen(false)
    toast.success("Clase agregada exitosamente")
  }

  const handleEditClass = (updatedClass: ClassSchedule) => {
    setSchedule(schedule.map((c) => (c.id === updatedClass.id ? updatedClass : c)))
    setEditingClass(null)
    setSelectedClass(null)
    toast.success("Clase actualizada exitosamente")
  }

  const handleDeleteClass = (classId: string) => {
    setSchedule(schedule.filter((c) => c.id !== classId))
    setSelectedClass(null)
    toast.success("Clase eliminada")
  }

  const getClassesForDay = (day: number) => {
    return schedule.filter((c) => c.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  const getClassPosition = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime)
    const endMinutes = timeToMinutes(endTime)
    const dayStartMinutes = 7 * 60 // 7 AM
    const dayEndMinutes = 21 * 60 // 9 PM

    const top = ((startMinutes - dayStartMinutes) / (dayEndMinutes - dayStartMinutes)) * 100
    const height = ((endMinutes - startMinutes) / (dayEndMinutes - dayStartMinutes)) * 100

    return { top: `${top}%`, height: `${height}%` }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {schedule.length} clases esta semana
          </Badge>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Clase
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Clase</DialogTitle>
            </DialogHeader>
            <ClassForm onSubmit={handleAddClass} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-2">
            <div className="text-sm font-medium text-muted-foreground">Hora</div>
            {days.slice(0, 5).map((day) => (
              <div key={day} className="text-sm font-medium text-center">
                {day}
              </div>
            ))}
            <div className="col-span-2" />
          </div>

          <div className="grid grid-cols-8 gap-2 mt-2">
            <div className="space-y-[56px] pt-2">
              {timeSlots.map((time) => (
                <div key={time} className="text-xs text-muted-foreground">
                  {time}
                </div>
              ))}
            </div>

            {days.slice(0, 5).map((day, dayIndex) => {
              const dayClasses = getClassesForDay(dayIndex)
              return (
                <div key={day} className="relative border-l border-border min-h-[800px]">
                  {dayClasses.map((classItem) => {
                    const position = getClassPosition(classItem.startTime, classItem.endTime)
                    return (
                      <button
                        key={classItem.id}
                        onClick={() => setSelectedClass(classItem)}
                        className={`absolute left-0 right-0 mx-1 rounded-lg p-2 text-left ${classItem.color} text-white hover:opacity-90 transition-opacity`}
                        style={{
                          top: position.top,
                          height: position.height,
                        }}
                      >
                        <p className="font-semibold text-sm line-clamp-1">{classItem.subject}</p>
                        <p className="text-xs opacity-90">
                          {classItem.startTime} - {classItem.endTime}
                        </p>
                        <p className="text-xs opacity-90 line-clamp-1">{classItem.room}</p>
                      </button>
                    )
                  })}
                </div>
              )
            })}

            <div className="col-span-2" />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedule.map((classItem) => (
          <Card key={classItem.id} className="p-4">
            <div className="flex gap-3">
              <div className={`h-2 w-2 rounded-full ${classItem.color} mt-1.5`} />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{classItem.subject}</h3>
                    <p className="text-sm text-muted-foreground">{days[classItem.day]}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {classItem.startTime} - {classItem.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{classItem.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span>{classItem.professor}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedClass && !editingClass && (
        <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${selectedClass.color}`} />
                {selectedClass.subject}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Profesor:</span>
                  <span className="font-medium">{selectedClass.professor}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Aula:</span>
                  <span className="font-medium">{selectedClass.room}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Horario:</span>
                  <span className="font-medium">
                    {days[selectedClass.day]}, {selectedClass.startTime} - {selectedClass.endTime}
                  </span>
                </div>
              </div>

              {selectedClass.notes && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="font-medium mb-1">Notas:</p>
                  <p className="text-muted-foreground">{selectedClass.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => {
                    setEditingClass(selectedClass)
                    setSelectedClass(null)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => handleDeleteClass(selectedClass.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingClass && (
        <Dialog open={!!editingClass} onOpenChange={() => setEditingClass(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Clase</DialogTitle>
            </DialogHeader>
            <ClassForm initialData={editingClass} onSubmit={handleEditClass} onCancel={() => setEditingClass(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ClassForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: ClassSchedule
  onSubmit: (classItem: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || "",
    professor: initialData?.professor || "",
    room: initialData?.room || "",
    day: initialData?.day?.toString() || "0",
    startTime: initialData?.startTime || "09:00",
    endTime: initialData?.endTime || "10:30",
    color: initialData?.color || "bg-blue-500",
    notes: initialData?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData, day: Number.parseInt(formData.day) })
    } else {
      onSubmit({ ...formData, day: Number.parseInt(formData.day) })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Materia</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="professor">Profesor</Label>
          <Input
            id="professor"
            value={formData.professor}
            onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="room">Aula</Label>
          <Input
            id="room"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="day">Día</Label>
        <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {days.map((day, index) => (
              <SelectItem key={day} value={index.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startTime">Hora de Inicio</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Hora de Fin</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Agregar"} Clase</Button>
      </DialogFooter>
    </form>
  )
}
