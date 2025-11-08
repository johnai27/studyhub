"use client"
import { useState } from "react"
import type React from "react"

import { Plus, Search, FileText, Copy, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Template {
  id: string
  name: string
  description: string
  category: "ensayo" | "informe" | "presentacion" | "notas" | "otro"
  content: string
  favorite: boolean
  createdAt: Date
}

const initialTemplates: Template[] = [
  {
    id: "1",
    name: "Plantilla de Ensayo Académico",
    description: "Estructura básica para ensayos universitarios",
    category: "ensayo",
    content: `# [Título del Ensayo]

## Introducción
[Presenta el tema y tu tesis principal]

## Desarrollo

### Argumento 1
[Desarrolla tu primer argumento con evidencia]

### Argumento 2
[Desarrolla tu segundo argumento con evidencia]

### Argumento 3
[Desarrolla tu tercer argumento con evidencia]

## Conclusión
[Resume tus argumentos y reafirma tu tesis]

## Referencias
[Lista tus fuentes en formato APA/MLA]`,
    favorite: true,
    createdAt: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: "2",
    name: "Informe de Laboratorio",
    description: "Formato estándar para reportes de experimentos",
    category: "informe",
    content: `# Informe de Laboratorio

## Datos Generales
- **Materia:** [Nombre de la materia]
- **Profesor:** [Nombre del profesor]
- **Fecha:** [Fecha del experimento]
- **Integrantes:** [Nombres]

## Objetivo
[Describe el objetivo del experimento]

## Marco Teórico
[Explica los conceptos teóricos relevantes]

## Materiales
- Material 1
- Material 2
- Material 3

## Procedimiento
1. Paso 1
2. Paso 2
3. Paso 3

## Resultados
[Presenta los datos obtenidos, incluye tablas o gráficos]

## Análisis
[Interpreta los resultados]

## Conclusiones
[Resume tus hallazgos y su relación con el objetivo]

## Referencias
[Bibliografía utilizada]`,
    favorite: true,
    createdAt: new Date(Date.now() - 86400000 * 20),
  },
  {
    id: "3",
    name: "Notas de Clase",
    description: "Plantilla para tomar apuntes estructurados",
    category: "notas",
    content: `# [Materia] - [Fecha]

## Tema Principal
[Título del tema de la clase]

## Conceptos Clave
- Concepto 1: [Definición]
- Concepto 2: [Definición]
- Concepto 3: [Definición]

## Notas de la Clase

### Sección 1
[Notas principales]

### Sección 2
[Notas principales]

## Preguntas
- [ ] Pregunta 1
- [ ] Pregunta 2

## Para Revisar
- [ ] Tema 1
- [ ] Tema 2

## Próxima Clase
[Temas que se verán]`,
    favorite: false,
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
]

export function TemplatesManager() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("todas")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "todas" || template.category === filterCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (a.favorite && !b.favorite) return -1
      if (!a.favorite && b.favorite) return 1
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

  const handleAddTemplate = (newTemplate: Omit<Template, "id" | "createdAt">) => {
    const template: Template = {
      ...newTemplate,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setTemplates([...templates, template])
    setIsAddDialogOpen(false)
    toast.success("Plantilla creada exitosamente")
  }

  const handleEditTemplate = (updatedTemplate: Template) => {
    setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)))
    setEditingTemplate(null)
    setSelectedTemplate(null)
    toast.success("Plantilla actualizada exitosamente")
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
    setSelectedTemplate(null)
    toast.success("Plantilla eliminada")
  }

  const handleToggleFavorite = (templateId: string) => {
    setTemplates(templates.map((t) => (t.id === templateId ? { ...t, favorite: !t.favorite } : t)))
    toast.success("Favorito actualizado")
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Contenido copiado al portapapeles")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-fade-in">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar plantillas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="ensayo">Ensayos</SelectItem>
              <SelectItem value="informe">Informes</SelectItem>
              <SelectItem value="presentacion">Presentaciones</SelectItem>
              <SelectItem value="notas">Notas</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Plantilla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Plantilla</DialogTitle>
            </DialogHeader>
            <TemplateForm onSubmit={handleAddTemplate} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.05s" }}>
        {filteredTemplates.length === 0 ? (
          <Card className="p-12 text-center md:col-span-2 lg:col-span-3">
            <p className="text-muted-foreground">No se encontraron plantillas</p>
          </Card>
        ) : (
          filteredTemplates.map((template, index) => (
            <Card
              key={template.id}
              className="p-4 cursor-pointer hover-lift animate-fade-in relative transition-all-smooth"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold line-clamp-1">{template.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFavorite(template.id)
                    }}
                    className={`flex-shrink-0 transition-colors duration-200 ${template.favorite ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                  >
                    <Star className={`h-5 w-5 ${template.favorite ? "fill-primary" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{template.category}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyContent(template.content)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedTemplate && !editingTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTemplate.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(selectedTemplate.id)}
                    className="transition-colors duration-200"
                  >
                    <Star className={`h-4 w-4 ${selectedTemplate.favorite ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyContent(selectedTemplate.content)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                <Badge variant="secondary" className="mt-2">
                  {selectedTemplate.category}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contenido de la Plantilla</h4>
                <div className="rounded-lg bg-muted p-4 font-mono text-sm max-h-96 overflow-y-auto transition-all-smooth">
                  <pre className="whitespace-pre-wrap text-foreground">{selectedTemplate.content}</pre>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 bg-transparent transition-all-smooth"
                  onClick={() => {
                    setEditingTemplate(selectedTemplate)
                    setSelectedTemplate(null)
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2 transition-all-smooth"
                  onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <DialogHeader>
              <DialogTitle>Editar Plantilla</DialogTitle>
            </DialogHeader>
            <TemplateForm
              initialData={editingTemplate}
              onSubmit={handleEditTemplate}
              onCancel={() => setEditingTemplate(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function TemplateForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Template
  onSubmit: (template: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || ("otro" as "ensayo" | "informe" | "presentacion" | "notas" | "otro"),
    content: initialData?.content || "",
    favorite: initialData?.favorite || false,
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
        <Label htmlFor="name">Nombre de la Plantilla</Label>
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ensayo">Ensayo</SelectItem>
            <SelectItem value="informe">Informe</SelectItem>
            <SelectItem value="presentacion">Presentación</SelectItem>
            <SelectItem value="notas">Notas</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido de la Plantilla</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={16}
          className="font-mono text-sm"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="favorite"
          checked={formData.favorite}
          onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="favorite" className="cursor-pointer">
          Marcar como favorito
        </Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Crear"} Plantilla</Button>
      </DialogFooter>
    </form>
  )
}
