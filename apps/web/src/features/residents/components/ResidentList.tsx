'use client';

import React from 'react';
import { ResidentDto } from '@mealflow/types';

interface ResidentListProps {
  residents: ResidentDto[];
  onEdit: (resident: ResidentDto) => void;
  onDelete: (id: string) => void;
}

export function ResidentList({ residents, onEdit, onDelete }: ResidentListProps) {
  if (residents.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
        No residents found for this property. Add some residents to get started.
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {residents.map((resident) => (
          <li key={resident.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-600 truncate">
                  {resident.user?.name || resident.user?.email || 'Unknown Resident'}
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                  <span>Code: {resident.residentCode || 'N/A'}</span>
                  <span>Room: {resident.room?.roomNumber || 'Unassigned'}</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    resident.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {resident.status}
                  </span>
                  <span>Plan: {resident.mealPlan}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(resident)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(resident.id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
