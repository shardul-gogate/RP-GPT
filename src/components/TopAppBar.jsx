import { IconButton} from "./IconButton";

export default function TopAppBar({ saveHistory }) {
  return (
    <div className='top-app-bar'>
      <div className="top-app-bar-title">AI Game Master</div>
      <div className='top-app-bar-button-row'>
        <IconButton icon="quicksave" onClick={saveHistory} />
        <IconButton icon="fullsave" onClick={() => console.log("Add clicked")} />
        <IconButton icon="load" onClick={() => console.log("Edit clicked")} />
        <IconButton icon="plotpoints" onClick={() => console.log("Delete clicked")} />
        <IconButton icon="quests" onClick={() => console.log("Save clicked")} />
        <IconButton icon="settings" onClick={() => console.log("Save clicked")} />
      </div>
    </div>
  );
}
