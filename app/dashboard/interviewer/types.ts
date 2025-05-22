export interface InterviewHistoryItem {
  date: string;
  feedback: string;
  rating: number | undefined;
}

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

export interface InterviewFeedbackData {
  technicalRating: number;
  communicationRating: number;
  problemSolvingRating: number;
  recommendation: 'Strongly Recommend' | 'Recommend' | 'Consider' | 'Not Recommended';
  comments: string;
} 