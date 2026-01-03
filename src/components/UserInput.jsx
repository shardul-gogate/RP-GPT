import { useRef, useEffect, useState } from "react";
import { InputIcon } from "./InputIcon";
import { InputIconEnum } from "../utils/enums";

export default function UserInput({ value, onChange, placeholder, onSend, eraseLastMessage, retry, continueChat, gameState, updateGameState }) {
  const textareaRef = useRef(null);

  const [isEditingState, setIsEditingState] = useState(false)
  const [dayAndDate, setDayAndDate] = useState(gameState.dayAndDate)
  const [timeOfDay, setTimeOfDay] = useState(gameState.timeOfDay)

  useEffect(() => {
    setDayAndDate(gameState.dayAndDate)
    setTimeOfDay(gameState.timeOfDay)
  }, [gameState])


  const startEditing = () => {
    if (!isEditingState) {
      setIsEditingState(true)
    }
  }
  const stopEditing = () => {
    if (isEditingState) {
      setIsEditingState(false)
      updateGameState({ dayAndDate, timeOfDay })
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div className="user-input-area">
      <textarea
        className="user-input"
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <div className="game-state" onBlur={stopEditing} >
        {
          isEditingState
          ?
          <input
            className="game-state-input"
            value={dayAndDate}
            onChange={(e) => setDayAndDate(e.target.value)}
          />
          :
          <span onClick={startEditing} >{dayAndDate}</span>
        }
        {
          isEditingState
          ?
          <input
            className="game-state-input"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          />
          :
          <span onClick={startEditing} >{timeOfDay}</span>
        }
        <div className="user-input-icons">
          <InputIcon icon={InputIconEnum.SEND} onClick={onSend} />
          <InputIcon icon={InputIconEnum.DELETE}  onClick={eraseLastMessage} />
          <InputIcon icon={InputIconEnum.REGENERATE} onClick={retry} />
          <InputIcon icon={InputIconEnum.CONTINUE} onClick={continueChat} />
        </div>
      </div>
    </div>
  );
}
