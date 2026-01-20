import { useState, useEffect } from 'react';
import api from '../utils/api';
import { ApiPaths } from '../utils/constants';

export function useSummary() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    api.get(ApiPaths.Api_Summary).then((data) => {
      setSummary(data);
    });
  }, []);

  const saveSummary = (newSummary) => {
    setSummary(newSummary);
    api.post(ApiPaths.Api_Summary, newSummary);
  };

  async function generateSummary(prompt, settings, onGenerate) {
    const { summaryModel, summaryInstructions, options } = settings;
    const payload = {
      prompt: prompt,
      model: summaryModel,
      system: summaryInstructions,
      options: options
    };
    try {
      var summary = await api.post(ApiPaths.Api_Generate_Summary, payload);
      onGenerate(summary);
    } catch (e) {
      onGenerate("Error: " + e.message);
    }
  };

  return { summary, saveSummary, generateSummary };
}