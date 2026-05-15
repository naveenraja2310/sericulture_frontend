import { useEffect, useState } from "react";
import Header from "../components/Header";
import StatusCard from "../components/StatusCard";
import ToggleCard from "../components/ToggleCard";
import ThresholdCard from "../components/ThresholdCard";
import Loader from "../components/Loader";

import {
  getStatus,
  toggleDevice,
  setMode,
  setTempThreshold,
  setHumThreshold,
  setFanCycle
} from "../api/deviceApi";

import toast from "react-hot-toast";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isGprsConnected = data?.gprsStatus
    ? /connect/i.test(data.gprsStatus)
    : false;
  const isAutoMode = data?.mode?.toUpperCase() === "AUTO";
  const actionDisabled = !isGprsConnected || isAutoMode;

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
        mode: data.mode,
        gprsStatus: data.gprsStatus
      }
    : null;

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
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async (device, currentStatus) => {
    try {
      const action = currentStatus ? "off" : "on";
      await toggleDevice(device, action);
      toast.success(`${device} turned ${action}`);
      await loadData();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleMode = async () => {
    try {
      const mode = data.mode === "AUTO" ? "manual" : "auto";
      await setMode(mode);
      toast.success(`Switched to ${mode} mode`);
      await loadData();
    } catch {
      toast.error("Mode change failed");
    }
  };

  const saveTemp = async (value) => {
    await setTempThreshold(Number(value));
    toast.success("Temperature threshold updated");
    await loadData();
  };

  const saveHum = async (value) => {
    await setHumThreshold(Number(value));
    toast.success("Humidity threshold updated");
    await loadData();
  };

  const saveFanCycle = async (value) => {
    await setFanCycle(Number(value));
    toast.success("Fan cycle time updated");
    await loadData();
  };

  if (loading || !data) return <Loader />;

  const isAuto = displayData.mode === "AUTO";

  return (
    <div className="dashboard">
      <Header gprsStatus={displayData?.gprsStatus} />

      <p className="section-label">Sensor Readings</p>
      <div className="grid">
        <StatusCard title="Temperature" value={displayData.temperature.toFixed(1)} unit="°C" />
        <StatusCard title="Humidity"    value={displayData.humidity} unit="%" />
      </div>

      <p className="section-label">Device Control</p>
      <div style={{ marginBottom: "32px" }}>
        <div className="card mode-card">
          <div className="card-label">
            <i className="ti ti-adjustments-horizontal" aria-hidden="true" />
            Control Mode
          </div>

          <button
            className={`mode-circle ${isAuto ? "auto" : "manual"}`}
            onClick={handleMode}
            disabled={!isGprsConnected}
            aria-label={`Switch to ${isAuto ? "manual" : "auto"} mode`}
          >
            <i className={`ti ${isAuto ? "ti-robot" : "ti-hand-click"}`} />
            {isAuto ? "AUTO" : "MANUAL"}
          </button>

          <p className="mode-hint" style={{ marginTop: 10 }}>
            {isAuto ? "System is self-managing" : "Manual override active"}
          </p>
        </div>
      </div>

      <div className="grid">
        <ToggleCard
          title="Motor"
          status={displayData.motor}
          disabled={actionDisabled}
          onToggle={() => handleToggle("motor", displayData.motor)}
        />
        <ToggleCard
          title="Fan"
          status={displayData.fan}
          disabled={actionDisabled}
          onToggle={() => handleToggle("fan", displayData.fan)}
        />
        <ToggleCard
          title="Heater"
          status={displayData.heater}
          disabled={actionDisabled}
          onToggle={() => handleToggle("heater", displayData.heater)}
        />
      </div>

      <p className="section-label">Thresholds & Timers</p>
      <div className="grid">
        <ThresholdCard
          title="Temperature Threshold"
          value={displayData.tempThreshold}
          onSave={saveTemp}
          disabled={actionDisabled}
        />
        <ThresholdCard
          title="Humidity Threshold"
          value={displayData.humThreshold}
          onSave={saveHum}
          disabled={actionDisabled}
        />
        <ThresholdCard
          title="Fan Cycle Time"
          value={displayData.fanCycleTime}
          onSave={saveFanCycle}
          disabled={actionDisabled}
        />
      </div>
    </div>
  );
}

export default Dashboard;