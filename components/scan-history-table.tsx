"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import Link from "next/link"

const scanHistory = [
  {
    id: "scan-001",
    fileName: "production-infrastructure.tfplan",
    scanDate: "2024-01-15 14:30:00",
    driftCount: 7,
    riskLevel: "high",
    status: "completed",
  },
  {
    id: "scan-002",
    fileName: "staging-environment.tfstate",
    scanDate: "2024-01-14 09:15:00",
    driftCount: 3,
    riskLevel: "medium",
    status: "completed",
  },
  {
    id: "scan-003",
    fileName: "dev-infrastructure.tfplan",
    scanDate: "2024-01-13 16:45:00",
    driftCount: 1,
    riskLevel: "low",
    status: "completed",
  },
  {
    id: "scan-004",
    fileName: "network-config.tfstate",
    scanDate: "2024-01-12 11:20:00",
    driftCount: 0,
    riskLevel: "low",
    status: "completed",
  },
  {
    id: "scan-005",
    fileName: "security-policies.tfplan",
    scanDate: "2024-01-11 13:10:00",
    driftCount: 12,
    riskLevel: "high",
    status: "completed",
  },
]

export function ScanHistoryTable() {
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
