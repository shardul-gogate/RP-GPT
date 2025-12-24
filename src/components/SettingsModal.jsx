import { IconButton } from './IconButton';
import { IconButtonEnum } from '../utils/enums';
import { useState } from 'react';

export default function SettingsModal({ settings, saveSettings, ollamaModels, closeModal}) {
  const [ollamaModel, setOllamaModel] = useState(settings.ollamaModel);
  const [systemInstructions, setSystemInstructions] = useState(settings.systemInstructions);
  const [options, setOptions] = useState(settings.options);

  const handleSave = () => {
    saveSettings({ ollamaModel, systemInstructions, options });
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="large-modal">
        <div className="close-large-modal">
          <span>Settings</span>
          <IconButton icon={IconButtonEnum.CLOSE} onClick={closeModal} />
        </div>
        <div className='settings-ollama'>
          <span>Select Model: </span>
          <select value={ollamaModel} onChange={(e) => setOllamaModel(e.target.value)}>
            {
              ollamaModels.map(model => (
                <option key={model.model} value={model.model}>{model.model}</option>
              ))
            }
          </select>
        </div>
        <textarea
          className='settings-system-instructions'
          rows={10}
          value={systemInstructions}
          onChange={(e) => setSystemInstructions(e.target.value)}
          placeholder='System Instructions'
        />
        <div className='settings-ollama'>
          <span>temperature: </span>
          <input
            type="number"
            value={options.temperature}
            onChange={(e) => setOptions(
              { ...options, temperature: parseFloat(e.target.value) }
            )}
          />
        </div>
        <div className='settings-ollama'>
          <span>top-p: </span>
          <input
            type="number"
            value={options.top_p}
            onChange={(e) => setOptions(
              { ...options, top_p: parseFloat(e.target.value) }
            )}
          />
        </div>
        <div className='settings-ollama'>
          <span>num_predict: </span>
          <input
            type="number"
            value={options.num_predict}
            onChange={(e) => setOptions(
              { ...options, num_predict: parseInt(e.target.value) }
            )}
          />
        </div>
        <div className='settings-ollama'>
          <span>repeat_penalty: </span>
          <input
            type="number"
            value={options.repeat_penalty}
            onChange={(e) => setOptions(
              { ...options, repeat_penalty: parseFloat(e.target.value) }
            )}
          />
        </div>
        <div className='settings-ollama'>
          <span>num_ctx: </span>
          <input
            type="number"
            value={options.num_ctx}
            onChange={(e) => setOptions(
              { ...options, num_ctx: parseInt(e.target.value) }
            )}
          />
        </div>
        <button className='settings-save-button' onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
