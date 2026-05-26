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

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getTelemetries({ page, limit });
      if (res && res.data) {
        setTelemetry(res.data.telemetry || []);
        setTotal(res.data.total_count || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page]);

  const openView = (t) => {
    setSelected(t);
    setThresholdForm({ tempThreshold: t.tempThreshold || 0, humThreshold: t.humThreshold || 0, fanCycleTime: t.fanCycleTime || 0 });
    setStageSettings(Array.isArray(t.stages) ? t.stages : []);
  };

  const closeView = () => {
    setSelected(null);
  };

  const doAction = async (actionFn, ...args) => {
    if (!selected) return;
    setUpdating(true);
    try {
      await actionFn(selected.deviceId, ...args);
      await fetch();
      const updated = (await getTelemetries({ page, limit })).data.telemetry.find(x => x.deviceId === selected.deviceId);
      setSelected(updated || null);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Devices</h2>

      {loading ? <div>Loading telemetry...</div> : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Device ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>User</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {telemetry.map(t => (
                <tr key={t._id}>
                  <td style={{ padding: '8px 4px' }}>{t.deviceId}</td>
                  <td style={{ padding: '8px 4px' }}>{t.username || (t.userDetails && t.userDetails.username)}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <button onClick={() => openView(t)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            <span style={{ margin: '0 8px' }}>Page {page} / {Math.max(1, Math.ceil(total / limit))}</span>
            <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}

      {selected && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 720, padding: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', maxHeight: '90vh', overflow: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Device: {selected.deviceId}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <strong>Temperature:</strong> {selected.temperature}
              </div>
              <div>
                <strong>Humidity:</strong> {selected.humidity}
              </div>
              <div>
                <strong>Mode:</strong> {selected.mode}
              </div>
              <div>
                <strong>Fan:</strong> {selected.fan}
              </div>
              <div>
                <strong>Motor:</strong> {selected.motor}
              </div>
              <div>
                <strong>Heater:</strong> {selected.heater}
              </div>
              {/* <div style={{ gridColumn: '1 / -1' }}>
                <strong>Stages:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{JSON.stringify(selected.stages, null, 2)}</pre>
              </div> */}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => doAction(sendDeviceAction, 'fan', 'on')} disabled={updating}>Fan On</button>
              <button onClick={() => doAction(sendDeviceAction, 'fan', 'off')} disabled={updating}>Fan Off</button>
              <button onClick={() => doAction(sendDeviceAction, 'motor', 'on')} disabled={updating}>Motor On</button>
              <button onClick={() => doAction(sendDeviceAction, 'motor', 'off')} disabled={updating}>Motor Off</button>
              <button onClick={() => doAction(sendDeviceAction, 'heater', 'on')} disabled={updating}>Heater On</button>
              <button onClick={() => doAction(sendDeviceAction, 'heater', 'off')} disabled={updating}>Heater Off</button>
              <button onClick={() => doAction(setMode, 'auto')} disabled={updating}>Set Auto</button>
              <button onClick={() => doAction(setMode, 'manual')} disabled={updating}>Set Manual</button>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <label>
                Temp Threshold
                <input type="number" step="0.1" value={thresholdForm.tempThreshold} onChange={e=>setThresholdForm({...thresholdForm, tempThreshold: parseFloat(e.target.value||0)})} style={{ marginLeft: 8 }} />
              </label>

              <label>
                Hum Threshold
                <input type="number" step="0.1" value={thresholdForm.humThreshold} onChange={e=>setThresholdForm({...thresholdForm, humThreshold: parseFloat(e.target.value||0)})} style={{ marginLeft: 8 }} />
              </label>

              <label>
                Fan Cycle (minutes)
                <input type="number" value={thresholdForm.fanCycleTime} onChange={e=>setThresholdForm({...thresholdForm, fanCycleTime: parseInt(e.target.value||0)})} style={{ marginLeft: 8 }} />
              </label>

              <button onClick={async()=>{
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
              }} disabled={updating}>Save Thresholds</button>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 8 }}><strong>Power:</strong> {selected.powerOn === 1 ? 'ON' : 'OFF'} &nbsp;&nbsp; <strong>GPRS:</strong> {selected.gprsStatus || '-'}</label>

              <div style={{ marginTop: 8 }}>
                <strong>Stage Settings</strong>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  {(Array.isArray(stageSettings) ? stageSettings : []).map((stage, idx) => (
                    <div key={idx} style={{ border: '1px solid #eee', padding: 12, borderRadius: 6, minWidth: 200 }}>
                      <div><strong>Stage {idx + 1}</strong></div>
                      <div style={{ marginTop: 8 }}>
                        <label>Temp Setpoint</label>
                        <input type="number" step="0.1" value={stage.tempSetpoint ?? stage.tempSetpoint === 0 ? stage.tempSetpoint : ''} onChange={e=>{
                          const v = parseFloat(e.target.value||0);
                          setStageSettings(s => s.map((st,i)=> i===idx ? {...st, tempSetpoint: v} : st));
                        }} style={{ width: '100%' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <label>Hum Setpoint</label>
                        <input type="number" step="0.1" value={stage.humSetpoint ?? stage.humSetpoint === 0 ? stage.humSetpoint : ''} onChange={e=>{
                          const v = parseFloat(e.target.value||0);
                          setStageSettings(s => s.map((st,i)=> i===idx ? {...st, humSetpoint: v} : st));
                        }} style={{ width: '100%' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <label>Duration Hours</label>
                        <input type="number" value={stage.durationHours ?? 0} onChange={e=>{
                          const v = parseInt(e.target.value||0);
                          setStageSettings(s => s.map((st,i)=> i===idx ? {...st, durationHours: v} : st));
                        }} style={{ width: '100%' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 8 }}>
                  <button onClick={async ()=>{
                    if (!selected) return;
                    setUpdating(true);
                    try {
                      await saveStageSettings(selected.deviceId, stageSettings);
                      await fetch();
                      const updated = (await getTelemetries({ page, limit })).data.telemetry.find(x => x.deviceId === selected.deviceId);
                      setSelected(updated || null);
                    } catch (e) { console.error(e); }
                    setUpdating(false);
                  }} disabled={updating}>Save Stage Settings</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button onClick={closeView}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
