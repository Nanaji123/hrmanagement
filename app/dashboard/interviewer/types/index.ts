export interface Candidate {
  id: string;
  name: string;
  role: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  meetingLink: string;
  resumeLink: string;
  feedbackSubmitted?: boolean;
  history: InterviewHistoryItem[];
}

export interface InterviewHistoryItem {
  date: string;
  feedback: string;
  rating: number | undefined;
}

export interface InterviewFeedbackData {
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  cultureFit: number;
  strengths: string;
  weaknesses: string;
  notes: string;
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'No Hire';
}

export interface FeedbackFormData {
  technicalSkills: number;
  communication: number;
  attitude: number;
  recommendation: 'Select' | 'Reject' | 'Hold';
  comments: string;
} 