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

export interface ScanItem {
  id: string;
  fileName: string;
  scanDate: string;
  driftCount: number;
  riskLevel: string;
  warnings: number;
  status: string;
  duration: string;
  resourcesScanned: number;
  changesDetected: number;
}

export interface ScanSummary {
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  avgDriftCount: number;
  totalDriftsFound: number;
  criticalIssues: number;
}

export interface ScanDashboardResponse {
  latestScan: ScanItem;
  scanSummary: ScanSummary;
  scanHistory: ScanItem[];
}

export interface DriftItem {
  driftCode: string | null;
  resourceType: string;
  resourceName: string;
  riskLevel: string;
  beforeStateJson: Record<string, any>;
  afterStateJson: Record<string, any>;
  aiExplanation: string;
  aiAction: string;
}

export interface ScanDetailResponse {
  id: string;
  fileName: string;
  scanDate: string;
  status: string;
  totalResources: number;
  driftCount: number;
  riskLevel: string;
  duration: string | null;
  createdBy: string | null;
  createdOn: string;
  modifiedBy: string | null;
  drifts: DriftItem[];
}

const dashboardApi = {
  askAI: (data: AskAIPayload) =>
    axiosClient.post<AIChatResponse>('/api/AIChat/ask', data),
  getAIChatHistory: (sessionId: string) =>
    axiosClient.get<AiChatHistoryDto[]>(`/api/aichathistory?sessionId=${sessionId}`),
  newAIChatSession: () => axiosClient.get<NewAIChatSessionResponse>("/api/AIChatHistory/new-session"),
  getAISessions: () => axiosClient.get<AiChatSessionDto[]>("/api/AIChatHistory/sessions"),
  getScanDashboard: () => axiosClient.get<ScanDashboardResponse>("/api/ScanDetail/dashboard"),
  getScanDetail: (id: string) => axiosClient.get<ScanDetailResponse>(`/api/ScanDetail/${id}`),
};

export default dashboardApi;
