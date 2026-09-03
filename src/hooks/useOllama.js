import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { ApiPaths } from '../utils/constants';

export function useOllama() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const data = await api.get(ApiPaths.Api_Ollama_Models);
        setModels(data);
      } catch {}
    }
    fetchModels();
  }, []);

  async function generateStream(prompt, settings, onStream) {
    const { ollamaModel, systemInstructions, options } = settings;
    setLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
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
          } catch (e) {
            console.error("Failed to parse JSON chunk:", json, e);
          }
        }
        buffer = buffer.substring(boundary + 1);
      }
    };

    try {
      await api.postStream(ApiPaths.Api_Ollama_Generate_Stream, payload, onChunk, controller.signal);
    } catch (e) {
      onStream("Error: " + e.message);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  function stopGeneration() {
    abortControllerRef.current?.abort();
    api.post(ApiPaths.Api_Ollama_Stop, {}).catch(() => {});
  }

  return { models, generateStream, loading, stopGeneration };
}
