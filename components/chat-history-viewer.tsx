"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, MessageSquare, Bot, User, Shield, Download, Eye, Clock } from "lucide-react"
import dashboardApi, { AiChatSessionDto, AiChatHistoryDto } from "../api/dashboardApi";

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
  preview?: string
}

interface ChatHistoryViewerProps {
  onSelectChat: (chatId: string) => void
  currentChatId: string
}

export function ChatHistoryViewer({ onSelectChat, currentChatId }: ChatHistoryViewerProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sessions, setSessions] = useState<AiChatSessionDto[]>([])
  const [messages, setMessages] = useState<AiChatHistoryDto[]>([])

  useEffect(() => {
    if (open) {
      dashboardApi.getAISessions()
        .then(res => setSessions(res.data))
        .catch(() => setSessions([]))
    }
  }, [open])

  // Fetch messages when a session is selected
  useEffect(() => {
    if (selectedChatId) {
      dashboardApi.getAIChatHistory(selectedChatId)
        .then(res => setMessages(res.data))
        .catch(() => setMessages([]))
    } else {
      setMessages([])
    }
  }, [selectedChatId])

  // Filter chats based on search and filters
  const filteredChats = sessions.filter((chat) => {
    const matchesSearch =
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = (() => {
      if (dateFilter === "all") return true
      const now = new Date()
      const chatDate = new Date(chat.lastActivity)

      switch (dateFilter) {
        case "today":
          return chatDate.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return chatDate >= weekAgo
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return chatDate >= monthAgo
        default:
          return true
      }
    })()

    return matchesSearch && matchesDate
  })

  // Filter messages in selected chat
  const filteredMessages = messages.filter((msg) => {
    const matchesType = typeFilter === "all" || msg.role === typeFilter
    const matchesSearch = msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && (searchTerm ? matchesSearch : true)
  })

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4" />
      case "ai":
      case "assistant":
        return <Bot className="h-4 w-4 text-primary" />
      case "system":
        return <Shield className="h-4 w-4 text-primary" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const exportChat = (chat: AiChatSessionDto) => {
    const exportData = {
      title: chat.title,
      createdAt: chat.createdAt,
      lastActivity: chat.lastActivity,
      messageCount: chat.messageCount,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, "_")}_chat_export.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const switchToChat = (chatId: string) => {
    onSelectChat(chatId)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          View Chat History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Chat History Viewer
          </DialogTitle>
          <DialogDescription>Browse and search through your conversation history</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[70vh]">
          {/* Chat List Panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chats and messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredChats.length} of {sessions.length} conversations
            </div>

            <ScrollArea className="h-[calc(70vh-120px)]">
              <div className="space-y-2">
                {filteredChats
                  .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
                  .map((chat) => (
                    <div
                      key={chat.sessionId}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedChatId === chat.sessionId ? "bg-muted border-primary" : ""
                      }`}
                      onClick={() => setSelectedChatId(chat.sessionId)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm truncate">{chat.title}</h4>
                        <div className="flex items-center gap-1">
                          {chat.sessionId === currentChatId && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              switchToChat(chat.sessionId)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {chat.preview || "No messages yet"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{chat.messageCount} messages</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(new Date(chat.lastActivity))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Detail Panel */}
          <div className="lg:col-span-2 space-y-4">
            {selectedChatId ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{sessions.find((chat) => chat.sessionId === selectedChatId)?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(new Date(sessions.find((chat) => chat.sessionId === selectedChatId)?.createdAt || ""))} • {sessions.find((chat) => chat.sessionId === selectedChatId)?.messageCount || 0} messages
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => switchToChat(selectedChatId)}
                      disabled={selectedChatId === currentChatId}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {selectedChatId === currentChatId ? "Current Chat" : "Switch to Chat"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        exportChat(
                          sessions.find((chat) => chat.sessionId === selectedChatId) || {
                            sessionId: "",
                            title: "",
                            messageCount: 0,
                            createdAt: "",
                            lastActivity: "",
                            preview: "",
                          }
                        )
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="messages" className="w-full">
                  <TabsList>
                    <TabsTrigger value="messages">Messages ({filteredMessages?.length || 0})</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="messages" className="mt-4">
                    <ScrollArea className="h-[calc(70vh-200px)] border rounded-lg p-4">
                      <div className="space-y-4">
                        {filteredMessages?.map((message) => (
                          <div key={message.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              {getMessageIcon(message.role)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {message.role}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{formatDate(new Date(message.timestamp))}</span>
                              </div>
                              <div className="bg-card border rounded-lg p-3">
                                <p className="text-sm">{message.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="summary" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-primary">
                            {messages.filter((m) => m.role === "user").length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">User Messages</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {messages.filter((m) => m.role === "ai").length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">AI Responses</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {messages.filter((m) => m.role === "system").length || 0}
                          </div>
                          <div className="text-xs text-muted-foreground">System Messages</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {/* {messages.filter((m) => m.metadata?.action === "file_upload").length || 0} */}
                          </div>
                          <div className="text-xs text-muted-foreground">File Uploads</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Recent Activity</h4>
                        <div className="space-y-2">
                          {messages
                            .slice(-5)
                            .reverse()
                            .map((message) => (
                              <div key={message.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                {getMessageIcon(message.role)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">{message.message}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(new Date(message.timestamp))}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
