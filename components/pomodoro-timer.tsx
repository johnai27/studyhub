"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Play, Pause, RotateCcw, Settings, Coffee, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

type SessionType = "work" | "shortBreak" | "longBreak"

interface PomodoroSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  })

  const [sessionType, setSessionType] = useState<SessionType>("work")
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [totalWorkTime, setTotalWorkTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getDuration = (type: SessionType) => {
    switch (type) {
      case "work":
        return settings.workDuration * 60
      case "shortBreak":
        return settings.shortBreakDuration * 60
      case "longBreak":
        return settings.longBreakDuration * 60
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const total = getDuration(sessionType)
    return ((total - timeLeft) / total) * 100
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)

    if (sessionType === "work") {
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)
      setTotalWorkTime((prev) => prev + settings.workDuration)

      if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
        setSessionType("longBreak")
        setTimeLeft(getDuration("longBreak"))
        toast.success("¡Sesión completada! Hora de un descanso largo", {
          description: `Has completado ${newCompletedSessions} sesiones`,
        })
      } else {
        setSessionType("shortBreak")
        setTimeLeft(getDuration("shortBreak"))
        toast.success("¡Sesión completada! Toma un descanso corto", {
          description: `Sesión ${newCompletedSessions} completada`,
        })
      }
    } else {
      setSessionType("work")
      setTimeLeft(getDuration("work"))
      toast.info("Descanso terminado", {
        description: "¡De vuelta al trabajo!",
      })
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(getDuration(sessionType))
  }

  const switchSessionType = (type: SessionType) => {
    setIsRunning(false)
    setSessionType(type)
    setTimeLeft(getDuration(type))
  }

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings)
    setTimeLeft(getDuration(sessionType))
    toast.success("Configuración actualizada")
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2 p-8">
        <Tabs value={sessionType} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="work" onClick={() => switchSessionType("work")} className="gap-2">
              <Zap className="h-4 w-4" />
              Trabajo
            </TabsTrigger>
            <TabsTrigger value="shortBreak" onClick={() => switchSessionType("shortBreak")} className="gap-2">
              <Coffee className="h-4 w-4" />
              Descanso Corto
            </TabsTrigger>
            <TabsTrigger value="longBreak" onClick={() => switchSessionType("longBreak")} className="gap-2">
              <Coffee className="h-4 w-4" />
              Descanso Largo
            </TabsTrigger>
          </TabsList>

          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-8xl font-bold tabular-nums tracking-tighter">{formatTime(timeLeft)}</div>
              <Progress value={getProgress()} className="w-full h-2" />
            </div>

            <div className="flex items-center justify-center gap-4">
              {!isRunning ? (
                <Button size="lg" className="gap-2 px-8" onClick={handleStart}>
                  <Play className="h-5 w-5" />
                  Iniciar
                </Button>
              ) : (
                <Button size="lg" variant="secondary" className="gap-2 px-8" onClick={handlePause}>
                  <Pause className="h-5 w-5" />
                  Pausar
                </Button>
              )}

              <Button size="lg" variant="outline" className="gap-2 bg-transparent" onClick={handleReset}>
                <RotateCcw className="h-5 w-5" />
                Reiniciar
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuración del Pomodoro</DialogTitle>
                  </DialogHeader>
                  <SettingsForm settings={settings} onSave={updateSettings} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Tabs>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Estadísticas de Hoy</h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Sesiones Completadas</p>
            <p className="text-3xl font-bold mt-1">{completedSessions}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Tiempo Total de Trabajo</p>
            <p className="text-3xl font-bold mt-1">{totalWorkTime}</p>
            <p className="text-xs text-muted-foreground mt-1">minutos</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Próximo Descanso Largo</p>
            <p className="text-3xl font-bold mt-1">
              {settings.sessionsUntilLongBreak - (completedSessions % settings.sessionsUntilLongBreak)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">sesiones restantes</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function SettingsForm({
  settings,
  onSave,
}: {
  settings: PomodoroSettings
  onSave: (settings: PomodoroSettings) => void
}) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workDuration">Duración del Trabajo (minutos)</Label>
        <Input
          id="workDuration"
          type="number"
          min="1"
          max="60"
          value={formData.workDuration}
          onChange={(e) => setFormData({ ...formData, workDuration: Number.parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortBreakDuration">Duración del Descanso Corto (minutos)</Label>
        <Input
          id="shortBreakDuration"
          type="number"
          min="1"
          max="30"
          value={formData.shortBreakDuration}
          onChange={(e) => setFormData({ ...formData, shortBreakDuration: Number.parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longBreakDuration">Duración del Descanso Largo (minutos)</Label>
        <Input
          id="longBreakDuration"
          type="number"
          min="1"
          max="60"
          value={formData.longBreakDuration}
          onChange={(e) => setFormData({ ...formData, longBreakDuration: Number.parseInt(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sessionsUntilLongBreak">Sesiones hasta Descanso Largo</Label>
        <Input
          id="sessionsUntilLongBreak"
          type="number"
          min="2"
          max="10"
          value={formData.sessionsUntilLongBreak}
          onChange={(e) => setFormData({ ...formData, sessionsUntilLongBreak: Number.parseInt(e.target.value) })}
        />
      </div>

      <Button type="submit" className="w-full">
        Guardar Configuración
      </Button>
    </form>
  )
}
