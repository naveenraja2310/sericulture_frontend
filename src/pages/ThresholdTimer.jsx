import React, { useContext } from "react";
import toast from "react-hot-toast";
import { setThresholdValue } from "../api/deviceApi";
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
        fanTempMin: isGprsConnected ? data.fanTempMin ?? 0 : 0,
        fanTempMax: isGprsConnected ? data.fanTempMax ?? 0 : 0,
        motorHumMin: isGprsConnected ? data.motorHumMin ?? 0 : 0,
        motorHumMax: isGprsConnected ? data.motorHumMax ?? 0 : 0,
        heaterTempMin: isGprsConnected ? data.heaterTempMin ?? 0 : 0,
        heaterTempMax: isGprsConnected ? data.heaterTempMax ?? 0 : 0,
        fanOnDuration: isGprsConnected ? data.fanOnDuration ?? 0 : 0,
        fanOffDuration: isGprsConnected ? data.fanOffDuration ?? 0 : 0,
      }
    : {
        fanTempMin: 0,
        fanTempMax: 0,
        motorHumMin: 0,
        motorHumMax: 0,
        heaterTempMin: 0,
        heaterTempMax: 0,
        fanOnDuration: 0,
        fanOffDuration: 0,
      };

  const thresholdFields = [
    { key: "fanTempMin", method: "setFanTempMin", title: "Fan Temp Min", unit: "°C", step: "0.1" },
    { key: "fanTempMax", method: "setFanTempMax", title: "Fan Temp Max", unit: "°C", step: "0.1" },
    { key: "motorHumMin", method: "setMotorHumMin", title: "Motor Hum Min", unit: "%", step: "0.1" },
    { key: "motorHumMax", method: "setMotorHumMax", title: "Motor Hum Max", unit: "%", step: "0.1" },
    { key: "heaterTempMin", method: "setHeaterTempMin", title: "Heater Temp Min", unit: "°C", step: "0.1" },
    { key: "heaterTempMax", method: "setHeaterTempMax", title: "Heater Temp Max", unit: "°C", step: "0.1" },
    { key: "fanOnDuration", method: "setFanOnDuration", title: "Fan On Duration", unit: "s", step: "0.1" },
    { key: "fanOffDuration", method: "setFanOffDuration", title: "Fan Off Duration", unit: "s", step: "0.1" },
  ];

  const saveThreshold = async (method, title, value) => {
    await setThresholdValue(undefined, method, Number(value));
    toast.success(`${title} updated`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard" style={{ paddingTop: 0 }}>
      <p className="section-label">Thresholds & Timers</p>
      <div className="grid threshold-grid">
        {thresholdFields.map(({ key, method, title, unit, step }) => (
          <ThresholdCard
            key={method}
            title={title}
            value={displayData[key]}
            unit={unit}
            step={step}
            onSave={(value) => saveThreshold(method, title, value)}
            disabled={actionDisabled}
          />
        ))}
      </div>
    </div>
  );
};

export default ThresholdTimer;
