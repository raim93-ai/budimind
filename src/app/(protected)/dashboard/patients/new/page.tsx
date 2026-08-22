'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const patientSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  icNumber: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  age: z.number().int().min(1).max(120).optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional().nullable(),
  phone: z.string().optional().nullable(),
  companyId: z.number().int().positive().optional().nullable(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Convert empty strings to null for optional fields
      const payload = {
        fullName: data.fullName,
        icNumber: data.icNumber || null,
        email: data.email || null,
        age: data.age ?? null,
        gender: data.gender || null,
        phone: data.phone || null,
        companyId: data.companyId ?? null,
      };

      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create patient');
      }

      // Redirect to assessment page with patient ID
      router.push(`/assessment?patientId=${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="washi-card w-full max-w-md space-y-6">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold">
            Register New Patient
          </h2>
        </div>

        {error && (
          <div className="bg-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              {...register('fullName')}
              id="fullName"
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="icNumber">IC Number</Label>
              <Input
                {...register('icNumber')}
                id="icNumber"
                placeholder="National ID / IC"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email')}
                id="email"
                type="email"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                {...register('age', { valueAsNumber: true })}
                id="age"
                type="number"
                min="1"
                max="120"
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                {...register('gender')}
                id="gender"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                {...register('phone')}
                id="phone"
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label htmlFor="companyId">Organization ID</Label>
              <Input
                {...register('companyId', { valueAsNumber: true })}
                id="companyId"
                type="number"
                placeholder="Organization ID"
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Register Patient'}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Already have a patient? <Link href="/assessment" className="text-primary hover:text-primary/80">
            Start Assessment
          </Link>
        </p>
      </form>
    </div>
  );
}