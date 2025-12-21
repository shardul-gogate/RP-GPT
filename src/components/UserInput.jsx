import { useRef, useEffect } from "react";
import { InputIcon } from "./InputIcon";

export default function UserInput({ value, onChange, placeholder, onSend, loading, eraseLastMessage, retry, continueChat}) {
  const textareaRef = useRef(null);

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
        disabled={loading}
      />
      <div className="user-input-icons">
        <InputIcon icon="send" onClick={onSend} disabled={loading}/>
        <InputIcon icon="delete"  onClick={eraseLastMessage} disabled={loading} />
        <InputIcon icon="regenerate" onClick={retry} disabled={loading} />
        <InputIcon icon="continue" onClick={continueChat} disabled={loading} />
      </div>
    </div>
  );
}
