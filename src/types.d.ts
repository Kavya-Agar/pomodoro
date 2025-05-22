interface ElectronAPI {
  startTimer: (duration: number) => Promise<void>;
  stopTimer: () => Promise<void>;
  onTick: (callback: (remainingTime: number) => void) => () => void;
  onMainMessage?: (callback: (message: string) => void) => void; // add optional if not always present
}

interface Window {
  electronAPI: ElectronAPI;
}