import { useState } from "react";

export default function Canvas({ messages, onEditMessage }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (idx, text) => {
    setEditingIndex(idx);
    setEditValue(text);
  };

  const handleBlur = (idx) => {
    if (editingIndex === idx) {
      onEditMessage(idx, editValue); // save changes back up
      setEditingIndex(null);
    }
  };

  return (
    <div
      style={{
        flex: 5,
        overflowY: "auto",
        border: "1px solid #ddd",
        padding: 16,
        borderRadius: 8,
        background: "#fafafa",
        fontFamily: "'Georgia', serif",
        lineHeight: 1.6,
        whiteSpace: "pre-wrap",
      }}
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{ marginBottom: 12, cursor: "pointer" }}
          onClick={() => handleStartEdit(idx, msg)}
        >
          {editingIndex === idx ? (
            <textarea
              rows={10}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleBlur(idx)}
              autoFocus
              style={{
                width: "100%",
                padding: "4px 8px",
                fontFamily: "'Georgia', serif",
                fontSize: "14px",
              }}
            />
          ) : (
            msg
          )}
        </div>
      ))}
    </div>
  );
}
