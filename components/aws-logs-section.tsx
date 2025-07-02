"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileText, Download, RefreshCw, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: "INFO" | "WARN" | "ERROR" | "DEBUG"
  service: string
  message: string
  source: string
  region: string
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:32:15",
    level: "INFO",
    service: "terraform",
    message: "Successfully applied configuration. Resources: 3 added, 1 changed, 0 destroyed.",
    source: "terraform-apply",
    region: "us-east-1",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:31:45",
    level: "WARN",
    service: "aws-s3",
    message: "S3 bucket 'app-storage-bucket' versioning is disabled. Consider enabling for data protection.",
    source: "aws-config",
    region: "us-east-1",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:31:20",
    level: "ERROR",
    service: "aws-ec2",
    message: "Failed to launch EC2 instance i-1234567890abcdef0: InsufficientInstanceCapacity",
    source: "ec2-launch",
    region: "us-west-2",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:30:55",
    level: "INFO",
    service: "terraform",
    message: "Terraform state lock acquired successfully",
    source: "terraform-lock",
    region: "us-east-1",
  },
  {
    id: "5",
    timestamp: "2024-01-15 14:30:30",
    level: "DEBUG",
    service: "aws-iam",
    message: "IAM role 'terraform-execution-role' permissions validated",
    source: "iam-validation",
    region: "global",
  },
  {
    id: "6",
    timestamp: "2024-01-15 14:30:10",
    level: "WARN",
    service: "aws-rds",
    message: "RDS instance 'main-database' backup retention period is 7 days. Consider increasing for production.",
    source: "rds-config",
    region: "us-east-1",
  },
  {
    id: "7",
    timestamp: "2024-01-15 14:29:45",
    level: "INFO",
    service: "terraform",
    message: "Refreshing Terraform state...",
    source: "terraform-refresh",
    region: "us-east-1",
  },
  {
    id: "8",
    timestamp: "2024-01-15 14:29:20",
    level: "ERROR",
    service: "aws-lambda",
    message: "Lambda function 'data-processor' execution failed: Runtime.HandlerNotFound",
    source: "lambda-execution",
    region: "us-east-1",
  },
]

export function AwsLogsSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "ALL" || log.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  const getLogIcon = (level: string) => {
    switch (level) {
      case "ERROR":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "WARN":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "INFO":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "DEBUG":
        return <Info className="h-4 w-4 text-gray-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case "ERROR":
        return "destructive"
      case "WARN":
        return "default"
      case "INFO":
        return "secondary"
      case "DEBUG":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  const logCounts = {
    ERROR: mockLogs.filter((log) => log.level === "ERROR").length,
    WARN: mockLogs.filter((log) => log.level === "WARN").length,
    INFO: mockLogs.filter((log) => log.level === "INFO").length,
    DEBUG: mockLogs.filter((log) => log.level === "DEBUG").length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          AWS Infrastructure Logs
        </CardTitle>
        <CardDescription>Real-time logs từ AWS services và Terraform operations</CardDescription>

        {/* Log Level Summary */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {logCounts.ERROR} Errors
          </Badge>
          <Badge variant="default" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {logCounts.WARN} Warnings
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {logCounts.INFO} Info
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            {logCounts.DEBUG} Debug
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="live">Live Logs</TabsTrigger>
            <TabsTrigger value="terraform">Terraform Logs</TabsTrigger>
            <TabsTrigger value="aws">AWS Service Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4">
            {/* Controls */}
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="ALL">All Levels</option>
                <option value="ERROR">Error</option>
                <option value="WARN">Warning</option>
                <option value="INFO">Info</option>
                <option value="DEBUG">Debug</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Logs Display */}
            <div className="border rounded-lg">
              <ScrollArea className="h-96">
                <div className="p-4 space-y-2">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.level)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getLogBadgeVariant(log.level) as any} className="text-xs">
                            {log.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {log.service}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {log.region}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">{log.timestamp}</span>
                        </div>
                        <p className="text-sm font-mono break-words">{log.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">Source: {log.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="terraform" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Terraform-specific logs sẽ được hiển thị ở đây</p>
            </div>
          </TabsContent>

          <TabsContent value="aws" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>AWS service logs sẽ được hiển thị ở đây</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
