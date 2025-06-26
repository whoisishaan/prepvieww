"use client";

import { useEffect, useState, use } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { fetchInterviewById } from "@/lib/api/vapi";
import { Interview } from "@/lib/types";

interface Feedback {
  id: string;
  // Add other feedback properties as needed
}

interface InterviewWithQuestions extends Interview {
  questions: string[];
  role: string;
  type: string;
  techstack: string[];
}

interface RouteParams {
  params: {
    id: string;
  };
}

const InterviewDetails = ({ params }: RouteParams) => {
  // Unwrap the params promise using React.use()
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [interview, setInterview] = useState<InterviewWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.uid,
            name: currentUser.name || 'User'
          });
        }

        // Fetch interview data
        const result = await fetchInterviewById(id);
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to load interview');
        }
        setInterview(result.data as InterviewWithQuestions);

        // Fetch feedback if user is logged in
        if (currentUser?.uid) {
          try {
            const feedbackData = await getFeedbackByInterviewId({
              interviewId: id,
              userId: currentUser.uid,
            });
            if (feedbackData) {
              setFeedback(feedbackData);
            }
          } catch (feedbackError) {
            console.error('Error loading feedback:', feedbackError);
            // Continue even if feedback fails to load
          }
        }
      } catch (err) {
        console.error('Error loading interview:', err);
        setError('Failed to load interview. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error || 'Interview not found'}</p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
              priority
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>
          <DisplayTechIcons techStack={interview.techstack} />
        </div>
        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name || 'User'}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions || []}
        feedbackId={feedback?.id}
      />
    </>
  );
};

export default InterviewDetails;