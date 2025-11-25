// app/context/AppModeContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { AppMode } from "~/interfaces/app.interface";

const AppModeContext = createContext<{
  mode: AppMode;
  setMode: (mode: AppMode) => void;
} | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>(AppMode.User);

  return (
    <AppModeContext.Provider value={{ mode, setMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (!context) throw new Error("useAppMode must be used within AppModeProvider");
  return context;
}