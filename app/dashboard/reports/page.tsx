"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileText, AlertTriangle, Clock, TrendingUp, Download, RefreshCw, Search, Filter } from "lucide-react"
import { ScanHistoryTable } from "@/components/scan-history-table"
import { useSearchParams } from "next/navigation"
import dashboardApi, { type ScanDashboardResponse } from "@/api/dashboardApi"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [dashboardData, setDashboardData] = useState<ScanDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await dashboardApi.getScanDashboard()
      setDashboardData(response.data)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const riskColor = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") === "history" ? "history" : "latest"

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center justify-between w-full">
              <div>
                <h1 className="text-xl font-semibold">Scan Reports</h1>
                <p className="text-sm text-muted-foreground">Tóm tắt và lịch sử các lần quét Terraform</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center justify-between w-full">
              <div>
                <h1 className="text-xl font-semibold">Scan Reports</h1>
                <p className="text-sm text-muted-foreground">Tóm tắt và lịch sử các lần quét Terraform</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="link" className="p-0 h-auto ml-2" onClick={fetchDashboardData}>
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const { latestScan, scanSummary, scanHistory } = dashboardData

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <SidebarTrigger />
          <div className="ml-4 flex items-center justify-between w-full">
            <div>
              <h1 className="text-xl font-semibold">Scan Reports</h1>
              <p className="text-sm text-muted-foreground">Tóm tắt và lịch sử các lần quét Terraform</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Scans</span>
              </div>
              <div className="text-2xl font-bold">{scanSummary.totalScans}</div>
              <div className="text-xs text-muted-foreground">Last 30 days</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {scanSummary.totalScans === 0
                  ? "0%"
                  : `${Math.round((scanSummary.successfulScans / scanSummary.totalScans) * 100)}%`}
              </div>
              <div className="text-xs text-muted-foreground">
                {scanSummary.successfulScans}/{scanSummary.totalScans} successful
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Avg Drifts</span>
              </div>
              <div className="text-2xl font-bold">{scanSummary.avgDriftCount}</div>
              <div className="text-xs text-muted-foreground">Per scan</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Critical Issues</span>
              </div>
              <div className="text-2xl font-bold">{scanSummary.criticalIssues}</div>
              <div className="text-xs text-muted-foreground">Require attention</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="latest">Latest Scan Report</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
          </TabsList>

          <TabsContent value="latest" className="space-y-6">
            {/* Latest Scan Detailed Report */}
            {latestScan === null ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Chưa có dữ liệu quét gần nhất
                  </CardTitle>
                  <CardDescription>Hệ thống chưa ghi nhận lần quét nào. Hãy thực hiện quét để xem báo cáo chi tiết.</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Chi tiết lần quét gần nhất
                  </CardTitle>
                  <CardDescription>Kết quả phân tích chi tiết từ file: {latestScan.fileName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scan Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Scan Duration</span>
                      <div className="text-lg font-semibold">{latestScan.duration}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Resources Scanned</span>
                      <div className="text-lg font-semibold">{latestScan.resourcesScanned}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Changes Detected</span>
                      <div className="text-lg font-semibold">{latestScan.changesDetected}</div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Số lượng drift</span>
                        <Badge variant="destructive">{latestScan.driftCount}</Badge>
                      </div>
                      <Progress value={70} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {latestScan.driftCount} out of {latestScan.resourcesScanned} resources
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mức độ rủi ro</span>
                        <Badge className={riskColor[latestScan.riskLevel as keyof typeof riskColor]}>
                          {latestScan.riskLevel === "high"
                            ? "Cao"
                            : latestScan.riskLevel === "medium"
                              ? "Trung bình"
                              : "Thấp"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Based on security and compliance impact</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Cảnh báo</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {latestScan.warnings}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Critical issues requiring immediate attention</div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {latestScan.warnings > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Phát hiện {latestScan.warnings} cảnh báo quan trọng cần được xem xét ngay lập tức.
                        <Button variant="link" className="p-0 h-auto ml-2" asChild>
                          <a href={`/dashboard/scan/${latestScan.id}`}>Xem chi tiết drift</a>
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Quét lúc: {latestScan.scanDate}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <a href={`/dashboard/scan/${latestScan.id}`}>Xem chi tiết</a>
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by filename, date, or status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="all">All time</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Scan History Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lịch sử kiểm tra chi tiết
                </CardTitle>
                <CardDescription>Danh sách đầy đủ các lần phân tích Terraform infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <ScanHistoryTable scanHistory={scanHistory} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
