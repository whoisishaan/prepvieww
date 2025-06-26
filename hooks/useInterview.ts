import { useState, useEffect } from 'react';
import { Interview } from '@/lib/types';
import { fetchInterviewById } from '@/lib/api/vapi';

interface UseInterviewResult {
  interview: Interview | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInterview = (interviewId: string | undefined): UseInterviewResult => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterview = async () => {
    if (!interviewId) {
      setError('No interview ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchInterviewById(interviewId);
      
      if (result.success && result.data) {
        setInterview(result.data);
      } else {
        setError(result.error || 'Failed to fetch interview');
      }
    } catch (err) {
      console.error('Error in useInterview:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterview();
  }, [interviewId]);

  return {
    interview,
    loading,
    error,
    refetch: fetchInterview,
  };
};
