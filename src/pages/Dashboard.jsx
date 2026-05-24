import { useEffect, useState } from "react";
import Header from "../components/Header";
import StatusOverview from "../components/StatusOverview";
import StatusCard from "../components/StatusCard";
import ToggleCard from "../components/ToggleCard";
import Loader from "../components/Loader";

import {
  getStatus,
  toggleDevice,
  setMode,
  setStage,
  setTempThreshold,
  setHumThreshold,
  setFanCycle,
  getDeviceId
} from "../api/deviceApi";

import toast from "react-hot-toast";

function Dashboard({ onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stageValue, setStageValue] = useState(1);

  const isGprsConnected = data?.gprsStatus
    ? /connect/i.test(data.gprsStatus)
    : false;
  const isPoweredOn = data?.powerOn === 1;
  const rawMode = data?.mode ? data.mode.toUpperCase() : "MANUAL";
  const actionEnabledBase = isGprsConnected && isPoweredOn;
  const actionDisabled = !actionEnabledBase;

  const displayData = data
    ? {
        temperature: isGprsConnected ? data.temperature : 0,
        humidity: isGprsConnected ? data.humidity : 0,
        motor: isGprsConnected ? data.motor : 0,
        fan: isGprsConnected ? data.fan : 0,
        heater: isGprsConnected ? data.heater : 0,
        tempThreshold: isGprsConnected ? data.tempThreshold : 0,
        humThreshold: isGprsConnected ? data.humThreshold : 0,
        fanCycleTime: isGprsConnected ? data.fanCycleTime : 0,
        uptime: isGprsConnected ? data.uptime : 0,
        mode: rawMode,
        activeStage: data.activeStage,
        gprsStatus: data.gprsStatus,
        powerOn: data.powerOn
      }
    : null;

  console.log("Display Data:", displayData);

  const activeStage = displayData?.activeStage ?? 0;
  const showStageDropdown = activeStage >= 1;
  const effectiveMode = activeStage >= 1 ? "STAGE" : rawMode;
  const isAutoMode = effectiveMode === "AUTO";
  const isStageMode = effectiveMode === "STAGE";

  useEffect(() => {
    if (displayData?.activeStage) {
      setStageValue(displayData.activeStage);
    }
  }, [displayData?.activeStage]);

  const loadData = async () => {
    try {
      const res = await getStatus();
      setData(res);
    } catch (err) {
      toast.error("Failed to fetch device data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const apiBase = import.meta.env.VITE_API_BASE_URL || `${window.location.protocol}//${window.location.host}`;
    const wsBase = apiBase.replace(/^http/, "ws");
    const wsUrl = `${wsBase}/device/${getDeviceId()}/ws`;

    let ws;
    let reconnectTimer;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {};

      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          setData(payload);
          setLoading(false);
        } catch (e) {
          console.error("Invalid WS message", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
        try {
          ws.close();
        } catch (e) {}
      };

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      try {
        ws && ws.close();
      } catch (e) {}
    };
  }, []);

  const handleToggle = async (device, currentStatus) => {
    try {
      const action = currentStatus ? "off" : "on";
      await toggleDevice(device, action);
      toast.success(`${device} turned ${action}`);
      
    } catch {
      toast.error("Action failed");
    }
  };

  const [modeLoading, setModeLoading] = useState(false);
  const [stageSaving, setStageSaving] = useState(false);

  const handleModeChange = async (targetMode) => {
    if (displayData?.mode === targetMode || modeLoading) return;

    try {
      setModeLoading(true);
      if (targetMode === "STAGE") {
        const success = await saveStage(stageValue, { suppressToast: true, refresh: false });
        if (!success) {
          return;
        }
      } else {
        await setMode(targetMode.toLowerCase());
      }
      await loadData();
      toast.success(`Switched to ${targetMode} mode`);
    } catch {
      toast.error("Mode change failed");
    } finally {
      setModeLoading(false);
    }
  };

  const saveStage = async (value, options = {}) => {
    const stage = Number(value);
    if (Number.isNaN(stage) || stage < 0 || stage > 5) {
      toast.error("Stage must be a number from 0 to 5");
      return false;
    }

    try {
      setStageSaving(true);
      await setStage(stage);
      if (!options.suppressToast) {
        toast.success(stage === 0 ? "Switched to AUTO mode" : `Stage set to ${stage}`);
      }
      if (options.refresh !== false) {
        await loadData();
      }
      return true;
    } catch {
      toast.error("Failed to set stage");
      return false;
    } finally {
      setStageSaving(false);
    }
  };

  if (loading || !data) return <Loader />;

  const isAuto = effectiveMode === "AUTO";
  const isStage = effectiveMode === "STAGE";
  const modeIcon = isAuto ? "ti-robot" : isStage ? "ti-settings" : "ti-hand-click";
  const modeLabel = isAuto ? "AUTO" : isStage ? "STAGE" : "MANUAL";

  return (
    <div className="dashboard">
      <Header onLogout={onLogout} />
      <StatusOverview 
        powerOn={displayData?.powerOn} 
        gprsStatus={displayData?.gprsStatus} 
        onRefresh={loadData}
      />

      <p className="section-label">Sensor Readings</p>
      <div className="grid">
        <StatusCard title="Temperature" value={displayData.temperature.toFixed(1)} unit="°C" />
        <StatusCard title="Humidity"    value={displayData.humidity.toFixed(2)} unit="%" />
      </div>

      <p className="section-label">Device Control</p>
      <div style={{ marginBottom: "32px" }}>
        <div className="card mode-card">
          <div className="card-label">
            <i className="ti ti-adjustments-horizontal" aria-hidden="true" />
            Control Mode
          </div>

          <div className="mode-options" role="group" aria-label="Control mode selection">
            <button
              type="button"
              className={`mode-button auto ${effectiveMode === "AUTO" ? "active" : ""}`}
              onClick={() => handleModeChange("AUTO")}
              disabled={actionDisabled || modeLoading}
            >
              <i className="ti ti-robot" aria-hidden="true" />
              AUTO
            </button>
            <button
              type="button"
              className={`mode-button stage ${effectiveMode === "STAGE" ? "active" : ""}`}
              onClick={() => handleModeChange("STAGE")}
              disabled={actionDisabled || modeLoading || stageSaving}
            >
              <i className="ti ti-settings" aria-hidden="true" />
              STAGE
            </button>
            <button
              type="button"
              className={`mode-button manual ${effectiveMode === "MANUAL" ? "active" : ""}`}
              onClick={() => handleModeChange("MANUAL")}
              disabled={actionDisabled || modeLoading}
            >
              <i className="ti ti-hand-click" aria-hidden="true" />
              MANUAL
            </button>
          </div>

          {showStageDropdown && (
            <div className="stage-control">
              <label htmlFor="stage-input">Stage (0 = AUTO)</label>
              <select
                id="stage-input"
                value={stageValue}
                onChange={(e) => setStageValue(Number(e.target.value))}
                disabled={actionDisabled || stageSaving}
                aria-label="Stage number"
              >
                {[0, 1, 2, 3, 4, 5].map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => saveStage(stageValue)}
                disabled={actionDisabled || stageSaving}
              >
                {stageSaving ? "Saving..." : "Set Stage"}
              </button>
            </div>
          )}

          <p className="mode-hint">
            {isAuto
              ? "System is self-managing"
              : isStage
              ? `Stage mode active — current stage ${displayData.activeStage || "N/A"}`
              : "Manual override active"}
          </p>
        </div>
      </div>

      <div className="grid">
        <ToggleCard
          title="Motor"
          status={displayData.motor}
          disabled={actionDisabled || isAuto}
          onToggle={() => handleToggle("motor", displayData.motor)}
        />
        <ToggleCard
          title="Fan"
          status={displayData.fan}
          disabled={actionDisabled || isAuto}
          onToggle={() => handleToggle("fan", displayData.fan)}
        />
        <ToggleCard
          title="Heater"
          status={displayData.heater}
          disabled={actionDisabled || isAuto}
          onToggle={() => handleToggle("heater", displayData.heater)}
        />
      </div>
    </div>
  );
}

export default Dashboard;