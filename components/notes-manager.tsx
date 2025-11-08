"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Search, BookOpen, Edit, Trash2, Pin, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  content: string
  subject: string
  tags: string[]
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Leyes de Newton",
    content:
      "Primera Ley: Un objeto en reposo permanece en reposo y un objeto en movimiento permanece en movimiento a menos que actúe sobre él una fuerza externa.\n\nSegunda Ley: F = ma\n\nTercera Ley: Para cada acción hay una reacción igual y opuesta.",
    subject: "Física",
    tags: ["mecánica", "fuerzas"],
    pinned: true,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "2",
    title: "Revolución Industrial",
    content:
      "La Revolución Industrial fue un periodo de transformación económica, tecnológica y social que comenzó en Gran Bretaña en el siglo XVIII.\n\nCaracterísticas principales:\n- Mecanización de la producción\n- Desarrollo del ferrocarril\n- Urbanización masiva\n- Surgimiento de la clase obrera",
    subject: "Historia",
    tags: ["siglo XVIII", "economía"],
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    id: "3",
    title: "Derivadas e Integrales",
    content:
      "Derivadas: Miden la tasa de cambio instantánea de una función.\n\nReglas básicas:\n- Regla de la potencia: d/dx(x^n) = nx^(n-1)\n- Regla del producto: (fg)' = f'g + fg'\n- Regla de la cadena: (f∘g)' = f'(g)·g'\n\nIntegrales: Operación inversa de la derivada.",
    subject: "Matemáticas",
    tags: ["cálculo", "análisis"],
    pinned: true,
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 86400000 * 4),
  },
]

export function NotesManager() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState<string>("todas")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const subjects = Array.from(new Set(notes.map((n) => n.subject)))
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)))

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesSubject = filterSubject === "todas" || note.subject === filterSubject

      return matchesSearch && matchesSubject
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })

  const handleAddNote = (newNote: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const note: Note = {
      ...newNote,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes([...notes, note])
    setIsAddDialogOpen(false)
    toast.success("Apunte creado exitosamente")
  }

  const handleEditNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date() } : note)))
    setEditingNote(null)
    setSelectedNote(null)
    toast.success("Apunte actualizado exitosamente")
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    setSelectedNote(null)
    toast.success("Apunte eliminado")
  }

  const handleTogglePin = (noteId: string) => {
    setNotes(notes.map((note) => (note.id === noteId ? { ...note, pinned: !note.pinned } : note)))
    toast.success("Apunte actualizado")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar apuntes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <BookOpen className="h-4 w-4" />
                {filterSubject === "todas" ? "Todas las materias" : filterSubject}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterSubject("todas")}>Todas las materias</DropdownMenuItem>
              {subjects.map((subject) => (
                <DropdownMenuItem key={subject} onClick={() => setFilterSubject(subject)}>
                  {subject}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Apunte
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Apunte</DialogTitle>
            </DialogHeader>
            <NoteForm onSubmit={handleAddNote} onCancel={() => setIsAddDialogOpen(false)} allTags={allTags} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.length === 0 ? (
          <Card className="p-12 text-center md:col-span-2 lg:col-span-3">
            <p className="text-muted-foreground">No se encontraron apuntes</p>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow relative"
              onClick={() => setSelectedNote(note)}
            >
              {note.pinned && <Pin className="absolute top-3 right-3 h-4 w-4 text-primary fill-primary" />}

              <div className="space-y-3">
                <div className="pr-6">
                  <h3 className="font-semibold line-clamp-1">{note.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{note.content}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{note.subject}</Badge>
                  {note.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 2 && <Badge variant="outline">+{note.tags.length - 2}</Badge>}
                </div>

                <p className="text-xs text-muted-foreground">
                  Actualizado {format(note.updatedAt, "dd MMM yyyy", { locale: es })}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedNote && !editingNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedNote.title}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTogglePin(selectedNote.id)
                    }}
                  >
                    <Pin className={`h-4 w-4 ${selectedNote.pinned ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingNote(selectedNote)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(selectedNote.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{selectedNote.subject}</Badge>
                {selectedNote.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap font-sans text-foreground">{selectedNote.content}</pre>
              </div>

              <div className="text-xs text-muted-foreground pt-4 border-t">
                <p>Creado: {format(selectedNote.createdAt, "PPP 'a las' p", { locale: es })}</p>
                <p>Actualizado: {format(selectedNote.updatedAt, "PPP 'a las' p", { locale: es })}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Apunte</DialogTitle>
            </DialogHeader>
            <NoteForm
              initialData={editingNote}
              onSubmit={handleEditNote}
              onCancel={() => setEditingNote(null)}
              allTags={allTags}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function NoteForm({
  initialData,
  onSubmit,
  onCancel,
  allTags,
}: {
  initialData?: Note
  onSubmit: (note: any) => void
  onCancel: () => void
  allTags: string[]
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    subject: initialData?.subject || "",
    tags: initialData?.tags || [],
    pinned: initialData?.pinned || false,
  })
  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      onSubmit({ ...initialData, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
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
        <Label htmlFor="subject">Materia</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={12}
          className="font-mono text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Etiquetas</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            placeholder="Agregar etiqueta..."
            list="existing-tags"
          />
          <datalist id="existing-tags">
            {allTags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
          <Button type="button" onClick={handleAddTag}>
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Crear"} Apunte</Button>
      </DialogFooter>
    </form>
  )
}
