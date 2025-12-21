import { useState } from "react";
import EditCanvasMessage from "./EditCanvasMessage";

export default function Canvas({ messages, onEditMessage }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (index, text) => {
    setEditingIndex(index);
    setEditValue(text);
  };

  const handleConfirmEdit = (newValue) => {
    onEditMessage(editingIndex, newValue);
    setEditingIndex(null);
    setEditValue("");
  };

  const handleDiscardEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="canvas">
      {messages.map((msg, index) => (
        editingIndex === index ? (
          <EditCanvasMessage
            key={index}
            value={editValue}
            onConfirmEdit={handleConfirmEdit}
            onDiscard={handleDiscardEdit}
            onChange={setEditValue}
          />
        ) : (
          <div
            className="canvas-message"
            key={index}
            onClick={() => handleStartEdit(index, msg)}
          >
            {msg}
          </div>
        )
      ))}
    </div>
  );
}
