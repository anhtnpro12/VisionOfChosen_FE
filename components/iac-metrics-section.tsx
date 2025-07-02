"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Server, Shield, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

const resourceData = [
  { name: "EC2", count: 12, cost: 450 },
  { name: "S3", count: 8, cost: 120 },
  { name: "RDS", count: 3, cost: 280 },
  { name: "Lambda", count: 15, cost: 45 },
  { name: "VPC", count: 2, cost: 0 },
  { name: "IAM", count: 25, cost: 0 },
]

const complianceData = [
  { name: "Compliant", value: 78, color: "#22c55e" },
  { name: "Warning", value: 15, color: "#f59e0b" },
  { name: "Critical", value: 7, color: "#ef4444" },
]

const driftTrendData = [
  { date: "2024-01-10", drifts: 2 },
  { date: "2024-01-11", drifts: 5 },
  { date: "2024-01-12", drifts: 1 },
  { date: "2024-01-13", drifts: 8 },
  { date: "2024-01-14", drifts: 3 },
  { date: "2024-01-15", drifts: 7 },
]

export function IacMetricsSection() {
  const totalResources = resourceData.reduce((sum, item) => sum + item.count, 0)
  const totalCost = resourceData.reduce((sum, item) => sum + item.cost, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Infrastructure Metrics & Analytics
        </CardTitle>
        <CardDescription>Real-time metrics và analytics từ AWS SDK về Terraform infrastructure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Resources</span>
            </div>
            <div className="text-2xl font-bold">{totalResources}</div>
            <div className="text-xs text-muted-foreground">+5 from last scan</div>
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Monthly Cost</span>
            </div>
            <div className="text-2xl font-bold">${totalCost}</div>
            <div className="text-xs text-muted-foreground">-12% from last month</div>
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Compliance</span>
            </div>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-xs text-muted-foreground">+3% improvement</div>
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Active Drifts</span>
            </div>
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-muted-foreground">2 high priority</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resource Distribution */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resource Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Compliance Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4">
              {complianceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drift Trend */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Drift Detection Trend (Last 7 days)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={driftTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="drifts" stroke="hsl(var(--destructive))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Health Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resource Health Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourceData.map((resource) => (
              <div key={resource.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{resource.name}</span>
                  <Badge variant="outline">{resource.count} resources</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Health Score</span>
                    <span>{Math.floor(Math.random() * 30) + 70}%</span>
                  </div>
                  <Progress value={Math.floor(Math.random() * 30) + 70} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Last checked: 2 minutes ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
