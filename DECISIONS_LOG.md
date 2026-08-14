# Decision Log

This file records Architecture Decision Records (ADRs) for the psychology clinic webapp project. Each decision follows the ADR format: Context, Decision, Consequences.

## ADR 001: Infrastructure Provider Selection
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to deploy a HIPAA-compliant web application that can scale to 10,000+ users with thousands of daily assessments. The infrastructure must support Business Associate Agreements (BAAs) for HIPAA compliance.

### Decision
Choose AWS as the primary cloud provider with the goal of signing BAAs for covered services. Reject Render, Heroku, Fly.io, and other PaaS options that do not offer BAAs.

### Consequences
**Positive**:
- Access to HIPAA-eligible services with available BAAs (RDS, S3, Lambda, Cognito, etc.)
- Enterprise-grade scalability and performance
- Global infrastructure with regional options for data residency
- Mature security and compliance tooling (CloudTrail, Config, GuardDuty, etc.)
- Ability to use managed services reducing operational overhead

**Negative**:
- Increased complexity compared to simpler PaaS solutions
- Potential vendor lock-in to AWS ecosystem
- Steeper learning curve for team members unfamiliar with AWS
- Higher operational responsibility (though mitigated by managed services)

### Related Decisions
- ADR 002: Infrastructure as Code tool selection
- ADR 005: Authentication service selection

## ADR 002: Infrastructure as Code Tool
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to manage AWS infrastructure in a repeatable, version-controlled manner to ensure consistency across environments and enable disaster recovery.

### Decision
Choose Terraform as the Infrastructure as Code (IaC) tool. Reject AWS CloudFormation, Pulumi, and CDK.

### Consequences
**Positive**:
- Cloud-agnostic syntax (though we're AWS-focused, provides flexibility)
- Excellent state management with locking mechanisms
- Strong module ecosystem for reusability
- Good integration with CI/CD pipelines
- Human-readable HCL syntax
- Ability to detect and correct drift
- Well-established in enterprise environments

**Negative**:
- Learning curve for HCL syntax
- State management complexity (requires remote backend setup)
- Separate tool to install and manage
- Less integrated with AWS-specific features than CloudFormation

### Related Decisions
- ADR 001: Infrastructure Provider Selection
- ADR 012: Monitoring and Observability tools

## ADR 003: Backend Language and Framework
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to build a scalable, secure backend capable of handling assessment submissions, AI integrations, and real-time dashboard updates while maintaining HIPAA compliance.

### Decision
Choose FastAPI (Python) as the backend framework. Reject Django, Node.js/Express, Go, and Ruby on Rails.

### Consequences
**Positive**:
- High performance with ASGI architecture (suitable for high concurrency)
- Automatic OpenAPI/Swagger documentation generation
- Excellent type hints and Pydantic validation for data integrity
- Strong ecosystem for AI/ML integration (scikit-learn, TensorFlow, PyTorch)
- Async/await support for efficient I/O operations
- Excellent developer experience with clear, maintainable code
- Strong security posture when properly implemented

**Negative**:
- Slightly less mature than Django for traditional web applications
- Smaller ecosystem than Node.js for certain web-specific features
- Python Global Interpreter Lock (GIL) limits true CPU parallelism (mitigated by async and multiprocessing for CPU-bound tasks)

### Related Decisions
- ADR 004: Backend ORM/Data Access Strategy
- ADR 006: Frontend Framework Selection

## ADR 004: Backend ORM/Data Access Strategy
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need an efficient, type-safe way to interact with our PostgreSQL database while maintaining performance and security.

### Decision
Use SQLAlchemy Core with Pydantic models for validation and a custom type-safe query builder. Reject full ORMs like SQLAlchemy ORM, Django ORM, and PonyORM.

### Consequences
**Positive**:
- Full control over SQL queries for performance optimization
- Eliminates ORM overhead and complexity
- Type safety through Pydantic models and mypy
- Explicit SQL makes security auditing easier (SQL injection prevention)
- Familiar to most Python developers
- Easy to optimize and troubleshoot performance issues
- Clear separation of concerns

**Negative**:
- More boilerplate code for common CRUD operations
- Requires manual mapping between SQL results and Pydantic models
- No built-in change tracking or lazy loading
- Team must write more data access code

### Related Decisions
- ADR 003: Backend Language and Framework
- ADR 008: Database Selection

## ADR 005: Authentication Service
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need a secure authentication system that supports HIPAA requirements including MFA, audit logging, and proper session handling.

### Decision
Choose AWS Cognito User Pools as the primary authentication service. Reject Auth0, Firebase Authentication, Keycloak, and custom-built solutions.

### Consequences
**Positive**:
- AWS signs BAAs covering Cognito User Pools
- Managed service with automatic scaling and patching
- Built-in security features: MFA, compromised credential detection, rate limiting
- Standard OAuth 2.0/OpenID Connect compliance
- Easy integration with other AWS services (ALB, API Gateway, etc.)
- Customizable workflows via Lambda triggers
- User directory management and profiles
- Social identity provider support (if needed for non-PHI flows)

**Negative**:
- Less flexibility than custom solutions for exotic requirements
- Dependence on AWS service availability
- Learning curve for Cognito-specific concepts and limitations
- Customization limits (though Lambda triggers extend capabilities)
- Potential for attribute size limits in user pool

### Related Decisions
- ADR 001: Infrastructure Provider Selection
- ADR 009: Authorization Strategy

## ADR 006: Frontend Framework Selection
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to build a responsive, secure frontend application that provides role-based dashboards for patients, consultants, administrators, and corporate users while maintaining good performance and developer experience.

### Decision
Choose Next.js 14 (App Router) with React as the frontend framework. Reject Create React App, Vite + plain React, Nuxt.js, SvelteKit, and Angular.

### Consequences
**Positive**:
- Server Components reduce JavaScript bundle size dramatically
- Built-in image, font, and script optimization
- Excellent SEO and performance characteristics
- Stream HTML delivery for faster perceived performance
- Built-in support for TypeScript
- Excellent routing system with route groups and parallel routes
- Strong data fetching capabilities with Server Components
- Excellent developer experience with Fast Refresh
- Strong ecosystem (React) with vast component libraries
- App Router provides modern React patterns (server/client components)

**Negative**:
- Newer paradigm (App Router) has learning curve
- Some ecosystem tools still adapting to App Router
- More complex than simpler SPA setups
- Server/Client component mental model can be challenging initially

### Related Decisions
- ADR 007: Styling and Component Library
- ADR 010: State Management Strategy

## ADR 007: Styling and Component Library
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to create a consistent, accessible, and maintainable UI across all user roles while ensuring good performance and accessibility compliance.

### Decision
Choose Tailwind CSS for styling and shadcn/ui for component library. Reject Bootstrap, Material-UI, Chakra UI, Ant Design, and custom CSS solutions.

### Consequences
**Positive**:
- Tailwind CSS:
    - Utility-first approach reduces CSS bloat
    - Excellent responsiveness and dark mode support
    - JIT compiler means fast build times in development
    - PurgeCSS equivalent built-in removes unused styles
    - Easy to maintain consistency across large teams
    - Strong developer experience with IntelliSense support
- shadcn/ui:
    - Not a traditional component library - provides reusable components you own
    - Built on Radix UI primitives (accessible by default)
    - Fully customizable (you control the code)
    - Excellent documentation and examples
    - Minimal bundle impact (only copy what you use)
    - Follows accessibility best practices (WAI-ARIA compliant)
- Combined approach:
    - Highly customizable without fighting the framework
    - Excellent performance characteristics
    - Strong accessibility foundation
    - Easy to theme and brand
    - Small CSS footprint in production

**Negative**:
- Utility-first syntax can be verbose to read initially
- Requires learning Tailwind's class naming conventions
- shadcn/ui requires copying and maintaining component code
- Less "out-of-the-box" component variety than traditional libraries
- Design system maintenance overhead

### Related Decisions
- ADR 006: Frontend Framework Selection
- ADR 010: State Management Strategy

## ADR 008: Database Selection
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need a reliable, secure database to store assessment data, user information, audit trails, and support HIPAA compliance requirements including encryption, access controls, and auditability.

### Decision
Choose PostgreSQL as the primary relational database. Reject MySQL/MariaDB, MongoDB, DynamoDB, and Cassandra.

### Consequences
**Positive**:
- Excellent ACID compliance critical for healthcare data
- Strong support for JSONB for semi-structured data (assessment builder)
- Row-Level Security (RLS) for fine-grained access control
- Comprehensive logging capabilities (log_statement, log_connections)
- Extensive audit extension options (pgaudit, audit trigger)
- Point-in-time recovery (PITR) and logical replication
- Strong encryption options (transparent data encryption, pgcrypto)
- Mature, battle-tested technology with decades of use in healthcare
- Outstanding tooling (pgAdmin, psql, etc.)
- Excellent performance with proper indexing
- Horizontal scaling via read replicas
- Rich extension ecosystem (PostGIS for geo, pgvector for AI/ML)

**Negative**:
- More complex setup than managed NoSQL services
- Requires more tuning for optimal performance
- Vertical scaling limits (though read replicas help scale reads)
- Operational overhead for backups, updates, and tuning (mitigated by RDS managed service)

### Related Decisions
- ADR 004: Backend ORM/Data Access Strategy
- ADR 013: Extensions and Enhancements

## ADR 009: Authorization Strategy
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to implement fine-grained authorization controls that enforce least privilege access to protected health information (PHI) based on user roles and specific permissions.

### Decision
Implement a hybrid authorization approach: AWS Cognito groups map to application roles, which are enforced by middleware in the FastAPI backend, supplemented by Row-Level Security (RLS) in PostgreSQL for data access. Reject relying solely on Cognito groups, pure application-level RBAC, or ABAC (Attribute-Based Access Control) for MVP.

### Consequences
**Positive**:
- Defense in depth: multiple layers of authorization checks
- Cognito handles authentication and initial role assignment
- Application middleware provides flexible, contextual authorization decisions
- PostgreSQL RLS provides database-level enforcement as a last line of defense
- Supports both role-based and resource-based access rules
- Audit trail integration possible at all layers
- Familiar pattern for developers
- RLS in PostgreSQL is efficient and transparent to applications

**Negative**:
- Increased complexity in authorization logic
- Need to keep Cognito groups, application roles, and RLS policies in sync
- Potential for authorization bugs if layers are inconsistent
- Performance overhead of multiple checks (mitigated by caching)
- RLS requires careful policy design to avoid performance issues

### Related Decisions
- ADR 005: Authentication Service
- ADR 008: Database Selection

## ADR 010: State Management Strategy
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to manage client-side state effectively in our Next.js application to ensure good performance, maintainability, and user experience across complex dashboard interactions.

### Decision
Use React Query (TanStack Query) for server state management and Zustand for client-side UI state. Reject Redux, MobX, Context API alone, and Recoil.

### Consequences
**Positive**:
- React Query:
    - Excellent for server state (caching, background updates, garbage collection)
    - Automatic request deduplication
    - Stale-while-revalidate caching strategy
    - Built-in loading and error states
    - Pagination and infinite query support
    - Mutations with optimistic updates
    - Excellent developer tools
    - Reduces boilerplate for data fetching
- Zustand:
    - Minimalist state management with tiny bundle footprint
    - Simple API (create, use, destroy)
    - Excellent TypeScript support
    - Middleware support for persistence, logging, etc.
    - Good performance with fine-grained subscriptions
    - Easy to test and debug
- Combined approach:
    - Clear separation of concerns (server vs client state)
    - Excellent performance characteristics
    - Minimal boilerplate
    - Strong TypeScript integration
    - Easy to debug and test

**Negative**:
- Learning curve for two different state management approaches
- Need to establish clear boundaries between server and client state
- Potential for state synchronization issues if not careful
- Two dependencies instead of one

### Related Decisions
- ADR 006: Frontend Framework Selection
- ADR 007: Styling and Component Library

## ADR 011: AI/ML Service Selection
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to integrate AI capabilities for assessment summarization, risk flag identification, and report generation assistance while maintaining HIPAA compliance for any PHI processing.

### Decision
Choose Azure OpenAI Service for AI capabilities. Reject direct OpenAI API, AWS Bedrock (pending BAA confirmation), self-hosted LLMs, and Hugging Face Inference API.

### Consequences
**Positive**:
- **Critical**: Microsoft offers Business Associate Agreements for Azure OpenAI Service
- Enterprise-grade security and compliance features
- Regional deployment control for data residency
- Virtual network integration for private connectivity
- Customer-managed keys (bring your own key) option
- Role-based access control via Azure AD
- Content filtering and abuse monitoring
- Financial backing through SLAs
- Access to latest OpenAI models (GPT-4o, text-embedding-3-small)
- Data processed is not used to train models by default
- Strong monitoring and logging capabilities through Azure Monitor

**Negative**:
- Dependency on external service (introduces latency and failure points)
- Potential complexity in VNet integration and private connectivity
- Cost considerations at scale (though reasonable for MVP)
- Requires careful data minimization to only send necessary PHI
- Output validation required to prevent hallucinations and inappropriate content
- Human-in-the-loop requirement adds workflow complexity

### Related Decisions
- ADR 003: Backend Language and Framework (for AI integration ease)
- ADR 006: Frontend Framework Selection (for displaying AI insights)
- ADR 001: Infrastructure Provider Selection (overall AWS/Azure strategy)

## ADR 012: Monitoring and Observability
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to monitor application performance, detect anomalies, ensure security, and maintain compliance through comprehensive logging and metrics.

### Decision
Use AWS CloudWatch as the primary monitoring and observability platform, with plans to add specialized tools as needed. Reject relying solely on open-source stacks (ELK, Prometheus/Grafana) or commercial SaaS (Datadog, New Relic) for MVP.

### Consequences
**Positive**:
- Native AWS integration with automatic metric collection
- Log aggregation from all AWS services (ECS, RDS, Lambda, CloudTrail, etc.)
- Metrics, logs, alarms, events, and dashboards in one platform
- Logs Insights query language for powerful log analysis
- Cross-account and cross-region capabilities
- Alarm system with SNS integration for notifications
- HIPAA considerations: data remains within AWS boundary if configured properly
- Access controlled via IAM policies
- Encryption at rest and in transit configurable
- Good starting point that can be augmented with specialized tools
- Reduces tool sprawl and integration complexity

**Negative**:
- Less flexible than open-source alternatives for custom visualizations
- Logs Insights has learning curve compared to SQL or KQL
- Dashboard capabilities less sophisticated than Grafana
- Limited APM (Application Performance Monitoring) features out of the box
- Log retention costs can become significant at scale
- May need to supplement with specialized tools for specific needs (tracing, etc.)

### Related Decisions
- ADR 001: Infrastructure Provider Selection
- ADR 002: Infrastructure as Code Tool
- ADR 013: Logging Strategy

## ADR 013: Logging Strategy
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to implement comprehensive logging that supports debugging, performance monitoring, security auditing, and HIPAA compliance requirements for audit controls.

### Decision
Implement structured JSON logging in all services with the following fields: timestamp, level, service, trace_id, message, and relevant contextual fields. Log to stdout/stderr for container collection, then forward to CloudWatch Logs via awslogs driver. Reject unstructured text logging, binary logging formats, and logging only to files.

### Consequences
**Positive**:
- Structured JSON enables powerful querying and analysis
- Consistent format across all services simplifies correlation
- Trace IDs allow request tracing across service boundaries
- Contextual fields enable rich debugging and auditing
- stdout/stderr logging follows container best practices
- CloudWatch Logs integration provides centralized storage and analysis
- Log groups can be configured with retention policies, encryption, and access controls
- Supports both human readability (via Logs Insights) and machine processing
- Facilitates security auditing and incident response
- Enables measurement of key metrics (error rates, latency, etc.)
- Easy to forward to additional systems (S3, Elasticsearch, etc.) if needed

**Negative**:
- Slightly larger log size than unstructured text
- Requires logging libraries that support structured output
- Need to establish and enforce logging conventions across team
- Potential for over-logging if not careful (mitigated by level thresholds)
- JSON parsing requires additional processing power (negligible impact)

### Related Decisions
- ADR 012: Monitoring and Observability
- ADR 008: Database Selection (for audit table design)

## ADR 014: CSS Methodology
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to define how we will write and organize CSS in our Next.js/Tailwind application to ensure maintainability, consistency, and scalability.

### Decision
Follow Tailwind's utility-first approach with these guidelines:
1. Use utility classes directly in JSX/Templates for component styling
2. Extract repeating patterns into reusable components
3. Use @apply sparingly only for complex utility combinations that violate DRY
4. Leverage Tailwind's @layer directive for base, components, and utilities
5. Use variants (hover:, focus:, dark:, etc.) appropriately for states
6. Utilize Tailwind's built-in responsive prefixes (sm:, md:, lg:, xl:, 2xl:)
7. For complex animations or keyframes, use @keyframes in a global CSS file
8. Avoid custom CSS unless absolutely necessary (prefer Tailwind utilities)
9. Use CSS variables (via :root) for theme colors that need to be dynamically updated
10. Follow Tailwind's recommended file structure for custom CSS

Reject BEM, SMACSS, OOCSS, and traditional CSS methodologies when using Tailwind.

### Consequences
**Positive**:
- Leverages Tailwind's strengths to the fullest
- Eliminates context switching between HTML and CSS files
- Reduces CSS specificity battles
- Makes styling changes localized and predictable
- Encourages component-based thinking
- Utilizes Tailwind's excellent responsive design system
- Consistent approach across the team
- Easy to purge unused CSS in production
- Works well with component libraries like shadcn/ui
- Minimal risk of styling conflicts
- Fast development cycle with instant visual feedback

**Negative**:
- Can lead to long class lists in JSX (mitigated by component extraction)
- Requires discipline to extract repeating patterns
- Learning curve for those unfamiliar with utility-first CSS
- Potential for inconsistency if conventions aren't followed
- Less familiar to designers coming from traditional CSS backgrounds
- Debugging can be challenging with many classes (use editor extensions)

### Related Decisions
- ADR 006: Frontend Framework Selection
- ADR 007: Styling and Component Library
- ADR 010: State Management Strategy

## ADR 015: API Design Philosophy
**Date**: 2026-08-15  
**Status**: Accepted

### Context
We need to define how we will design our backend API to ensure consistency, usability, security, and performance across all endpoints.

### Decision
Follow RESTful principles with pragmatic adaptations for performance and usability:
1. Use resource-based URLs (nouns, not verbs)
2. Use standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
3. Use HTTP status codes correctly
4. Implement proper content negotiation (JSON as primary format)
5. Use plural resource names for collections (/users, not /user)
6. Nest resources when logically contained (/users/{id}/assessments)
7. Use query parameters for filtering, sorting, pagination
8. Implement versioning in the URL (/api/v1/, /api/v2/)
9. Use ISO 8601 format for all timestamps
10. Use UUIDs for resource identifiers
11. Implement proper CORS policies
12. Use HTTP headers for metadata (RateLimit-Remaining, etc.)
13. Implement proper error responses with consistent structure
14. Use HTTPS exclusively
15. Implement request ID tracing for debugging
16. Apply input validation and sanitization at the boundary
17. Implement rate limiting to prevent abuse
18. Use webhooks for asynchronous notifications where appropriate
19. Provide comprehensive OpenAPI/Swagger documentation
20. Implement HATEOAS links where beneficial for discoverability

Reject SOAP, GraphQL (for MVP), RPC-style designs, and versioning via headers or media types.

### Consequences
**Positive**:
- Familiar and intuitive for developers consuming the API
- Leverages HTTP semantics correctly
- Caching-friendly with proper use of headers and status codes
- Good performance characteristics with RESTful patterns
- Easy to document and understand
- Standardized error handling improves client reliability
- Versioning in URL is clear and explicit
- UUIDs prevent enumeration attacks
- Proper content negotiation allows for future format support
- Rate limiting protects system resources
- OpenAPI/Swagger enables automated client generation and testing
- Clear separation of concerns between API and implementation
- Supports evolution of the API over time
- Follows industry best practices for public APIs

**Negative**:
- Can lead to over-fetching or under-fetching of data (mitigated by field selection/query parameters)
- Less efficient than GraphQL for complex nested data requirements (mitigated by specific endpoints)
- Requires more endpoints for specific use cases (mitigated by good resource modeling)
- Caching complexity increases with personalized data
- Versioning in URL can lead to endpoint proliferation (mitigated by good deprecation policy)
- HATEOAS adds complexity and payload size (used judiciously)

### Related Decisions
- ADR 003: Backend Language and Framework
- ADR 006: Frontend Framework Selection (for API consumption)
- ADR 014: API Documentation (implied)

---
*This decision log will be updated as the project evolves and new significant decisions are made. Each ADR should be reviewed periodically to ensure it still reflects the current state of the project.*