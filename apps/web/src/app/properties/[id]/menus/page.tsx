'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MenuDto, MealType } from '@mealflow/types';

interface MenuFormData {
  date: string;
  type: MealType;
  title: string;
  description: string;
}

interface MenuFormProps {
  propertyId: string;
  menu?: MenuDto;
  onSave: () => void;
  onCancel: () => void;
}

function MenuForm({ propertyId, menu, onSave, onCancel }: MenuFormProps) {
  const [form, setForm] = useState<MenuFormData>({
    date: menu?.date ? new Date(menu.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    type: menu?.type || MealType.LUNCH,
    title: menu?.title || '',
    description: menu?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const url = menu
      ? `/api/properties/${propertyId}/menus/${menu.id}`
      : `/api/properties/${propertyId}/menus`;
    const method = menu ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, propertyId }),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json();
      setError(err.message || 'Failed to save menu');
      return;
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.formTitle}>{menu ? 'Edit Menu' : 'Create Menu'}</h3>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.formRow}>
        <label style={styles.label}>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          style={styles.input}
        />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>Meal Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as MealType })}
          style={styles.input}
        >
          <option value={MealType.LUNCH}>Lunch</option>
          <option value={MealType.DINNER}>Dinner</option>
        </select>
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          placeholder="e.g. Monday Lunch Special"
          style={styles.input}
        />
      </div>
      <div style={styles.formRow}>
        <label style={styles.label}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Menu details, items included..."
          rows={3}
          style={{ ...styles.input, resize: 'vertical' }}
        />
      </div>
      <div style={styles.formActions}>
        <button type="button" onClick={onCancel} style={styles.btnSecondary}>
          Cancel
        </button>
        <button type="submit" disabled={loading} style={styles.btnPrimary}>
          {loading ? 'Saving...' : menu ? 'Update Menu' : 'Create Menu'}
        </button>
      </div>
    </form>
  );
}

export default function MenusPage({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuDto | null>(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}/menus`);
      if (!res.ok) throw new Error('Failed to fetch menus');
      setMenus(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { fetchMenus(); }, [fetchMenus]);

  const handleDelete = async (menuId: string) => {
    if (!confirm('Delete this menu?')) return;
    await fetch(`/api/properties/${propertyId}/menus/${menuId}`, { method: 'DELETE' });
    fetchMenus();
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingMenu(null);
    fetchMenus();
  };

  const mealTypeColor = (type: MealType) =>
    type === MealType.LUNCH ? '#f59e0b' : '#6366f1';

  if (loading) return <div style={styles.loading}>Loading menus…</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Menu Management</h1>
          <p style={styles.subtitle}>Manage daily meal menus for this property</p>
        </div>
        <button
          onClick={() => { setEditingMenu(null); setShowForm(true); }}
          style={styles.btnPrimary}
        >
          + Create Menu
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {(showForm || editingMenu) && (
        <div style={styles.formWrapper}>
          <MenuForm
            propertyId={propertyId}
            menu={editingMenu || undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingMenu(null); }}
          />
        </div>
      )}

      {menus.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🍽️</div>
          <h3 style={styles.emptyTitle}>No menus yet</h3>
          <p style={styles.emptyText}>Create your first menu to get started</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {menus.map((menu) => (
            <div key={menu.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span
                  style={{
                    ...styles.badge,
                    background: mealTypeColor(menu.type),
                  }}
                >
                  {menu.type}
                </span>
                <span style={styles.cardDate}>
                  {new Date(menu.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h3 style={styles.cardTitle}>{menu.title}</h3>
              {menu.description && (
                <p style={styles.cardDesc}>{menu.description}</p>
              )}
              <div style={styles.cardActions}>
                <button
                  onClick={() => { setEditingMenu(menu); setShowForm(false); }}
                  style={styles.btnSmallSecondary}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(menu.id)}
                  style={styles.btnSmallDanger}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)',
    padding: '2rem',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    margin: '0.25rem 0 0',
    fontSize: '0.95rem',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #FF9933, #FF5500)',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '0.75rem 1.5rem',
    borderRadius: '10px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  btnSmallSecondary: {
    background: 'rgba(255, 153, 51, 0.15)',
    color: '#FFB05B',
    border: '1px solid rgba(255, 153, 51, 0.3)',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
  btnSmallDanger: {
    background: 'rgba(239,68,68,0.15)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.3)',
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
  error: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)',
    color: '#fff',
    fontSize: '1.2rem',
  },
  formWrapper: {
    background: 'rgba(0, 31, 84, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 153, 51, 0.2)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formTitle: { color: '#fff', fontSize: '1.25rem', fontWeight: 600, margin: 0 },
  formRow: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 500 },
  input: {
    background: 'rgba(10, 17, 40, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '0.65rem 0.9rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'rgba(0, 31, 84, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    color: '#fff',
    padding: '0.2rem 0.7rem',
    borderRadius: '99px',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  cardDate: { color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' },
  cardTitle: { color: '#fff', fontSize: '1.05rem', fontWeight: 600, margin: 0 },
  cardDesc: { color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 },
  cardActions: { display: 'flex', gap: '0.5rem', marginTop: 'auto' },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem 2rem',
    color: 'rgba(255,255,255,0.5)',
  },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { color: '#fff', fontSize: '1.25rem', margin: '0 0 0.5rem' },
  emptyText: { fontSize: '0.9rem', margin: 0 },
};
