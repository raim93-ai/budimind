'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

export default function NewPatientPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  const onSubmit = (data: any) => {
    // In a real app, we'd create the patient and redirect
    // For now, just redirect to assessment selection
    router.push('/assessment');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="washi-card w-full max-w-md space-y-6">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold">
            Register New Patient
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlValue="fullName">Full Name *</Label>
            <Input
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              id="fullName"
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{String(errors.fullName.message)}</p>
            )}
          </div>
          
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlValue="icNumber">IC Number</Label>
              <Input
                {...register('icNumber')}
                id="icNumber"
                placeholder="National ID / IC"
              />
            </div>
            <div>
              <Label htmlValue="email">Email</Label>
              <Input
                {...register('email', {
                  pattern: {
                    value: /^\S+@\S+$\.\S+$/,
                    message: 'Enter a valid email address',
                  },
                })}
                id="email"
                type="email"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlValue="age">Age</Label>
              <Input
                {...register('age', {
                  min: {
                    value: 1,
                    message: 'Age must be at least 1',
                  },
                  max: {
                    value: 120,
                    message: 'Age must not exceed 120',
                  },
                })}
                id="age"
                type="number"
                min="1"
                max="120"
              />
            </div>
            <div>
              <Label htmlValue="gender">Gender</Label>
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
              <Label htmlValue="phone">Phone Number</Label>
              <Input
                {...register('phone')}
                id="phone"
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label htmlValue="companyId">Organization ID</Label>
              <Input
                {...register('companyId')}
                id="companyId"
                type="number"
                placeholder="Organization ID"
              />
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Register Patient
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