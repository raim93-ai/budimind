// Shared type definitions and enums for BudiMind

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  correlationId?: string;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, ComponentHealth>;
  timestamp: string;
}

export interface ComponentHealth {
  status: 'healthy' | 'unhealthy';
  latencyMs?: number;
  error?: string;
}

// Corporate domain types
export enum CorporateRole {
  SPONSOR = 'sponsor',
  FACILITATOR = 'facilitator',
  IO_PSYCHOLOGIST = 'io_psychologist',
  CP_ANALYST = 'cp_analyst',
  PRIVACY_REVIEWER = 'privacy_reviewer',
  PLATFORM_OPERATIONS = 'platform_operations',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  LAUNCHED = 'launched',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum AnalysisStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVIEW = 'review',
  RELEASED = 'released',
}

// Clinical domain types
export enum ClinicalRole {
  CLIENT = 'client',
  EMPLOYEE = 'employee',
  CP = 'cp',
  CLINICAL_OPERATIONS = 'clinical_operations',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum EntitlementStatus {
  ELIGIBLE = 'eligible',
  INELIGIBLE = 'ineligible',
  EXHAUSTED = 'exhausted',
  EXPIRED = 'expired',
}

// Common types
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  preferredContact: 'email' | 'phone' | 'sms';
}

export interface Money {
  amount: number; // in minor units (cents/sen)
  currency: string;
}

export interface DateRange {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface TimeSlot {
  start: string; // ISO 8601
  end: string; // ISO 8601
  timezone: string;
}

// API Response wrappers
export interface SuccessResponse<T> {
  success: true;
  data: T;
  correlationId: string;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Utility types
export type UUID = string & { readonly __brand: unique symbol };
export type ISODateTime = string & { readonly __brand: unique symbol };
export type Email = string & { readonly __brand: unique symbol };
