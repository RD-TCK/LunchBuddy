'use client';

import React, { useRef, useState } from 'react';

interface ImportResidentsProps {
  onImport: (file: File) => Promise<void>;
  loading: boolean;
}

export function ImportResidents({ onImport, loading }: ImportResidentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      return;
    }

    setError(null);
    try {
      await onImport(file);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Import failed');
      } else {
        setError('Import failed');
      }
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="inline-block ml-3">
      <input
        type="file"
        accept=".csv"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="button"
        disabled={loading}
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:bg-gray-100"
      >
        {loading ? 'Importing...' : 'Import CSV'}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
