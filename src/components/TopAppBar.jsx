import { IconButton } from "./IconButton";
import { IconButtonEnum, LargeModalTypeEnum, SmallModalTypEnum } from "../utils/enums";

export default function TopAppBar({ saveHistory, openSmallModal, openLargeModal }) {

  return (
    <div className='top-app-bar'>
      <div className="top-app-bar-title">RP-GPT</div>
      <div className='top-app-bar-button-row'>
        <IconButton icon={IconButtonEnum.QUICK_SAVE} onClick={saveHistory} />
        <IconButton icon={IconButtonEnum.FULL_SAVE} onClick={() => openSmallModal(SmallModalTypEnum.SAVE)} />
        <IconButton icon={IconButtonEnum.LOAD} onClick={() => openSmallModal(SmallModalTypEnum.LOAD)} />
        <IconButton icon={IconButtonEnum.PLOT_POINTS} onClick={() => openLargeModal(LargeModalTypeEnum.PLOT_POINTS)} />
        <IconButton icon={IconButtonEnum.QUESTS} onClick={() => openLargeModal(LargeModalTypeEnum.QUESTS)} />
        <IconButton icon={IconButtonEnum.SUMMARIZE} onClick={() => openLargeModal(LargeModalTypeEnum.SUMMARIZE)} />
        <IconButton icon={IconButtonEnum.SETTINGS} onClick={() => openLargeModal(LargeModalTypeEnum.SETTINGS)} />
      </div>
    </div>
  );
}
