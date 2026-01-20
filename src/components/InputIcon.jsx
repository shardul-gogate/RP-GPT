import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faPaperPlane, faArrowsRotate, faDeleteLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { InputIconEnum } from '../utils/enums';

export function InputIcon({ icon, onClick, disabled }) {
  const getIcon = () => {
    switch (icon) {
      case InputIconEnum.DONE:
        return faCheck;
      case InputIconEnum.CANCEL:
        return faXmark;
      case InputIconEnum.SEND:
        return faPaperPlane;
      case InputIconEnum.REGENERATE:
        return faArrowsRotate;
      case InputIconEnum.DELETE:
        return faDeleteLeft;
      case InputIconEnum.CONTINUE:
        return faAnglesRight;
      default:
        return null;
    }
  };

  const getTooltip = () => {
    switch (icon) {
      case InputIconEnum.DONE:
        return "Confirm Edit";
      case InputIconEnum.CANCEL:
        return "Cancel Edit";
      case InputIconEnum.SEND:
        return "Send Prompt";
      case InputIconEnum.REGENERATE:
        return "Regenerate Last Message";
      case InputIconEnum.DELETE:
        return "Delete Last Message";
      case InputIconEnum.CONTINUE:
        return "Continue Generation";
      default:
          return null;
    };
  };

  return (
    <button
      className='user-input-icon-button'
      onClick={onClick}
      title={getTooltip()}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={getIcon()} size='2x' />
    </button>
  );
}