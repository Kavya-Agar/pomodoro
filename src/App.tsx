import React, { useState, useEffect } from 'react';

interface ElectronAPI {
    startTimer: (duration: number) => Promise<void>;
    stopTimer: () => Promise<void>;
    onTick: (callback: (remainingTime: number) => void) => void;
}

declare global {
    interface Window {
        ElectronAPI: ElectronAPI;
    }
}

const App: React.FC = () => {
    const [remainingTime, setRemainingTime] = useState<number>(1500);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const startTimer = async () => {
        setIsRunning(true);
        await window.electronAPI.startTimer(remainingTime);
    };

    useEffect(() => {
        if (isRunning) {
            const handleTick = (time: number) => {
                setRemainingTime(time);
            };
            window.electronAPI.onTick(handleTick);
            return () => {};
        }
    }, [isRunning]);

    const formatTime = (timeInSeconds: number): string => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <div className="pomodoro-container">
            <h1>Pomodoro Timer</h1>
            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${100 - (remainingTime / 1500) * 100}%` }}
                />
            </div>
            <div className="timer">{formatTime(remainingTime)}</div>
            <div className="button-group">
                {isRunning ? (
                    <button
                        className="stop-btn"
                        onClick={async () => {
                            await window.electronAPI.stopTimer();
                            setIsRunning(false);
                        }}
                    >
                        Stop
                    </button>
                ) : (
                    <button
                        className="start-btn"
                        onClick={startTimer}
                    >
                        Start
                    </button>
                )}
            </div>
        </div>
    );
};

export default App;