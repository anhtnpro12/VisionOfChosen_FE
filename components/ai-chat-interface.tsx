"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
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
import dashboardApi, { AiChatHistoryDto } from "../api/dashboardApi";
import { v4 as uuidv4 } from 'uuid';
// Hàm tiện ích thao tác cookie
function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '');
}

export const MESSAGE_TYPE = ["user", "ai", "system"] as const;
type MessageType = typeof MESSAGE_TYPE[number];

interface Message {
  id: string
  type: MessageType
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
      }
    ]
  }

  static deleteChatSession(sessionId: string): void {
    const sessions = this.loadChatSessions()
    const filteredSessions = sessions.filter((session) => session.id !== sessionId)
    this.saveChatSessions(filteredSessions)
  }
}

export function AiChatInterface() {
  const [currentChatId, setCurrentChatId] = useState<string>("")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId)
  const messages = currentChat?.messages || []

  // Load chat sessions on component mount
  useEffect(() => {
    // Lấy sessionId từ cookie nếu có
    let cookieSessionId = getCookie('sessionId')
    if (cookieSessionId) {
      setCurrentChatId(cookieSessionId)
      dashboardApi.getAIChatHistory(cookieSessionId)
        .then(res => {
          const history: AiChatHistoryDto[] = res.data
          const messages = history.map(item => ({
            id: item.id,
            type: item.role,
            content: item.message,
            timestamp: new Date(item.timestamp),
            metadata: undefined
          }) as Message)
          const chatSession = {
            id: cookieSessionId,
            title: "AI Chat Session",
            createdAt: messages[0]?.timestamp || new Date(),
            lastActivity: messages[messages.length-1]?.timestamp || new Date(),
            preview: messages[messages.length-1]?.content || '',
            messages
          }
          setChatSessions([chatSession])
        })
        .catch(() => {
          setChatSessions([{
            id: cookieSessionId,
            title: "AI Chat Session",
            createdAt: new Date(),
            lastActivity: new Date(),
            preview: '',
            messages: []
          }])
        })
    } else {
      // Nếu không có sessionId, tạo mới
      dashboardApi.newAIChatSession()
        .then(res => {
          const { session_id, message, timestamp } = res.data
          setCookie('sessionId', session_id)
          setCurrentChatId(session_id)
          const newChat: ChatSession = {
            id: session_id,
            title: "AI Chat Session",
            createdAt: new Date(timestamp),
            lastActivity: new Date(timestamp),
            preview: message,
            messages: [
              {
                id: "1",
                type: "system",
                content: message,
                timestamp: new Date(timestamp),
                metadata: undefined,
              },
            ],
          }
          setChatSessions([newChat])
        })
        .catch(() => {
          setChatSessions([{
            id: "chat-error",
            title: "AI Chat Session",
            createdAt: new Date(),
            lastActivity: new Date(),
            preview: '',
            messages: []
          }])
        })
    }
  }, [])

  // Save chat sessions whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      ChatStorageService.saveChatSessions(chatSessions)
    }
  }, [chatSessions])

  // Auto-scroll to bottom when messages or typing changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const updateChatPreview = (chatId: string, lastMessage: Message) => {
    const preview = lastMessage.content.length > 50 ? lastMessage.content.substring(0, 50) + "..." : lastMessage.content

    setChatSessions((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, preview } : chat)))
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: MESSAGE_TYPE[0],
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
      const payload = {
        sessionId: currentChatId,
        message: inputMessage,
      }
      const response = await dashboardApi.askAI(payload)
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: MESSAGE_TYPE[1],
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

  const createNewChat = async () => {
    try {
      const res = await dashboardApi.newAIChatSession();
      const { session_id, message, timestamp } = res.data;
      setCookie('sessionId', session_id);
      const newChat: ChatSession = {
        id: session_id,
        title: `Infrastructure Chat ${chatSessions.length + 1}`,
        createdAt: new Date(timestamp),
        lastActivity: new Date(timestamp),
        preview: message,
        messages: [
          {
            id: "1",
            type: MESSAGE_TYPE[2],
            content: message,
            timestamp: new Date(timestamp),
            metadata: undefined,
          },
        ],
      };
      setChatSessions((prev) => [newChat, ...prev]);
      setCurrentChatId(session_id);
      setUploadedFiles([]);
      toast({
        title: "New chat created",
        description: `Started \"${newChat.title}\" conversation`,
      });
    } catch (error) {
      toast({
        title: "Lỗi khi tạo session mới",
        description: "Không thể tạo session chat mới. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }

  const switchToChat = async (chatId: string) => {
    setCurrentChatId(chatId)
    setCookie('sessionId', chatId)
    setUploadedFiles([])
    // Fetch chat history for the selected session
    try {
      const res = await dashboardApi.getAIChatHistory(chatId)
      const history: AiChatHistoryDto[] = res.data
      const messages = history.map(item => ({
        id: item.id,
        type: item.role,
        content: item.message,
        timestamp: new Date(item.timestamp),
        metadata: undefined
      }) as Message)
      const chatSession = {
        id: chatId,
        title: "AI Chat Session",
        createdAt: messages[0]?.timestamp || new Date(),
        lastActivity: messages[messages.length-1]?.timestamp || new Date(),
        preview: messages[messages.length-1]?.content || '',
        messages
      }
      setChatSessions([chatSession])
    } catch {
      setChatSessions([{
        id: chatId,
        title: "AI Chat Session",
        createdAt: new Date(),
        lastActivity: new Date(),
        preview: '',
        messages: []
      }])
    }
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
        type: MESSAGE_TYPE[2],
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
        type: MESSAGE_TYPE[2],
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
              <CardTitle>AI DESTROY DRIFT</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={createNewChat}>
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <ChatHistoryViewer onSelectChat={switchToChat} currentChatId={currentChatId} />
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
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
        </div> */}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <div className="border rounded-lg">
          <ScrollArea className="h-[500px] p-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                  <img
                    src="/logo-transparent.png"
                    alt="Logo"
                    className="h-14 mx-auto mb-4 opacity-90"
                  />
                  <p className="text-2xl font-bold tracking-wide">
                    Xin chào bạn có Drifts nào không? <br /> Hãy để tôi Destroy nó nhé!!
                  </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex gap-3 ${message.type === MESSAGE_TYPE[0] ? "justify-end" : "justify-start"}`}>
                      {(message.type === MESSAGE_TYPE[1] || message.type === MESSAGE_TYPE[2]) && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {message.type === MESSAGE_TYPE[2] ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <Bot className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === MESSAGE_TYPE[0]
                            ? "bg-primary text-primary-foreground"
                            : message.type === MESSAGE_TYPE[2]
                              ? "bg-muted border"
                              : "bg-card border"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
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
                      {message.type === MESSAGE_TYPE[0] && (
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
                <div ref={messagesEndRef} />
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
            {/* Input câu hỏi */}
            <div className="border border-black dark:border-white/30 rounded-lg p-2 bg-white dark:bg-black/20">
              <Textarea
                placeholder="Ask AI about infrastructure..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTyping}
                className="w-full resize-none min-h-[60px] max-h-[200px] overflow-auto border-none focus:outline-none focus:ring-0 focus-visible:ring-0"
              />
            </div>

            {/* Hành động bên dưới: upload, connect AWS, gửi */}
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-2 items-center">
                {/* Upload file */}
                <input
                  type="file"
                  multiple
                  accept=".tfplan,.tfstate,.json,.tf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Upload
                  </label>
                </Button>

                {/* Kết nối AWS */}
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

              {/* Trạng thái file & Gửi câu hỏi */}
              <div className="flex gap-2 items-center justify-between w-full md:w-auto">
            
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-black hover:bg-zinc-900 text-white rounded-full h-10 w-10 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
