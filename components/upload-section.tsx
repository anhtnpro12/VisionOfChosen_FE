"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadSectionProps {
  onUploadClick: () => void
}

export function UploadSection({ onUploadClick }: UploadSectionProps) {
  const [textContent, setTextContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const handleTextAnalysis = async () => {
    if (!textContent.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung Terraform",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      toast({
        title: "Phân tích thành công",
        description: "Nội dung Terraform đã được phân tích. Kiểm tra kết quả trong dashboard.",
      })
      setTextContent("")
    }, 3000)
  }

  return (
    <Tabs defaultValue="file" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file">
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </TabsTrigger>
        <TabsTrigger value="text">
          <FileText className="h-4 w-4 mr-2" />
          Paste Text
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-8 border-2 border-dashed border-muted rounded-lg bg-muted/50">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">Kéo thả file hoặc click để chọn file</p>
                <p className="text-xs text-muted-foreground">Hỗ trợ: .tfplan, .tfstate, .json</p>
              </div>
              <Button onClick={onUploadClick} size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Chọn file để upload
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="text" className="mt-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nội dung Terraform Plan/State</label>
              <Textarea
                placeholder={`Paste nội dung Terraform của bạn vào đây...

Ví dụ:
{
  "format_version": "1.0",
  "terraform_version": "1.0.0",
  "planned_values": {
    "root_module": {
      "resources": [
        {
          "address": "aws_s3_bucket.example",
          "mode": "managed",
          "type": "aws_s3_bucket",
          "name": "example"
        }
      ]
    }
  }
}`}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">{textContent.length} ký tự</p>
              <Button onClick={handleTextAnalysis} disabled={!textContent.trim() || isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Phân tích ngay
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
