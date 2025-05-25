"use client";

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Interview {
  id: string;
  candidate: string;
  position: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  date: string;
}

interface InterviewCalendarProps {
  date: Date;
  onDateChange: (date: Date) => void;
  interviews: Interview[];
}

export function InterviewCalendar({ date, onDateChange, interviews }: InterviewCalendarProps) {
  const handleChange = (newValue: any) => {
    if (newValue instanceof Date) {
      onDateChange(newValue);
    }
  };

  return (
    <div className="calendar-container">
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
          background: white;
          padding: 0.75rem;
          border-radius: 0.75rem;
        }
        .react-calendar__tile {
          color: #1f2937;
          padding: 0.75rem 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }
        .react-calendar__month-view__weekdays {
          color: #374151;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
        }
        .react-calendar__month-view__days__day--weekend {
          color: #dc2626;
        }
        .react-calendar__tile--now {
          background: #f3f4f6;
          color: #1f2937;
          font-weight: 600;
        }
        .react-calendar__tile--active {
          background: #2563eb !important;
          color: white !important;
          font-weight: 600;
        }
        .react-calendar__tile--hasActive {
          background: #dbeafe;
          color: #1e40af;
        }
        .react-calendar__navigation {
          margin-bottom: 1rem;
        }
        .react-calendar__navigation button {
          color: #1f2937;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.375rem;
          min-width: 36px;
          background: none;
          border-radius: 0.375rem;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f3f4f6;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f3f4f6;
          transform: scale(1.05);
        }
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
      `}</style>
      <Calendar
        onChange={handleChange}
        value={date}
        className="w-full border-none"
        minDetail="month"
        next2Label={null}
        prev2Label={null}
        formatShortWeekday={(locale, date) => {
          return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
        }}
      />
    </div>
  );
} 