import axiosClientAi from './axiosClientAi';

export interface UploadTerraformResponse {
  message: string;
  filenames: string[];
  session_id: string;
  extracted_files: string[];
  terraform_plan_result: Record<string, any>;
  terraform_apply_result: Record<string, any>;
  success: boolean;
  timestamp: string;
}

const dashboardAiApi = {
  /**
   * Upload terraform files to AI server
   * @param files Array of File objects (browser)
   */
  uploadTerraform: async (files: File[]): Promise<UploadTerraformResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    const response = await axiosClientAi.post<UploadTerraformResponse>('/upload-terraform', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default dashboardAiApi; 