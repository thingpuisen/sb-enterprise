import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, defaultSettings, fetchSettings } from '../services/settingsService';

interface SettingsContextType {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const refreshSettings = async () => {
    const data = await fetchSettings();
    setSettings(data);
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
