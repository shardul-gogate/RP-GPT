import { useState, useEffect } from 'react';
import api from '../utils/api';
import { ApiPaths } from '../utils/constants';

export function useSettings(availableModels = []) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get(ApiPaths.Api_Settings)
      .then((data) => {
        if (availableModels.length > 0) {
          const ollamModelExists = availableModels.some(m => m.model === data.ollamaModel);
          const summaryModelExists = availableModels.some(m => m.model === data.summaryModel);
          if (!ollamModelExists || !summaryModelExists) {
            const correctedSettings = { ...data, ollamaModel: availableModels[0].model, summaryModel: availableModels[0].model};
            setSettings(correctedSettings);
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
