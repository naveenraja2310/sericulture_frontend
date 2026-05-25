import React, { createContext, useEffect, useState } from "react";
import { getStatus, getDeviceId } from "../api/deviceApi";

export const DeviceDataContext = createContext({});

export const DeviceDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getStatus();
        setData(res);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

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
        setData({
          gprsStatus: false,
          powerOn: false,
          temperature: 0,
          humidity: 0,
          motor: 0,
          fan: 0,
          heater: 0,
          tempThreshold: 0,
          humThreshold: 0,
          fanCycleTime: 0,
          uptime: 0,
          mode: "MANUAL",
          activeStage: 0,
        });
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

  const refreshData = async () => {
    try {
      const res = await getStatus();
      setData(res);
    } catch (e) {
      console.error("refreshData failed", e);
    }
  };

  return (
    <DeviceDataContext.Provider value={{ data, loading, refreshData }}>
      {children}
    </DeviceDataContext.Provider>
  );
};

export default DeviceDataProvider;
