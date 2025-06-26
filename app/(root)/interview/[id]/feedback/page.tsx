import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface RouteParams {
  params: {
    id: string;
  };
}

export default async function Feedback({ params }: RouteParams) {
  // Await params before destructuring
  const { id } = await params;
  console.log('Fetching feedback for interview ID:', id);
  
  const user = await getCurrentUser();
  if (!user || !user.uid) {
    console.log('No user found or user ID is missing, redirecting to login');
    redirect("/login"); 
  }

  console.log('Fetching interview data for ID:', id);
  const interview = await getInterviewById(id);
  console.log('Interview data:', interview);
  
  if (!interview) {
    console.log('No interview found, redirecting to home');
    redirect("/");
  }

  console.log('Fetching feedback for interview:', id, 'user ID:', user.uid);
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.uid,
  });
  console.log('Feedback data:', feedback);

  if (!feedback) {
    console.log('No feedback found for interview:', id);
    return (
      <section className="section-feedback">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-3xl font-semibold mb-4">No Feedback Available</h1>
          <p className="text-gray-400 mb-6">
            We couldn't find any feedback for this interview.
          </p>
          <Button asChild>
            <Link href={`/interview/${id}`} className="btn-primary">
              Back to Interview
            </Link>
          </Button>
        </div>
      </section>
    );
  }


  return (
    <section className="section-feedback max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold mb-2">
          Feedback on the Interview -{" "}
          <span className="capitalize text-primary-200">
            {interview.role || 'Technical'}
          </span>{" "}
          Interview
        </h1>
        
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {/* Overall Impression */}
          <div className="flex items-center bg-dark-300 px-4 py-2 rounded-lg">
            <Image src="/star.svg" width={22} height={22} alt="star" className="mr-2" />
            <p className="text-lg">
              Overall:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore || 'N/A'}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center bg-dark-300 px-4 py-2 rounded-lg">
            <Image src="/calendar.svg" width={20} height={20} alt="calendar" className="mr-2" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "Date not available"}
            </p>
          </div>
        </div>
      </div>

      {feedback?.finalAssessment && (
        <div className="mb-8 p-6 bg-dark-300 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Final Assessment</h2>
          <p className="text-gray-300">{feedback.finalAssessment}</p>
        </div>
      )}

      {/* Interview Breakdown */}
      {feedback?.categoryScores?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Interview Breakdown</h2>
          <div className="space-y-6">
            {feedback.categoryScores.map((category, index) => (
              <div key={index} className="p-4 bg-dark-300 rounded-lg">
                <p className="font-bold text-lg">
                  {index + 1}. {category.name} ({category.score}/100)
                </p>
                <p className="mt-2 text-gray-300">{category.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {feedback?.strengths?.length > 0 && (
          <div className="p-6 bg-dark-300 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-400">Strengths</h3>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback?.areasForImprovement?.length > 0 && (
          <div className="p-6 bg-dark-300 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-amber-400">Areas for Improvement</h3>
            <ul className="space-y-2">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button asChild variant="outline" className="flex-1 max-w-xs mx-auto">
          <Link href="/" className="text-center">
            Back to Dashboard
          </Link>
        </Button>
        
        <Button asChild className="flex-1 max-w-xs mx-auto">
          <Link href={`/interview/${id}`} className="text-center">
            Retake Interview
          </Link>
        </Button>
      </div>
    </section>
  );
};