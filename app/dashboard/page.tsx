"use client"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UploadDialog } from "@/components/upload-dialog"
import { AiChatInterface } from "@/components/ai-chat-interface"
import { IacMetricsSection } from "@/components/iac-metrics-section"
import { AwsLogsSection } from "@/components/aws-logs-section"

export default function DashboardPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <SidebarTrigger />
          <div className="ml-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">AI-powered Terraform infrastructure management</p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* AI Chat Interface */}
        <AiChatInterface />

        {/* IaC Metrics Section */}
        <IacMetricsSection />

        {/* AWS Logs Section */}
        <AwsLogsSection />

        <UploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      </div>
    </div>
  )
}
