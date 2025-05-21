import { useState, useEffect } from 'react';
import styles from '../InterviewerPage.module.css';

interface InterviewTimerProps {
  onTimeUpdate?: (time: number) => void;
}

export const InterviewTimer: React.FC<InterviewTimerProps> = ({ onTimeUpdate }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((val) => val.toString().padStart(2, '0'))
      .join(':');
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    onTimeUpdate?.(0);
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerDisplay}>{formatTime(time)}</div>
      <div className={styles.timerControls}>
        {!isRunning ? (
          <button onClick={handleStart} className={styles.timerButton}>
            Start
          </button>
        ) : (
          <button onClick={handlePause} className={styles.timerButton}>
            Pause
          </button>
        )}
        <button onClick={handleReset} className={styles.timerButton}>
          Reset
        </button>
      </div>
    </div>
  );
};
