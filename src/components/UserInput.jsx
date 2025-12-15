export default function UserInput({ value, onChange, placeholder }) {
  return (
    <textarea
      rows={3}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        flex: 1,
        padding: 8,
        borderRadius: 8,
        border: "1px solid #ccc",
        resize: "vertical",
      }}
    />
  );
}
