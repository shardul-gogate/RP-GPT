import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faPaperPlane, faArrowsRotate, faDeleteLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

export function InputIcon({ icon, onClick, disabled }) {
    const getIcon = () => {
        switch (icon) {
            case "done":
                return faCheck;
            case "cancel":
                return faXmark;
            case "send":
                return faPaperPlane;
            case "regenerate":
                return faArrowsRotate;
            case "delete":
                return faDeleteLeft;
            case "continue":
                return faAnglesRight;
            default:
                return null;
        }
    };

    const getTooltip = () => {
        switch (icon) {
            case "done":
                return "Confirm Edit";
            case "cancel":
                return "Cancel Edit";
            case "send":
                return "Send Prompt";
            case "regenerate":
                return "Regenerate Last Message";
            case "delete":
                return "Delete Last Message";
            case "continue":
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