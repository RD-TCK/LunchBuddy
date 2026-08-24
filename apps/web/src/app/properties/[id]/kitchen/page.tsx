'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MealDto, MealStatus, MealType } from '@mealflow/types';

const STATUS_COLORS: Record<string, string> = {
  BOOKED: '#6366f1',
  PREPARING: '#f59e0b',
  PACKED: '#22c55e',
  ASSIGNED: '#06b6d4',
  DISPATCHED: '#8b5cf6',
  DELIVERED: '#10b981',
  CONFIRMED: '#059669',
  DISPUTED: '#ef4444',
  INVESTIGATING: '#f97316',
  RESOLVED: '#6b7280',
  CANCELLED: '#374151',
};

export default function KitchenPage({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  const [meals, setMeals] = useState<MealDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealTypeFilter, setMealTypeFilter] = useState<MealType | 'ALL'>('ALL');
  const [processing, setProcessing] = useState(false);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}/meals`);
      if (!res.ok) throw new Error('Failed to fetch meals');
      setMeals(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  const filteredMeals = meals.filter((m) => {
    const mealDate = new Date(m.createdAt).toISOString().split('T')[0];
    const matchDate = mealDate === date;
    const matchType = mealTypeFilter === 'ALL' || m.booking?.menu?.type === mealTypeFilter;
    return matchDate && matchType;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (status: MealStatus) => {
    const ids = filteredMeals.filter((m) => m.status === status).map((m) => m.id);
    setSelected(new Set(ids));
  };

  const batchAction = async (endpoint: 'start-preparing' | 'mark-packed') => {
    if (selected.size === 0) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}/kitchen/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealIds: Array.from(selected) }),
      });
      if (!res.ok) throw new Error('Action failed');
      setSelected(new Set());
      fetchMeals();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setProcessing(false);
    }
  };

  const byStatus = filteredMeals.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div style={styles.loading}>Loading kitchen dashboard…</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🍳 Kitchen Dashboard</h1>
          <p style={styles.subtitle}>Manage meal preparation and packing</p>
        </div>
        <div style={styles.filters}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.filterInput}
          />
          <select
            value={mealTypeFilter}
            onChange={(e) => setMealTypeFilter(e.target.value as MealType | 'ALL')}
            style={styles.filterInput}
          >
            <option value="ALL">All Types</option>
            <option value={MealType.LUNCH}>Lunch</option>
            <option value={MealType.DINNER}>Dinner</option>
          </select>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Stats Row */}
      <div style={styles.statsRow}>
        {Object.entries(byStatus).map(([status, count]) => (
          <div key={status} style={styles.statCard}>
            <div style={{ ...styles.statDot, background: STATUS_COLORS[status] || '#6b7280' }} />
            <div>
              <div style={styles.statNum}>{count}</div>
              <div style={styles.statLabel}>{status}</div>
            </div>
          </div>
        ))}
        {Object.keys(byStatus).length === 0 && (
          <div style={styles.emptyText}>No meals for this date</div>
        )}
      </div>

      {/* Batch Actions */}
      {selected.size > 0 && (
        <div style={styles.batchBar}>
          <span style={styles.batchCount}>{selected.size} meals selected</span>
          <div style={styles.batchActions}>
            <button
              onClick={() => batchAction('start-preparing')}
              disabled={processing}
              style={styles.btnYellow}
            >
              {processing ? 'Working…' : '🔥 Start Preparing'}
            </button>
            <button
              onClick={() => batchAction('mark-packed')}
              disabled={processing}
              style={styles.btnGreen}
            >
              {processing ? 'Working…' : '📦 Mark Packed'}
            </button>
            <button onClick={() => setSelected(new Set())} style={styles.btnCancel}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Quick select buttons */}
      <div style={styles.quickSelect}>
        <button onClick={() => selectAll(MealStatus.BOOKED)} style={styles.btnSmall}>Select All BOOKED</button>
        <button onClick={() => selectAll(MealStatus.PREPARING)} style={styles.btnSmall}>Select All PREPARING</button>
      </div>

      {/* Meals Table */}
      <div style={styles.tableWrapper}>
        {filteredMeals.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🍽️</div>
            <h3 style={styles.emptyTitle}>No meals found</h3>
            <p style={styles.emptyText}>Generate meals from bookings first</p>
          </div>
        ) : (
          filteredMeals.map((meal) => (
            <div
              key={meal.id}
              style={{
                ...styles.mealRow,
                ...(selected.has(meal.id) ? styles.mealRowSelected : {}),
              }}
              onClick={() => toggleSelect(meal.id)}
            >
              <div style={styles.mealCheckbox}>
                <div style={{
                  ...styles.checkbox,
                  ...(selected.has(meal.id) ? styles.checkboxChecked : {}),
                }}>
                  {selected.has(meal.id) && '✓'}
                </div>
              </div>
              <div style={styles.mealInfo}>
                <div style={styles.mealName}>
                  {meal.resident?.user?.name || 'Unknown Resident'}
                </div>
                <div style={styles.mealSub}>
                  Room {meal.room?.roomNumber || 'N/A'} •{' '}
                  {meal.booking?.menu?.title || 'No menu'}
                </div>
              </div>
              <div style={styles.mealMeta}>
                <span style={{
                  ...styles.statusBadge,
                  background: STATUS_COLORS[meal.status] + '22',
                  color: STATUS_COLORS[meal.status] || '#6b7280',
                  border: `1px solid ${STATUS_COLORS[meal.status]}44`,
                }}>
                  {meal.status}
                </span>
                <span style={styles.qrHint}>QR: {meal.qrToken.slice(0, 8)}…</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)', padding: '2rem', fontFamily: "'Inter', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 },
  subtitle: { color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0', fontSize: '0.95rem' },
  filters: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  filterInput: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.88rem', outline: 'none' },
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)', color: '#fff', fontSize: '1.2rem' },
  error: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const },
  statCard: { display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0, 31, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.75rem 1.25rem' },
  statDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  statNum: { fontSize: '1.4rem', fontWeight: 700, color: '#fff' },
  statLabel: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const },
  batchBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 153, 51, 0.15)', border: '1px solid rgba(255, 153, 51, 0.3)', borderRadius: '12px', padding: '0.75rem 1.25rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' },
  batchCount: { color: '#FFB05B', fontWeight: 600 },
  batchActions: { display: 'flex', gap: '0.5rem' },
  btnYellow: { background: '#FF9933', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  btnGreen: { background: '#22c55e', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  btnCancel: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' },
  quickSelect: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  btnSmall: { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)', padding: '0.35rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 },
  tableWrapper: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  mealRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', background: 'rgba(0, 31, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s' },
  mealRowSelected: { background: 'rgba(255, 153, 51, 0.12)', border: '1px solid rgba(255, 153, 51, 0.3)' },
  mealCheckbox: { flexShrink: 0 },
  checkbox: { width: '20px', height: '20px', borderRadius: '5px', border: '2px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 700 },
  checkboxChecked: { background: '#FF9933', borderColor: '#FF9933' },
  mealInfo: { flex: 1, minWidth: 0 },
  mealName: { color: '#fff', fontWeight: 600, fontSize: '0.92rem' },
  mealSub: { color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginTop: '0.1rem' },
  mealMeta: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 },
  statusBadge: { padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 },
  qrHint: { color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontFamily: 'monospace' },
  emptyState: { textAlign: 'center' as const, padding: '3rem 2rem', color: 'rgba(255,255,255,0.5)' },
  emptyIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  emptyTitle: { color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem' },
  emptyText: { fontSize: '0.88rem', margin: 0, color: 'rgba(255,255,255,0.5)' },
};
