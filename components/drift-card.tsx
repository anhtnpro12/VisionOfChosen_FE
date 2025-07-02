"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Bot, AlertTriangle, Info } from "lucide-react"

interface DriftCardProps {
  drift: {
    id: string
    resourceType: string
    resourceName: string
    riskLevel: string
    beforeState: Record<string, any>
    afterState: Record<string, any>
    aiExplanation: string
    aiSuggestion: string
  }
}

export function DriftCard({ drift }: DriftCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [aiQuestion, setAiQuestion] = useState("")

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

  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel === "high") return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (riskLevel === "medium") return <Info className="h-4 w-4 text-yellow-500" />
    return <Info className="h-4 w-4 text-blue-500" />
  }

  const handleAskAI = () => {
    console.log(`Asking AI about ${drift.id}:`, aiQuestion)
    setAiQuestion("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {getRiskIcon(drift.riskLevel)}
              {drift.resourceType}
            </CardTitle>
            <CardDescription>{drift.resourceName}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getRiskBadge(drift.riskLevel)}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Before/After States */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Trạng thái trước</h4>
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-100 dark:border-red-900">
                  <pre className="text-xs overflow-x-auto">{JSON.stringify(drift.beforeState, null, 2)}</pre>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Trạng thái sau</h4>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-100 dark:border-green-900">
                  <pre className="text-xs overflow-x-auto">{JSON.stringify(drift.afterState, null, 2)}</pre>
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Giải thích của AI
              </h4>
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-100 dark:border-blue-900">
                <p className="text-sm">{drift.aiExplanation}</p>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Gợi ý giải pháp</h4>
              <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-100 dark:border-amber-900">
                <pre className="text-sm whitespace-pre-wrap">{drift.aiSuggestion}</pre>
              </div>
            </div>

            {/* Ask AI */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="font-medium text-sm">Hỏi thêm AI về drift này</h4>
              <Textarea
                placeholder="Ví dụ: Tại sao thay đổi này lại có mức rủi ro cao?"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                rows={2}
              />
              <Button size="sm" onClick={handleAskAI} disabled={!aiQuestion.trim()}>
                <Bot className="mr-2 h-4 w-4" />
                Hỏi AI
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
