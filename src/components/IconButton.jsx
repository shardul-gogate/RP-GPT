import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faScroll, faBook, faFloppyDisk, faDownload } from '@fortawesome/free-solid-svg-icons';

export default function IconButton({ icon, onClick }) {
  const getIcon = () => {
    switch (icon) {
      case "settings":
        return faGear;
      case "quests":
        return faScroll;
      case "plotpoints":
        return faBook;
      case "save":
        return faFloppyDisk;
      case "load":
        return faDownload;
      default:
        return null;
    }
  };

  const getTooltip = () => {
    switch (icon) {
      case "settings":
        return "Settings";
      case "quests":
        return "Quests";
      case "plotpoints":
        return "Plot Points";
      case "save":
        return "Save";
      case "load":
        return "Load";
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
