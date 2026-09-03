import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop } from '@fortawesome/free-solid-svg-icons';

export default function LoadingIndicator({ onStop }) {
    return (
        <button className="loading-indicator" onClick={onStop} title="Stop Generating">
            <FontAwesomeIcon className="loading-indicator-stop-icon" icon={faStop} size='2x' />
        </button>
    );
}
