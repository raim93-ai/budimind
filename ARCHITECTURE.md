# Technical Architecture

## Overview
HIPAA-compliant, scalable webapp for psychology clinic with online assessments (DASS-21) and multi-role dashboards. Designed for 10,000+ users and thousands of daily assessments.

## Architecture Diagram (Text Representation)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             AWS Cloud (HIPAA BAA)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │  Route 53  │  │   WAF      │  │   ALB      │  │   CloudFront       │   │
│  │ (DNS)      │  │            │  │ (TLS term) │  │ (Static assets)    │   │
│  └────┬───────┘  └────┬───────┘  └────┬───────┘  └─────────┬──────────┘   │
│       │               │               │                    │              │
│  ┌────▼───────────────▼───────────────▼───────────────▼────────────┐      │
│  │                    ECS Fargate Cluster (Private Subnets)          │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │  │
│  │  │  API Svc    │  │  Worker Svc │  │  Admin Svc  │  │  (Optional) │  │  │
│  │  │ (FastAPI)   │  │ (Scoring,   │  │  Reports,   │  │  Workers   │  │  │
│  │  │             │  │  AI, Email) │  │  Exports)   │  │            │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬──────┘  │  │
│  └─────────┼────────────────┼────────────────┼─────────────┼────────────┘  │
│            │                │                │                 │           │
│  ┌─────────▼──────┐ ┌───────▼───────┐ ┌─────▼──────┐ ┌───────▼──────┐    │
│  │ RDS PostgreSQL │ │ ElastiCache   │ │    S3      │ │  S3 Logs     │    │
│  │ (Primary)      │ │   (Redis)     │ │  (PHI,     │ │ (Immutable,  │    │
│  │  - Multi-AZ    │ │               │ │   Assessments,│ │  Glacier     │    │
│  │  - Encrypted   │ │               │ │   Docs)      │ │  Archive)    │    │
│  │  - pgvector    │ │               │ │              │ │              │    │
│  │  - 35-day backups│ │             │ │              │ │              │    │
│  └────────────────┘ └───────────────┘ └────────────┘ └────────────┘    │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │                   Monitoring & Compliance Services                    │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │ │
│  │  │CloudWatch  │  │CloudTrail  │  │Security Hub│  │  Config    │    │ │
│  │  │Logs +      │  │(API Audit) │  │(Findings)  │  │(Resource)  │    │ │
│  │  │Metrics     │  │            │  │            │  │  Rules)    │    │ │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │ │
│  │                 │                                                     │ │
│  │  ┌────────────┐  ┌────────────┐                                      │ │
│  │  │  SNS       │  │  KMS       │                                      │ │
│  │  │(Alerts →   │  │(Key Mgmt)  │                                      │ │
│  │  │ PagerDuty) │  │            │                                      │ │
│  │  └────────────┘  └────────────┘                                      │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Network & Edge
- **Route 53**: DNS management, health checks, latency-based routing
- **WAF**: AWS WAF with managed rulesets (OWASP, common exploits)
- **ALB**: Application Load Balancer (internet-facing, TLS termination)
- **CloudFront**: CDN for static assets (Next.js frontend), edge caching

### 2. Compute Layer (ECS Fargate)
- **API Service**: FastAPI application (Python 3.11+), auto-scaling (2-20 tasks)
- **Worker Service**: Handles assessment scoring, AI insights, email, report generation
- **Admin Service** (Optional): Internal tools/reports isolated from public API

### 3. Data Layer
- **Primary Database**: RDS PostgreSQL (Multi-AZ, encrypted, pgvector extension)
- **Cache**: ElastiCache Redis (Multi-AZ, session caching, rate limiting)
- **Object Storage**: S3 Buckets (encrypted, versioned, lifecycle policies)

### 4. Authentication & Authorization
- **AWS Cognito User Pool**: HIPAA-eligible, MFA, custom attributes (role, clinic_id)
- **Authorization Strategy**: Cognito groups → app roles middleware + PostgreSQL RLS

### 5. API Design (FastAPI)
- **Versioning**: `/api/v1/` prefix
- **Middleware**: JWT validation, audit logging, rate limiting, input validation
- **Endpoints**: Auth, assessments, patients, reports, health, metrics

### 6. Frontend (Next.js 14)
- **Architecture**: App Router with Server Components
- **Authentication**: next-auth with Cognito (httpOnly cookies for refresh tokens)
- **Routing**: Role-based paths (/dashboard/patient, /dashboard/consultant, etc.)
- **State Management**: React Query (server state), Zustand (client state)
- **UI**: Tailwind CSS + shadcn/ui component library

### 7. AI/ML Components
- **Azure OpenAI Service**: GPT-4o (summarization), text-embedding-3-small (similarity)
- **Usage**: Assessment summarization, risk flag identification, report assistance
- **HIPAA Compliance**: Data minimization, human-in-the-loop, output validation

### 8. Security & Compliance Features
- **Infrastructure**: Private subnets, security groups, GuardDuty, Inspector
- **Data**: Encryption at rest (AES-256), in transit (TLS 1.2+), KMS key management
- **Application**: Dependency scanning, SAST, DAST, penetration testing
- **Privacy**: Data minimization, consent management, access/deletion APIs
- **Audit**: Immutable audit table, CloudTrail, CloudWatch Logs, S3 immutable storage

### 9. Deployment & Operations
- **IaC**: Terraform (S3 backend, DynamoDB locking, workspaces: dev/staging/prod)
- **CI/CD**: GitHub Actions → ECR → ECS (lint, test, build, deploy, smoke tests)
- **Observability**: CloudWatch (metrics, logs, alarms), structured JSON logging
- **Backup**: RDS automated backups, S3 cross-region replication, documented runbooks

### 10. Scalability & Performance
- **Horizontal Scaling**: ECS target tracking policies (CPU 70%, memory 80%)
- **Database**: Read replicas, connection pooling (Prisma Accelerate), partitioning
- **Caching**: L1 (app dict), L2 (Redis), L3 (CloudFront)
- **Performance Targets**: API p95 <500ms, assessment submission <2s, dashboard load <3s

### 11. Development Experience
- **Local Dev**: Docker compose with simplified services, mock Cognito
- **Testing**: Unit (80%+ coverage), integration, e2e (Cypress), load (k6/Locust)
- **Code Quality**: Monorepo, linting (black, isort, flake8, bandit, eslint, prettier)
- **Dependencies**: Poetry (Python), npm (Node.js), Dependabot for updates

### 12. Compliance & Regulatory Considerations
- **HIPAA**: BAAs with AWS (core services) + Microsoft (Azure OpenAI)
- **Required**: Access controls, audit controls, integrity controls, auth, transmission security
- **GDPR** (if applicable): DPA with AWS/Microsoft, data subject requests, DPIA
- **Frameworks**: Architecture aligns with SOC 2, ISO 27001 principles

### 13. Future Extensions
- **Phase 2**: FHIR R4 integration, advanced analytics, patient portal enhancements
- **Phase 3**: AI/ML model training, NLP for clinical notes, wearable integration
- **Technical**: Graviton3/4 migration, event-driven architecture, service mesh

---
*This architecture is designed to be HIPAA-compliant, scalable, and maintainable. All technology choices are HIPAA-eligible or have available BAAs.*