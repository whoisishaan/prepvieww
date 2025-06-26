import { Interview } from "@/lib/types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const fetchInterviewById = async (interviewId: string): Promise<ApiResponse<Interview>> => {
  try {
    const response = await fetch(`/api/vapi/generate?interviewId=${encodeURIComponent(interviewId)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'Failed to fetch interview'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error fetching interview:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
