import { IconButtonEnum } from "../utils/enums";
import { IconButton } from "./IconButton";

export default function SummaryModal({ summary, latestSummary, saveSummary, generateNewSummary, closeModal}) {
  return (
    <div className="modal-overlay">
      <div className="large-modal">
        <div className="close-large-modal">
          <span>Summarize</span>
          <IconButton icon={IconButtonEnum.CLOSE} onClick={closeModal} />
        </div>
        <textarea
          className='settings-system-instructions'
          disabled={true}
          rows={10}
          value={summary}
          onChange={() => {}}
          placeholder='Current Summary'
        />
        <div className='summary-label'>
          <button className='settings-save-button' onClick={generateNewSummary}>Generate</button>
        </div>
        <textarea
          className='settings-system-instructions'
          rows={10}
          disabled={true}
          value={latestSummary}
          onChange={() => {}}
          placeholder='Current Chapter Summary'
        />
        <button className='settings-save-button' onClick={saveSummary}>Save</button>
      </div>
    </div>
  );
}