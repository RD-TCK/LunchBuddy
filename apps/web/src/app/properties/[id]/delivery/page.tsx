'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MealType } from '@mealflow/types';

interface Batch {
  id: string;
  date: string;
  type: MealType;
  status: string;
  assignedTo?: { id: string; name: string; email: string };
  meals: Array<{
    id: string;
    status: string;
    qrToken: string;
    resident?: { user?: { name?: string } };
    room?: { roomNumber: string };
  }>;
  createdAt: string;
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DeliveryPage({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  const [batches, setBatches] = useState<Batch[]>([]);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateBatch, setShowCreateBatch] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: MealType.LUNCH,
    assignedToId: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [batchesRes, staffRes] = await Promise.all([
        fetch(`/api/properties/${propertyId}/delivery/batches`),
        fetch(`/api/properties/${propertyId}/users?role=DELIVERY_STAFF`),
      ]);
      const batchData = batchesRes.ok ? await batchesRes.json() : [];
      const staffData = staffRes.ok ? await staffRes.json() : [];
      setBatches(Array.isArray(batchData) ? batchData : []);
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/properties/${propertyId}/delivery/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createForm),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.message || 'Failed to create batch');
      return;
    }
    setShowCreateBatch(false);
    setSuccess('Delivery batch created!');
    setTimeout(() => setSuccess(null), 3000);
    fetchData();
  };

  const handleDispatch = async (batchId: string) => {
    const res = await fetch(`/api/properties/${propertyId}/delivery/batches/${batchId}/dispatch`, {
      method: 'POST',
    });
    if (res.ok) {
      setSuccess('Batch dispatched!');
      setTimeout(() => setSuccess(null), 3000);
      fetchData();
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanResult(null);
    const res = await fetch(`/api/properties/${propertyId}/delivery/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrToken: qrInput }),
    });
    if (res.ok) {
      const meal = await res.json();
      setScanResult(`✅ Delivered to ${meal.resident?.user?.name || 'resident'} in Room ${meal.room?.roomNumber || 'N/A'}`);
      setQrInput('');
      fetchData();
    } else {
      const err = await res.json();
      setScanResult(`❌ ${err.message || 'Failed to deliver'}`);
    }
  };

  const batchStatusColor: Record<string, string> = {
    CREATED: '#6b7280',
    ASSIGNED: '#6366f1',
    DISPATCHED: '#f59e0b',
    COMPLETED: '#22c55e',
  };

  if (loading) return <div style={styles.loading}>Loading delivery dashboard…</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🚚 Delivery Dashboard</h1>
          <p style={styles.subtitle}>Manage delivery batches and QR scanning</p>
        </div>
        <button onClick={() => setShowCreateBatch(!showCreateBatch)} style={styles.btnPrimary}>
          + Create Batch
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.successMsg}>{success}</div>}

      {/* QR Scan Section */}
      <div style={styles.scanCard}>
        <h3 style={styles.scanTitle}>📱 QR Scan — Mark as Delivered</h3>
        <form onSubmit={handleScan} style={styles.scanForm}>
          <input
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="Paste or scan QR token here…"
            style={styles.scanInput}
            autoFocus
          />
          <button type="submit" style={styles.btnScan} disabled={!qrInput.trim()}>
            Deliver
          </button>
        </form>
        {scanResult && (
          <div style={{
            ...styles.scanResult,
            background: scanResult.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            borderColor: scanResult.startsWith('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
            color: scanResult.startsWith('✅') ? '#86efac' : '#f87171',
          }}>
            {scanResult}
          </div>
        )}
      </div>

      {/* Create Batch Form */}
      {showCreateBatch && (
        <div style={styles.formCard}>
          <h3 style={styles.cardTitle}>Create Delivery Batch</h3>
          <form onSubmit={handleCreateBatch} style={styles.form}>
            <div style={styles.formRow}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={createForm.date}
                onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Meal Type</label>
              <select
                value={createForm.type}
                onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as MealType })}
                style={styles.input}
              >
                <option value={MealType.LUNCH}>Lunch</option>
                <option value={MealType.DINNER}>Dinner</option>
              </select>
            </div>
            <div style={styles.formRow}>
              <label style={styles.label}>Assign to Delivery Staff</label>
              <select
                value={createForm.assignedToId}
                onChange={(e) => setCreateForm({ ...createForm, assignedToId: e.target.value })}
                required
                style={styles.input}
              >
                <option value="">Select staff…</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
                {staff.length === 0 && <option disabled>No delivery staff found</option>}
              </select>
            </div>
            <div style={styles.formActions}>
              <button type="button" onClick={() => setShowCreateBatch(false)} style={styles.btnSecondary}>Cancel</button>
              <button type="submit" style={styles.btnPrimary}>Create Batch</button>
            </div>
          </form>
        </div>
      )}

      {/* Batches List */}
      <h2 style={styles.sectionTitle}>Delivery Batches</h2>
      {batches.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <h3 style={styles.emptyTitle}>No batches yet</h3>
          <p style={styles.emptyText}>Create a batch to group meals for delivery</p>
        </div>
      ) : (
        <div style={styles.batchGrid}>
          {batches.map((batch) => (
            <div key={batch.id} style={styles.batchCard}>
              <div style={styles.batchHeader}>
                <div style={styles.batchMeta}>
                  <span style={{
                    ...styles.statusPill,
                    background: batchStatusColor[batch.status] + '22',
                    color: batchStatusColor[batch.status],
                    border: `1px solid ${batchStatusColor[batch.status]}44`,
                  }}>
                    {batch.status}
                  </span>
                  <span style={styles.batchType}>
                    {batch.type === MealType.LUNCH ? '☀️ Lunch' : '🌙 Dinner'}
                  </span>
                </div>
                <div style={styles.batchDate}>
                  {new Date(batch.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div style={styles.batchStats}>
                <div style={styles.batchStatItem}>
                  <span style={styles.batchStatNum}>{batch.meals.length}</span>
                  <span style={styles.batchStatLabel}>Total Meals</span>
                </div>
                <div style={styles.batchStatItem}>
                  <span style={styles.batchStatNum}>
                    {batch.meals.filter((m) => m.status === 'DELIVERED').length}
                  </span>
                  <span style={styles.batchStatLabel}>Delivered</span>
                </div>
              </div>
              {batch.assignedTo && (
                <div style={styles.assignedTo}>
                  👤 {batch.assignedTo.name}
                </div>
              )}
              {batch.status === 'ASSIGNED' && (
                <button onClick={() => handleDispatch(batch.id)} style={styles.btnDispatch}>
                  🚀 Dispatch Batch
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)', padding: '2rem', fontFamily: "'Inter', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 },
  subtitle: { color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0', fontSize: '0.95rem' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)', color: '#fff', fontSize: '1.2rem' },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
  successMsg: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
  scanCard: { background: 'rgba(0, 31, 84, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 153, 51, 0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' },
  scanTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem' },
  scanForm: { display: 'flex', gap: '0.75rem' },
  scanInput: { flex: 1, background: 'rgba(10, 17, 40, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '0.7rem 1rem', color: '#fff', fontSize: '0.95rem', outline: 'none' },
  btnScan: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' },
  scanResult: { marginTop: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid', fontWeight: 500 },
  formCard: { background: 'rgba(0, 31, 84, 0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' },
  cardTitle: { color: '#fff', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formRow: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 500 },
  input: { background: 'rgba(10, 17, 40, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' } as React.CSSProperties,
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  btnPrimary: { background: 'linear-gradient(135deg, #FF9933, #FF5500)', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  btnSecondary: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  sectionTitle: { color: '#fff', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 1rem' },
  batchGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  batchCard: { background: 'rgba(0, 31, 84, 0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  batchHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  batchMeta: { display: 'flex', gap: '0.5rem', alignItems: 'center' },
  batchDate: { color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' },
  batchType: { color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' },
  statusPill: { padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 },
  batchStats: { display: 'flex', gap: '1.5rem' },
  batchStatItem: { display: 'flex', flexDirection: 'column', gap: '0.1rem' },
  batchStatNum: { fontSize: '1.4rem', fontWeight: 700, color: '#fff' },
  batchStatLabel: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const },
  assignedTo: { color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem' },
  btnDispatch: { background: 'linear-gradient(135deg, #FF9933, #FF5500)', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', width: '100%', marginTop: 'auto' },
  emptyState: { textAlign: 'center' as const, padding: '3rem 2rem', color: 'rgba(255,255,255,0.5)' },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  emptyTitle: { color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem' },
  emptyText: { fontSize: '0.88rem', margin: 0, color: 'rgba(255,255,255,0.5)' },
};
