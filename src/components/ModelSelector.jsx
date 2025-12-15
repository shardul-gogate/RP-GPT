export default function ModelSelector({ model, onChange }) {
    return (
        <select value={model} onChange={e => onChange(e.target.value)}>
            <option value="MistralRP">MistralRP</option>
            <option value="LlamaRP">LlamaRP</option>
        </select>
    );
};

;