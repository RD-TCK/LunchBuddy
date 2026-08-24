'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ComplaintDto, ComplaintStatus, ComplaintType } from '@mealflow/types';

const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  [ComplaintType.MISSING_MEAL]: '🚫 Missing Meal',
  [ComplaintType.WRONG_MEAL]: '❌ Wrong Meal',
  [ComplaintType.DAMAGED_PACKAGING]: '📦 Damaged Packaging',
  [ComplaintType.LATE_DELIVERY]: '⏰ Late Delivery',
  [ComplaintType.QUALITY]: '⚠️ Quality Issue',
  [ComplaintType.OTHER]: '💬 Other',
};

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: '#ef4444',
  [ComplaintStatus.ASSIGNED]: '#f59e0b',
  [ComplaintStatus.INVESTIGATING]: '#6366f1',
  [ComplaintStatus.RESOLVED]: '#22c55e',
};

export default function ComplaintsPage({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  const [complaints, setComplaints] = useState<ComplaintDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolveModal, setResolveModal] = useState<ComplaintDto | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'ALL'>('ALL');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}/complaints`);
      if (!res.ok) throw new Error('Failed to fetch complaints');
      setComplaints(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleResolve = async (complaintId: string) => {
    const res = await fetch(`/api/properties/${propertyId}/complaints/${complaintId}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: ComplaintStatus.RESOLVED,
        resolutionNotes,
      }),
    });
    if (res.ok) {
      setResolveModal(null);
      setResolutionNotes('');
      fetchComplaints();
    }
  };

  const filtered = statusFilter === 'ALL'
    ? complaints
    : complaints.filter((c) => c.status === statusFilter);

  const counts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div style={styles.loading}>Loading complaints…</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📋 Complaints</h1>
          <p style={styles.subtitle}>Manage and resolve resident complaints</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | 'ALL')}
          style={styles.filterInput}
        >
          <option value="ALL">All Statuses</option>
          {Object.values(ComplaintStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Stats */}
      <div style={styles.statsRow}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} style={styles.statCard}>
            <div style={{ ...styles.statDot, background: color }} />
            <div>
              <div style={styles.statNum}>{counts[status] || 0}</div>
              <div style={styles.statLabel}>{status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎉</div>
          <h3 style={styles.emptyTitle}>No complaints!</h3>
          <p style={styles.emptyText}>All residents are happy</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((complaint) => (
            <div key={complaint.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardLeft}>
                  <span style={styles.typeLabel}>
                    {COMPLAINT_TYPE_LABELS[complaint.type]}
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    background: STATUS_COLORS[complaint.status] + '22',
                    color: STATUS_COLORS[complaint.status],
                    border: `1px solid ${STATUS_COLORS[complaint.status]}44`,
                  }}>
                    {complaint.status}
                  </span>
                </div>
                <div style={styles.cardDate}>
                  {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <p style={styles.description}>{complaint.description}</p>

              <div style={styles.cardMeta}>
                <div style={styles.metaItem}>
                  <span style={styles.metaIcon}>👤</span>
                  {complaint.resident?.user?.name || 'Unknown Resident'}
                </div>
                {complaint.meal && (
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>🍽️</span>
                    {complaint.meal.booking?.menu?.title || 'Unknown Meal'}
                  </div>
                )}
              </div>

              {complaint.resolutionNotes && (
                <div style={styles.resolutionBox}>
                  <strong style={styles.resolutionLabel}>Resolution:</strong>
                  <span style={styles.resolutionText}> {complaint.resolutionNotes}</span>
                </div>
              )}

              {complaint.status !== ComplaintStatus.RESOLVED && (
                <button
                  onClick={() => { setResolveModal(complaint); setResolutionNotes(''); }}
                  style={styles.btnResolve}
                >
                  ✅ Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Resolve Complaint</h3>
            <p style={styles.modalDesc}>{resolveModal.description}</p>
            <label style={styles.label}>Resolution Notes</label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={3}
              placeholder="Describe how this was resolved…"
              style={styles.textarea}
            />
            <div style={styles.modalActions}>
              <button onClick={() => setResolveModal(null)} style={styles.btnCancel}>Cancel</button>
              <button onClick={() => handleResolve(resolveModal.id)} style={styles.btnPrimary}>Resolve</button>
            </div>
          </div>
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
  filterInput: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.88rem', outline: 'none' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)', color: '#fff', fontSize: '1.2rem' },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const },
  statCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0, 31, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.75rem 1.25rem' },
  statDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  statNum: { fontSize: '1.4rem', fontWeight: 700, color: '#fff' },
  statLabel: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: 'rgba(0, 31, 84, 0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  typeLabel: { color: '#fff', fontWeight: 600, fontSize: '0.95rem' },
  statusBadge: { padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 },
  cardDate: { color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' },
  description: { color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 },
  cardMeta: { display: 'flex', gap: '1.25rem', flexWrap: 'wrap' as const },
  metaItem: { display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' },
  metaIcon: { fontSize: '0.85rem' },
  resolutionBox: { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.85rem' },
  resolutionLabel: { color: '#86efac' },
  resolutionText: { color: 'rgba(255,255,255,0.7)' },
  btnResolve: { background: 'rgba(34,197,94,0.15)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', alignSelf: 'flex-start' as const },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#0B1325', border: '1px solid rgba(255, 153, 51, 0.3)', borderRadius: '20px', padding: '2rem', width: '90%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  modalTitle: { color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: 0 },
  modalDesc: { color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', margin: 0 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 500 },
  textarea: { background: 'rgba(10, 17, 40, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const, resize: 'vertical' as const },
  modalActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  btnPrimary: { background: 'linear-gradient(135deg, #FF9933, #FF5500)', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  btnCancel: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' },
  emptyState: { textAlign: 'center' as const, padding: '4rem 2rem', color: 'rgba(255,255,255,0.5)' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { color: '#fff', fontSize: '1.25rem', margin: '0 0 0.5rem' },
  emptyText: { fontSize: '0.9rem', margin: 0 },
};
