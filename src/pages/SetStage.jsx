import React, { useState, useContext, useEffect } from "react";
import { getDeviceId } from "../api/deviceApi";
import axios from "axios";
import { DeviceDataContext } from "../contexts/DeviceDataContext";

const defaultStages = [
  { tempSetpoint: 28, humSetpoint: 90, durationHours: 144 },
  { tempSetpoint: 27, humSetpoint: 85, durationHours: 94 },
  { tempSetpoint: 26, humSetpoint: 80, durationHours: 108 },
  { tempSetpoint: 26, humSetpoint: 75, durationHours: 192 },
  { tempSetpoint: 32, humSetpoint: 61, durationHours: 72 },
];

const SetStage = () => {
  const { data } = useContext(DeviceDataContext);
  const [stages, setStages] = useState(() =>
    data?.stages?.length > 0 ? data.stages : defaultStages
  );
  const [stagesInitialized, setStagesInitialized] = useState(
    () => !!data?.stages?.length
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!stagesInitialized && data?.stages?.length > 0) {
      setStages(data.stages);
      setStagesInitialized(true);
    }
  }, [data?.stages, stagesInitialized]);

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
      setMessage("success");
    } catch {
      setMessage("error");
    } finally {
      setSaving(false);
    }
  };

  const activeStage = data?.activeStage;

  return (
    <div className="dashboard" style={{ paddingBottom: 80, paddingTop: 0 }}>
      <p className="section-label">Stage Settings</p>

      {activeStage != null && (
        <div className="active-stage-bar">
          <i className="ti ti-player-play" aria-hidden="true" />
          Active stage: <strong>Stage {activeStage}</strong>
        </div>
      )}

      <div className="stages-grid">
        {stages.map((stage, idx) => {
          const isActive = idx + 1 === activeStage;
          return (
            <div key={idx} className={`stage-card${isActive ? " stage-card--active" : ""}`}>
              <span className={`stage-badge ${isActive ? "stage-badge--active" : "stage-badge--num"}`}>
                {isActive ? "Active" : `Stage ${idx + 1}`}
              </span>

              <div className="stage-card-title">
                <i className="ti ti-settings" aria-hidden="true" />
                Stage {idx + 1}
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-temperature" aria-hidden="true" />
                  Temp setpoint
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.tempSetpoint}
                    step="0.1"
                    onChange={e => handleChange(idx, "tempSetpoint", parseFloat(e.target.value))}
                  />
                  <span className="stage-field-unit">°C</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-droplet" aria-hidden="true" />
                  Hum setpoint
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.humSetpoint}
                    step="0.1"
                    onChange={e => handleChange(idx, "humSetpoint", parseFloat(e.target.value))}
                  />
                  <span className="stage-field-unit">%</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Duration
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.durationHours}
                    step="1"
                    onChange={e => handleChange(idx, "durationHours", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">hrs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="stage-save-row">
        <p className="stage-save-hint">
          <i className="ti ti-info-circle" aria-hidden="true" />
          Changes apply on next stage transition
        </p>
        <button className="stage-save-btn" onClick={handleSave} disabled={saving}>
          <i className={`ti ${saving ? "ti-loader-2" : "ti-device-floppy"}`}
            style={saving ? { animation: "spin 0.9s linear infinite" } : {}}
            aria-hidden="true"
          />
          {saving ? "Saving…" : "Save All Stages"}
        </button>
      </div>

      {message && (
        <div className={`stage-message ${message === "success" ? "stage-message--success" : "stage-message--error"}`}>
          <i className={`ti ${message === "success" ? "ti-circle-check" : "ti-alert-circle"}`} aria-hidden="true" />
          {message === "success" ? "Stage settings updated!" : "Failed to update stage settings"}
        </div>
      )}
    </div>
  );
};

export default SetStage;