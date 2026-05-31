import React, { useEffect, useState } from "react";
import { getTelemetries, sendDeviceAction, setMode, setTempThreshold, setHumThreshold, setFanCycle, setStage, setStageSettings as saveStageSettings } from "../api/deviceApi";

const Devices = () => {
  const [telemetry, setTelemetry] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [thresholdForm, setThresholdForm] = useState({ tempThreshold: 0, humThreshold: 0, fanCycleTime: 0 });
  const [stageSettings, setStageSettings] = useState([]);
  const [stageValue, setStageValue] = useState(1);
  const [stageSaving, setStageSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getTelemetries({ page, limit });
      if (res && res.data) {
        setTelemetry(res.data.telemetry || []);
        setTotal(res.data.total_count || 0);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const openView = (t) => {
    setSelected(t);
    setThresholdForm({ tempThreshold: t.tempThreshold || 0, humThreshold: t.humThreshold || 0, fanCycleTime: t.fanCycleTime || 0 });
    setStageSettings(Array.isArray(t.stages) ? t.stages : []);
    setStageValue(t.activeStage >= 1 ? t.activeStage : 1);
  };

  const closeView = () => setSelected(null);

  const doAction = async (actionFn, ...args) => {
    if (!selected) return;
    setUpdating(true);
    try {
      await actionFn(selected.deviceId, ...args);
      await fetch();
      const updated = (await getTelemetries({ page, limit })).data.telemetry.find(x => x.deviceId === selected.deviceId);
      setSelected(updated || null);
    } catch (e) { console.error(e); }
    finally { setUpdating(false); }
  };

  const saveStage = async (value) => {
    if (!selected) return false;
    const stage = Number(value);
    if (Number.isNaN(stage) || stage < 0 || stage > 5) return false;
    setStageSaving(true);
    try {
      if (stage === 0) await setMode(selected.deviceId, "auto");
      else await setStage(selected.deviceId, stage);
      await fetch();
      const updated = (await getTelemetries({ page, limit })).data.telemetry.find(x => x.deviceId === selected.deviceId);
      setSelected(updated || null);
      return true;
    } catch (e) { console.error(e); return false; }
    finally { setStageSaving(false); }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isConnected = (t) => t.gprsStatus && /connect/i.test(t.gprsStatus);

  return (
    <div className="users-page">

      {/* ── Header ── */}
      <div className="users-header">
        <div>
          <p className="section-label" style={{ margin: 0 }}>Admin</p>
          <h2 className="users-title">
            <i className="ti ti-cpu" aria-hidden="true" />
            Devices
          </h2>
        </div>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="loader-container" style={{ height: 200 }}>
          <div className="loader" />
          <p className="loader-text">Loading telemetry…</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th><i className="ti ti-hash" aria-hidden="true" /> Device ID</th>
                  <th><i className="ti ti-user" aria-hidden="true" /> User</th>
                  {/* <th>Sensor</th> */}
                  {/* <th><i className="ti ti-wifi" aria-hidden="true" /> Status</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="users-empty">
                      <i className="ti ti-cpu-off" aria-hidden="true" />
                      No devices found
                    </td>
                  </tr>
                ) : telemetry.map(t => (
                  <tr key={t._id}>
                    <td>
                      <span className="users-device-id">
                        <i className="ti ti-hash" aria-hidden="true" />
                        {t.deviceId}
                      </span>
                    </td>
                    <td>
                      <div className="users-avatar-row">
                        <div className="users-avatar">
                          {((t.username || (t.userDetails?.username) || "D")[0]).toUpperCase()}
                        </div>
                        {t.username || t.userDetails?.username || "—"}
                      </div>
                    </td>
                    {/* <td>
                      <span className={`gprs-badge ${t.sensorFailure ? "disconnected" : "connected"}`}>
                        <i className={`ti ${t.sensorFailure ? "ti-alert-circle" : "ti-shield-check"}`} aria-hidden="true" />
                        {t.sensorFailure != null ? String(t.sensorFailure) : "—"}
                      </span>
                    </td> */}
                    {/* <td>
                      <span className={`gprs-badge ${isConnected(t) ? "connected" : "disconnected"}`}>
                        <i className={`ti ${isConnected(t) ? "ti-wifi" : "ti-wifi-off"}`} aria-hidden="true" />
                        {isConnected(t) ? "Connected" : "Offline"}
                      </span>
                    </td> */}
                    <td>
                      <button className="users-btn-edit" onClick={() => openView(t)}>
                        <i className="ti ti-eye" aria-hidden="true" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="users-pagination">
            <span className="users-count">{total} device{total !== 1 ? "s" : ""} total</span>
            <div className="users-page-controls">
              <button className="users-page-btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} aria-label="Previous">
                <i className="ti ti-chevron-left" aria-hidden="true" />
              </button>
              <span className="users-page-label">Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
              <button className="users-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} aria-label="Next">
                <i className="ti ti-chevron-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Device Detail Modal ── */}
      {selected && (
        <div className="modal-overlay" onClick={closeView}>
          <div className="dv-modal" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-icon">
                  <i className="ti ti-cpu" aria-hidden="true" />
                </div>
                <div>
                  <h3>{selected.deviceId}</h3>
                  <p>{selected.username || selected.userDetails?.username || "No user assigned"}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeView} aria-label="Close">
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>

            <div className="dv-body">

              {/* ── Sensor readings ── */}
              <p className="dv-section-label">Sensor Readings</p>
              <div className="dv-stats-grid">
                <div className="dv-stat">
                  <i className="ti ti-temperature" aria-hidden="true" />
                  <div>
                    <span className="dv-stat-label">Temperature</span>
                    <span className="dv-stat-value">{selected.temperature != null ? selected.temperature.toFixed(2) : "—"} <small>°C</small></span>
                  </div>
                </div>
                <div className="dv-stat">
                  <i className="ti ti-droplet" aria-hidden="true" />
                  <div>
                    <span className="dv-stat-label">Humidity</span>
                    <span className="dv-stat-value">{selected.humidity != null ? selected.humidity.toFixed(2) : "—"} <small>%</small></span>
                  </div>
                </div>
                <div className="dv-stat">
                  <i
                    className={`ti ${selected.sensorFailure ? "ti-alert-circle" : "ti-shield-check"}`}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="dv-stat-label">Sensor Status</span>
                    <span
                      className={`dv-stat-value ${selected.sensorFailure ? "dv-off" : "dv-on"}`}
                      style={{ color: selected.sensorFailure ? "red" : "green" }}
                    >
                      {selected.sensorFailure === null
                        ? "—"
                        : selected.sensorFailure
                        ? "Inactive"
                        : "Active"}
                    </span>
                  </div>
                </div>

                <div className="dv-stat">
                  <i className={`ti ${selected.powerOn === 1 ? "ti-plug" : "ti-plug-off"}`} aria-hidden="true" />
                  <div>
                    <span className="dv-stat-label">Power</span>
                    <span className={`dv-stat-value ${selected.powerOn === 1 ? "dv-on" : "dv-off"}`}>
                      {selected.powerOn === 1 ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>
                <div className="dv-stat">
                  <i className="ti ti-wifi" aria-hidden="true" />
                  <div>
                    <span className="dv-stat-label">GPRS</span>
                    <span className={`dv-stat-value ${isConnected(selected) ? "dv-on" : "dv-off"}`}>
                      {selected.gprsStatus || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Device toggles ── */}
              <p className="dv-section-label">Device Control</p>
              <div className="dv-toggle-row">
                {[
                  { key: "fan",    icon: "ti-wind",      label: "Fan"    },
                  { key: "motor",  icon: "ti-engine",    label: "Motor"  },
                  { key: "heater", icon: "ti-flame",     label: "Heater" },
                ].map(({ key, icon, label }) => {
                  const isOn = selected[key] === 1;
                  return (
                    <div key={key} className={`dv-toggle-card ${isOn ? "dv-toggle-card--on" : ""}`}>
                      <i className={`ti ${icon}`} aria-hidden="true" />
                      <span>{label}</span>
                      <button
                        className={`toggle-btn ${isOn ? "on" : "off"}`}
                        disabled={updating}
                        onClick={() => doAction(sendDeviceAction, key, isOn ? "off" : "on")}
                        aria-label={`Toggle ${label}`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* ── Mode selection ── */}
              <p className="dv-section-label">Control Mode</p>
              <div className="mode-options" style={{ justifyContent: "flex-start", marginBottom: 0 }}>
                {[
                  { mode: "stage",  icon: "ti-settings",   label: "STAGE",  isActive: selected?.activeStage >= 1, action: () => saveStage(stageValue) },
                  { mode: "auto",   icon: "ti-robot",      label: "AUTO",   isActive: selected?.mode?.toLowerCase() === "auto" && !(selected?.activeStage >= 1), action: () => doAction(setMode, "auto") },
                  { mode: "manual", icon: "ti-hand-click", label: "MANUAL", isActive: selected?.mode?.toLowerCase() === "manual" && !(selected?.activeStage >= 1), action: () => doAction(setMode, "manual") },
                ].map(({ mode, icon, label, isActive, action }) => (
                  <button
                    key={mode}
                    className={`mode-button ${mode} ${isActive ? "active" : ""}`}
                    onClick={action}
                    disabled={updating || stageSaving}
                  >
                    <i className={`ti ${icon}`} aria-hidden="true" />
                    {label}
                    {mode === "stage" && selected?.activeStage >= 1 && (
                      <span className="stage-indicator">({selected.activeStage})</span>
                    )}
                  </button>
                ))}
              </div>

              {selected?.activeStage >= 1 && (
                <div className="stage-control" style={{ marginTop: 14 }}>
                  <label htmlFor="dv-stage-select">Active Stage</label>
                  <select
                    id="dv-stage-select"
                    value={stageValue}
                    onChange={e => setStageValue(Number(e.target.value))}
                    disabled={updating || stageSaving}
                  >
                    {[0, 1, 2, 3, 4, 5].map(s => (
                      <option key={s} value={s}>{s === 0 ? "0 (AUTO)" : `Stage ${s}`}</option>
                    ))}
                  </select>
                  <button onClick={() => saveStage(stageValue)} disabled={updating || stageSaving}>
                    <i className={`ti ${stageSaving ? "ti-loader-2" : "ti-check"}`}
                      style={stageSaving ? { animation: "spin 0.9s linear infinite" } : {}}
                      aria-hidden="true"
                    />
                    {stageSaving ? "Saving…" : "Set Stage"}
                  </button>
                </div>
              )}

              {/* ── Thresholds ── */}
              <p className="dv-section-label">Thresholds & Timers</p>
              <div className="dv-threshold-grid">
                {[
                  { label: "Temp Threshold", icon: "ti-temperature", unit: "°C", field: "tempThreshold", step: "0.1", parse: parseFloat },
                  { label: "Hum Threshold",  icon: "ti-droplet",     unit: "%",  field: "humThreshold",  step: "0.1", parse: parseFloat },
                  { label: "Fan Cycle",      icon: "ti-clock-play",  unit: "min",field: "fanCycleTime",  step: "1",   parse: parseInt   },
                ].map(({ label, icon, unit, field, step, parse }) => (
                  <div key={field} className="card" style={{ padding: "14px 16px" }}>
                    <div className="card-label">
                      <i className={`ti ${icon}`} aria-hidden="true" />
                      {label}
                    </div>
                    <div className="threshold-box">
                      <input
                        type="number"
                        step={step}
                        value={thresholdForm[field]}
                        onChange={e => setThresholdForm({ ...thresholdForm, [field]: parse(e.target.value || 0) })}
                        disabled={updating}
                        placeholder={`Value (${unit})`}
                      />
                      <span className="stage-field-unit">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button
                  className="stage-save-btn"
                  disabled={updating}
                  onClick={async () => {
                    if (!selected) return;
                    setUpdating(true);
                    try {
                      await setTempThreshold(selected.deviceId, thresholdForm.tempThreshold);
                      await setHumThreshold(selected.deviceId, thresholdForm.humThreshold);
                      await setFanCycle(selected.deviceId, thresholdForm.fanCycleTime);
                      await fetch();
                      const updated = (await getTelemetries({ page, limit })).data.telemetry.find(x => x.deviceId === selected.deviceId);
                      setSelected(updated || null);
                    } catch (e) { console.error(e); }
                    setUpdating(false);
                  }}
                >
                  <i className={`ti ${updating ? "ti-loader-2" : "ti-device-floppy"}`}
                    style={updating ? { animation: "spin 0.9s linear infinite" } : {}}
                    aria-hidden="true"
                  />
                  {updating ? "Saving…" : "Save Thresholds"}
                </button>
              </div>

              {/* ── Stage settings ── */}
              {stageSettings.length > 0 && (
                <>
                  <p className="dv-section-label">Stage Settings</p>
                  <div className="stages-grid">
                    {stageSettings.map((stage, idx) => {
                      const isActive = idx + 1 === selected.activeStage;
                      return (
                        <div key={idx} className={`stage-card${isActive ? " stage-card--active" : ""}`}>
                          <span className={`stage-badge ${isActive ? "stage-badge--active" : "stage-badge--num"}`}>
                            {isActive ? "Active" : `Stage ${idx + 1}`}
                          </span>
                          <div className="stage-card-title">
                            <i className="ti ti-settings" aria-hidden="true" />
                            Stage {idx + 1}
                          </div>

                          {[
                            { label: "Temp", icon: "ti-temperature", unit: "°C", key: "tempSetpoint", step: "0.1", parse: parseFloat },
                            { label: "Humidity", icon: "ti-droplet", unit: "%",  key: "humSetpoint",  step: "0.1", parse: parseFloat },
                            { label: "Duration", icon: "ti-clock",   unit: "hrs",key: "durationHours",step: "1",   parse: parseInt   },
                          ].map(({ label, icon, unit, key, step, parse }) => (
                            <div key={key} className="stage-field">
                              <div className="stage-field-label">
                                <i className={`ti ${icon}`} aria-hidden="true" />
                                {label}
                              </div>
                              <div className="stage-field-input">
                                <input
                                  type="number"
                                  step={step}
                                  value={stage[key] ?? 0}
                                  onChange={e => {
                                    const v = parse(e.target.value || 0);
                                    setStageSettings(s => s.map((st, i) => i === idx ? { ...st, [key]: v } : st));
                                  }}
                                />
                                <span className="stage-field-unit">{unit}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                    <button
                      className="stage-save-btn"
                      disabled={updating}
                      onClick={async () => {
                        if (!selected) return;
                        setUpdating(true);
                        try {
                          await saveStageSettings(selected.deviceId, stageSettings);
                          await fetch();
                          const updated = (await getTelemetries({ page, limit })).data.telemetry.find(x => x.deviceId === selected.deviceId);
                          setSelected(updated || null);
                        } catch (e) { console.error(e); }
                        setUpdating(false);
                      }}
                    >
                      <i className={`ti ${updating ? "ti-loader-2" : "ti-device-floppy"}`}
                        style={updating ? { animation: "spin 0.9s linear infinite" } : {}}
                        aria-hidden="true"
                      />
                      {updating ? "Saving…" : "Save Stage Settings"}
                    </button>
                  </div>
                </>
              )}

            </div>{/* end dv-body */}

          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;