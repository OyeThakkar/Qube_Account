"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", companies: 186, users: 80 },
  { month: "February", companies: 305, users: 200 },
  { month: "March", companies: 237, users: 120 },
  { month: "April", companies: 73, users: 190 },
  { month: "May", companies: 209, users: 130 },
  { month: "June", companies: 214, users: 140 },
]

const chartConfig = {
  companies: {
    label: "Companies",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function ExampleChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth Trends</CardTitle>
        <CardDescription>Company and User Growth Over Time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="companies" fill="var(--color-companies)" radius={4} />
              <Bar dataKey="users" fill="var(--color-users)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
