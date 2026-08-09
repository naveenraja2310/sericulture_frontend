import React, { useState, useContext, useEffect } from "react";
import { getDeviceId, setStageSettings } from "../api/deviceApi";
import { DeviceDataContext } from "../contexts/DeviceDataContext";

const defaultStages = [
  {  fanTempMin: 25, fanTempMax: 30, fanOnDuration: 120, fanOffDuration: 60, motorHumMin: 80, motorHumMax: 90, heaterTempMin: 27, heaterTempMax: 29, durationHours: 144,  },
  {  fanTempMin: 25, fanTempMax: 30, fanOnDuration: 120, fanOffDuration: 60, motorHumMin: 80, motorHumMax: 90, heaterTempMin: 27, heaterTempMax: 29, durationHours: 120,  },
  {  fanTempMin: 25, fanTempMax: 30, fanOnDuration: 120, fanOffDuration: 60, motorHumMin: 80, motorHumMax: 90, heaterTempMin: 27, heaterTempMax: 29, durationHours: 94, },
  {  fanTempMin: 25, fanTempMax: 30, fanOnDuration: 120, fanOffDuration: 60, motorHumMin: 80, motorHumMax: 90, heaterTempMin: 27, heaterTempMax: 29, durationHours: 94, },
  {  fanTempMin: 25, fanTempMax: 30, fanOnDuration: 120, fanOffDuration: 60, motorHumMin: 80, motorHumMax: 90, heaterTempMin: 27, heaterTempMax: 29, durationHours: 94, },
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
      console.log("Saving stage settings for device ID:::", deviceId, "with data:", stages);
      await setStageSettings(deviceId, stages);
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
                  <i className="ti ti-clock" aria-hidden="true" />
                  Fan Temp Min
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.fanTempMin}
                    step="1"
                    onChange={e => handleChange(idx, "fanTempMin", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">°C</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Fan Temp Max
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.fanTempMax}
                    step="1"
                    onChange={e => handleChange(idx, "fanTempMax", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">°C</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Fan On Duration
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.fanOnDuration}
                    step="1"
                    onChange={e => handleChange(idx, "fanOnDuration", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">mins</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Fan Off Duration
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.fanOffDuration}
                    step="1"
                    onChange={e => handleChange(idx, "fanOffDuration", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">mins</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Motor Hum Min
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.motorHumMin}
                    step="1"
                    onChange={e => handleChange(idx, "motorHumMin", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">%</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Motor Hum Max
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.motorHumMax}
                    step="1"
                    onChange={e => handleChange(idx, "motorHumMax", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">%</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Heater Temp Min
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.heaterTempMin}
                    step="1"
                    onChange={e => handleChange(idx, "heaterTempMin", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">°C</span>
                </div>
              </div>

              <div className="stage-field">
                <div className="stage-field-label">
                  <i className="ti ti-clock" aria-hidden="true" />
                  Heater Temp Max
                </div>
                <div className="stage-field-input">
                  <input
                    type="number"
                    value={stage.heaterTempMax}
                    step="1"
                    onChange={e => handleChange(idx, "heaterTempMax", parseInt(e.target.value))}
                  />
                  <span className="stage-field-unit">°C</span>
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