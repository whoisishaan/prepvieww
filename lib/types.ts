export interface Interview {
  id: string;
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

export interface Feedback {
  id: string;
  interviewId: string;
  userId: string;
  feedback: string;
  createdAt: string;
}

export interface User {
  id: string;
  uid: string;
  email: string;
  name: string;
}
