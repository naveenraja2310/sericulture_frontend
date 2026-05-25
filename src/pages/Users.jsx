import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", deviceId: "" });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, limit });
      if (res && res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users || []);
        setTotal(res.data.total_count || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page]);

  const openModal = () => {
    setEditingId(null);
    setForm({ username: "", password: "", deviceId: "" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({ username: "", password: "", deviceId: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, form);
      } else {
        await createUser(form);
      }
      closeModal();
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (u) => {
    setEditingId(u.id);
    setForm({ username: u.username || "", password: u.password || "", deviceId: u.deviceId || "" });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete user?')) return;
    try {
      await deleteUser(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Users</h2>
      <button onClick={openModal} style={{ marginBottom: 16 }}>Add User</button>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Username</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Password</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Device ID</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: '8px 4px' }}>{u.username}</td>
                  <td style={{ padding: '8px 4px' }}>{u.password}</td>
                  <td style={{ padding: '8px 4px' }}>{u.deviceId}</td>                  
                  <td style={{ padding: '8px 4px' }}>
                    <button onClick={() => handleEdit(u)}>Edit</button>
                    <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 8 }}>Delete</button>
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

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 10, width: '100%', maxWidth: 420, padding: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Update User' : 'Add User'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label>
                  Username
                  <input
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                    placeholder="Enter username"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Device ID
                  <input
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                    placeholder="Enter device ID"
                    value={form.deviceId}
                    onChange={e => setForm({ ...form, deviceId: e.target.value })}
                  />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={closeModal}>Cancel</button>
                  <button type="submit" style={{ padding: '8px 16px' }}>{editingId ? 'Update' : 'Create'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
