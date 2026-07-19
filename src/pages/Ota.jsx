import React, { useEffect, useState } from "react";
import { getUsers } from "../api/userApi";
import { updateFirmwareForDevice, uploadFirmwareFile } from "../api/deviceApi";

const OTA = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [version, setVersion] = useState("1.0.0");
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers({ page: 1, limit: 100, search: "" });
        const userList = response?.data?.users || [];
        setUsers(userList);
      } catch (error) {
        console.error("Failed to load users", error);
        setMessage("Unable to load users from the server.");
      }
    };

    loadUsers();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a firmware file before uploading.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const response = await uploadFirmwareFile(selectedFile);
      setUploadResult(response?.data || null);
      setMessage(`Firmware uploaded successfully: ${response?.data?.filename || selectedFile.name}`);
    } catch (error) {
      console.error("Firmware upload failed", error);
      setMessage(error?.response?.data?.error || "Firmware upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const toggleUserSelection = (user) => {
    const deviceId = user?.deviceId || "";
    if (!deviceId) {
      return;
    }

    setSelectedUsers((prev) => {
      const alreadySelected = prev.some((item) => item.deviceId === deviceId);
      if (alreadySelected) {
        return prev.filter((item) => item.deviceId !== deviceId);
      }

      return [...prev, user];
    });
  };

  const handleDeploy = async () => {
    if (!uploadResult) {
      setMessage("Upload a firmware file first.");
      return;
    }

    if (!selectedUsers.length) {
      setMessage("Select at least one user before deploying.");
      return;
    }

    setDeploying(true);
    setMessage("");

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL_HTTP).replace(/\/$/, "");
      const firmwareUrl = `${baseUrl}/file/${encodeURIComponent(uploadResult.filename)}`;

      const payload = {
        version: version || "1.0.0",
        url: firmwareUrl,
        size: uploadResult.size,
        sha256: uploadResult.sha256,
      };

      for (const user of selectedUsers) {
        const deviceId = user?.deviceId;
        if (!deviceId) continue;
        await updateFirmwareForDevice(deviceId, payload);
      }

      setMessage(`Firmware update sent to ${selectedUsers.length} device(s).`);
    } catch (error) {
      console.error("Firmware deployment failed", error);
      setMessage(error?.response?.data?.error || "Firmware deployment failed.");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "760px", margin: "0 auto" }}>
      <h2>OTA Firmware Update</h2>
      <p>Upload a firmware binary, choose the users whose devices should receive it, and deploy the update.</p>

      <div style={{ marginTop: "20px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
        <h3>1. Upload firmware</h3>
        <input
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          style={{ display: "block", marginBottom: "12px" }}
        />
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
          Version
          <input
            type="text"
            value={version}
            onChange={(event) => setVersion(event.target.value)}
            style={{ display: "block", width: "100%", marginTop: "6px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </label>
        <button onClick={handleUpload} disabled={uploading} style={{ padding: "8px 12px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" }}>
          {uploading ? "Uploading..." : "Upload firmware"}
        </button>

        {uploadResult && (
          <div style={{ marginTop: "12px", fontSize: "14px", color: "#1f2937" }}>
            <p style={{ margin: "4px 0" }}><strong>Filename:</strong> {uploadResult.filename}</p>
            <p style={{ margin: "4px 0" }}><strong>Size:</strong> {uploadResult.size}</p>
            <p style={{ margin: "4px 0" }}><strong>SHA256:</strong> {uploadResult.sha256}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
        <h3>2. Select users</h3>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff", textAlign: "left" }}
          >
            {selectedUsers.length > 0 ? `${selectedUsers.length} user(s) selected` : "Select users"}
          </button>

          {dropdownOpen && (
            <div style={{ marginTop: "8px", border: "1px solid #ddd", borderRadius: "6px", maxHeight: "220px", overflowY: "auto", background: "#fff", padding: "8px" }}>
              {users.length === 0 ? (
                <p style={{ margin: 0 }}>No users available.</p>
              ) : (
                users.map((user) => {
                  const deviceId = user?.deviceId || "";
                  const checked = selectedUsers.some((item) => item.deviceId === deviceId);

                  return (
                    <label key={user?.id || deviceId} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", cursor: deviceId ? "pointer" : "default" }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!deviceId}
                        onChange={() => toggleUserSelection(user)}
                      />
                      <span>
                        {user?.username || "Unknown user"} - {deviceId || "No device ID"}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: "16px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
        <h3>3. Deploy firmware</h3>
        <button
          onClick={handleDeploy}
          disabled={deploying || !uploadResult}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "none", background: deploying ? "#6b7280" : "#16a34a", color: "#fff", cursor: deploying ? "not-allowed" : "pointer" }}
        >
          {deploying ? "Deploying..." : "Send to selected devices"}
        </button>
      </div>

      {message && (
        <div style={{ marginTop: "16px", padding: "12px", borderRadius: "6px", background: message.includes("success") || message.includes("sent") ? "#ecfdf5" : "#fef2f2", color: message.includes("success") || message.includes("sent") ? "#166534" : "#991b1b" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default OTA;
