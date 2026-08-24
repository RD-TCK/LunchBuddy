# MealFlow — Development Plan

**Version:** 1.0  
**Status:** Active Development  
**Project:** MealFlow  
**Primary Market:** Greater Noida, NCR, India

---

# 1. Purpose

This document defines the implementation roadmap for MealFlow.

It converts the requirements defined in:

`MealFlow_Implementation_Document.md`

into incremental engineering phases.

The development agent must follow this document in sequence.

Do NOT implement the entire product at once.

---

# 2. Product Goal

MealFlow is a B2B SaaS platform for hostel and PG meal operations.

The MVP focuses on one core problem:

> Making every meal traceable from resident booking to kitchen preparation, packing, delivery, confirmation, and complaint resolution.

The core workflow is:

Resident
→ Book Meal
→ Meal Generated
→ Kitchen Preparation
→ Packing
→ QR/Meal Identity
→ Assignment
→ Dispatch
→ Delivery
→ Resident Confirmation

Exception workflow:

Meal
→ Missing/Wrong/Late
→ Complaint
→ Investigation
→ Resolution

---

# 3. Development Philosophy

Follow these principles:

1. Build incrementally.
2. Complete one phase before starting the next.
3. Do not add unnecessary features.
4. Keep the MVP focused.
5. Test every major feature.
6. Maintain documentation.
7. Never compromise tenant isolation.
8. Never rely only on frontend authorization.
9. Keep business logic in backend services.
10. Prefer simple architecture over unnecessary complexity.
11. Do not implement AI before sufficient operational data exists.
12. Do not mark a feature complete until it works end-to-end.

---

# 4. Technology Stack

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

## Supporting Technologies

- Redis when required
- Docker
- REST API
- JWT authentication
- QR code generation/scanning
- Automated testing

---

# 5. Architecture Strategy

Use a modular monolith for the MVP.

Do NOT introduce microservices unless explicitly approved.

High-level architecture:

Frontend
↓
NestJS API
↓
Domain Modules
↓
Prisma
↓
PostgreSQL

Main backend modules:

- Auth
- Organizations
- Properties
- Rooms
- Users
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

---

# 6. Development Status Legend

Use:

- `[ ]` Not Started
- `[~]` In Progress
- `[x]` Completed
- `[!]` Blocked
- `[R]` Requires Review

A phase may only be marked `[x]` when all acceptance criteria are satisfied.

---

# 7. Phase 0 — Project Initialization

**Status:** [x] Completed

## Objective

Create the basic development environment.

## Tasks

- [x] Initialize Git repository
- [x] Create monorepo structure
- [x] Configure package manager
- [x] Configure TypeScript
- [x] Configure ESLint
- [x] Configure Prettier
- [x] Create Next.js application
- [x] Create NestJS application
- [x] Configure PostgreSQL (Supabase)
- [x] Configure Prisma (Supabase)
- [x] Configure `.env.example`
- [x] Configure testing framework
- [x] Create basic health-check endpoint
- [x] Create initial README
- [ ] Configure basic CI if appropriate

## Acceptance Criteria

- [x] Frontend starts successfully
- [x] Backend starts successfully
- [x] PostgreSQL connects successfully (Supabase)
- [x] Prisma connects successfully (Supabase)
- [x] Health endpoint works
- [x] Tests execute successfully
- [x] No secrets are committed

---

# 8. Phase 1 — Authentication and Authorization

**Status:** [x] Completed

## Objective

Create secure authentication and role-based authorization.

## Roles

- OWNER
- ADMIN
- MANAGER
- KITCHEN_STAFF
- DELIVERY_STAFF
- RESIDENT

## Tasks

- [x] User model
- [x] Password hashing
- [x] Login
- [x] JWT access token
- [x] Refresh token
- [x] Logout
- [x] Authentication middleware/guard
- [x] Role-based authorization
- [x] Protected API routes
- [x] Protected frontend routes
- [x] Authentication error handling
- [x] Rate limiting where appropriate

## Security Requirements

- [x] Backend authorization implemented
- [x] Passwords never stored in plaintext
- [x] Tokens securely handled
- [x] Unauthorized users cannot access protected resources
- [x] Residents can access only their own data

## Acceptance Criteria

A user can:

1. Register/login
2. Receive authentication credentials
3. Access authorized resources
4. Be rejected from unauthorized resources
5. Logout successfully

---

# 9. Phase 2 — Multi-Tenant Organization and Property Management

**Status:** [x] Completed

## Objective

Create the SaaS tenant hierarchy.

Hierarchy:

Organization
→ Property
→ Rooms
→ Residents

## Tasks

- [ ] Organization model
- [ ] Property model
- [ ] Property-user relationship
- [ ] Room model
- [ ] Organization creation
- [ ] Property creation
- [ ] Room creation
- [ ] Staff assignment
- [ ] Tenant context
- [ ] Tenant authorization

## Critical Requirement

One organization/property must NEVER be able to access another organization's data.

## Acceptance Criteria

- [ ] Organizations can be created
- [ ] Properties can be created
- [ ] Rooms can be created
- [ ] Staff can be assigned
- [ ] Tenant isolation tests pass

---

# 10. Phase 3 — Resident Management

**Status:** [x] Completed

## Objective

Allow operators to manage residents.

## Tasks

- [ ] Resident model
- [ ] Resident profile
- [ ] Room assignment
- [ ] Meal plan
- [ ] Active/inactive status
- [ ] Resident creation
- [ ] Resident update
- [ ] Resident deletion/deactivation
- [ ] Resident search
- [ ] Resident filtering
- [ ] CSV import
- [ ] CSV validation
- [ ] Import preview
- [ ] Import error reporting

## Acceptance Criteria

Admin can:

- [ ] Add resident
- [ ] Assign room
- [ ] Change room
- [ ] Change meal plan
- [ ] Deactivate resident
- [ ] Import residents from CSV
- [ ] View resident list

---

# 11. Phase 4 — Menu Management

**Status:** [ ] Not Started

## Objective

Allow administrators to create and manage meal menus.

## Tasks

- [ ] Menu model
- [ ] Meal type
- [ ] Menu date
- [ ] Menu title
- [ ] Menu description
- [ ] Create menu
- [ ] Edit menu
- [ ] Delete menu
- [ ] View daily menu
- [ ] View upcoming menus

## Meal Types

- LUNCH
- DINNER

Future:

- BREAKFAST
- SNACK

Do not implement unnecessary meal types unless required.

## Acceptance Criteria

Admin can create a menu for a specific date and meal type.

Resident can view the menu.

---

# 12. Phase 5 — Meal Booking

**Status:** [ ] Not Started

## Objective

Allow residents to book or skip meals.

## Core Workflow

Resident
→ View Menu
→ Book
→ Booking Created

## Tasks

- [ ] Booking model
- [ ] Book meal API
- [ ] Skip meal API
- [ ] Cancel booking if allowed
- [ ] Booking cutoff
- [ ] Booking validation
- [ ] Duplicate booking prevention
- [ ] Booking status
- [ ] Booking history
- [ ] Admin booking view

## Booking States

- BOOKED
- SKIPPED
- CANCELLED
- EXPIRED

## Acceptance Criteria

- [ ] Resident can book lunch
- [ ] Resident can skip lunch
- [ ] Duplicate bookings are prevented
- [ ] Cutoff rules work
- [ ] Admin can see total bookings

---

# 13. Phase 6 — Meal Generation Engine

**Status:** [ ] Not Started

## Objective

Convert valid bookings into individually traceable meals.

This is one of the most important phases.

## Tasks

- [ ] Meal model
- [ ] Automatic meal generation
- [ ] Unique meal ID
- [ ] Secure QR token
- [ ] Meal state machine
- [ ] Meal timestamps
- [ ] Meal history
- [ ] Meal event tracking
- [ ] Audit events

## Meal States

BOOKED
→ PREPARING
→ PACKED
→ ASSIGNED
→ DISPATCHED
→ DELIVERED
→ CONFIRMED

Exception:

DELIVERED
→ DISPUTED
→ INVESTIGATING
→ RESOLVED

Cancellation:

BOOKED
→ CANCELLED

## Acceptance Criteria

For every valid booking:

- [ ] Exactly one meal is generated
- [ ] Meal has unique ID
- [ ] Meal has secure QR token
- [ ] Meal is linked to resident
- [ ] Meal is linked to property
- [ ] Meal has correct date/type
- [ ] State transitions are validated
- [ ] Important transitions create audit events

---

# 14. Phase 7 — Kitchen Operations

**Status:** [ ] Not Started

## Objective

Give kitchen staff accurate preparation and packing information.

## Tasks

- [ ] Kitchen dashboard
- [ ] Today's meal count
- [ ] Veg/non-veg count if supported
- [ ] Preparation status
- [ ] Packing status
- [ ] Start preparation
- [ ] Mark meals packed
- [ ] Meal batches
- [ ] Delivery batch creation
- [ ] Meal label/QR display

## Acceptance Criteria

Kitchen staff can:

- [ ] See required meal count
- [ ] Start preparation
- [ ] Track preparation
- [ ] Mark meals packed
- [ ] Create delivery batch

---

# 15. Phase 8 — Delivery Operations

**Status:** [ ] Not Started

## Objective

Track meals from kitchen dispatch to resident delivery.

## Tasks

- [ ] Delivery staff dashboard
- [ ] Delivery batches
- [ ] Assign staff
- [ ] Meal assignment
- [ ] QR scanner
- [ ] QR validation
- [ ] Dispatch status
- [ ] Delivery status
- [ ] Confirmation
- [ ] Invalid QR handling
- [ ] Already-delivered handling
- [ ] Wrong-property protection

## Acceptance Criteria

Delivery staff can:

1. View assigned batch
2. Scan meal QR
3. Verify meal
4. See correct resident/room
5. Mark meal delivered

The system must reject:

- Invalid QR
- Already delivered meal
- Wrong property meal
- Unauthorized delivery action

---

# 16. Phase 9 — Resident Meal Tracking

**Status:** [ ] Not Started

## Objective

Give residents visibility into their meal.

## Screens

- [ ] Home
- [ ] Today's menu
- [ ] Booking
- [ ] Meal status
- [ ] Meal history
- [ ] Complaint

## Meal Timeline

Booked
→ Preparing
→ Packed
→ Dispatched
→ Delivered
→ Confirmed

## Acceptance Criteria

Resident can see the current state of their meal.

---

# 17. Phase 10 — Complaint and Exception Management

**Status:** [ ] Not Started

## Objective

Digitize missing-meal and delivery issue resolution.

## Complaint Categories

- MISSING_MEAL
- WRONG_MEAL
- DAMAGED_PACKAGING
- LATE_DELIVERY
- QUALITY
- OTHER

## Tasks

- [ ] Complaint model
- [ ] Create complaint
- [ ] Complaint dashboard
- [ ] Complaint assignment
- [ ] Complaint status
- [ ] Investigation
- [ ] Resolution
- [ ] Resolution notes
- [ ] Notifications
- [ ] Complaint history

## Complaint States

OPEN
→ ASSIGNED
→ INVESTIGATING
→ RESOLVED

## Acceptance Criteria

Resident can report a missing meal.

Admin can:

- [ ] View complaint
- [ ] See meal timeline
- [ ] Assign complaint
- [ ] Investigate
- [ ] Resolve complaint
- [ ] Record resolution

---

# 18. Phase 11 — Admin Dashboard

**Status:** [ ] Not Started

## Objective

Provide operational visibility.

## Dashboard Metrics

- [ ] Total residents
- [ ] Today's meals
- [ ] Booked
- [ ] Preparing
- [ ] Packed
- [ ] Dispatched
- [ ] Delivered
- [ ] Confirmed
- [ ] Complaints
- [ ] Pending issues

## Operational Metrics

- [ ] Fulfillment rate
- [ ] Missing meal rate
- [ ] Complaint rate
- [ ] Average delivery time
- [ ] Average resolution time

## Alerts

- [ ] Missing meal alerts
- [ ] Delayed delivery alerts
- [ ] Pending meal alerts
- [ ] High complaint volume

---

# 19. Phase 12 — Analytics

**Status:** [ ] Not Started

## Objective

Convert operational data into useful information.

## Metrics

### Fulfillment Rate

Delivered meals / Booked meals × 100

### Missing Meal Rate

Missing meal complaints / Delivered meals × 100

### Complaint Rate

Complaints / Booked meals × 100

### Average Delivery Time

Delivered timestamp - Dispatch timestamp

### Average Resolution Time

Resolved timestamp - Complaint timestamp

## Tasks

- [ ] Analytics API
- [ ] Dashboard charts
- [ ] Daily reports
- [ ] Weekly reports
- [ ] Monthly reports
- [ ] Meal trends
- [ ] Complaint trends
- [ ] Delivery trends

---

# 20. Phase 13 — Notifications

**Status:** [ ] Not Started

## Notification Architecture

Use a provider abstraction.

NotificationService
→ Push Provider
→ WhatsApp Provider
→ SMS Provider

## Resident Notifications

- [ ] Booking confirmation
- [ ] Booking reminder
- [ ] Meal packed
- [ ] Meal dispatched
- [ ] Meal delivered
- [ ] Complaint update

## Admin Notifications

- [ ] High complaint volume
- [ ] Delayed delivery
- [ ] Operational anomaly

---

# 21. Phase 14 — Audit and Security Hardening

**Status:** [ ] Not Started

## Tasks

- [ ] Audit logging
- [ ] Permission review
- [ ] Tenant isolation review
- [ ] API security review
- [ ] Input validation
- [ ] Rate limiting
- [ ] Secure QR tokens
- [ ] Error handling
- [ ] Secret management
- [ ] Database backup strategy
- [ ] Logging
- [ ] Monitoring

## Security Acceptance Criteria

- [ ] No cross-tenant data access
- [ ] No privilege escalation
- [ ] Unauthorized APIs blocked
- [ ] Secrets not committed
- [ ] Sensitive data not exposed in logs

---

# 22. Phase 15 — Testing and QA

**Status:** [ ] Not Started

## Unit Testing

Test:

- [ ] Booking rules
- [ ] Cutoff rules
- [ ] Meal generation
- [ ] State transitions
- [ ] Permission logic
- [ ] QR validation
- [ ] Complaint workflow
- [ ] Analytics calculations

## Integration Testing

Test:

- [ ] Login
- [ ] Booking
- [ ] Meal generation
- [ ] Kitchen workflow
- [ ] Delivery workflow
- [ ] Complaint workflow

## End-to-End Test

Main workflow:

Resident
→ Login
→ Book lunch
→ Meal generated
→ Kitchen prepares
→ Meal packed
→ QR scanned
→ Meal delivered
→ Resident confirms

Exception workflow:

Resident
→ Book
→ Meal generated
→ Delivery
→ Missing meal
→ Complaint
→ Investigation
→ Resolution

---

# 23. Phase 16 — Pilot Deployment

**Status:** [ ] Not Started

## Objective

Deploy MealFlow to the first real hostel/PG.

Target:

100–300 residents.

## Tasks

- [ ] Production database
- [ ] Production backend
- [ ] Production frontend
- [ ] HTTPS
- [ ] Environment configuration
- [ ] Database backups
- [ ] Monitoring
- [ ] Error tracking
- [ ] Admin account
- [ ] Resident import
- [ ] Staff training
- [ ] Pilot documentation

---

# 24. Pilot Measurement

Collect baseline data before deployment.

Measure:

- [ ] Daily meals
- [ ] Missing meals
- [ ] Complaints
- [ ] Manual reconciliation time
- [ ] Delivery time
- [ ] Wastage
- [ ] Booking accuracy

After deployment compare:

Before vs After

Primary KPI:

## Meal Fulfillment Rate

Secondary KPIs:

- Missing meal rate
- Complaint rate
- Delivery time
- Resolution time
- Manual work
- Wastage

Do not fabricate results.

---

# 25. MVP Exclusions

Do NOT implement these during MVP unless explicitly approved:

- [ ] Rent management
- [ ] Accounting
- [ ] Payment gateway
- [ ] RFID
- [ ] Biometrics
- [ ] Face recognition
- [ ] Marketplace
- [ ] Advanced inventory
- [ ] Advanced procurement
- [ ] AI forecasting
- [ ] Advanced route optimization
- [ ] Full PG management suite

---

# 26. Future Development

After successful MVP validation:

## Phase F1 — Inventory

- Inventory tracking
- Ingredient consumption
- Stock alerts

## Phase F2 — Procurement

- Purchase planning
- Supplier management
- Cost tracking

## Phase F3 — AI Forecasting

- Meal demand prediction
- Wastage prediction
- Anomaly detection

## Phase F4 — Operational Intelligence

- Staff performance
- Kitchen efficiency
- Delivery optimization
- Menu intelligence

## Phase F5 — Full Accommodation Operations

Potentially:

- Rent
- Billing
- Maintenance
- Visitor management
- Complaints
- Attendance

These should only be considered after the meal-operation product has proven demand.

---

# 27. Current Sprint

**Current Phase:** Phase 0 — Project Initialization

**Current Objective:**

Create a stable development foundation.

**Do not start Phase 1 until Phase 0 acceptance criteria are satisfied.**

---

# 28. Change Management

If a new feature is requested:

1. Determine whether it belongs to MVP.
2. Check the master implementation document.
3. Determine architectural impact.
4. Update this development plan if necessary.
5. Obtain approval before adding major scope.

Do not silently expand the product scope.

---

# 29. AI Agent Instructions

The development agent must:

1. Read `context.md`.
2. Read the relevant section of `MealFlow_Implementation_Document.md`.
3. Read this `DEVELOPMENT_PLAN.md`.
4. Inspect existing code before modifying it.
5. Implement only the current phase.
6. Run tests.
7. Fix errors.
8. Update this document.
9. Update README/documentation when necessary.
10. Report completed work and remaining work.

The agent must NOT automatically proceed to the next phase.

---

# 30. Completion Standard

A phase is complete only when:

- [ ] Required database changes implemented
- [ ] Required backend APIs implemented
- [ ] Authorization implemented
- [ ] Frontend UI implemented
- [ ] Validation implemented
- [ ] Error handling implemented
- [ ] Tests implemented
- [ ] Tests passing
- [ ] Documentation updated
- [ ] End-to-end workflow verified
- [ ] No critical known bugs remain

---

# 31. Master MVP Completion Criteria

MealFlow MVP is complete when this entire workflow works:

Resident
↓
Login
↓
View Menu
↓
Book Lunch
↓
Meal Created
↓
Kitchen Sees Count
↓
Meal Prepared
↓
Meal Packed
↓
Unique Meal/QR Identity
↓
Delivery Batch
↓
QR Scan
↓
Validation
↓
Dispatch
↓
Delivery
↓
Resident Confirmation
↓
Audit Trail

And the exception workflow works:

Meal
↓
Missing Meal
↓
Complaint
↓
Admin Investigation
↓
Meal Timeline
↓
Resolution
↓
Audit Trail

---

# 32. Current Priority

The highest priority is NOT visual polish.

The highest priority is:

> Build a reliable end-to-end meal traceability system.

Priority order:

1. Correctness
2. Security
3. Data integrity
4. End-to-end workflow
5. Usability
6. Performance
7. Visual polish
8. Advanced intelligence

---

# 33. Development Log

The development agent should append important implementation decisions here.

## 2026-08-24

Project planning initialized.

Status:

Phase 0 — Not Started

Next action:

Set up project foundation.