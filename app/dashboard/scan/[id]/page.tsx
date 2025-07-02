"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft, Bot } from "lucide-react"
import { DriftCard } from "@/components/drift-card"
import Link from "next/link"

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  const [aiQuestion, setAiQuestion] = useState("")

  // Mock data for scan details
  const scanDetails = {
    id: params.id,
    fileName: "production-infrastructure.tfplan",
    scanDate: "2024-01-15 14:30:00",
    status: "completed",
    totalResources: 45,
    driftCount: 7,
    riskLevel: "high",
  }

  const drifts = [
    {
      id: "drift-001",
      resourceType: "aws_s3_bucket",
      resourceName: "app-storage-bucket",
      riskLevel: "high",
      beforeState: {
        versioning: "Disabled",
        encryption: "None",
        public_access_block: "false",
      },
      afterState: {
        versioning: "Enabled",
        encryption: "AES256",
        public_access_block: "true",
      },
      aiExplanation:
        "Phát hiện thay đổi cấu hình bảo mật quan trọng trên S3 bucket. Việc bật versioning và encryption là tích cực, nhưng cần kiểm tra xem có phải là thay đổi có chủ ý hay không.",
      aiSuggestion:
        "1. Xác nhận với team DevOps về việc thay đổi này\n2. Cập nhật Terraform code để phản ánh cấu hình mới\n3. Chạy terraform plan để đồng bộ state",
    },
    {
      id: "drift-002",
      resourceType: "aws_ec2_instance",
      resourceName: "web-server-01",
      riskLevel: "medium",
      beforeState: {
        instance_type: "t3.micro",
        security_groups: ["sg-web-default"],
        tags: { Environment: "production" },
      },
      afterState: {
        instance_type: "t3.small",
        security_groups: ["sg-web-default", "sg-monitoring"],
        tags: { Environment: "production", Monitoring: "enabled" },
      },
      aiExplanation:
        "EC2 instance đã được nâng cấp instance type và thêm security group mới. Có thể là do yêu cầu tăng performance hoặc thêm monitoring.",
      aiSuggestion:
        "1. Kiểm tra lý do nâng cấp instance type\n2. Cập nhật Terraform để include security group mới\n3. Đảm bảo cost optimization sau khi nâng cấp",
    },
    {
      id: "drift-003",
      resourceType: "aws_rds_instance",
      resourceName: "main-database",
      riskLevel: "low",
      beforeState: {
        backup_retention_period: 7,
        backup_window: "03:00-04:00",
        maintenance_window: "sun:04:00-sun:05:00",
      },
      afterState: {
        backup_retention_period: 14,
        backup_window: "02:00-03:00",
        maintenance_window: "sun:03:00-sun:04:00",
      },
      aiExplanation:
        "Cấu hình backup và maintenance window của RDS đã được điều chỉnh. Tăng retention period là tích cực cho data protection.",
      aiSuggestion:
        "1. Cập nhật Terraform code với cấu hình backup mới\n2. Thông báo team về thay đổi maintenance window\n3. Monitor backup costs sau khi tăng retention period",
    },
  ]

  const handleAskAI = () => {
    // Mock AI response
    console.log("Asking AI:", aiQuestion)
    setAiQuestion("")
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
              <p className="text-sm text-muted-foreground">{scanDetails.fileName}</p>
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
                  scanDetails.riskLevel === "high"
                    ? "destructive"
                    : scanDetails.riskLevel === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {scanDetails.riskLevel === "high"
                  ? "Rủi ro cao"
                  : scanDetails.riskLevel === "medium"
                    ? "Rủi ro trung bình"
                    : "Rủi ro thấp"}
              </Badge>
            </CardTitle>
            <CardDescription>Quét hoàn thành lúc {scanDetails.scanDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{scanDetails.totalResources}</div>
                <div className="text-sm text-muted-foreground">Tổng tài nguyên</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-destructive">{scanDetails.driftCount}</div>
                <div className="text-sm text-muted-foreground">Drift phát hiện</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {scanDetails.totalResources - scanDetails.driftCount}
                </div>
                <div className="text-sm text-muted-foreground">Tài nguyên ổn định</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drift List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Danh sách Drift theo tài nguyên</h2>
          {drifts.map((drift) => (
            <DriftCard key={drift.id} drift={drift} />
          ))}
        </div>

        {/* AI Chat Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Hỏi AI về kết quả phân tích
            </CardTitle>
            <CardDescription>Đặt câu hỏi để được AI giải thích thêm về các drift được phát hiện</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ví dụ: Tại sao việc thay đổi S3 bucket lại có mức rủi ro cao?"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAskAI} disabled={!aiQuestion.trim()}>
              <Bot className="mr-2 h-4 w-4" />
              Hỏi AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
