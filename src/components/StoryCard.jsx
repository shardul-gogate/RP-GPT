import { useState } from "react";

export default function StoryCard({ description, triggers, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(description);
  const [trigs, setTrigs] = useState(triggers.join(", "));

  const handleSave = () => {
    const updatedCard = {
      description: desc,
      triggers: trigs.split(",").map(t => t.trim()).filter(t => t)
    };
    if (onUpdate) onUpdate(updatedCard);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDesc(description);
    setTrigs(triggers.join(", "));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 12,
          marginBottom: 12,
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          maxWidth: 300
        }}
      >
        <textarea
          rows={10}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <input
          type="text"
          value={trigs}
          onChange={(e) => setTrigs(e.target.value)}
          placeholder="Comma-separated triggers"
          style={{ width: "100%", marginBottom: 8 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        maxWidth: 300,
      }}
    >
      <p style={{ fontFamily: "Georgia, serif", marginBottom: 8 }}>{description}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {triggers.length === 0 ? (
          <span style={{ fontSize: 12, color: "#999" }}>No triggers</span>
        ) : (
          triggers.map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                padding: "3px 8px",
                background: "#f1f5f9",
                borderRadius: 999,
                border: "1px solid #e0e0e0"
              }}
            >
              {t}
            </span>
          ))
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        style={{ marginTop: 8 }}
      >
        Edit
      </button>
    </div>
  );
}
