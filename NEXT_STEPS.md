# Implementation Plan: Next Steps

## Overview
Prioritized 4-week plan to deliver a HIPAA-compliant MVP for the psychology clinic webapp. Based on the architecture and technology decisions documented.

## Week 1: Foundation & Core Infrastructure
**Goal**: Establish HIPAA-compliant AWS foundation and backend API skeleton.

### Day 1-2: AWS Account & BAA
- [ ] Create AWS organization account (if not exists)
- [ ] Submit BAA request to AWS (typically 1-2 business days)
- [ ] Set up AWS Organizations with SCPs for baseline security
- [ ] Configure IAM identity center for workforce access
- [ ] Enable CloudTrail, Config, Security Hub in all regions

### Day 3-4: Infrastructure as Code (Terraform)
- [ ] Initialize Terraform backend (S3 bucket + DynamoDB table for state locking)
- [ ] Create networking module: VPC, public/private subnets, IGW, NAT GW
- [ ] Create security group baseline (least privilege)
- [ ] Provision RDS PostgreSQL instance (Multi-AZ, encrypted, db.t3.medium for dev)
- [ ] Provision ElastiCache Redis cluster (cache.t3.micro for dev)
- [ ] Create S3 buckets: assessments, documents, logs, frontend (with encryption/versioning)
- [ ] Set up AWS KMS keys (customer-managed for S3/RDS)

### Day 5-7: Backend Foundation
- [ ] Initialize FastAPI project structure with Poetry
- [ ] Configure Prisma-like ORM layer (SQLAlchemy core + Pydantic + type-safe queries)
- [ ] Implement database connection pooling and session management
- [ ] Create core models: User, Role, Assessment, AuditLog
- [ ] Implement database migrations system (using Alembic or custom)
- [ ] Set up basic API structure with versioning (/api/v1/)
- [ ] Implement JWT validation middleware (integrate with Cognito)
- [ ] Create audit logging middleware (request/response logging, PHI flagging)
- [ ] Add health check endpoint (/health) verifying DB and cache connectivity
- [ ] Write unit tests for models and basic API functions
- [ ] Configure linting (black, isort, flake8, bandit) and formatting
- [ ] Set up GitHub Actions CI: lint, test, build Docker image, push to ECR

## Week 2: Auth & Core Features
**Goal**: Implement authentication, basic assessment functionality, and initial dashboards.

### Day 8-9: Authentication & User Management
- [ ] Configure AWS Cognito User Pool:
    - Schema with custom attributes: role, clinic_id, phi_consent_date, mfa_enrolled
    - Password policy: 12+ chars, complexity, no reuse
    - MFA: Required for admins, optional but recommended for others
    - Email verification required
    - Lambda triggers: Pre-signup (domain validation), Post-confirmation (write to DB)
- [ ] Implement Cognito integration in FastAPI:
    - Token validation using Cognito JWKS
    - Role-based access control (RBAC) middleware
    - User profile endpoint (/api/v1/auth/me)
    - Login/logout flows (using Cognito hosted UI or custom)
- [ ] Create user management API endpoints (admin only):
    - GET /users (list with pagination/filtering)
    - POST /users (create)
    - GET /users/{id} (get details)
    - PATCH /users/{id} (update role/status)
    - DELETE /users/{id} (deactivate - soft delete)
- [ ] Implement password reset and MFA enrollment flows
- [ ] Write integration tests for auth flows

### Day 10-11: Assessment Core
- [ ] Design assessment schema in PostgreSQL:
    - assessments table: id, patient_id, type, status, started_at, completed_at, scores_json, metadata_json
    - assessment_questions table (for dynamic builder later): id, assessment_type, question_text, question_type, options, scoring_rules, order
    - assessment_responses table: id, assessment_id, question_id, response_value, timestamp
- [ ] Implement DASS-21 specific logic:
    - Fixed 21-question assessment with known scoring (DASS-21 manual)
    - Scoring engine: calculate depression, anxiety, stress subscales
    - Severity mapping: normal/mild/moderate/severe/extremely severe
    - Validation: ensure all questions answered before scoring
- [ ] Create assessment API endpoints:
    - GET /assessments/{type}/template (get questions for type)
    - POST /assessments/{type} (submit assessment, returns scored result)
    - GET /assessments/{id} (get assessment + PHI if authorized)
    - GET /assessments (list for patient with filtering/pagination)
    - GET /patients/{patient_id}/assessments (get history)
- [ ] Implement assessment validation and sanitization
- [ ] Add assessment submission to audit log (flag PHI access)
- [ ] Write unit and integration tests for assessment flows

### Day 12-14: Initial Dashboards & Frontend Kickoff
- [ ] Initialize Next.js 14 project with TypeScript, Tailwind, shadcn/ui
- [ ] Set up authentication context with Cognito integration:
    - Custom next-auth provider for Cognito
    - Token storage: httpOnly, Secure, SameSite cookies for refresh token
    - Access token in memory (short-lived)
    - Role-based route protection
- [ ] Create basic layout components: header, footer, sidebar (role-based)
- [ ] Implement patient dashboard:
    - Landing page after login: welcome + recent assessments
    - "Take Assessment" button linking to DASS-21 form
    - Assessment history list (date, type, status)
    - View past assessment results (scores, severity bands)
- [ ] Implement consultant dashboard skeleton:
    - Patient list table (name, last assessment, status)
    - Search/filter patients by name, date range, assessment type
    - Patient detail view (basic info + assessment history)
    - Ability to assign assessments to patients
- [ ] Implement admin dashboard skeleton:
    - User management interface (list, create, edit, deactivate)
    - System settings placeholder
    - Audit log viewer (basic)
- [ ] Set up API service layer in frontend (React Query or SWR)
- [ ] Implement loading states, error handling, form validation
- [ ] Add responsive design for mobile/tablet
- [ ] Write component unit tests (Jest + React Testing Library)
- [ ] Configure frontend CI: lint, test, build, deploy to S3/CloudFront

## Week 3: Advanced Features & Polish
**Goal**: Implement assessment builder, AI insights, corporate dashboard, and security hardening.

### Day 15-16: Assessment Builder (Simplified)
- [ ] Design JSON schema for dynamic assessments (simplified version of DASS-21 structure)
- [ ] Create assessment schema CRUD endpoints:
    - GET /assessment-schemas (list)
    - POST /assessment-schemas (create - admin only)
    - GET /assessment-schemas/{id} (get)
    - PATCH /assessment-schemas/{id} (update version - admin only)
    - POST /assessment-schemas/{id}/publish (change status from draft to published)
- [ ] Implement schema validation service (JSON Schema validation)
- [ ] Modify assessment endpoints to use dynamic schemas:
    - GET /assessment-schemas/{id}/template
    - POST /assessments (accept schema_id, validate against schema)
- [ ] Create basic schema editor UI in admin dashboard:
    - Form-based editor for simple assessments (likert, multiple choice, text)
    - Ability to define scoring rules
    - Versioning UI (draft/published)
    - Preview mode
- [ ] Write tests for schema validation and rendering

### Day 17-18: AI Insights (v1)
- [ ] Configure Azure OpenAI Service:
    - Create Azure subscription (if not exists)
    - Submit BAA request to Microsoft (parallel with AWS)
    - Provision OpenAI resource in selected region
    - Deploy GPT-4o and text-embedding-3-small models
    - Configure network settings (private endpoint, VNet integration)
    - Set up Azure AD authentication or API key management (via AWS Secrets Manager)
- [ ] Implement AI service layer in FastAPI:
    - Secure client for Azure OpenAI (managed identity or key vault)
    - Prompt templates for different use cases:
        * Assessment summarization: "Convert these DASS-21 scores into a clinical narrative summary..."
        * Risk flag identification: "Review this longitudinal assessment data for concerning patterns..."
        * Report assistance: "Help draft the summary section of a progress note based on this assessment data..."
    - Data minimization function: extract only necessary PHI for AI prompt
    - Output validation: check for hallucinations, inappropriate content, PHI leakage
    - Rate limiting and cost tracking
- [ ] Create AI insights API endpoints:
    - POST /insights/assessment-summary (assessment_id -> narrative summary)
    - POST /insights/risk-flags (patient_id, timeframe -> flagged patterns)
    - POST /insights/report-assist (assessment_id, section_type -> generated text)
    - GET /insights/{id} (get specific insight)
    - GET /insights (list insights for patient/assessment with filtering)
- [ ] Implement human-in-the-loop workflow:
    - All AI insights require clinician review before sharing with patient
    - Review status: pending, approved, rejected
    - Audit trail for AI usage (prompt, parameters, output, reviewer, timestamp)
- [ ] Add AI insights to assessment detail views (clinician only)
- [ ] Write unit and integration tests for AI service (mock Azure OpenAI)
- [ ] Configure monitoring: token usage, latency, error rates

### Day 19-21: Corporate Dashboard & Reporting
- [ ] Design corporate data model:
    - Clinics/organizations table (for future multi-tenancy)
    - Aggregated assessment results (daily/weekly/monthly rollups)
    - Cohort tracking (demographics, intervention groups)
    - Utilization metrics (assessments per user, completion rates)
- [ ] Implement data aggregation jobs:
    - Nightly batch process (using ECS scheduled tasks or EventBridge)
    - Roll up assessment data by clinic, date, demographics
    - Calculate averages, distributions, trend lines
    - Store in separate reporting tables or data warehouse (Redshift Spectrum for MVP)
- [ ] Create corporate dashboard:
    - Overview panel: total assessments, active users, completion rate
    - Trends: assessment volume over time (daily/weekly/monthly)
    - Demographics: age distribution, gender breakdown (if collected)
    - Outcomes: average score changes over time for interventions
    - Utilization: assessments per user, top assessment types
    - Export functionality: CSV/PDF reports
- [ ] Create report generation endpoint:
    - POST /reports/generate (async, returns report_id)
    - Report types: utilization, outcomes, demographics, compliance
    - Formats: PDF (via WeasyPrint or ReportLab), CSV, Excel
    - Storage: S3 with presigned URL for download (expires in 1 hour)
    - Notification: SNS email when report ready
- [ ] Implement role-based access:
    - Corporate role: can view aggregated data for their organization
    - Admin role: can view all corporate data
    - Consultant/Patient: no access to corporate dashboard
- [ ] Write tests for aggregation logic and report generation

### Day 22-23: Security Hardening & Compliance
- [ ] Implement additional security headers:
    - Content Security Policy (CSP) - strict but functional
    - X-Frame-Options: DENY
    - X-Content-Type-Options: nosniff
    - Referrer-Policy: strict-origin-when-cross-origin
    - Permissions-Policy: geolocation=(), microphone=(), camera=()
- [ ] Enhance rate limiting:
    - Per-IP and per-user limits (using Redis)
    - Stricter limits on auth endpoints
    - Dynamic adjustment based on threat indicators
- [ ] Implement session hardening:
    - Short idle timeout (15 minutes) with re-authentication
    - Concurrent session limits
    - Force password reset after 90 days
    - Password history (remember last 10 passwords)
- [ ] Add PHI masking in logs and error messages:
    - Never log full assessment responses or raw PHI
    - Mask identifiers in logs (show only last 4 chars of IDs)
    - Sanitize error messages before returning to user
- [ ] Implement data export and deletion:
    - GET /patients/{id}/export (JSON/PDF of all PHI)
    - DELETE /patients/{id}/data (initiate deletion workflow - admin only)
    - Deletion process: mark for deletion, background job to anonymize/delete, audit trail
- [ ] Conduct internal penetration testing (OWASP Top 10 focus)
- [ ] Review and update security group configurations
- [ ] Enable VPC Flow Logs to S3 for long-term retention
- [ ] Configure GuardDuty and Inspector (if not already enabled)

### Day 24: Performance Testing & Optimization
- [ ] Set up load testing environment (k6 or Locust)
- [ ] Test critical user journeys:
    - Login → take assessment → view results
    - Consultant: load patient list (1000 patients) → view patient detail
    - Admin: user management operations
    - Corporate dashboard loading
- [ ] Identify and fix bottlenecks:
    - Database query optimization (add missing indexes)
    - API response caching where appropriate (Redis)
    - Frontend bundle optimization (code splitting, lazy loading)
    - Image optimization (Next.js Image)
- [ ] Configure autoscaling policies:
    - ECS services: target tracking (CPU 70%, memory 80%)
    - Minimum 2 tasks for HA, scale to 10-20 based on load
    - Cooldown periods to prevent thrashing
- [ ] Set up CloudWatch alarms for key metrics:
    - High error rates (5xx)
    - High latency (p95 > 1s for API, >3s for frontend)
    - CPU/memory utilization >85% for sustained periods
    - Failed login spikes
    - Assessment submission rate drops

### Day 25: Documentation & Knowledge Transfer
- [ ] Update architecture diagrams with any changes
- [ ] Write API documentation (ensure OpenAPI/Swagger is accurate)
- [ ] Create user manuals for each role (patient, consultant, admin, corp)
- [ ] Create administrator guide:
    - User management
    - Assessment builder usage
    - Report generation
    - System monitoring basics
- [ ] Create developer onboarding guide:
    - Local development setup (Docker compose)
    - Running tests
    - Making changes and submitting PRs
    - Deployment process
- [ ] Update DECISIONS_LOG.md with any changes made during implementation
- [ ] Create runbook for common operations:
    - Database backup/restore
    - Cache clearing
    - Log investigation
    - Incident response basics

### Day 26: Final Security & Compliance Review
- [ ] Verify all BAAs are in place (AWS and Microsoft)
- [ ] Review audit log completeness:
    - All PHI access logged
    - Authentication events (success/failure)
    - Authorization decisions
    - Data modifications
    - Administrative actions
- [ ] Test data export and deletion workflows
- [ ] Verify encryption at rest and in transit:
    - RDS: force SSL, check encryption flag
    - S3: default encryption, versioning, object lock on logs bucket
    - EBS volumes: encrypted
    - ElastiCache: transit encryption enabled
    - ALB: HTTPS only, modern TLS policy
- [ ] Review IAM policies for least privilege
- [ ] Check security group rules (no overly permissive rules)
- [ ] Ensure logging retention meets requirements (CloudWatch, S3)
- [ ] Document incident response plan and escalation paths
- [ ] Schedule first penetration test with third party (if budget allows)

### Day 27-28: Beta Testing & Launch Preparation
- [ ] Conduct internal beta testing with clinic staff:
    - Patients: take assessments, view history
    - Consultants: manage patients, review assessments
    - Admins: user management, assessment builder
    - Corp: view dashboards, generate reports
- [ ] Collect and prioritize feedback
- [ ] Fix critical bugs identified
- [ ] Perform final security scan (dependencies, code)
- [ ] Update documentation based on feedback
- [ ] Prepare launch announcement and training materials
- [ ] Plan for post-launch monitoring and support rotation
- [ ] Create rollback procedure in case of issues
- [ ] Final stakeholder sign-off meeting

## Post-MVP Enhancements (Months 2-6)
- [ ] FHIR R4 integration for EHR interoperability
- [ ] Advanced analytics with Amazon QuickSight or Metabase
- [ ] Custom ML models for risk prediction (using SageMaker)
- [ ] Mobile application (React Native)
- [ ] Appointment scheduling and calendar integration
- [ ] Secure messaging between patients and providers
- [ ] Insurance billing and claims processing (X12 837)
- [ ] Multi-tenant architecture for serving multiple clinics
- [ ] Natural language processing for clinical notes
- [ ] Wearable device integration (Apple Health, Google Fit)
- [ ] Telehealth video visits (WebRTC implementation)
- [ ] Automated compliance reporting and audit preparation

---
*This plan is designed to be aggressive but achievable with a focused team. Adjust timelines based on actual team size, experience, and any unforeseen complexities. Regular standups and progress reviews will help keep the project on track.*