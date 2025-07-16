import axiosClient from './axiosClient';

export interface AskAIPayload {
  sessionId: string;
  message: string;
}

export interface AIChatResponse {
  role: string;
  message: string;
}

export interface AiChatHistoryDto {
  id: string;
  sessionId: string;
  userId: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface NewAIChatSessionResponse {
  session_id: string;
  message: string;
  conversation_state: string;
  timestamp: string;
  suggestions: string[];
}

export interface AiChatSessionDto {
  sessionId: string;
  title: string;
  createdAt: string;
  lastActivity: string;
  preview: string;
  messageCount: number;
}

const dashboardApi = {
  askAI: (data: AskAIPayload) =>
    axiosClient.post<AIChatResponse>('/api/AIChat/ask', data),
  getAIChatHistory: (sessionId: string) =>
    axiosClient.get<AiChatHistoryDto[]>(`/api/aichathistory?sessionId=${sessionId}`),
  newAIChatSession: () => axiosClient.get<NewAIChatSessionResponse>("/api/AIChatHistory/new-session"),
  getAISessions: () => axiosClient.get<AiChatSessionDto[]>("/api/AIChatHistory/sessions"),
};

export default dashboardApi;
