'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResidentDto, MealPlan, ResidentStatus } from '@mealflow/types';
import { ResidentList } from '../../../../features/residents/components/ResidentList';
import { ResidentForm } from '../../../../features/residents/components/ResidentForm';
import { ImportResidents } from '../../../../features/residents/components/ImportResidents';

export default function ResidentsPage({ params }: { params: { id: string } }) {
  const propertyId = params.id;
  const router = useRouter();
  const [residents, setResidents] = useState<ResidentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [editingResident, setEditingResident] = useState<ResidentDto | null>(null);

  const fetchResidents = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/residents`);
      if (!res.ok) throw new Error('Failed to fetch residents');
      const data = await res.json();
      setResidents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResidents();
  }, [fetchResidents]);

  const handleSaveResident = async (data: {
    name: string;
    email: string;
    residentCode: string;
    mealPlan: MealPlan;
    status: ResidentStatus;
  }) => {
    const url = editingResident 
      ? `/api/residents/${editingResident.id}`
      : `/api/properties/${propertyId}/residents`;
    const method = editingResident ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to save resident');
    }

    setShowForm(false);
    setEditingResident(null);
    fetchResidents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this resident?')) return;
    try {
      const res = await fetch(`/api/residents/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete resident');
      fetchResidents();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const residentsData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => { row[h] = values[i] });
        return {
          name: row.name,
          email: row.email,
          residentCode: row.residentcode || row.code,
          mealPlan: row.mealplan || 'STANDARD',
        };
      });

      const res = await fetch(`/api/properties/${propertyId}/residents/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ residents: residentsData }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Import failed');
      }

      alert(`Successfully imported residents.`);
      fetchResidents();
    } catch (err: unknown) {
      if (err instanceof Error) alert(`Import error: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  if (loading) return <div className="p-8">Loading residents...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1128] via-[#001F54] to-[#0A1128] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
              Residents Management
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage residents and meal plans for property {propertyId}.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
            <button
              onClick={() => {
                setEditingResident(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-[#FF9933] to-[#FF5500] hover:from-[#FFB05B] hover:to-[#FF6F1C] cursor-pointer transition-all focus:outline-none"
            >
              Add Resident
            </button>
            <ImportResidents onImport={handleImport} loading={importing} />
            <button
              onClick={() => router.push(`/properties`)}
              className="inline-flex items-center px-4 py-2 border border-white/10 rounded-xl shadow-sm text-sm font-semibold text-slate-350 bg-[#0A1128] hover:bg-[#0A1128]/80 hover:border-[#FF9933]/30 cursor-pointer transition-all focus:outline-none"
            >
              Back to Properties
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {showForm ? (
          <ResidentForm 
            initialData={editingResident} 
            onSubmit={handleSaveResident} 
            onCancel={() => { setShowForm(false); setEditingResident(null); }} 
          />
        ) : (
          <ResidentList 
            residents={residents} 
            onEdit={(r) => { setEditingResident(r); setShowForm(true); }} 
            onDelete={handleDelete} 
          />
        )}
      </div>
    </div>
  );
}
