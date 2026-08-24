'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { MenuDto, BookingDto, MealType, BookingStatus } from '@mealflow/types';

export default function BookingsPage({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [menusRes, bookingsRes] = await Promise.all([
        fetch(`/api/properties/${propertyId}/menus`),
        fetch(`/api/properties/${propertyId}/bookings`),
      ]);
      if (!menusRes.ok || !bookingsRes.ok) throw new Error('Failed to load data');
      const [m, b] = await Promise.all([menusRes.json(), bookingsRes.json()]);
      setMenus(m);
      setBookings(b);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusColor: Record<BookingStatus, string> = {
    [BookingStatus.BOOKED]: '#22c55e',
    [BookingStatus.SKIPPED]: '#f59e0b',
    [BookingStatus.CANCELLED]: '#ef4444',
    [BookingStatus.EXPIRED]: '#6b7280',
  };

  const bookingsForMenu = bookings.filter((b) => b.menuId === activeMenuId);

  if (loading) return <div style={styles.loading}>Loading bookings…</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Bookings</h1>
          <p style={styles.subtitle}>View resident meal bookings by menu</p>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.layout}>
        {/* Menu selector */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Menus</h3>
          {menus.length === 0 ? (
            <p style={styles.emptyText}>No menus found</p>
          ) : (
            menus.map((menu) => {
              const count = bookings.filter((b) => b.menuId === menu.id).length;
              const isActive = activeMenuId === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenuId(menu.id)}
                  style={{
                    ...styles.menuItem,
                    ...(isActive ? styles.menuItemActive : {}),
                  }}
                >
                  <div style={styles.menuItemType}>
                    <span style={{
                      ...styles.badge,
                      background: menu.type === MealType.LUNCH ? '#f59e0b' : '#6366f1',
                    }}>
                      {menu.type}
                    </span>
                  </div>
                  <div style={styles.menuItemInfo}>
                    <div style={styles.menuItemTitle}>{menu.title}</div>
                    <div style={styles.menuItemDate}>
                      {new Date(menu.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div style={styles.bookingCount}>{count}</div>
                </button>
              );
            })
          )}
        </div>

        {/* Bookings list */}
        <div style={styles.main}>
          {!activeMenuId ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <h3 style={styles.emptyTitle}>Select a menu</h3>
              <p style={styles.emptyText}>Choose a menu from the left to view bookings</p>
            </div>
          ) : bookingsForMenu.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🗒️</div>
              <h3 style={styles.emptyTitle}>No bookings yet</h3>
              <p style={styles.emptyText}>Residents haven&apos;t booked this menu yet</p>
            </div>
          ) : (
            <>
              <div style={styles.bookingStats}>
                {Object.values(BookingStatus).map((status) => {
                  const c = bookingsForMenu.filter((b) => b.status === status).length;
                  return (
                    <div key={status} style={styles.statCard}>
                      <span style={{ ...styles.statDot, background: statusColor[status] }} />
                      <div>
                        <div style={styles.statNum}>{c}</div>
                        <div style={styles.statLabel}>{status}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={styles.bookingList}>
                {bookingsForMenu.map((booking) => (
                  <div key={booking.id} style={styles.bookingRow}>
                    <div style={styles.bookingUser}>
                      <div style={styles.avatar}>
                        {booking.resident?.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={styles.residentName}>
                          {booking.resident?.user?.name || 'Unknown'}
                        </div>
                        <div style={styles.residentEmail}>
                          {booking.resident?.user?.email}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      background: statusColor[booking.status] + '22',
                      color: statusColor[booking.status],
                      border: `1px solid ${statusColor[booking.status]}44`,
                    }}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
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
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 },
  subtitle: { color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0', fontSize: '0.95rem' },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0A1128, #001F54, #0A1128)',
    color: '#fff',
    fontSize: '1.2rem',
  },
  error: {
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    color: '#f87171',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  layout: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' },
  sidebar: {
    background: 'rgba(0, 31, 84, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  sidebarTitle: { color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 0.75rem' },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '10px',
    background: 'transparent',
    border: '1px solid transparent',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
  },
  menuItemActive: {
    background: 'rgba(255, 153, 51, 0.15)',
    border: '1px solid rgba(255, 153, 51, 0.4)',
  },
  menuItemType: { flexShrink: 0 },
  menuItemInfo: { flex: 1, minWidth: 0 },
  menuItemTitle: { fontSize: '0.88rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  menuItemDate: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' },
  bookingCount: { background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '99px', padding: '0.1rem 0.55rem', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 },
  badge: { color: '#fff', padding: '0.15rem 0.55rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 700 },
  main: {
    background: 'rgba(0, 31, 84, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '1.5rem',
    minHeight: '400px',
  },
  emptyState: { textAlign: 'center' as const, padding: '4rem 2rem', color: 'rgba(255,255,255,0.5)' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { color: '#fff', fontSize: '1.1rem', margin: '0 0 0.5rem' },
  emptyText: { fontSize: '0.88rem', margin: 0, color: 'rgba(255,255,255,0.5)' },
  bookingStats: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(0, 31, 84, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
  },
  statDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  statNum: { fontSize: '1.25rem', fontWeight: 700, color: '#fff' },
  statLabel: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' as const },
  bookingList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  bookingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    background: 'rgba(0, 31, 84, 0.2)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  bookingUser: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF9933, #FF5500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    flexShrink: 0,
  },
  residentName: { color: '#fff', fontWeight: 500, fontSize: '0.92rem' },
  residentEmail: { color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' },
  statusBadge: { padding: '0.2rem 0.7rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 600 },
};
