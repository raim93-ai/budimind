'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PatientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [patientId, setPatientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const method = email ? 'email' : 'patientId';
      const value = email || patientId;

      const response = await fetch('/api/patient/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [method]: value }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store patient token in cookie and redirect to dashboard
        document.cookie = `patient_token=${result.token}; path=/; max-age=86400; SameSite=Strict`;
        router.push('/patient/dashboard');
      } else {
        setError(result.error || 'Patient not found');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 washi-paper">
      <div className="w-full max-w-md washi-card p-8 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block hanko-badge px-3 py-1 text-xs mb-3">
            Patient Portal
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Access Your Mental Health Dashboard
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            Enter your email or patient ID to view your assessment history and
            track your wellness journey over time.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLookup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">
                OR
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID</Label>
            <Input
              id="patientId"
              type="text"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={isLoading || !!email}
            />
          </div>

          {error && (
            <div className="bg-[var(--destructive)]/10 text-[var(--destructive)] p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full button-primary"
            disabled={isLoading || (!email && !patientId)}
          >
            {isLoading ? 'Looking up...' : 'Access Dashboard'}
          </Button>
        </form>

        {/* Security note */}
        <div className="text-center pt-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            Your data is protected under HIPAA guidelines. All information is
            encrypted and accessible only to you and your healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
