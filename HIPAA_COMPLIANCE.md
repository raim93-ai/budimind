# HIPAA Compliance Checklist

## Technical Safeguards

### Access Control (45 CFR § 164.312(a))
- [x] Unique user identification (consultant login with unique email)
- [x] Emergency access procedure (temporary patient tokens valid 24h)
- [ ] **TODO**: Automatic logoff (implement session timeout after 30 min inactivity)
- [x] Encryption and decryption (JWT tokens with HS256, httpOnly cookies)

### Audit Controls (45 CFR § 164.312(b))
- [x] Audit log table created (`audit_log` in schema)
- [x] Audit logging API endpoint (`/api/audit`)
- [x] Middleware attaches user context to all requests
- [ ] **TODO**: Add audit logging to all API routes (patients, companies, assessments)

### Integrity (45 CFR § 164.312(c))
- [ ] **TODO**: Implement data integrity validation for assessment results
- [x] Foreign key constraints enforced (PRAGMA foreign_keys = ON)

### Person or Entity Authentication (45 CFR § 164.312(d))
- [x] Two-factor authentication not yet implemented (TODO for production)
- [x] JWT token verification in middleware
- [x] Password hashing with bcrypt

### Transmission Security (45 CFR § 164.312(e))
- [x] HTTP-only cookies (secure flag in production)
- [x] SameSite=Strict for cookie policy
- [ ] **TODO**: HTTPS enforcement (should be handled at load balancer/CDN level)

## Administrative Safeguards

### Security Officer (45 CFR § 164.308(a)(1))
- [ ] **TODO**: Designate a security officer

### Workforce Security (45 CFR § 164.308(a)(3))
- [x] Role-based access: consultants get `/dashboard` access
- [x] Patients get `/patient/dashboard` access
- [ ] **TODO**: Company admins get `/dashboard/company` access
- [x] Protected routes enforced via middleware

### Information Access Management (45 CFR § 164.308(a)(4))
- [x] Company-scoped patient data (patients linked to companies)
- [ ] **TODO**: Implement RLS-equivalent filtering in all queries

### Security Awareness (45 CFR § 164.308(a)(5))
- [ ] **TODO**: Regular security training

### Security Incident Procedures (45 CFR § 164.308(a)(6))
- [ ] **TODO**: Incident response plan

## Physical Safeguards
- [x] Hosted application (physical security handled by cloud provider)
- [ ] **TODO**: Facility access controls (if self-hosted)

## Required Documentation
- [x] Audit trail schema
- [ ] **TODO**: Policies and procedures document
- [ ] **TODO**: Risk analysis document
- [ ] **TODO**: Business Associate Agreement (BAA) with hosting provider

## Key Implementation Checklist

1. **Database encryption at rest**: Enable SQLite encryption (SQLCipher)
2. **API rate limiting**: Add rate limiting to all auth endpoints
3. **Session management**: Implement session timeout (currently 7 days — should be shorter)
4. **Audit logging**: Add `logAuditEvent()` calls to all sensitive operations
5. **Data minimization**: Ensure API responses don't expose unnecessary PHI
6. **Error handling**: Don't expose stack traces or internal errors to clients
7. **Backup & recovery**: Implement encrypted database backups with 30-day retention

## Current Status: Partial (needs production hardening)
