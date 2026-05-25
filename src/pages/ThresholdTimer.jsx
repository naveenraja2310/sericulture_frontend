import React, { useContext } from "react";
import toast from "react-hot-toast";
import { setTempThreshold, setHumThreshold, setFanCycle } from "../api/deviceApi";
import { DeviceDataContext } from "../contexts/DeviceDataContext";
import ThresholdCard from "../components/ThresholdCard";

const ThresholdTimer = () => {
  const { data, loading } = useContext(DeviceDataContext);

  console.log("thershold", data)

  const isGprsConnected = data?.gprsStatus ? /connect/i.test(data.gprsStatus) : false;
  const isPoweredOn = data?.powerOn === 1;
  const actionDisabled = !(isGprsConnected && isPoweredOn);
  const displayData = data
    ? {
        tempThreshold: isGprsConnected ? data.tempThreshold : 0,
        humThreshold: isGprsConnected ? data.humThreshold : 0,
        fanCycleTime: isGprsConnected ? data.fanCycleTime : 0,
      }
    : { tempThreshold: 0, humThreshold: 0, fanCycleTime: 0 };

  const saveTemp = async (value) => {
    await setTempThreshold(Number(value));
    toast.success("Temperature threshold updated");
  };

  const saveHum = async (value) => {
    await setHumThreshold(Number(value));
    toast.success("Humidity threshold updated");
  };

  const saveFanCycle = async (value) => {
    await setFanCycle(Number(value));
    toast.success("Fan cycle time updated");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
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
};

export default ThresholdTimer;
