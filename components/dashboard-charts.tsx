"use client"
import { Card } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Lun", horas: 3.5 },
  { name: "Mar", horas: 4.2 },
  { name: "Mié", horas: 3.8 },
  { name: "Jue", horas: 5.1 },
  { name: "Vie", horas: 4.5 },
  { name: "Sáb", horas: 2.8 },
  { name: "Dom", horas: 0.6 },
]

export function DashboardCharts() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Horas de Estudio esta Semana</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
          />
          <Bar dataKey="horas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
