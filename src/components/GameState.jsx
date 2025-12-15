import { useState, useEffect } from "react";

export default function GameState({ gameState, onChange }) {
  const [editing, setEditing] = useState(false);
  const [localDate, setLocalDate] = useState(gameState.date);
  const [localDay, setLocalDay] = useState(gameState.day);
  const [localTime, setLocalTime] = useState(gameState.timeOfDay);

  useEffect(() => {
    setLocalDate(gameState.date);
    setLocalDay(gameState.day);
    setLocalTime(gameState.timeOfDay);
  }, [gameState]);

  const handleSave = () => {
    setEditing(false);
    onChange({ date: localDate, day: localDay, timeOfDay: localTime });
  };

  if (editing) {
    return (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <input
          type="text"
          value={localDate}
          onChange={(e) => setLocalDate(e.target.value)}
          style={{ width: 90 }}
        />
        <input
          type="text"
          value={localDay}
          onChange={(e) => setLocalDay(e.target.value)}
          style={{ width: 90 }}
        />
        <select
          value={localTime}
          onChange={(e) => setLocalTime(e.target.value)}
        >
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
          <option>Night</option>
        </select>
        <button onClick={handleSave}>✔</button>
      </div>
    );
  }

  return (
    <div
      style={{ cursor: "pointer", padding: "2px 6px", border: "1px solid #ccc", borderRadius: 4 }}
      onClick={() => setEditing(true)}
    >
      {localDate} | {localDay} | {localTime}
    </div>
  );
}
