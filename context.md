# MealFlow — AI Development Context

## 1. Project Identity

Project Name: MealFlow

MealFlow is a B2B SaaS platform designed to help hostels, PGs, and student accommodations manage their daily meal operations.

Initial target market:

- Greater Noida
- NCR region
- Hostels and PGs with centralized or semi-centralized meal services

The primary problem MealFlow solves is the lack of reliable meal traceability and operational coordination between:

Resident
→ Kitchen
→ Packing
→ Delivery
→ Resident

The system should reduce:

- Missing tiffins
- Wrong meal delivery
- Manual reconciliation
- Manual counting
- Delivery confusion
- Complaint handling delays
- Lack of accountability
- Food wastage caused by inaccurate meal counts

---

# 2. Master Product Specification

The complete product and technical specification is stored in:

`MealFlow_Implementation_Document.md`

This document is the primary source of truth for:

- Product requirements
- User roles
- Business workflows
- Database design
- API architecture
- UI requirements
- System architecture
- MVP scope
- Security requirements
- Testing requirements
- Future roadmap

Do not contradict the master specification without first explaining the reason.

---

# 3. Development Roadmap

The implementation sequence is defined in:

`DEVELOPMENT_PLAN.md`

Always check this file before starting a new major feature.

Development must happen phase-by-phase.

Do not implement multiple future phases together unless explicitly instructed.

---

# 4. Core Product Principle

The most important principle of MealFlow is:

> Every meal should be individually traceable.

The system should be able to answer:

- Who booked this meal?
- What meal was booked?
- For which property?
- For which resident?
- Was it prepared?
- Was it packed?
- Who handled it?
- Was it assigned?
- Was it dispatched?
- Was it delivered?
- Was it confirmed?
- If something went wrong, where did the process fail?

---

# 5. Core MVP Workflow

The most important workflow in the entire system is:

Resident
↓
Views Menu
↓
Books Meal
↓
Meal Record Generated
↓
Kitchen Sees Required Count
↓
Meal Prepared
↓
Meal Packed
↓
Unique Meal Identity / QR Generated
↓
Delivery Batch Created
↓
Delivery Staff Receives Meal
↓
QR Scanned
↓
System Validates Meal
↓
Meal Dispatched
↓
Meal Delivered
↓
Resident Confirms Delivery
↓
Audit Trail Completed

This workflow must be reliable before advanced features are considered.

---

# 6. Exception Workflow

MealFlow must also handle failures.

Example:

Meal
↓
Not Received
↓
Resident Reports Missing Meal
↓
Complaint Created
↓
Admin Investigates
↓
Meal Timeline Reviewed
↓
Issue Resolved
↓
Resolution Recorded
↓
Audit Trail Updated

Other possible exceptions include:

- Wrong meal
- Late delivery
- Damaged packaging
- Quality complaint
- Invalid QR
- Duplicate scan
- Already delivered meal
- Wrong-property meal

---

# 7. User Roles

The MVP supports the following roles:

- OWNER
- ADMIN
- MANAGER
- KITCHEN_STAFF
- DELIVERY_STAFF
- RESIDENT

Each role must have clearly defined permissions.

Never rely only on frontend UI restrictions.

All sensitive authorization must be enforced on the backend.

---

# 8. Technology Stack

Unless explicitly changed after architectural review, use:

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Node.js
- NestJS
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Infrastructure

- Docker for local development
- REST API
- JWT-based authentication

Additional infrastructure such as Redis may be introduced only when technically justified.

---

# 9. Architecture Principle

Use a modular monolith for the MVP.

Do NOT introduce microservices unless explicitly approved.

The preferred architecture is:

Frontend
↓
Backend API
↓
Domain Modules
↓
Prisma
↓
PostgreSQL

Backend modules may include:

- Auth
- Organizations
- Properties
- Rooms
- Residents
- Menus
- Bookings
- Meals
- Kitchen
- Delivery
- Complaints
- Notifications
- Analytics
- Audit

Modules should have clear responsibilities.

Avoid tightly coupling unrelated modules.

---

# 10. Multi-Tenancy

MealFlow is a multi-tenant SaaS product.

Tenant isolation is a critical security requirement.

A tenant must never be able to access:

- Another organization's residents
- Another organization's rooms
- Another organization's meals
- Another organization's bookings
- Another organization's complaints
- Another organization's analytics
- Another organization's staff

Tenant filtering must be enforced at the backend/data-access level.

Never depend solely on frontend filtering.

Every relevant database query must respect tenant/property boundaries.

---

# 11. Database Principles

Use PostgreSQL with Prisma.

Important principles:

- Use proper foreign keys.
- Use database constraints where appropriate.
- Use indexes for frequently queried fields.
- Avoid unnecessary duplication.
- Use transactions for multi-step business operations.
- Prevent duplicate bookings through database/application constraints.
- Maintain referential integrity.
- Store timestamps consistently.
- Use appropriate enum/status types.
- Never delete important operational history unnecessarily.

Operational records such as meals, deliveries, complaints, and audit events should preserve historical information.

---

# 12. Business Logic Principles

Business logic should primarily live in backend/domain services.

Do not place important business rules only inside React components.

Examples of backend-controlled rules:

- Booking cutoff
- Duplicate booking prevention
- Meal generation
- Meal state transitions
- QR validation
- Delivery authorization
- Tenant isolation
- Complaint workflow
- Permission checks

The frontend should display and interact with business logic, not become the source of truth for it.

---

# 13. Meal State Machine

Meal state transitions must be explicitly controlled.

Expected flow:

BOOKED
↓
PREPARING
↓
PACKED
↓
ASSIGNED
↓
DISPATCHED
↓
DELIVERED
↓
CONFIRMED

Possible exception states/workflows:

DELIVERED
↓
DISPUTED
↓
INVESTIGATING
↓
RESOLVED

Cancellation may occur where business rules permit:

BOOKED
↓
CANCELLED

Do not allow arbitrary state changes.

Every important state transition should be auditable.

---

# 14. QR / Meal Identity

Every generated meal should have a unique identity.

QR functionality must:

- Identify the meal
- Validate the meal
- Validate property/tenant context
- Prevent unauthorized delivery
- Prevent duplicate delivery
- Handle invalid QR codes
- Handle already-delivered meals

Never trust a QR value by itself.

The backend must validate the meal before changing its state.

---

# 15. Security Rules

Security is a first-class requirement.

Never:

- Hardcode passwords
- Hardcode API keys
- Commit secrets
- Store plaintext passwords
- Trust frontend authorization
- Expose sensitive database information
- Return unnecessary sensitive fields from APIs

Use environment variables for secrets.

Validate all user input.

Implement proper authentication and authorization.

Use secure password hashing.

Review APIs for privilege escalation and cross-tenant access.

---

# 16. API Principles

Use REST APIs.

Base API version:

`/api/v1`

APIs should have:

- Clear naming
- Proper HTTP methods
- Validation
- Authentication
- Authorization
- Consistent response structure
- Consistent error handling
- Appropriate status codes

Do not expose internal implementation details unnecessarily.

---

# 17. Frontend Principles

The frontend should be:

- Clean
- Simple
- Responsive
- Mobile-friendly
- Operationally focused

Prioritize usability over visual complexity.

Kitchen and delivery staff may use mobile devices.

Resident workflows should require minimal steps.

Admin dashboards should prioritize operational information.

Avoid unnecessary animations and decorative UI.

---

# 18. Mobile Priority

The following workflows should be particularly mobile-friendly:

### Resident

- View menu
- Book meal
- View meal status
- Report issue

### Delivery Staff

- Login
- View assigned meals
- Scan QR
- Confirm delivery

### Kitchen Staff

- View meal count
- View preparation status
- Pack meals
- Manage batches

Desktop dashboards are more important for:

- Admin
- Manager
- Owner

---

# 19. Error Handling

Every feature must have proper error handling.

Examples:

Invalid login
→ Clear authentication error

Duplicate booking
→ Clear booking error

Expired booking window
→ Explain cutoff

Invalid QR
→ Reject scan and explain reason

Already delivered meal
→ Reject duplicate delivery

Unauthorized access
→ Return appropriate authorization error

Cross-tenant access attempt
→ Reject request

Do not silently fail.

Do not expose stack traces or internal errors to users.

---

# 20. Testing Rules

Every major business rule should have automated tests.

Important areas:

- Authentication
- Authorization
- Tenant isolation
- Booking
- Booking cutoff
- Meal generation
- Meal state transitions
- QR validation
- Delivery
- Complaints
- Analytics calculations

Before marking a feature complete:

1. Run tests.
2. Fix failures.
3. Test important edge cases.
4. Verify frontend/backend integration.
5. Verify authorization.
6. Verify database integrity.

---

# 21. Development Workflow

Before implementing a feature:

1. Read `context.md`.
2. Read the relevant section of `MealFlow_Implementation_Document.md`.
3. Read the relevant section of `DEVELOPMENT_PLAN.md`.
4. Inspect the existing implementation.
5. Understand existing database relationships.
6. Plan the change.
7. Implement the feature.
8. Write/update tests.
9. Run tests.
10. Fix errors.
11. Update documentation.
12. Report what changed.

Do not blindly overwrite existing code.

---

# 22. Scope Control

The MVP must remain focused.

Do NOT add the following unless explicitly approved:

- Rent management
- Accounting
- Full payment system
- RFID
- Biometrics
- Face recognition
- Marketplace
- Advanced procurement
- Advanced inventory
- AI forecasting
- Complex route optimization
- Full accommodation management

MealFlow's first objective is to solve meal operations extremely well.

---

# 23. AI / ML Strategy

Do not implement AI/ML features prematurely.

The first priority is collecting reliable operational data.

Future AI capabilities may include:

- Meal demand forecasting
- Food wastage prediction
- Anomaly detection
- Procurement recommendations
- Operational optimization

AI should be built only after the core workflow generates sufficient trustworthy data.

---

# 24. Product Decision Principle

When there are multiple possible implementations:

Prefer the solution that is:

1. Simple
2. Reliable
3. Secure
4. Maintainable
5. Easy to test
6. Easy to operate
7. Appropriate for an MVP

Do not choose complexity merely because it is technically impressive.

---

# 25. Change Management

If a requested change significantly affects:

- Database architecture
- Authentication
- Multi-tenancy
- Core meal workflow
- API architecture
- Technology stack
- MVP scope

Do not silently implement it.

First explain:

1. What is changing?
2. Why is it necessary?
3. What parts of the system are affected?
4. What are the risks?
5. What is the recommended approach?

Then wait for approval.

---

# 26. AI Agent Behavior

The AI coding agent should behave like a senior software engineer.

It should:

- Inspect before modifying.
- Plan before implementing.
- Keep changes focused.
- Avoid unnecessary refactoring.
- Preserve existing functionality.
- Test changes.
- Explain important architectural decisions.
- Keep documentation updated.
- Identify risks.
- Never fabricate successful tests.
- Never claim a feature works without verification.

If something is uncertain, explicitly state the uncertainty.

---

# 27. Completion Standard

A feature is NOT complete merely because code has been written.

A feature is complete only when:

- Database changes are complete
- Backend logic is complete
- API is complete
- Authorization is complete
- Frontend is complete
- Validation is complete
- Error handling is complete
- Tests are passing
- End-to-end workflow works
- Documentation is updated
- No critical known issues remain

---

# 28. Current Development Status

Initial project setup has been completed.

The next task is to verify the project foundation and begin implementation according to:

`DEVELOPMENT_PLAN.md`

Do not jump directly into advanced features.

The development order must remain controlled and incremental.

---

# 29. Final Product Principle

MealFlow should not be treated as a generic hostel management application.

The initial product focus is:

> Reliable, traceable, and accountable hostel meal operations.

The core value proposition is:

> Know exactly what meals were booked, prepared, packed, dispatched, delivered, confirmed, and where any failure occurred.

Everything in the MVP should support this objective.