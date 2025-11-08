"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Search, Users, Clock, MapPin, Video, Edit, Trash2, Copy, CalendarIcon } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format, isPast, isFuture } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface Meeting {
  id: string
  title: string
  description: string
  type: "estudio" | "proyecto" | "tutoria" | "otro"
  date: Date
  time: string
  duration: number // in minutes
  location: string
  isVirtual: boolean
  meetingLink?: string
  participants: string[]
  agenda?: string
  notes?: string
}

const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "Reunión de Grupo - Proyecto Final",
    description: "Discutir avances del proyecto de Física",
    type: "proyecto",
    date: new Date(Date.now() + 86400000),
    time: "15:00",
    duration: 60,
    location: "Biblioteca Central",
    isVirtual: false,
    participants: ["Ana García", "Carlos López", "María Rodríguez"],
    agenda: "1. Revisar avances\n2. Distribuir tareas\n3. Definir próximos pasos",
  },
  {
    id: "2",
    title: "Tutoría de Cálculo",
    description: "Repaso de integrales definidas",
    type: "tutoria",
    date: new Date(Date.now() + 172800000),
    time: "10:00",
    duration: 45,
    location: "Oficina 302",
    isVirtual: false,
    participants: ["Dr. García"],
  },
  {
    id: "3",
    title: "Sesión de Estudio - Química",
    description: "Preparación para examen de reacciones químicas",
    type: "estudio",
    date: new Date(Date.now() + 259200000),
    time: "16:00",
    duration: 120,
    location: "Zoom",
    isVirtual: true,
    meetingLink: "https://zoom.us/j/example",
    participants: ["Pedro Sánchez", "Laura Martínez"],
  },
]

export function MeetingsManager() {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("todas")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  const upcomingMeetings = meetings.filter((m) => isFuture(m.date))
  const pastMeetings = meetings.filter((m) => isPast(m.date))

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "todas" || meeting.type === filterType

    return matchesSearch && matchesType
  })

  const handleAddMeeting = (newMeeting: Omit<Meeting, "id">) => {
    const meeting: Meeting = {
      ...newMeeting,
      id: Date.now().toString(),
    }
    setMeetings([...meetings, meeting])
    setIsAddDialogOpen(false)
    toast.success("Reunión creada exitosamente")
  }

  const handleEditMeeting = (updatedMeeting: Meeting) => {
    setMeetings(meetings.map((m) => (m.id === updatedMeeting.id ? updatedMeeting : m)))
    setEditingMeeting(null)
    setSelectedMeeting(null)
    toast.success("Reunión actualizada exitosamente")
  }

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(meetings.filter((m) => m.id !== meetingId))
    setSelectedMeeting(null)
    toast.success("Reunión eliminada")
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    toast.success("Enlace copiado al portapapeles")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar reuniones..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="estudio">Estudio</SelectItem>
              <SelectItem value="proyecto">Proyecto</SelectItem>
              <SelectItem value="tutoria">Tutoría</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Reunión
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Reunión</DialogTitle>
            </DialogHeader>
            <MeetingForm onSubmit={handleAddMeeting} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.05s" }}>
        <Card className="p-4 hover-lift" style={{ animationDelay: "0.05s" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
              <p className="text-sm text-muted-foreground">Próximas reuniones</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover-lift" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingMeetings.filter((m) => m.isVirtual).length}</p>
              <p className="text-sm text-muted-foreground">Virtuales</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 hover-lift" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pastMeetings.length}</p>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Próximas ({upcomingMeetings.length})</TabsTrigger>
          <TabsTrigger value="past">Pasadas ({pastMeetings.length})</TabsTrigger>
          <TabsTrigger value="all">Todas ({meetings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid gap-4">
            {upcomingMeetings.length === 0 ? (
              <Card className="p-12 text-center animate-fade-in">
                <p className="text-muted-foreground">No hay reuniones próximas</p>
              </Card>
            ) : (
              upcomingMeetings
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((meeting, index) => (
                  <Card
                    key={meeting.id}
                    className="p-4 hover-lift animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{meeting.title}</h3>
                              {meeting.isVirtual && (
                                <Badge variant="secondary" className="gap-1">
                                  <Video className="h-3 w-3" />
                                  Virtual
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                          </div>
                          <Badge>{meeting.type}</Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {format(meeting.date, "dd MMM yyyy", { locale: es })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {meeting.time} ({meeting.duration} min)
                          </div>
                          <div className="flex items-center gap-1">
                            {meeting.isVirtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                            {meeting.location}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex -space-x-2">
                            {meeting.participants.slice(0, 3).map((participant, index) => (
                              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {participant
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {meeting.participants.length} participante{meeting.participants.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid gap-4">
            {pastMeetings.length === 0 ? (
              <Card className="p-12 text-center animate-fade-in">
                <p className="text-muted-foreground">No hay reuniones pasadas</p>
              </Card>
            ) : (
              pastMeetings.map((meeting, index) => (
                <Card
                  key={meeting.id}
                  className="p-4 opacity-75 transition-all-smooth hover:opacity-100 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">{meeting.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(meeting.date, "PPP", { locale: es })} • {meeting.time}
                      </p>
                    </div>
                    <Badge variant="secondary">{meeting.type}</Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4">
            {filteredMeetings.map((meeting, index) => (
              <Card
                key={meeting.id}
                className="p-4 hover-lift animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedMeeting(meeting)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <p className="text-sm text-muted-foreground">{meeting.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(meeting.date, "dd MMM yyyy", { locale: es })} • {meeting.time}
                    </p>
                  </div>
                  <Badge>{meeting.type}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedMeeting && !editingMeeting && (
        <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
          <DialogContent className="max-w-2xl animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedMeeting.title}
                {selectedMeeting.isVirtual && (
                  <Badge variant="secondary" className="gap-1">
                    <Video className="h-3 w-3" />
                    Virtual
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedMeeting.description}</p>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">{format(selectedMeeting.date, "PPP", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Hora:</span>
                  <span className="font-medium">
                    {selectedMeeting.time} ({selectedMeeting.duration} minutos)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {selectedMeeting.isVirtual ? (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-muted-foreground">Ubicación:</span>
                  <span className="font-medium">{selectedMeeting.location}</span>
                </div>
              </div>

              {selectedMeeting.meetingLink && (
                <div className="rounded-lg bg-muted p-3 transition-all-smooth">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Enlace de reunión</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedMeeting.meetingLink}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleCopyLink(selectedMeeting.meetingLink!)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Participantes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.participants.map((participant, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {participant}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedMeeting.agenda && (
                <div>
                  <h4 className="font-semibold mb-2">Agenda</h4>
                  <div className="rounded-lg bg-muted p-3 text-sm transition-all-smooth">
                    <pre className="whitespace-pre-wrap font-sans text-muted-foreground">{selectedMeeting.agenda}</pre>
                  </div>
                </div>
              )}

              {selectedMeeting.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notas</h4>
                  <div className="rounded-lg bg-muted p-3 text-sm transition-all-smooth">
                    <p className="text-muted-foreground">{selectedMeeting.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => {
                    setEditingMeeting(selectedMeeting)
                    setSelectedMeeting(null)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => handleDeleteMeeting(selectedMeeting.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingMeeting && (
        <Dialog open={!!editingMeeting} onOpenChange={() => setEditingMeeting(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <DialogHeader>
              <DialogTitle>Editar Reunión</DialogTitle>
            </DialogHeader>
            <MeetingForm
              initialData={editingMeeting}
              onSubmit={handleEditMeeting}
              onCancel={() => setEditingMeeting(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function MeetingForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Meeting
  onSubmit: (meeting: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || ("estudio" as "estudio" | "proyecto" | "tutoria" | "otro"),
    date: initialData?.date || new Date(),
    time: initialData?.time || "10:00",
    duration: initialData?.duration || 60,
    location: initialData?.location || "",
    isVirtual: initialData?.isVirtual || false,
    meetingLink: initialData?.meetingLink || "",
    participants: initialData?.participants || [],
    agenda: initialData?.agenda || "",
    notes: initialData?.notes || "",
  })
  const [newParticipant, setNewParticipant] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  const handleAddParticipant = () => {
    if (newParticipant && !formData.participants.includes(newParticipant)) {
      setFormData({ ...formData, participants: [...formData.participants, newParticipant] })
      setNewParticipant("")
    }
  }

  const handleRemoveParticipant = (participant: string) => {
    setFormData({ ...formData, participants: formData.participants.filter((p) => p !== participant) })
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
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="estudio">Sesión de Estudio</SelectItem>
            <SelectItem value="proyecto">Proyecto</SelectItem>
            <SelectItem value="tutoria">Tutoría</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
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
            min="15"
            step="15"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isVirtual"
          checked={formData.isVirtual}
          onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="isVirtual" className="cursor-pointer">
          Reunión virtual
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">{formData.isVirtual ? "Plataforma" : "Ubicación"}</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder={formData.isVirtual ? "Ej: Zoom, Google Meet" : "Ej: Aula 301"}
          required
        />
      </div>

      {formData.isVirtual && (
        <div className="space-y-2">
          <Label htmlFor="meetingLink">Enlace de reunión (opcional)</Label>
          <Input
            id="meetingLink"
            type="url"
            value={formData.meetingLink}
            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
            placeholder="https://..."
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Participantes</Label>
        <div className="flex gap-2">
          <Input
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddParticipant())}
            placeholder="Nombre del participante"
          />
          <Button type="button" onClick={handleAddParticipant}>
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.participants.map((participant) => (
            <Badge key={participant} variant="secondary" className="gap-1">
              {participant}
              <button
                type="button"
                onClick={() => handleRemoveParticipant(participant)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda">Agenda (opcional)</Label>
        <Textarea
          id="agenda"
          value={formData.agenda}
          onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
          rows={3}
          placeholder="1. Punto uno&#10;2. Punto dos"
        />
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
        <Button type="submit">{initialData ? "Actualizar" : "Crear"} Reunión</Button>
      </DialogFooter>
    </form>
  )
}
