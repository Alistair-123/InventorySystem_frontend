import React, { useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Label,
  Sector,
  ResponsiveContainer,
  Tooltip
} from "recharts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  statusBreakdown: {
    serviceable: number
    unserviceable: number
    disposed: number
    lost: number
  }
}

export function ChartPieDonutText({ statusBreakdown }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const rawData = [
    { name: "Serviceable", value: statusBreakdown.serviceable, color: "#22c55e" },
    { name: "Unserviceable", value: statusBreakdown.unserviceable, color: "#000000" },
    { name: "Disposed", value: statusBreakdown.disposed, color: "#6b7280" },
    { name: "Lost", value: statusBreakdown.lost, color: "#ef4444" },
  ]

  const chartData = rawData.filter((item) => item.value > 0)

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0)

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / total) * 100).toFixed(1)

      return (
        <div className="bg-background border rounded-md shadow-md p-3 text-sm">
          <div className="font-semibold">{data.name}</div>
          <div className="text-muted-foreground">
            {data.value.toLocaleString()} items
          </div>
          <div className="text-muted-foreground">
            {percentage}%
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Property Status</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <div className="w-full h-[280px]">
          <ResponsiveContainer>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                activeIndex={activeIndex ?? -1}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}

                <Label
                  position="center"
                  content={() => (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan className="text-2xl font-bold">
                        {total.toLocaleString()}
                      </tspan>
                      <tspan x="50%" dy="20">
                        Total
                      </tspan>
                    </text>
                  )}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 w-full space-y-2">
          {chartData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1)

            return (
              <div
                key={index}
                className="flex items-center justify-between text-sm hover:bg-muted p-2 rounded-md transition"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <div className="flex gap-3">
                  <span className="text-muted-foreground">
                    {percentage}%
                  </span>
                  <span className="font-medium">
                    {item.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground justify-center">
        Hover slices to view details
      </CardFooter>
    </Card>
  )
}