import React, { useState } from "react";
import { getDeviceId } from "../api/deviceApi";
import axios from "axios";

const defaultStages = [
  { tempSetpoint: 28, humSetpoint: 90, durationHours: 144 },
  { tempSetpoint: 27, humSetpoint: 85, durationHours: 94 },
  { tempSetpoint: 26, humSetpoint: 80, durationHours: 108 },
  { tempSetpoint: 26, humSetpoint: 75, durationHours: 192 },
  { tempSetpoint: 32, humSetpoint: 61, durationHours: 72 },
];

const SetStage = () => {
  const [stages, setStages] = useState(defaultStages);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (idx, field, value) => {
    const updated = stages.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    );
    setStages(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const deviceId = getDeviceId();
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${baseUrl}/device/${deviceId}/stage-settings`, stages);
      setMessage("Stage settings updated!");
    } catch (e) {
      setMessage("Failed to update stage settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <h2>Set Stage Settings</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {stages.map((stage, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, minWidth: 200 }}>
            <h4>Stage {idx + 1}</h4>
            <div>
              <label>Temp Setpoint: </label>
              <input
                type="number"
                value={stage.tempSetpoint}
                onChange={e => handleChange(idx, "tempSetpoint", parseFloat(e.target.value))}
                step="0.1"
              />
            </div>
            <div>
              <label>Hum Setpoint: </label>
              <input
                type="number"
                value={stage.humSetpoint}
                onChange={e => handleChange(idx, "humSetpoint", parseFloat(e.target.value))}
                step="0.1"
              />
            </div>
            <div>
              <label>Duration (hrs): </label>
              <input
                type="number"
                value={stage.durationHours}
                onChange={e => handleChange(idx, "durationHours", parseInt(e.target.value))}
                step="1"
              />
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSave} disabled={saving} style={{ marginTop: 24 }}>
        {saving ? "Saving..." : "Save"}
      </button>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
};

export default SetStage;
