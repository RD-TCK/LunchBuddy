'use client';

import React, { useState } from 'react';
import { ResidentDto, MealPlan, ResidentStatus } from '@mealflow/types';

interface ResidentFormData {
  name: string;
  email: string;
  residentCode: string;
  mealPlan: MealPlan;
  status: ResidentStatus;
}

interface ResidentFormProps {
  initialData?: ResidentDto | null;
  onSubmit: (data: ResidentFormData) => Promise<void>;
  onCancel: () => void;
}

export function ResidentForm({ initialData, onSubmit, onCancel }: ResidentFormProps) {
  const [name, setName] = useState(initialData?.user?.name || '');
  const [email, setEmail] = useState(initialData?.user?.email || '');
  const [residentCode, setResidentCode] = useState(initialData?.residentCode || '');
  const [mealPlan, setMealPlan] = useState<MealPlan>(initialData?.mealPlan || MealPlan.STANDARD);
  const [status, setStatus] = useState<ResidentStatus>(initialData?.status || ResidentStatus.ACTIVE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        name,
        email,
        residentCode,
        mealPlan,
        status,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to save resident');
      } else {
        setError('Failed to save resident');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        {initialData ? 'Edit Resident' : 'Add New Resident'}
      </h3>
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            disabled={!!initialData}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Resident Code</label>
          <input
            type="text"
            value={residentCode}
            onChange={(e) => setResidentCode(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meal Plan</label>
          <select
            value={mealPlan}
            onChange={(e) => setMealPlan(e.target.value as MealPlan)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {Object.values(MealPlan).map((mp) => (
              <option key={mp} value={mp}>{mp}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ResidentStatus)}
            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {Object.values(ResidentStatus).map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
