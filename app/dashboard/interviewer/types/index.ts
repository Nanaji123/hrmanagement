export interface Candidate {
  id: string;
  name: string;
  role: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: string;
  meetingLink: string;
  resumeLink: string;
  history: InterviewHistoryItem[];
}

export interface InterviewHistoryItem {
  date: string;
  feedback: string;
  rating?: number;
}

export interface InterviewFeedbackData {
  technicalRating: number;
  communicationRating: number;
  problemSolvingRating: number;
  recommendation: string;
  comments: string;
}

export interface FeedbackFormData {
  technicalSkills: number;
  communication: number;
  attitude: number;
  recommendation: 'Select' | 'Reject' | 'Hold';
  comments: string;
} 