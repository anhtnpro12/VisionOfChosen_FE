"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Send,
  User,
  CloudIcon as Aws,
  Database,
  Shield,
  Activity,
  Upload,
  FileText,
  X,
  Plus,
  MessageSquare,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ChatHistoryViewer } from "@/components/chat-history-viewer"
import dashboardApi from "../api/dashboardApi";

interface Message {
  id: string
  type: "user" | "ai" | "system"
  content: string
  timestamp: Date
  metadata?: {
    awsRegion?: string
    resourceCount?: number
    action?: string
  }
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  lastActivity: Date
  preview?: string // Last message preview
}

// Chat Storage Service
class ChatStorageService {
  private static STORAGE_KEY = "terraform-chat-history"

  static saveChatSessions(sessions: ChatSession[]): void {
    try {
      const serializedSessions = sessions.map((session) => ({
        ...session,
        messages: session.messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        createdAt: session.createdAt.toISOString(),
        lastActivity: session.lastActivity.toISOString(),
      }))
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedSessions))
    } catch (error) {
      console.error("Failed to save chat sessions:", error)
    }
  }

  static loadChatSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return this.getDefaultSessions()

      const parsed = JSON.parse(stored)
      return parsed.map((session: any) => ({
        ...session,
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        createdAt: new Date(session.createdAt),
        lastActivity: new Date(session.lastActivity),
      }))
    } catch (error) {
      console.error("Failed to load chat sessions:", error)
      return this.getDefaultSessions()
    }
  }

  static getDefaultSessions(): ChatSession[] {
    return [
      {
        id: "chat-1",
        title: "AWS Infrastructure Analysis",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lastActivity: new Date(),
        preview: "AI Assistant đã kết nối thành công với AWS...",
        messages: [
          {
            id: "1",
            type: "system",
            content: "AI Assistant đã kết nối thành công với AWS. Sẵn sàng phân tích Terraform infrastructure của bạn.",
            timestamp: new Date(),
            metadata: { awsRegion: "us-east-1" },
          },
        ],
      },
      {
        id: "chat-2",
        title: "S3 Bucket Security Review",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 23 * 60 * 60 * 1000),
        preview: "Đã phát hiện 3 S3 buckets với cấu hình bảo mật cần cải thiện...",
        messages: [
          {
            id: "1",
            type: "system",
            content: "Bắt đầu phân tích bảo mật S3 buckets...",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          {
            id: "2",
            type: "user",
            content: "Kiểm tra cấu hình bảo mật của S3 bucket production",
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
          },
          {
            id: "3",
            type: "ai",
            content:
              "Đã phát hiện 3 S3 buckets với cấu hình bảo mật cần cải thiện. Bucket 'app-storage' không có encryption, bucket 'logs-backup' có public read access.",
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
            metadata: { awsRegion: "us-east-1", resourceCount: 3 },
          },
        ],
      },
      {
        id: "chat-3",
        title: "Cost Optimization Analysis",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        preview: "Phát hiện 5 EC2 instances có thể downsize để tiết kiệm 30% chi phí...",
        messages: [
          {
            id: "1",
            type: "system",
            content: "Khởi tạo phân tích cost optimization...",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            id: "2",
            type: "user",
            content: "Phân tích chi phí EC2 instances và đưa ra gợi ý tối ưu",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            id: "3",
            type: "ai",
            content:
              "Phát hiện 5 EC2 instances có thể downsize để tiết kiệm 30% chi phí. Instance i-1234567 chạy t3.large nhưng CPU usage chỉ 15%.",
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            metadata: { awsRegion: "us-west-2", resourceCount: 12 },
          },
        ],
      },
    ]
  }

  static deleteChatSession(sessionId: string): void {
    const sessions = this.loadChatSessions()
    const filteredSessions = sessions.filter((session) => session.id !== sessionId)
    this.saveChatSessions(filteredSessions)
  }
}

export function AiChatInterface() {
  const [currentChatId, setCurrentChatId] = useState("chat-1")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Load chat sessions on component mount
  useEffect(() => {
    const loadedSessions = ChatStorageService.loadChatSessions()
    setChatSessions(loadedSessions)
  }, [])

  // Save chat sessions whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      ChatStorageService.saveChatSessions(chatSessions)
    }
  }, [chatSessions])

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId)
  const messages = currentChat?.messages || []

  const updateChatPreview = (chatId: string, lastMessage: Message) => {
    const preview = lastMessage.content.length > 50 ? lastMessage.content.substring(0, 50) + "..." : lastMessage.content

    setChatSessions((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, preview } : chat)))
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    // Update current chat with new message
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              lastActivity: new Date(),
            }
          : chat,
      ),
    )

    updateChatPreview(currentChatId, userMessage)
    setInputMessage("")
    setIsTyping(true)

    try {
      // Hardcode sessionId và userId tạm thời
      const payload = {
        sessionId: currentChatId,
        userId: "user-123", // hardcode
        message: inputMessage,
      }
      const response = await dashboardApi.askAI(payload)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.data.message, // Nếu muốn hiển thị role: `${response.data.role}: ${response.data.message}`
        timestamp: new Date(),
        // Có thể bổ sung metadata nếu API trả về
      }
      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiResponse],
                lastActivity: new Date(),
              }
            : chat,
        ),
      )
      updateChatPreview(currentChatId, aiResponse)
    } catch (error) {
      toast({
        title: "Lỗi khi gọi AI",
        description: "Không thể lấy phản hồi từ AI. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`
    const newChat: ChatSession = {
      id: newChatId,
      title: `Infrastructure Chat ${chatSessions.length + 1}`,
      createdAt: new Date(),
      lastActivity: new Date(),
      preview: "AI Assistant đã sẵn sàng. Hãy upload Terraform files...",
      messages: [
        {
          id: "1",
          type: "system",
          content: "AI Assistant đã sẵn sàng. Hãy upload Terraform files hoặc hỏi về infrastructure của bạn.",
          timestamp: new Date(),
          metadata: { awsRegion: "us-east-1" },
        },
      ],
    }

    setChatSessions((prev) => [newChat, ...prev])
    setCurrentChatId(newChatId)
    setUploadedFiles([])

    toast({
      title: "New chat created",
      description: `Started "${newChat.title}" conversation`,
    })
  }

  const switchToChat = (chatId: string) => {
    setCurrentChatId(chatId)
    setUploadedFiles([]) // Reset files when switching chats
  }

  const deleteChatSession = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent dropdown from closing

    if (chatSessions.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one chat session",
        variant: "destructive",
      })
      return
    }

    const chatToDelete = chatSessions.find((chat) => chat.id === chatId)
    setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId))

    // If deleting current chat, switch to the first available chat
    if (chatId === currentChatId) {
      const remainingChats = chatSessions.filter((chat) => chat.id !== chatId)
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id)
      }
    }

    toast({
      title: "Chat deleted",
      description: `"${chatToDelete?.title}" has been removed from history`,
    })
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      const validExtensions = [".tfplan", ".tfstate", ".json", ".tf"]
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))
      return validExtensions.includes(fileExtension)
    })

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles])

      // Add system message about file upload
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content: `📁 Uploaded ${validFiles.length} file(s): ${validFiles.map((f) => f.name).join(", ")}`,
        timestamp: new Date(),
        metadata: { action: "file_upload" },
      }

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, systemMessage],
                lastActivity: new Date(),
              }
            : chat,
        ),
      )

      updateChatPreview(currentChatId, systemMessage)

      toast({
        title: "Files uploaded successfully",
        description: `${validFiles.length} Terraform files ready for analysis`,
      })
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const connectToAWS = async () => {
    setIsConnecting(true)

    setTimeout(() => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: "system",
        content: "✅ Đã kết nối thành công với AWS Account (123456789012). Đang đồng bộ Terraform state...",
        timestamp: new Date(),
        metadata: { awsRegion: "us-east-1", resourceCount: 45 },
      }

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, systemMessage],
                lastActivity: new Date(),
              }
            : chat,
        ),
      )
      updateChatPreview(currentChatId, systemMessage)
      setIsConnecting(false)
      toast({
        title: "Kết nối thành công",
        description: "AI đã kết nối với AWS và sẵn sàng phân tích infrastructure",
      })
    }, 3000)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <CardTitle>AI Infrastructure Assistant</CardTitle>
              <CardDescription>Chat với AI để phân tích và quản lý Terraform infrastructure trên AWS</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={createNewChat}>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <ChatHistoryViewer chatSessions={chatSessions} onSelectChat={switchToChat} currentChatId={currentChatId} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Aws className="h-3 w-3" />
            AWS Connected
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            Terraform State: Synced
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {currentChat?.title || "Current Chat"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className="border rounded-lg">
          <ScrollArea className="h-80 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Bắt đầu chat với AI để phân tích infrastructure!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      {(message.type === "ai" || message.type === "system") && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {message.type === "system" ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <Bot className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.type === "system"
                              ? "bg-muted border"
                              : "bg-card border"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.metadata && (
                          <div className="flex gap-2 mt-2 text-xs opacity-70">
                            {message.metadata.awsRegion && (
                              <Badge variant="outline" className="text-xs">
                                {message.metadata.awsRegion}
                              </Badge>
                            )}
                            {message.metadata.resourceCount && (
                              <Badge variant="outline" className="text-xs">
                                {message.metadata.resourceCount} resources
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                      </div>
                      {message.type === "user" && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-card border rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
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
          <div className="p-3 space-y-3">
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
                      <FileText className="h-3 w-3" />
                      <span className="truncate max-w-32">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-4 w-4 p-0 hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="file"
                multiple
                accept=".tfplan,.tfstate,.json,.tf"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                </label>
              </Button>
              <Input
                placeholder="Ask AI about infrastructure or upload files..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isTyping}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={connectToAWS} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <Activity className="h-3 w-3 mr-1 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Aws className="h-3 w-3 mr-1" />
                      Reconnect AWS
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {uploadedFiles.length > 0
                  ? `${uploadedFiles.length} files ready for analysis`
                  : "Upload files and ask AI questions"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
