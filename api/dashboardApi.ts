import axiosClient from './axiosClient';

export interface AskAIPayload {
  sessionId: string;
  userId: string;
  message: string;
}

export interface AIChatResponse {
  role: string;
  message: string;
}

const dashboardApi = {
  askAI: (data: AskAIPayload) =>
    axiosClient.post<AIChatResponse>('/api/AIChat/ask', data),
};

export default dashboardApi;
