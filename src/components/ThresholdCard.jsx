import { useEffect, useState } from "react";

const THRESHOLD_ICONS = {
  "Temperature Threshold": "ti-temperature",
  "Humidity Threshold":    "ti-droplet",
  "Fan Cycle Time":        "ti-clock-play",
  "Fan Temp Min":          "ti-temperature",
  "Fan Temp Max":          "ti-temperature",
  "Motor Hum Min":         "ti-droplet",
  "Motor Hum Max":         "ti-droplet",
  "Heater Temp Min":       "ti-flame",
  "Heater Temp Max":       "ti-flame",
  "Fan On Duration":       "ti-clock-play",
  "Fan Off Duration":      "ti-clock-play",
};

const THRESHOLD_UNITS = {
  "Temperature Threshold": "°C",
  "Humidity Threshold":    "%",
  "Fan Cycle Time":        "s",
  "Fan Temp Min":          "°C",
  "Fan Temp Max":          "°C",
  "Motor Hum Min":         "%",
  "Motor Hum Max":         "%",
  "Heater Temp Min":       "°C",
  "Heater Temp Max":       "°C",
  "Fan On Duration":       "s",
  "Fan Off Duration":      "s",
};

function ThresholdCard({ title, value, onSave, disabled, icon: customIcon, unit: customUnit, step = "0.1" }) {
  const [input, setInput] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const icon = customIcon || THRESHOLD_ICONS[title] || "ti-adjustments";
  const unit = customUnit ?? (THRESHOLD_UNITS[title] || "");

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(input);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-label">
        <i className={`ti ${icon}`} aria-hidden="true" />
        {title}
      </div>

      <div className="threshold-box">
        <input
          type="number"
          step={step}
          value={input ?? ""}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || saving}
          placeholder={`Enter value${unit ? ` (${unit})` : ""}`}
          aria-label={`${title} value`}
        />
        <button
          onClick={handleSave}
          disabled={disabled || saving}
          aria-label={`Save ${title}`}
        >
          <i
            className={`ti ${saving ? "ti-loader-2" : "ti-device-floppy"}`}
            style={{ fontSize: 15, ...(saving && { animation: "spin 0.9s linear infinite" }) }}
            aria-hidden="true"
          />
          {saving ? "Saving…" : "Set"}
        </button>
      </div>
    </div>
  );
}

export default ThresholdCard;