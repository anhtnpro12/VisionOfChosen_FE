"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { ScanItem } from "@/api/dashboardApi"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ScanHistoryTableProps {
  scanHistory: ScanItem[]
}

export function ScanHistoryTable({ scanHistory }: ScanHistoryTableProps) {
  const getRiskBadge = (riskLevel: string) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    } as const

    const labels = {
      low: "Thấp",
      medium: "Trung bình",
      high: "Cao",
    }

    return (
      <Badge variant={variants[riskLevel as keyof typeof variants]}>{labels[riskLevel as keyof typeof labels]}</Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === "completed" ? (
      <Badge variant="outline" className="text-green-600 border-green-600">
        Hoàn thành
      </Badge>
    ) : (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        Đang xử lý
      </Badge>
    )
  }

  if (!scanHistory || scanHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Không có dữ liệu quét</h3>
        <p className="text-muted-foreground mb-4">
          Chưa có lịch sử quét nào được tìm thấy. Hãy thực hiện quét đầu tiên để xem dữ liệu ở đây.
        </p>
        <Button asChild>
          <Link href="/dashboard/scan">Thực hiện quét mới</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File name</TableHead>
            <TableHead>Ngày quét</TableHead>
            <TableHead>Drift</TableHead>
            <TableHead>Rủi ro</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scanHistory.map((scan) => (
            <TableRow key={scan.id}>
              <TableCell className="font-medium">{scan.fileName}</TableCell>
              <TableCell>{scan.scanDate}</TableCell>
              <TableCell>
                <Badge variant={scan.driftCount > 0 ? "destructive" : "secondary"}>{scan.driftCount}</Badge>
              </TableCell>
              <TableCell>{getRiskBadge(scan.riskLevel)}</TableCell>
              <TableCell>{getStatusBadge(scan.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/scan/${scan.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Tải
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
