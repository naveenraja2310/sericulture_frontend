# Sericulture IoT - React PWA Frontend

A progressive web app for real-time monitoring and control of sericulture IoT devices.

## Features

✅ Mobile App UI
✅ PWA Installable
✅ Auto Refresh Dashboard
✅ Toggle Devices
✅ Update Thresholds
✅ AUTO / MANUAL Mode Switch
✅ Production Ready Structure
✅ Toast Notifications
✅ Loader Screen
✅ Responsive Mobile Layout
✅ API Integration
✅ Separate API Layer
✅ Clean Component Architecture
✅ Real-time Refresh Every 5 Seconds

## Installation

```bash
cd frontend
npm install
```

## Environment Setup

Create a `.env` file with the API endpoint:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Development

```bash
npm run dev
```

The app will run at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Install as PWA on Mobile

1. Open on mobile Chrome: `http://YOUR_PC_IP:5173`
2. Tap Chrome menu → "Add to Home Screen"
3. It will work like a native mobile app

## Project Structure

```
src/
├── api/
│   └── deviceApi.js        # API integration layer
├── components/
│   ├── Header.jsx          # Dashboard header
│   ├── Login.jsx           # Login component
│   ├── StatusCard.jsx      # Display status values
│   ├── ToggleCard.jsx      # Toggle devices
│   ├── ThresholdCard.jsx   # Set thresholds
│   └── Loader.jsx          # Loading spinner
├── pages/
│   └── Dashboard.jsx       # Main dashboard page
├── App.jsx                 # Main app component
├── main.jsx                # React entry point
└── index.css               # Global styles
```

## Device API Endpoints

- `GET /device/{DEVICE_ID}/status` - Get device status
- `POST /device/{DEVICE_ID}/{device}/{action}` - Toggle device (motor, fan, heater)
- `POST /device/{DEVICE_ID}/mode/{mode}` - Set mode (auto/manual)
- `POST /device/{DEVICE_ID}/temp-threshold` - Set temperature threshold
- `POST /device/{DEVICE_ID}/hum-threshold` - Set humidity threshold
- `POST /device/{DEVICE_ID}/fan-cycle` - Set fan cycle time

## Device ID

The app is configured for device: `YADH-B4ACF589`

Edit `src/api/deviceApi.js` to change the device ID.
