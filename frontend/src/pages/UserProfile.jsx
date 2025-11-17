
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const formatDateTime = (d) => {
  try {
    const date = typeof d === 'string' ? new Date(d) : d;
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(date);
  } catch {
    return String(d);
  }
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #eee' }}>
    <div style={{ width: 160, color: '#6B7280', fontWeight: 500 }}>{label}</div>
    <div style={{ color: '#111827' }}>{value ?? '-'}</div>
  </div>
);

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/auth/login-history');
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError(e.message || 'Failed to load login history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!user) return null;

  return (
    <div className="page-wrapper" style={{ padding: 16 }}>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>User Profile</h2>
      <p style={{ color: '#6B7280', marginBottom: 20 }}>Your account information and recent login activity.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, marginBottom: 12 }}>Profile</h3>
          <InfoRow label="Employee ID" value={user.employeeId} />
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Department" value={user.department} />
          <InfoRow label="Role" value={user.role} />
          {user.email && <InfoRow label="Email" value={user.email} />}
          {user.createdAt && <InfoRow label="Created" value={formatDateTime(user.createdAt)} />}
          {user.updatedAt && <InfoRow label="Updated" value={formatDateTime(user.updatedAt)} />}
        </section>

        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Login History</h3>
            {!loading && (
              <span style={{ color: '#6B7280', fontSize: 12 }}>{history.length} records</span>
            )}
          </div>
          {loading ? (
            <div style={{ padding: '16px 0', color: '#6B7280' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: '16px 0', color: '#B91C1C' }}>{error}</div>
          ) : history.length === 0 ? (
            <div style={{ padding: '16px 0', color: '#6B7280' }}>No login activity yet.</div>
          ) : (
            <ol style={{ marginTop: 12, paddingLeft: 20 }}>
              {history.map((ts, idx) => (
                <li key={idx} style={{ padding: '6px 0' }}>{formatDateTime(ts)}</li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
