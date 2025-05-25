import React from 'react';
import { Calendar } from 'lucide-react';

interface Interview {
  id: string;
  candidate: string;
  position: string;
  time: string;
  type: string;
  status: string;
  date: string;
}

interface InterviewCalendarProps {
  date: Date;
  onDateChange: (date: Date) => void;
  interviews: Interview[];
}

export const InterviewCalendar = ({ date, onDateChange, interviews }: InterviewCalendarProps) => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getInterviewsForDay = (day: number) => {
    return interviews.filter(interview => {
      const interviewDate = new Date(interview.date);
      return interviewDate.getDate() === day &&
             interviewDate.getMonth() === date.getMonth() &&
             interviewDate.getFullYear() === date.getFullYear();
    });
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const dayInterviews = getInterviewsForDay(day);
          return (
            <button
              key={day}
              onClick={() => onDateChange(new Date(date.getFullYear(), date.getMonth(), day))}
              className={`aspect-square p-1 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                day === date.getDate() ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900'
              }`}
            >
              <div className="flex flex-col h-full">
                <span className="text-right">{day}</span>
                {dayInterviews.length > 0 && (
                  <div className="mt-1 flex flex-col gap-1">
                    {dayInterviews.slice(0, 2).map(interview => (
                      <div
                        key={interview.id}
                        className="text-xs p-1 rounded bg-emerald-50 text-emerald-700 truncate"
                        title={`${interview.candidate} - ${interview.type}`}
                      >
                        {interview.candidate}
                      </div>
                    ))}
                    {dayInterviews.length > 2 && (
                      <div className="text-xs text-emerald-600">
                        +{dayInterviews.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}; 