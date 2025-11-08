"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Search, AlertCircle, CheckCircle2, Clock, CalendarIcon, BookOpen, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, differenceInDays, isPast, isFuture } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface Exam {
  id: string
  subject: string
  topic: string
  date: Date
  time: string
  location: string
  duration: number // in minutes
  studyProgress: number // 0-100
  notes?: string
  completed: boolean
}

const initialExams: Exam[] = [
  {
    id: "1",
    subject: "Matemáticas",
    topic: "Cálculo Diferencial e Integral",
    date: new Date(Date.now() + 86400000 * 2),
    time: "10:00",
    location: "Aula 301",
    duration: 120,
    studyProgress: 75,
    notes: "Repasar ejercicios de derivadas e integrales definidas",
    completed: false,
  },
  {
    id: "2",
    subject: "Física",
    topic: "Mecánica Clásica",
    date: new Date(Date.now() + 86400000 * 5),
    time: "14:00",
    location: "Aula 205",
    duration: 90,
    studyProgress: 45,
    notes: "Estudiar Leyes de Newton y cinemática",
    completed: false,
  },
  {
    id: "3",
    subject: "Química",
    topic: "Reacciones Químicas",
    date: new Date(Date.now() + 86400000 * 8),
    time: "09:00",
    location: "Lab 101",
    duration: 120,
    studyProgress: 30,
    completed: false,
  },
  {
    id: "4",
    subject: "Historia",
    topic: "Segunda Guerra Mundial",
    date: new Date(Date.now() - 86400000 * 3),
    time: "11:00",
    location: "Aula 410",
    duration: 60,
    studyProgress: 100,
    completed: true,
  },
]

export function ExamsManager() {
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

  const upcomingExams = exams.filter((exam) => !exam.completed && isFuture(exam.date))
  const completedExams = exams.filter((exam) => exam.completed || isPast(exam.date))

  const filteredExams = exams.filter(
    (exam) =>
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getDaysUntil = (date: Date) => {
    return differenceInDays(date, new Date())
  }

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil <= 1) return "text-red-600"
    if (daysUntil <= 3) return "text-orange-600"
    if (daysUntil <= 7) return "text-yellow-600"
    return "text-green-600"
  }

  const handleAddExam = (newExam: Omit<Exam, "id">) => {
    const exam: Exam = {
      ...newExam,
      id: Date.now().toString(),
    }
    setExams([...exams, exam])
    setIsAddDialogOpen(false)
    toast.success("Examen agregado exitosamente")
  }

  const handleEditExam = (updatedExam: Exam) => {
    setExams(exams.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam)))
    setEditingExam(null)
    setSelectedExam(null)
    toast.success("Examen actualizado exitosamente")
  }

  const handleDeleteExam = (examId: string) => {
    setExams(exams.filter((exam) => exam.id !== examId))
    setSelectedExam(null)
    toast.success("Examen eliminado")
  }

  const handleUpdateProgress = (examId: string, progress: number) => {
    setExams(exams.map((exam) => (exam.id === examId ? { ...exam, studyProgress: progress } : exam)))
    toast.success("Progreso actualizado")
  }

  const handleToggleComplete = (examId: string) => {
    setExams(exams.map((exam) => (exam.id === examId ? { ...exam, completed: !exam.completed } : exam)))
    toast.success("Estado actualizado")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar exámenes..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Examen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Examen</DialogTitle>
            </DialogHeader>
            <ExamForm onSubmit={handleAddExam} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingExams.length}</p>
              <p className="text-sm text-muted-foreground">Próximos exámenes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingExams.filter((e) => getDaysUntil(e.date) <= 3).length}</p>
              <p className="text-sm text-muted-foreground">Esta semana</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedExams.length}</p>
              <p className="text-sm text-muted-foreground">Completados</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Próximos ({upcomingExams.length})</TabsTrigger>
          <TabsTrigger value="completed">Completados ({completedExams.length})</TabsTrigger>
          <TabsTrigger value="all">Todos ({exams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-4">
            {upcomingExams.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No hay exámenes próximos</p>
              </Card>
            ) : (
              upcomingExams
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((exam) => {
                  const daysUntil = getDaysUntil(exam.date)
                  return (
                    <Card key={exam.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{exam.subject}</h3>
                                {daysUntil <= 3 && (
                                  <Badge variant="destructive" className="gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    Urgente
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{exam.topic}</p>
                            </div>

                            <div className={`text-right ${getUrgencyColor(daysUntil)}`}>
                              <p className="text-2xl font-bold">{daysUntil}</p>
                              <p className="text-xs">días</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {format(exam.date, "dd MMM yyyy", { locale: es })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {exam.time} ({exam.duration} min)
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {exam.location}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progreso de estudio</span>
                              <span className="font-medium">{exam.studyProgress}%</span>
                            </div>
                            <Progress value={exam.studyProgress} className="h-2" />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateProgress(exam.id, Math.min(exam.studyProgress + 10, 100))}
                              >
                                +10%
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setSelectedExam(exam)}>
                                Ver detalles
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleToggleComplete(exam.id)}>
                                Marcar completo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-4">
            {completedExams.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No hay exámenes completados</p>
              </Card>
            ) : (
              completedExams.map((exam) => (
                <Card key={exam.id} className="p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{exam.subject}</h3>
                      <p className="text-sm text-muted-foreground">{exam.topic}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(exam.date, "dd MMM yyyy", { locale: es })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Completado
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{exam.subject}</h3>
                    <p className="text-sm text-muted-foreground">{exam.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(exam.date, "dd MMM yyyy", { locale: es })} • {exam.time}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedExam(exam)}>
                    Ver detalles
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedExam && !editingExam && (
        <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedExam.subject}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Tema</h4>
                <p className="text-muted-foreground">{selectedExam.topic}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Fecha</p>
                  <p>{format(selectedExam.date, "PPP", { locale: es })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Hora</p>
                  <p>{selectedExam.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Duración</p>
                  <p>{selectedExam.duration} minutos</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ubicación</p>
                  <p>{selectedExam.location}</p>
                </div>
              </div>

              {selectedExam.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notas</h4>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <p className="text-muted-foreground">{selectedExam.notes}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Progreso de Estudio</h4>
                <Progress value={selectedExam.studyProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">{selectedExam.studyProgress}% completado</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => {
                    setEditingExam(selectedExam)
                    setSelectedExam(null)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => handleDeleteExam(selectedExam.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingExam && (
        <Dialog open={!!editingExam} onOpenChange={() => setEditingExam(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Examen</DialogTitle>
            </DialogHeader>
            <ExamForm initialData={editingExam} onSubmit={handleEditExam} onCancel={() => setEditingExam(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ExamForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Exam
  onSubmit: (exam: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || "",
    topic: initialData?.topic || "",
    date: initialData?.date || new Date(),
    time: initialData?.time || "10:00",
    location: initialData?.location || "",
    duration: initialData?.duration || 120,
    studyProgress: initialData?.studyProgress || 0,
    notes: initialData?.notes || "",
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
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Tema del Examen</Label>
        <Input
          id="topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.date, "PPP", { locale: es })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && setFormData({ ...formData, date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Hora</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duración (min)</Label>
          <Input
            id="duration"
            type="number"
            min="30"
            step="15"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="progress">Progreso de Estudio (%)</Label>
        <Input
          id="progress"
          type="number"
          min="0"
          max="100"
          value={formData.studyProgress}
          onChange={(e) => setFormData({ ...formData, studyProgress: Number.parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Agregar"} Examen</Button>
      </DialogFooter>
    </form>
  )
}
