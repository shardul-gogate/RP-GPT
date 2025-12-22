import React, { useState } from 'react';
import { SmallModalTypEnum } from '../utils/enums';

export default function SmallModal({ smallModalTypeEnum, onConfirm, onCancel }) {
  const [gameName, setGameName] = useState('');
  const modalTitle = smallModalTypeEnum === SmallModalTypEnum.SAVE ? 'Save Game' : 'Load Game';
  const buttonTitle = smallModalTypeEnum === SmallModalTypEnum.SAVE ? 'Save' : 'Load';

  const handleSave = () => {
    onConfirm(gameName);
  };

  return (
    <div className="modal-overlay">
      <div className="small-modal">
        <h2>{modalTitle}</h2>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter the game name"
        />
        <div className="small-modal-buttons">
          <button onClick={handleSave}>{buttonTitle}</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
