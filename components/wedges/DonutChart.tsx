"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
// const chartData = [
//   { name: "chrome", count: 275, fill: "var(--color-chrome)" },
//   { name: "safari", count: 200, fill: "var(--color-safari)" },
//   { name: "firefox", count: 187, fill: "var(--color-firefox)" },
//   { name: "edge", count: 173, fill: "var(--color-edge)" },
//   { name: "other", count: 90, fill: "var(--color-other)" },
// ]


type ComponentProps = {
    title: string;
    subTitle: string;
    data: { name: string; count: number }[];
    chartLabels: string[];
}

export default function Component({ title, subTitle, data, chartLabels }: ComponentProps) {
  const chartConfig: { [key: string]: { label: string; color: string } } = {} satisfies ChartConfig;

  for(let i = 0; i < data.length; i++) {
    chartConfig[chartLabels[i]] = {
      label: chartLabels[i],
      color: `hsl(var(--chart-${i + 1}))`,
    }    
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing top 5 of all time
        </div>
      </CardFooter>
    </Card>
  )
}
