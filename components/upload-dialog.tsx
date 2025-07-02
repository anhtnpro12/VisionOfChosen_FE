"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, Send, User } from "lucide-react"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const { toast } = useToast()

  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; type: "user" | "ai"; content: string; timestamp: Date }>
  >([])
  const [chatInput, setChatInput] = useState("")
  const [isAiTyping, setIsAiTyping] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validExtensions = [".tfplan", ".tfstate", ".json"]
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

      if (!validExtensions.includes(fileExtension)) {
        toast({
          title: "File không hợp lệ",
          description: "Chỉ chấp nhận file .tfplan, .tfstate hoặc .json",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      setUploadComplete(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)
          toast({
            title: "Upload thành công",
            description: "File đã được tải lên và đang được phân tích",
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleClose = () => {
    setSelectedFile(null)
    setUploading(false)
    setUploadProgress(0)
    setUploadComplete(false)
    onOpenChange(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsAiTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai" as const,
        content: `Tôi hiểu bạn muốn biết về "${chatInput}". Dựa trên file Terraform bạn upload, tôi sẽ phân tích và đưa ra những insight chi tiết về infrastructure của bạn. Bạn có thể hỏi về security, cost optimization, hoặc best practices.`,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiMessage])
      setIsAiTyping(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Terraform File & Chat với AI
          </DialogTitle>
          <DialogDescription>Upload file và chat với AI để được tư vấn về infrastructure</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[60vh]">
          {/* Upload Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Upload File</h3>
            <div className="space-y-4">
              {!uploadComplete ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="file">Chọn file</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".tfplan,.tfstate,.json"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                  </div>

                  {selectedFile && (
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <div className="font-medium">{selectedFile.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Kích thước: {formatFileSize(selectedFile.size)}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Đang upload...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium text-green-600">Upload thành công!</div>
                      <div className="text-sm">
                        File {selectedFile?.name} đã được tải lên và đang được AI phân tích. Bạn sẽ nhận được thông báo
                        khi quá trình phân tích hoàn tất.
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Chat với AI
            </h3>
            <div className="border rounded-lg bg-slate-50 dark:bg-slate-900">
              <ScrollArea className="h-80 p-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Hãy upload file và bắt đầu chat với AI!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "ai" && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === "user" ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-800 border"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                        {message.type === "user" && (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 border rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              <Separator />
              <div className="p-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Hỏi AI về infrastructure của bạn..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={!selectedFile || isAiTyping}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || !selectedFile || isAiTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {!selectedFile && (
                  <p className="text-xs text-muted-foreground mt-2">Upload file trước để chat với AI</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            {uploadComplete ? "Đóng" : "Hủy"}
          </Button>
          {!uploadComplete && (
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? "Đang upload..." : "Upload"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
