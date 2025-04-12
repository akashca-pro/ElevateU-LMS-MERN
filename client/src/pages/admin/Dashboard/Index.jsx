import { ChevronDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import TopAnalytics from "./TopAnalytics"

const data = [
  { month: "Jan", income: 65, profit: 40 },
  { month: "Feb", income: 50, profit: 35 },
  { month: "Mar", income: 45, profit: 30 },
  { month: "Apr", income: 60, profit: 45 },
  { month: "May", income: 75, profit: 50 },
  { month: "Jun", income: 80, profit: 60 },
  { month: "Jul", income: 77, profit: 65 },
  { month: "Aug", income: 60, profit: 70 },
  { month: "Sep", income: 50, profit: 55 },
  { month: "Oct", income: 70, profit: 45 },
  { month: "Nov", income: 75, profit: 40 },
  { month: "Dec", income: 65, profit: 35 },
]

const metrics = [
  {
    value: "$200.00",
    label: "Total Revenue",
  },
  {
    value: "551",
    label: "Total Students",
  },
  {
    value: "551",
    label: "Total Tutors",
  },
  {
    value: "23",
    label: "Tutors Courses",
  },
]

const Index = () => {
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
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Income & Expanse</h2>
            <button className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
              Yearly
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA500" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} tickMargin={10} tickFormatter={(value) => `${value}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500">09 Projects</div>
                            <div className="font-medium">${payload[0].value},000</div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="#7C3AED" strokeWidth={2} fill="url(#income)" />
                <Area type="monotone" dataKey="profit" stroke="#FFA500" strokeWidth={2} fill="url(#profit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#7C3AED]" />
              <span className="text-sm text-gray-500">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FFA500]" />
              <span className="text-sm text-gray-500">Profit</span>
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
