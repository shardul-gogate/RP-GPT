import { useState } from "react";

export default function Quest({ name, description, objectives, status, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [questName, setQuestName] = useState(name);
  const [questDescription, setQuestDescription] = useState(description);
  const [questStatus, setQuestStatus] = useState(status);
  const [objs, setObjs] = useState(objectives);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        name: questName,
        description: questDescription,
        status: questStatus,
        objectives: objs,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setQuestName(name);
    setQuestDescription(description);
    setQuestStatus(status);
    setObjs(objectives);
    setIsEditing(false);
  };

  const toggleObjective = (index) => {
    const newObjs = [...objs];
    newObjs[index].completed = !newObjs[index].completed;
    setObjs(newObjs);
  };

  const addObjective = () => {
    setObjs([...objs, { name: "", completed: false }]);
  };

  const updateObjectiveName = (index, newName) => {
    const newObjs = [...objs];
    newObjs[index].name = newName;
    setObjs(newObjs);
  };

  const removeObjective = (index) => {
    const newObjs = objs.filter((_, i) => i !== index);
    setObjs(newObjs);
  };

  if (isEditing) {
    return (
      <div style={{
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        maxWidth: 300
      }}>
        <input
          type="text"
          value={questName}
          onChange={(e) => setQuestName(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <select
          value={questStatus}
          onChange={(e) => setQuestStatus(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Finished">Finished</option>
        </select>

        <input
          type="text"
          value={questDescription}
          onChange={(e) => setQuestDescription(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <ul style={{ paddingLeft: 18, marginBottom: 8 }}>
          {objs.map((obj, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={obj.completed}
                onChange={() => toggleObjective(i)}
              />
              <input
                type="text"
                value={obj.name}
                onChange={(e) => updateObjectiveName(i, e.target.value)}
                style={{ flex: 1 }}
              />
              <button onClick={() => removeObjective(i)}>✕</button>
            </li>
          ))}
        </ul>

        <button onClick={addObjective} style={{ marginBottom: 8 }}>Add Objective</button>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      maxWidth: 300
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>{questName}</strong>
        <span style={{
          fontSize: 12,
          padding: "2px 6px",
          borderRadius: 999,
          background: "#eee",
          color: "#333"
        }}>{questStatus}</span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#555",
          marginBottom: 8,
          whiteSpace: "pre-wrap",
          lineHeight: 1.4,
        }}
      >
        {questDescription}
      </p>
      <ul style={{ paddingLeft: 18, margin: 0 }}>
        {objs.length === 0
          ? <li style={{ color: "#999", fontSize: 12 }}>No objectives</li>
          : objs.map((obj, i) => (
              <li key={i} style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" checked={obj.completed} readOnly />
                <span style={{ textDecoration: obj.completed ? "line-through" : "none" }}>{obj.name}</span>
              </li>
            ))
        }
      </ul>
      <button onClick={() => setIsEditing(true)} style={{ marginTop: 8 }}>Edit</button>
    </div>
  );
}
