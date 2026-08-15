'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getDb } from '@/lib/db';

export default async function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch companies for filter dropdown
  const [companies, setCompanies] = useState<any[]>([]);
  
  useEffect(() => {
    fetchPatients();
    fetchCompanies();
  }, [search, selectedCompany]);
  
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCompany) params.append('companyId', selectedCompany);
      
      const response = await fetch(`/api/patients?${params.toString()}`);
      const data = await response.json();
      setPatients(data.patients);
    } catch (error) {
      console.error('Fetch patients error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Fetch companies error:', error);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Patient Management
        </h1>
        <div className="flex space-x-3">
          <Link href="/dashboard/patients/new" className="button-accent">
            Add New Patient
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2 w-full max-w-xs">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, IC, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full"
          />
        </div>
        
        <div className="flex-1 md:w-auto">
          <select
            value={selectedCompany ?? ''}
            onChange={(e) => setSelectedCompany(e.target.value || null)}
            className="w-full select"
          >
            <option value="">All Organizations</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="washi-card">
        {loading ? (
          <div className="text-center py-12">
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients found.</p>
            {search || selectedCompany ? (
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCompany(null);
                }}
                className="button-secondary mt-4"
              >
                Reset Filters
              </button>
            ) : (
              <Link href="/dashboard/patients/new" className="button mt-4">
                Add First Patient
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                    IC Number
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                    Age
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                    Organization
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">
                    Last Assessment
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {patients.map(patient => (
                  <tr key={patient.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 text-left font-medium">
                      {patient.full_name}
                    </td>
                    <td className="px-6 py-4 text-left font-mono text-sm">
                      {patient.ic_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-left text-sm">
                      {patient.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-left text-sm">
                      {patient.age || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-left text-sm">
                      {patient.company_name || 'Independent'}
                    </td>
                    <td className="px-6 py-4 text-left text-sm">
                      {/* This would come from a separate query in a real app */}
                      <span className="hanko-badge px-2 py-1 text-xs">
                        Recent
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Link 
                        href={`/dashboard/patients/${patient.id}`} 
                        className="button-secondary h-9 px-3"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}