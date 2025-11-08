"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Search, BookOpen, FileText, LinkIcon, Video, File, Edit, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

type ResourceType = "libro" | "articulo" | "video" | "enlace" | "documento"

interface Resource {
  id: string
  title: string
  description: string
  type: ResourceType
  subject: string
  author?: string
  url?: string
  tags: string[]
  createdAt: Date
}

const initialResources: Resource[] = [
  {
    id: "1",
    title: "Cálculo: Una Variable",
    description: "Libro completo de cálculo diferencial e integral",
    type: "libro",
    subject: "Matemáticas",
    author: "James Stewart",
    tags: ["cálculo", "fundamental"],
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
  {
    id: "2",
    title: "Introducción a la Mecánica Cuántica",
    description: "Artículo sobre los principios fundamentales de la mecánica cuántica",
    type: "articulo",
    subject: "Física",
    author: "Richard Feynman",
    url: "https://example.com/quantum-mechanics",
    tags: ["física moderna", "cuántica"],
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: "3",
    title: "Tutorial de Derivadas",
    description: "Video explicativo sobre reglas de derivación",
    type: "video",
    subject: "Matemáticas",
    url: "https://youtube.com/watch?v=example",
    tags: ["cálculo", "tutorial"],
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: "4",
    title: "Khan Academy - Física",
    description: "Plataforma completa de aprendizaje de física",
    type: "enlace",
    subject: "Física",
    url: "https://khanacademy.org/physics",
    tags: ["recurso online", "práctica"],
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
]

const resourceIcons = {
  libro: BookOpen,
  articulo: FileText,
  video: Video,
  enlace: LinkIcon,
  documento: File,
}

export function LibraryManager() {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("todos")
  const [filterSubject, setFilterSubject] = useState<string>("todas")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)

  const subjects = Array.from(new Set(resources.map((r) => r.subject)))

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "todos" || resource.type === filterType
    const matchesSubject = filterSubject === "todas" || resource.subject === filterSubject

    return matchesSearch && matchesType && matchesSubject
  })

  const groupedResources = filteredResources.reduce(
    (acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = []
      }
      acc[resource.type].push(resource)
      return acc
    },
    {} as Record<ResourceType, Resource[]>,
  )

  const handleAddResource = (newResource: Omit<Resource, "id" | "createdAt">) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setResources([...resources, resource])
    setIsAddDialogOpen(false)
    toast.success("Recurso agregado exitosamente")
  }

  const handleEditResource = (updatedResource: Resource) => {
    setResources(resources.map((resource) => (resource.id === updatedResource.id ? updatedResource : resource)))
    setEditingResource(null)
    toast.success("Recurso actualizado exitosamente")
  }

  const handleDeleteResource = (resourceId: string) => {
    setResources(resources.filter((resource) => resource.id !== resourceId))
    toast.success("Recurso eliminado")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar recursos..."
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
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="libro">Libros</SelectItem>
              <SelectItem value="articulo">Artículos</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="enlace">Enlaces</SelectItem>
              <SelectItem value="documento">Documentos</SelectItem>
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
              Agregar Recurso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Recurso</DialogTitle>
            </DialogHeader>
            <ResourceForm onSubmit={handleAddResource} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos ({filteredResources.length})</TabsTrigger>
          <TabsTrigger value="libros">Libros</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="enlaces">Enlaces</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredResources.length === 0 ? (
              <Card className="p-12 text-center md:col-span-2">
                <p className="text-muted-foreground">No se encontraron recursos</p>
              </Card>
            ) : (
              filteredResources.map((resource) => {
                const Icon = resourceIcons[resource.type]
                return (
                  <Card key={resource.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold line-clamp-1">{resource.title}</h3>
                            {resource.author && <p className="text-sm text-muted-foreground">por {resource.author}</p>}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                •••
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {resource.url && (
                                <DropdownMenuItem onClick={() => window.open(resource.url, "_blank")}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Abrir
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => setEditingResource(resource)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteResource(resource.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{resource.subject}</Badge>
                          <Badge variant="outline">{resource.type}</Badge>
                          {resource.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="libros" className="mt-6">
          <ResourceTypeView
            resources={groupedResources.libro || []}
            onEdit={setEditingResource}
            onDelete={handleDeleteResource}
          />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <ResourceTypeView
            resources={groupedResources.video || []}
            onEdit={setEditingResource}
            onDelete={handleDeleteResource}
          />
        </TabsContent>

        <TabsContent value="enlaces" className="mt-6">
          <ResourceTypeView
            resources={groupedResources.enlace || []}
            onEdit={setEditingResource}
            onDelete={handleDeleteResource}
          />
        </TabsContent>
      </Tabs>

      {editingResource && (
        <Dialog open={!!editingResource} onOpenChange={() => setEditingResource(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Recurso</DialogTitle>
            </DialogHeader>
            <ResourceForm
              initialData={editingResource}
              onSubmit={handleEditResource}
              onCancel={() => setEditingResource(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ResourceTypeView({
  resources,
  onEdit,
  onDelete,
}: {
  resources: Resource[]
  onEdit: (resource: Resource) => void
  onDelete: (id: string) => void
}) {
  if (resources.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No hay recursos de este tipo</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {resources.map((resource) => {
        const Icon = resourceIcons[resource.type]
        return (
          <Card key={resource.id} className="p-4">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{resource.title}</h3>
                    {resource.author && <p className="text-sm text-muted-foreground">por {resource.author}</p>}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {resource.url && (
                        <DropdownMenuItem onClick={() => window.open(resource.url, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(resource)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(resource.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{resource.subject}</Badge>
                  {resource.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function ResourceForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Resource
  onSubmit: (resource: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || ("libro" as ResourceType),
    subject: initialData?.subject || "",
    author: initialData?.author || "",
    url: initialData?.url || "",
    tags: initialData?.tags || [],
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={formData.type}
            onValueChange={(value: ResourceType) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="libro">Libro</SelectItem>
              <SelectItem value="articulo">Artículo</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="enlace">Enlace</SelectItem>
              <SelectItem value="documento">Documento</SelectItem>
            </SelectContent>
          </Select>
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

      <div className="space-y-2">
        <Label htmlFor="author">Autor (opcional)</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL (opcional)</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://..."
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
          />
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
        <Button type="submit">{initialData ? "Actualizar" : "Agregar"} Recurso</Button>
      </DialogFooter>
    </form>
  )
}
