import { useState } from "react";
import { IconButton } from "./IconButton";
import SmallModal from "./SmallModal";
import { IconButtonEnum, SmallModalTypEnum } from "../utils/enums";

export default function TopAppBar({ saveHistory, saveFullGame, loadGame }) {
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [smallModalTypeEnum, setSmallModalTypeEnum] = useState(null);

  const handleSave = (gameName) => {
    if (smallModalTypeEnum === SmallModalTypEnum.SAVE) {
      saveFullGame(gameName);
    } else {
      loadGame(gameName);
    }
    setIsSmallModalOpen(false);
  };

  const handleCancel = () => {
    setIsSmallModalOpen(false);
  };

  return (
    <>
      <div className='top-app-bar'>
        <div className="top-app-bar-title">AI Game Master</div>
        <div className='top-app-bar-button-row'>
          <IconButton icon={IconButtonEnum.QUICK_SAVE} onClick={saveHistory} />
          <IconButton
            icon={IconButtonEnum.FULL_SAVE}
            onClick={() => {
              setSmallModalTypeEnum(SmallModalTypEnum.SAVE);
              setIsSmallModalOpen(true);
            }}
          />
          <IconButton
            icon={IconButtonEnum.LOAD}
            onClick={() => {
              setSmallModalTypeEnum(SmallModalTypEnum.LOAD);
              setIsSmallModalOpen(true);
            }}
          />
          <IconButton icon={IconButtonEnum.PLOT_POINTS} onClick={() => console.log("Delete clicked")} />
          <IconButton icon={IconButtonEnum.QUESTS} onClick={() => console.log("Save clicked")} />
          <IconButton icon={IconButtonEnum.SETTINGS} onClick={() => console.log("Save clicked")} />
        </div>
      </div>
      {isSmallModalOpen && <SmallModal smallModalTypeEnum={smallModalTypeEnum} onConfirm={handleSave} onCancel={handleCancel} />}
    </>
  );
}
