import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faScroll, faBook, faFloppyDisk, faDownload, faUpload, faXmark, faWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { IconButtonEnum } from '../utils/enums';

export function IconButton({ icon, onClick }) {
    const getIcon = () => {
        switch (icon) {
            case IconButtonEnum.SETTINGS:
                return faGear;
            case IconButtonEnum.QUESTS:
                return faScroll;
            case IconButtonEnum.PLOT_POINTS:
                return faBook;
            case IconButtonEnum.QUICK_SAVE:
                return faFloppyDisk;
            case IconButtonEnum.FULL_SAVE:
                return faDownload;
            case IconButtonEnum.LOAD:
                return faUpload;
            case IconButtonEnum.CLOSE:
                return faXmark;
            case IconButtonEnum.SUMMARIZE:
                return faWandSparkles;
            default:
                return null;
        }
    };

    const getTooltip = () => {
        switch (icon) {
            case IconButtonEnum.SETTINGS:
                return "Settings";
            case IconButtonEnum.QUESTS:
                return "Quests";
            case IconButtonEnum.PLOT_POINTS:
                return "Plot Points";
            case IconButtonEnum.QUICK_SAVE:
                return "Quick Save";
            case IconButtonEnum.FULL_SAVE:
                return "Full Save";
            case IconButtonEnum.LOAD:
                return "Load";
            case IconButtonEnum.CLOSE:
                return "Close";
            case IconButtonEnum.SUMMARIZE:
                return "Summarize";
            default:
                return null;
        }
    };


    return (
        <button
            className='top-app-bar-icon-button'
            onClick={onClick}
            title={getTooltip()}
        >
            <FontAwesomeIcon icon={getIcon()} size='2x' />
        </button>
    );
}
