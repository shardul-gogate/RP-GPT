import { useState, useEffect } from 'react';
import api from '../utils/api';
import { ApiPaths } from '../utils/constants';

export function useOllama() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchModels() {
      const data = await api.get(ApiPaths.Api_Ollama_Models);
      setModels(data);
    }
    fetchModels();
  }, []);

  async function generateStream(prompt, settings, onStream) {
    const { ollamaModel, systemInstructions, options } = settings;
    setLoading(true);
    const payload = {
      prompt: prompt,
      model: ollamaModel,
      system: systemInstructions,
      options: options
    };

    let buffer = '';
    const onChunk = (chunk) => {
      buffer += chunk;
      let boundary = buffer.lastIndexOf('\n');
      if (boundary !== -1) {
        let toComplete = buffer.substring(0, boundary);
        const jsons = toComplete.split('\n').filter(s => s.trim());
        for (const json of jsons) {
          try {
            const parsed = JSON.parse(json);
            if (parsed.response) {
              onStream(parsed.response);
            }
            if (parsed.done) {
              setLoading(false);
            }
          } catch (e) {
            console.error("Failed to parse JSON chunk:", json, e);
          }
        }
        buffer = buffer.substring(boundary + 1);
      }
    };

    try {
      await api.postStream(ApiPaths.Api_Ollama_Generate_Stream, payload, onChunk);
    } catch (e) {
      onStream("Error: " + e.message);
      setLoading(false);
    }
  }

  return { models, generateStream, loading };
}
