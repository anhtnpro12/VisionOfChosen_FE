"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft, Bot, AlertTriangle } from "lucide-react"
import { DriftCard } from "@/components/drift-card"
import Link from "next/link"
import dashboardApi, { type ScanDetailResponse } from "@/api/dashboardApi"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  const [aiQuestion, setAiQuestion] = useState("")
  const [scanData, setScanData] = useState<ScanDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchScanDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await dashboardApi.getScanDetail(params.id)
      setScanData(response.data)
    } catch (err) {
      console.error("Error fetching scan detail:", err)
      setError("Không thể tải chi tiết quét. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScanDetail()
  }, [params.id])

  const handleAskAI = () => {
    // Mock AI response
    console.log("Asking AI:", aiQuestion)
    setAiQuestion("")
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/reports?tab=history">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại Scan Reports
                </Link>
              </Button>
              <div>
                <Skeleton className="h-6 w-48 mb-1" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center p-4 border rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Skeleton className="h-6 w-64" />
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
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
            <div className="ml-4 flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/reports?tab=history">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại Scan Reports
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Chi tiết kiểm tra</h1>
                <p className="text-sm text-muted-foreground">Không thể tải dữ liệu</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="link" className="p-0 h-auto ml-2" onClick={fetchScanDetail}>
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!scanData) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <SidebarTrigger />
          <div className="ml-4 flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/reports?tab=history">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại Scan Reports
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Chi tiết kiểm tra</h1>
              <p className="text-sm text-muted-foreground">{scanData.fileName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Scan Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tổng quan kết quả quét</span>
              <Badge
                variant={
                  scanData.riskLevel === "high"
                    ? "destructive"
                    : scanData.riskLevel === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {scanData.riskLevel === "high"
                  ? "Rủi ro cao"
                  : scanData.riskLevel === "medium"
                    ? "Rủi ro trung bình"
                    : "Rủi ro thấp"}
              </Badge>
            </CardTitle>
            <CardDescription>Quét hoàn thành lúc {scanData.scanDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{scanData.totalResources}</div>
                <div className="text-sm text-muted-foreground">Tổng tài nguyên</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-destructive">{scanData.driftCount}</div>
                <div className="text-sm text-muted-foreground">Drift phát hiện</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {scanData.totalResources - scanData.driftCount}
                </div>
                <div className="text-sm text-muted-foreground">Tài nguyên ổn định</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drift List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Danh sách Drift theo tài nguyên</h2>
          {scanData.drifts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Không có drift nào</h3>
                <p className="text-muted-foreground">
                  Không phát hiện drift nào trong lần quét này. Infrastructure của bạn đang ổn định.
                </p>
              </CardContent>
            </Card>
          ) : (
            scanData.drifts.map((drift, index) => (
              <DriftCard key={`${drift.resourceType}-${drift.resourceName}-${index}`} drift={drift} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
