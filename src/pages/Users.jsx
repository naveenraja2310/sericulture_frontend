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
    if (!window.confirm("Delete user?")) return;
    try {
      await deleteUser(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="users-page">

      {/* ── Header ── */}
      <div className="users-header">
        <div>
          <p className="section-label" style={{ margin: 0 }}>Admin</p>
          <h2 className="users-title">
            <i className="ti ti-users" aria-hidden="true" />
            Users
          </h2>
        </div>
        <button className="users-add-btn" onClick={openModal}>
          <i className="ti ti-plus" aria-hidden="true" />
          Add User
        </button>
      </div>

      {/* ── Table card ── */}
      {loading ? (
        <div className="loader-container" style={{ height: 200 }}>
          <div className="loader" />
          <p className="loader-text">Loading users…</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="users-table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th><i className="ti ti-user" aria-hidden="true" /> Username</th>
                  {/* <th><i className="ti ti-lock" aria-hidden="true" /> Password</th> */}
                  <th><i className="ti ti-cpu" aria-hidden="true" /> Device ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="users-empty">
                      <i className="ti ti-users-off" aria-hidden="true" />
                      No users found
                    </td>
                  </tr>
                ) : users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="users-avatar-row">
                        <div className="users-avatar">
                          {(u.username?.[0] || "U").toUpperCase()}
                        </div>
                        {u.username}
                      </div>
                    </td>
                    {/* <td>
                      <span className="users-password-mask">••••••••</span>
                    </td> */}
                    <td>
                      <span className="users-device-id">
                        <i className="ti ti-hash" aria-hidden="true" />
                        {u.deviceId || <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </span>
                    </td>
                    <td>
                      <div className="users-actions">
                        <button className="users-btn-edit" onClick={() => handleEdit(u)} aria-label="Edit user">
                          <i className="ti ti-edit" aria-hidden="true" />
                          Edit
                        </button>
                        <button className="users-btn-delete" onClick={() => handleDelete(u.id)} aria-label="Delete user">
                          <i className="ti ti-trash" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div className="users-pagination">
            <span className="users-count">
              {total} user{total !== 1 ? "s" : ""} total
            </span>
            <div className="users-page-controls">
              <button
                className="users-page-btn"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <i className="ti ti-chevron-left" aria-hidden="true" />
              </button>
              <span className="users-page-label">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                className="users-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                aria-label="Next page"
              >
                <i className="ti ti-chevron-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-icon">
                  <i className={`ti ${editingId ? "ti-edit" : "ti-user-plus"}`} aria-hidden="true" />
                </div>
                <div>
                  <h3>{editingId ? "Update User" : "Add User"}</h3>
                  <p>{editingId ? "Edit user details below" : "Fill in the details to create a new user"}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal} aria-label="Close modal">
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="modal-field">
                  <label htmlFor="u-username">Username</label>
                  <div className="modal-input-wrap">
                    <i className="ti ti-user" aria-hidden="true" />
                    <input
                      id="u-username"
                      type="text"
                      placeholder="Enter username"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="modal-field">
                  <label htmlFor="u-password">Password</label>
                  <div className="modal-input-wrap">
                    <i className="ti ti-lock" aria-hidden="true" />
                    <input
                      id="u-password"
                      type="text"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="modal-field">
                  <label htmlFor="u-device">Device ID <span className="modal-optional">optional</span></label>
                  <div className="modal-input-wrap">
                    <i className="ti ti-cpu" aria-hidden="true" />
                    <input
                      id="u-device"
                      type="text"
                      placeholder="Enter device ID"
                      value={form.deviceId}
                      onChange={e => setForm({ ...form, deviceId: e.target.value })}
                    />
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn-submit">
                  <i className={`ti ${editingId ? "ti-check" : "ti-user-plus"}`} aria-hidden="true" />
                  {editingId ? "Update User" : "Create User"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Users;