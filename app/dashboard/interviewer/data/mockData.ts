import { Candidate } from '../types';

export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Frontend Developer',
    interviewDate: '2024-06-10',
    interviewTime: '10:00 AM',
    interviewType: 'Technical',
    meetingLink: '#',
    resumeLink: '#',
    history: [
      {
        date: '2023-12-01',
        feedback: 'Strong technical skills.',
        rating: 4,
      },
      {
        date: '2024-01-15',
        feedback: 'Good communication.',
        rating: 5,
      },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Backend Developer',
    interviewDate: '2024-06-12',
    interviewTime: '2:00 PM',
    interviewType: 'HR',
    meetingLink: '#',
    resumeLink: '#',
    history: [
      {
        date: '2024-01-20',
        feedback: 'Excellent problem solver.',
        rating: 5,
      },
    ],
  },
  {
    id: '3',
    name: 'Peter Jones',
    role: 'Data Scientist',
    interviewDate: '2024-06-15',
    interviewTime: '11:30 AM',
    interviewType: 'Technical',
    meetingLink: '#',
    resumeLink: '#',
    history: [
      {
        date: '2024-02-10',
        feedback: 'Very good understanding of algorithms.',
        rating: 5,
      },
    ],
  },
  {
    id: '4',
    name: 'Mary Brown',
    role: 'UX Designer',
    interviewDate: '2024-06-16',
    interviewTime: '3:00 PM',
    interviewType: 'Design',
    meetingLink: '#',
    resumeLink: '#',
    history: [
      {
        date: '2024-03-01',
        feedback: 'Excellent portfolio and user-centered approach.',
        rating: 5,
      },
    ],
  },
  {
    id: '5',
    name: 'David Green',
    role: 'Project Manager',
    interviewDate: '2024-06-18',
    interviewTime: '10:00 AM',
    interviewType: 'Behavioral',
    meetingLink: '#',
    resumeLink: '#',
    history: [
      {
        date: '2024-04-05',
        feedback: 'Strong leadership skills and experience.',
        rating: 4,
      },
    ],
  },
]; 