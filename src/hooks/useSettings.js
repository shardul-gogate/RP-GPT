import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { ApiPaths } from '../utils/constants';

export function useSettings(availableModels = []) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get(ApiPaths.Api_Settings)
      .then((data) => {
        // Validate that the selected model exists in available models
        if (availableModels.length > 0) {
          const modelExists = availableModels.some(m => m.model === data.ollamaModel);
          if (!modelExists) {
            console.warn(`Model "${data.ollamaModel}" not found. Using "${availableModels[0].model}" instead.`);
            const correctedSettings = { ...data, ollamaModel: availableModels[0].model };
            setSettings(correctedSettings);
            // Auto-save the corrected settings
            api.post(ApiPaths.Api_Settings, correctedSettings);
          } else {
            setSettings(data);
          }
        } else {
          setSettings(data);
        }
      });
  }, [availableModels]);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    api.post(ApiPaths.Api_Settings, newSettings);
  };

  return { settings, saveSettings };
}
