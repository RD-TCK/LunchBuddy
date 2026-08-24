'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserDto, OrganizationDto, PropertyDto } from '@mealflow/types';

export default function PropertiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserDto | null>(null);
  const [organization, setOrganization] = useState<OrganizationDto | null>(null);
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [orgName, setOrgName] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrgDetails = useCallback(async (orgId: string) => {
    try {
      const res = await fetch(`/api/organizations/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        setOrganization(data);
      }
    } catch (err) {
      console.error('Error fetching organization:', err);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setTimeout(() => {
        setUser(parsedUser);
        if (parsedUser.organizationId) {
          fetchOrgDetails(parsedUser.organizationId);
          fetchProperties();
        }
      }, 0);
    } else {
      router.push('/login');
    }
  }, [router, fetchOrgDetails, fetchProperties]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create organization');
      }

      setOrganization(data);
      if (user) {
        const updatedUser = { ...user, organizationId: data.id };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setOrgName('');
      fetchProperties();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!organization) {
      setError('You must create an organization first');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: propertyName,
          address: propertyAddress,
          city: propertyCity,
          timezone: 'Asia/Kolkata',
          organizationId: organization.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create property');
      }

      setProperties([...properties, data]);
      setPropertyName('');
      setPropertyAddress('');
      setPropertyCity('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1128] via-[#001F54] to-[#0A1128] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="w-10 h-10 bg-[#0A1128] hover:bg-[#0A1128]/80 border border-white/10 hover:border-[#FF9933]/30 rounded-xl flex items-center justify-center transition-all cursor-pointer">
              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <span className="text-2xl font-extrabold tracking-tight">Organization & Properties</span>
          </div>
          <span className="text-sm bg-[#001F54]/50 px-3 py-1 rounded-full border border-white/10 text-slate-400">
            Role: <span className="text-[#FF9933] font-bold uppercase">{user?.role}</span>
          </span>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-sm flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* 1. Setup Organization if not exists */}
        {!organization ? (
          <div className="max-w-md mx-auto bg-[#001F54]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FF9933]/10 rounded-full blur-2xl pointer-events-none"></div>
            <h2 className="text-xl font-bold mb-2">Create your Organization</h2>
            <p className="text-sm text-slate-450 mb-6">Initialize your SaaS tenant settings by naming your Organization.</p>
            
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My PG Accommodations"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-[#0A1128] border border-white/10 focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933]/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-650 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF9933] to-[#FF5500] hover:from-[#FFB05B] hover:to-[#FF6F1C] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-[#FF9933]/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Organization & Add Property Forms */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 bg-[#001F54]/20 border border-white/10 rounded-2xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tenant Scope</h3>
                <h2 className="text-xl font-extrabold text-slate-100 mb-1">{organization.name}</h2>
                <span className="text-xs text-slate-500">ID: {organization.id}</span>
              </div>

              <div className="p-6 bg-[#001F54]/40 border border-white/10 rounded-2xl relative overflow-hidden">
                <h3 className="text-lg font-bold mb-4">Add Property</h3>
                <form onSubmit={handleCreateProperty} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1">Property Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pari Chowk Boys Hostel"
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className="w-full bg-[#0A1128] border border-white/10 focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933]/50 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-650 transition-all outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1">Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Knowledge Park III"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      className="w-full bg-[#0A1128] border border-white/10 focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933]/50 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-650 transition-all outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Greater Noida"
                      value={propertyCity}
                      onChange={(e) => setPropertyCity(e.target.value)}
                      className="w-full bg-[#0A1128] border border-white/10 focus:border-[#FF9933] focus:ring-1 focus:ring-[#FF9933]/50 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-650 transition-all outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A1128] hover:bg-[#0A1128]/85 border border-white/10 hover:border-[#FF9933]/30 text-slate-200 font-bold py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer text-sm"
                  >
                    {loading ? 'Adding...' : 'Add Property'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Properties list */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold">Properties ({properties.length})</h2>
              
              {properties.length === 0 ? (
                <div className="p-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                  <svg className="w-12 h-12 mb-4 text-slate-655" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>No properties registered yet. Create your first property!</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((prop) => (
                    <div key={prop.id} className="p-6 bg-[#001F54]/30 border border-white/10 hover:border-[#FF9933]/40 rounded-2xl transition-all shadow-sm">
                      <h3 className="text-lg font-bold text-slate-100 mb-2">{prop.name}</h3>
                      <div className="space-y-1 text-sm text-slate-400 mb-4">
                        <p className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {prop.address || 'No address'}, {prop.city || 'No city'}
                        </p>
                        <p className="text-xs text-slate-650 font-mono mt-1">ID: {prop.id}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: '👥 Residents', href: `/properties/${prop.id}/residents` },
                          { label: '🍽️ Menus', href: `/properties/${prop.id}/menus` },
                          { label: '📋 Bookings', href: `/properties/${prop.id}/bookings` },
                          { label: '🍳 Kitchen', href: `/properties/${prop.id}/kitchen` },
                          { label: '🚚 Delivery', href: `/properties/${prop.id}/delivery` },
                          { label: '📣 Complaints', href: `/properties/${prop.id}/complaints` },
                        ].map(({ label, href }) => (
                          <a
                            key={href}
                            href={href}
                            className="text-center text-xs font-semibold py-2 px-1 bg-[#0A1128]/70 hover:bg-[#0A1128] border border-white/10 hover:border-[#FF9933]/50 rounded-xl text-slate-300 hover:text-white transition-all"
                          >
                            {label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
