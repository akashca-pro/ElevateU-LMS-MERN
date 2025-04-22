import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import TopAnalytics from "./TopAnalytics"
import { useDashboardMetricsQuery, useRevenueChartQuery } from '@/services/adminApi/adminAnalyticsApi.js'
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Index = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString()) // '1' to '12'
  const [viewType, setViewType] = useState("yearly")
  const { data: revenueData } = useRevenueChartQuery({
    year,
    viewType,
    month: viewType === "monthly" || viewType === "weekly" ? month : undefined,
  });

  console.log(revenueData)

  const { data : details } = useDashboardMetricsQuery()

  const metrics = [
    {
      value: details?.data?.totalEarnings || 0,
      label: "Total Earnings",
    },
    {
      value: details?.data?.totalStudents || 0,
      label: "Total Students",
    },
    {
      value: details?.data?.totalTutors || 0,
      label: "Total Tutors",
    },
    {
      value: details?.data?.totalCourses || 0,
      label: "Total Courses",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
              <div className="text-2xl font-semibold">{metric.value}</div>
              <div className="text-sm text-gray-500">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="rounded-lg border border-gray-100 bg-white p-6">
        <div className="flex gap-4 justify-end">
          {/* Year Selector */}
          <Select onValueChange={(value) => setYear(value)} defaultValue={String(year)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>

          {/* View Type Selector */}
          <Select onValueChange={(value) => setViewType(value)} defaultValue={viewType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>

          {/* Show Month Selector for monthly/weekly */}
          {(viewType === "monthly" || viewType === "weekly") && (
            <Select onValueChange={(value) => setMonth(value)} defaultValue={String(month)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {new Date(0, i).toLocaleString("default", { month: "short" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData?.data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
              dataKey={
                viewType === "yearly"
                  ? "month"
                  : viewType === "monthly"
                  ? "date"
                  : 'week'
              }
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
                <YAxis axisLine={false} tickLine={false} tickMargin={10} tickFormatter={(value) => `₹${value}`} />
             
                <Area type="monotone" dataKey="income" stroke="#7C3AED" strokeWidth={2} fill="url(#income)" />
                <Area type="monotone" dataKey="profit" stroke="#7C3AED" strokeWidth={2} fill="url(#profit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#7C3AED]" />
              <span className="text-sm text-gray-500">Revenue</span>
            </div>
          </div>

        </div>
        {/* Top 10  */}

        <TopAnalytics/>

      </div>
    </div>
  )
}

export default Index
