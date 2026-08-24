# MealFlow — Implementation & Product Development Document

**Version:** 1.0  
**Date:** 24 August 2026  
**Product:** MealFlow  
**Category:** B2B SaaS / Hostel & PG Meal Operations  
**Primary Pilot Market:** Greater Noida, NCR, India  
**Document Purpose:** Master implementation specification for Antigravity / AI coding agents

---

# 1. Executive Summary

MealFlow is a B2B SaaS platform for hostels, PGs, student accommodations, and similar residential properties that digitizes the complete meal-fulfillment workflow:

**Resident booking → meal headcount → kitchen preparation → packing → assignment → dispatch → delivery → confirmation → complaint/reconciliation → analytics**

The core problem is not merely that hostel operators use registers or WhatsApp. The deeper problem is that the operator cannot reliably answer:

- How many meals should be prepared?
- Which resident requested a meal?
- Which meal belongs to which resident?
- Was the meal packed?
- Who received it?
- Where did the process fail?
- How many meals were wasted?
- Which staff member handled the delivery?
- How quickly was a missing-meal complaint resolved?

MealFlow should create a digital identity and audit trail for every meal.

## Product thesis

> **MealFlow makes every hostel meal traceable from booking to delivery.**

The initial product must NOT become a generic PG-management platform. The MVP focuses specifically on meal operations and fulfillment.

---

# 2. Product Vision

## 2.1 Vision

Build the operational layer that allows hostel and PG operators to manage meals with minimal manual intervention.

## 2.2 Long-term vision

MealFlow should eventually evolve from:

**Meal Tracking**

into:

**Meal Operations Intelligence**

and eventually:

**Food Operations OS for Residential Accommodation**

Long-term capabilities may include:

- meal demand forecasting
- food-wastage prediction
- inventory forecasting
- procurement recommendations
- kitchen optimization
- staff performance analytics
- vendor management
- cost optimization

These are NOT MVP requirements.

---

# 3. Problem Statement

## Current workflow

Typical workflow:

Resident → WhatsApp/verbal request → caretaker → handwritten/Excel list → kitchen → manual tiffin preparation → manual distribution → complaint → manual investigation

This creates:

1. Missing tiffins
2. Wrong-room deliveries
3. Duplicate meals
4. Incorrect meal counts
5. Excess food preparation
6. Food wastage
7. Manual reconciliation
8. Staff dependency
9. Complaint disputes
10. Lack of accountability
11. Lack of historical operational data

## Core problem

> Hostel and PG operators lack a reliable digital system to coordinate, track, verify, and reconcile individual meals across the complete fulfillment lifecycle.

---

# 4. Product Positioning

Do NOT position MealFlow as:

> "Another PG management app."

Do NOT position it primarily as:

> "An AI-powered mess app."

Position it as:

> **"The operating system for hostel and PG meal operations."**

More specific positioning:

> **MealFlow gives hostel and PG operators end-to-end visibility over every meal—from resident booking to kitchen preparation to delivery and complaint resolution.**

---

# 5. Market and Competitive Context

Existing products already cover parts of the market, including:

- Mess management
- Meal booking
- QR/RFID attendance
- Billing
- Inventory
- Menu management
- Student apps
- PG management

Examples include MessMitra, StayManager, Capturo PG, HostelDash, and similar solutions.

Therefore MealFlow must NOT attempt to win by having the largest feature list.

## Differentiation

Existing approach:

> "Did the resident eat?"

MealFlow approach:

> **"Where is every meal in the fulfillment pipeline?"**

The differentiating concept is:

### Meal Traceability + Exception Management

Every meal should have:

- unique ID
- resident
- room
- property
- meal type
- date
- status
- timestamped events
- assigned staff
- delivery confirmation
- complaint history

---

# 6. Target Market

## Initial geography

Start with:

- Greater Noida
- Knowledge Park II
- Knowledge Park III
- Alpha I
- Alpha II
- Beta
- Gamma
- Pari Chowk
- nearby student-accommodation clusters

Do NOT initially attempt NCR-wide sales.

## Customer profile

Ideal first customer:

- 50–500 residents
- meals included in rent or meal plan
- centralized kitchen or controlled mess
- lunch/dinner distribution
- manual/WhatsApp/Excel workflow
- recurring missing-meal complaints
- multiple staff members
- willingness to pilot software

## Secondary market

Later:

- student hostels
- private hostel chains
- co-living operators
- college hostels
- corporate accommodation
- tiffin operators

---

# 7. User Personas

## 7.1 Owner

Goals:

- reduce complaints
- reduce wastage
- reduce operational cost
- reduce staff dependency
- see property performance

Needs:

- dashboard
- reports
- operational KPIs
- complaint visibility
- wastage metrics

## 7.2 Mess Manager / Admin

Goals:

- accurate meal count
- kitchen coordination
- delivery tracking
- complaint resolution

Needs:

- meal dashboard
- booking overview
- kitchen status
- complaints
- resident management

## 7.3 Kitchen Staff

Goals:

- know exactly how many meals to prepare

Needs:

- simple preparation screen
- veg/non-veg count
- special meal count
- packing status

## 7.4 Delivery Staff

Goals:

- know exactly what to deliver
- confirm delivery quickly

Needs:

- mobile interface
- assigned meals
- QR scanner
- one-tap delivery confirmation

## 7.5 Resident

Goals:

- book/skip meal
- know meal status
- receive meal
- report missing meal

Needs:

- simple mobile-first interface
- today's menu
- booking
- status tracking
- complaint reporting

---

# 8. Product Principles

1. Mobile-first for residents and delivery staff.
2. Desktop/tablet optimized for admins and kitchen.
3. Minimum manual data entry.
4. Every meal should be traceable.
5. Every important state change should be auditable.
6. Simple workflows for operational staff.
7. No unnecessary AI in MVP.
8. Multi-tenant from day one.
9. API-first architecture.
10. Security and authorization must be built into the architecture.
11. Build measurable operational outcomes.
12. Do not build unrelated PG features until meal operations are validated.

---

# 9. MVP Definition

## MVP objective

Solve one problem extremely well:

> **Track a lunch from resident booking to successful delivery and handle missing-meal exceptions.**

## MVP modules

### Required

- Authentication
- Organization
- Property
- Room management
- Resident management
- Staff management
- Menu management
- Meal booking
- Meal skipping
- Booking cutoff
- Automatic headcount
- Kitchen dashboard
- Meal generation
- Unique meal ID
- QR code
- Delivery tracking
- Delivery confirmation
- Missing-meal complaint
- Complaint management
- Admin dashboard
- Basic analytics
- Notifications
- Audit logs
- CSV resident import

### Explicitly excluded from MVP

- Rent management
- Full accounting
- Inventory
- Payment gateway
- RFID
- Biometric systems
- Face recognition
- AI forecasting
- Advanced route optimization
- Marketplace
- Social features
- Full hostel-management suite
- Vendor marketplace

---

# 10. Core User Journey

## Resident

1. Login
2. View today's meals
3. View lunch menu
4. Book lunch
5. Booking confirmation
6. Meal ID generated
7. Kitchen prepares meal
8. Meal packed
9. Meal assigned
10. Meal dispatched
11. Meal delivered
12. Resident sees status
13. Resident confirms receipt

If not received:

1. Resident opens meal
2. Selects "Report Missing Meal"
3. Complaint created
4. Admin receives alert
5. Staff investigates
6. Meal event history is displayed
7. Complaint resolved
8. Resolution recorded

---

# 11. Meal State Machine

The meal lifecycle is the core business workflow.

## Primary lifecycle

BOOKED
→ PREPARING
→ PACKED
→ ASSIGNED
→ DISPATCHED
→ DELIVERED
→ CONFIRMED

## Exception lifecycle

DELIVERED
→ DISPUTED
→ INVESTIGATING
→ RESOLVED

## Cancellation

BOOKED
→ CANCELLED

## State rules

### BOOKED
Created after resident successfully books a meal.

### PREPARING
Kitchen begins preparation.

### PACKED
Meal has been packed and identified.

### ASSIGNED
Meal assigned to delivery batch/staff.

### DISPATCHED
Meal leaves kitchen.

### DELIVERED
Delivery staff marks it delivered.

### CONFIRMED
Resident confirms receipt, or the system/admin policy confirms it after a defined period.

### DISPUTED
Resident reports a problem.

### INVESTIGATING
Admin/staff is handling the issue.

### RESOLVED
Complaint has a recorded resolution.

---

# 12. Meal Identity

Every meal must receive a unique ID.

Example:

`ML-20260824-000381`

Meal record:

- Meal ID
- Resident
- Room
- Property
- Meal type
- Date
- Menu
- Booking
- Status
- QR token
- Delivery batch
- Staff
- timestamps

## QR principle

Do NOT encode personal information directly into QR.

Bad:

`Rohan + phone + room`

Good:

`secure random meal token`

Backend resolves token to meal.

---

# 13. Booking Rules

Admin defines:

- booking opening time
- booking cutoff time
- distribution start time
- distribution end time

Example:

- Lunch opens: 08:00
- Lunch closes: 10:30
- Kitchen preparation: 10:45
- Distribution: 12:30

After cutoff:

> Booking closed.

Admin may have override permissions.

## Booking statuses

- BOOKED
- SKIPPED
- CANCELLED
- EXPIRED

---

# 14. Meal Count Logic

Example:

Residents = 300

At cutoff:

- Booked = 267
- Skipped = 21
- No response = 12

Kitchen receives:

Total meals = 267

Breakdown:

- Veg = 243
- Non-veg = 24
- Special = 3

The count must be calculated deterministically from valid bookings.

---

# 15. Kitchen Workflow

Kitchen dashboard:

Today's lunch:

- total residents
- total booked
- total skipped
- total pending
- veg
- non-veg
- special
- preparation progress
- packing progress

Kitchen actions:

- start preparation
- mark batch preparing
- mark meals packed
- generate/print meal labels
- create delivery batch

Kitchen UI must be extremely simple.

---

# 16. Delivery Workflow

Delivery staff sees:

- assigned delivery batch
- number of meals
- resident
- room
- meal ID
- delivery status

Workflow:

Scan QR
→ validate meal
→ show resident/room
→ mark delivered

If QR invalid:

> Invalid meal.

If already delivered:

> Meal already delivered.

If wrong property:

> Meal does not belong to this property.

---

# 17. Complaint Workflow

Categories:

- MISSING_MEAL
- WRONG_MEAL
- DAMAGED_PACKAGING
- LATE_DELIVERY
- QUALITY
- OTHER

Workflow:

Resident submits complaint.

System records:

- meal ID
- resident
- time
- complaint type
- description

Admin sees:

- complaint
- meal lifecycle
- delivery events
- assigned staff
- timestamps

Admin can:

- assign complaint
- change priority
- investigate
- resolve
- add resolution note

---

# 18. Exception Management

This is a key product differentiator.

Examples:

### Alert

"17 students have not confirmed lunch."

### Alert

"8 meals are packed but not dispatched."

### Alert

"7 missing-meal complaints today."

### Alert

"Friday food wastage is significantly higher."

### Alert

"Delivery staff has 12 unconfirmed meals."

The system should surface problems rather than only store data.

---

# 19. Admin Dashboard

Dashboard sections:

## Summary

- residents
- today's meals
- booked
- delivered
- pending
- disputed

## Operational metrics

- fulfillment rate
- missing meal rate
- average delivery time
- complaint rate
- resolution time

## Alerts

- missing meals
- delayed deliveries
- unconfirmed meals
- unusual activity

## Insights

- wastage trend
- complaint trend
- fulfillment trend

---

# 20. Resident UI

## Screen 1: Login

Fields:

- phone
- OTP

## Screen 2: Home

Display:

- resident name
- property
- room
- today's meals
- current meal status

## Screen 3: Menu

Display:

- date
- meal type
- menu
- booking status

Actions:

- Book
- Skip

## Screen 4: Meal Status

Timeline:

Booked
✓

Preparing
✓

Packed
✓

Dispatched
✓

Delivered
●

## Screen 5: Complaint

Options:

- missing
- wrong
- damaged
- late
- quality
- other

---

# 21. Kitchen UI

Main dashboard:

- today's meal count
- meal breakdown
- preparation status
- packing status

Buttons:

- Start preparation
- Mark packed
- Generate labels
- Create batch

Avoid complex navigation.

---

# 22. Delivery UI

Mobile-first.

Main screen:

- delivery batch
- meals remaining
- meals delivered

Primary action:

`SCAN QR`

After scan:

- resident
- room
- meal
- status

Primary action:

`MARK DELIVERED`

---

# 23. Owner UI

Dashboard:

- residents
- today's meals
- fulfillment rate
- pending
- complaints
- wastage
- staff activity

Reports:

- daily
- weekly
- monthly

---

# 24. Recommended Technology Stack

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

## ORM

- Prisma

## Cache / queues

- Redis

Use Redis initially only where needed; architecture should support it.

## Authentication

- JWT
- refresh tokens
- OTP provider for resident login if implemented

## QR

Standard QR generation and scanning libraries.

## Notifications

Potential integrations:

- WhatsApp Business API/provider
- SMS
- Web Push

Use provider abstraction so vendor can be changed.

## Hosting for MVP

Possible setup:

- Frontend: Vercel
- Backend: Render/Railway/AWS
- Database: managed PostgreSQL
- Redis: managed Redis

Move to AWS/GCP/Azure architecture when scale requires it.

---

# 25. Architecture

High-level architecture:

Client applications:

- Resident PWA
- Admin dashboard
- Kitchen dashboard
- Delivery PWA

↓

API Gateway / Backend

↓

Domain modules:

- Auth
- Organizations
- Properties
- Residents
- Rooms
- Menus
- Bookings
- Meals
- Kitchen
- Delivery
- Complaints
- Notifications
- Analytics

↓

PostgreSQL

↓

Optional Redis

↓

External services:

- WhatsApp
- SMS
- Push notifications

---

# 26. Repository Structure

Use a monorepo.

```text
mealflow/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   │
│   └── api/
│       └── src/
│           ├── auth/
│           ├── organizations/
│           ├── properties/
│           ├── rooms/
│           ├── residents/
│           ├── users/
│           ├── menus/
│           ├── bookings/
│           ├── meals/
│           ├── kitchen/
│           ├── delivery/
│           ├── complaints/
│           ├── notifications/
│           ├── analytics/
│           └── audit/
│
├── packages/
│   ├── database/
│   ├── types/
│   ├── ui/
│   └── config/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── package.json
├── turbo.json
└── README.md
```

---

# 27. Multi-Tenant Architecture

MealFlow is a SaaS.

One platform:

Organization A
→ Property A1
→ Property A2

Organization B
→ Property B1

Every property-specific query must be tenant-aware.

Recommended hierarchy:

Organization
→ Property
→ Rooms
→ Residents
→ Meals

Staff permissions should be scoped to authorized organizations/properties.

Never allow one property to access another property's data.

---

# 28. Database Schema

## organizations

Fields:

- id UUID PK
- name
- owner_id
- created_at
- updated_at

## properties

Fields:

- id UUID PK
- organization_id FK
- name
- address
- city
- timezone
- meal_service_enabled
- created_at
- updated_at

## users

Fields:

- id UUID PK
- name
- phone
- email
- password_hash
- role
- created_at
- updated_at

Roles:

- OWNER
- ADMIN
- MANAGER
- KITCHEN_STAFF
- DELIVERY_STAFF
- RESIDENT

## property_users

Fields:

- id UUID PK
- property_id FK
- user_id FK
- role
- created_at

## rooms

Fields:

- id UUID PK
- property_id FK
- room_number
- floor
- capacity
- created_at

## residents

Fields:

- id UUID PK
- user_id FK
- property_id FK
- room_id FK
- resident_code
- meal_plan
- status
- joined_at
- left_at

## menus

Fields:

- id UUID PK
- property_id FK
- date
- meal_type
- title
- description
- created_at

## meal_bookings

Fields:

- id UUID PK
- resident_id FK
- menu_id FK
- status
- booked_at
- cancelled_at
- cutoff_at

## meals

Fields:

- id UUID PK
- booking_id FK
- resident_id FK
- property_id FK
- meal_type
- meal_date
- meal_code
- qr_token
- status
- created_at
- updated_at

## delivery_batches

Fields:

- id UUID PK
- property_id FK
- staff_id FK
- meal_type
- meal_date
- started_at
- completed_at
- status

## delivery_events

Fields:

- id UUID PK
- meal_id FK
- staff_id FK
- event_type
- latitude
- longitude
- timestamp
- metadata

## complaints

Fields:

- id UUID PK
- meal_id FK
- resident_id FK
- category
- description
- status
- priority
- assigned_to
- created_at
- resolved_at
- resolution

## audit_logs

Fields:

- id UUID PK
- organization_id
- user_id
- entity_type
- entity_id
- action
- old_value
- new_value
- created_at

---

# 29. Database Relationships

Core relationships:

Organization 1:N Properties

Property 1:N Rooms

Property 1:N Residents

Room 1:N Residents

Property 1:N Menus

Resident 1:N MealBookings

Menu 1:N MealBookings

MealBooking 1:1 Meal

Meal 1:N DeliveryEvents

Meal 1:0..N Complaints

Property 1:N DeliveryBatches

DeliveryBatch 1:N Meals

User 1:N AuditLogs

---

# 30. Database Rules

Use:

- UUID primary keys
- foreign keys
- indexes
- timestamps
- soft-delete where operationally useful
- database constraints
- unique constraints

Important indexes:

- residents.property_id
- residents.room_id
- menus.property_id + date
- meal_bookings.resident_id
- meal_bookings.menu_id
- meals.property_id + meal_date
- meals.qr_token
- meals.status
- delivery_events.meal_id
- complaints.status
- complaints.property_id

QR token must be unique.

---

# 31. API Design

Base:

`/api/v1`

## Auth

POST `/auth/register`

POST `/auth/login`

POST `/auth/refresh`

POST `/auth/logout`

POST `/auth/forgot-password`

POST `/auth/verify-otp`

## Properties

GET `/properties`

POST `/properties`

GET `/properties/:id`

PATCH `/properties/:id`

DELETE `/properties/:id`

## Residents

GET `/properties/:id/residents`

POST `/properties/:id/residents`

GET `/residents/:id`

PATCH `/residents/:id`

DELETE `/residents/:id`

POST `/properties/:id/residents/import`

## Menus

GET `/properties/:id/menus`

POST `/properties/:id/menus`

GET `/menus/:id`

PATCH `/menus/:id`

DELETE `/menus/:id`

## Bookings

POST `/menus/:id/book`

POST `/menus/:id/skip`

GET `/residents/:id/bookings`

GET `/properties/:id/bookings`

## Meals

GET `/meals/today`

GET `/meals/:id`

GET `/properties/:id/meals`

GET `/properties/:id/meals/summary`

## Kitchen

GET `/kitchen/today`

GET `/kitchen/meal-count`

GET `/kitchen/preparation-list`

POST `/kitchen/batches`

PATCH `/kitchen/batches/:id`

POST `/kitchen/meals/:id/pack`

## Delivery

GET `/delivery/today`

GET `/delivery/batches/:id`

POST `/delivery/scan`

POST `/delivery/meals/:id/dispatch`

POST `/delivery/meals/:id/deliver`

POST `/delivery/meals/:id/confirm`

## Complaints

POST `/complaints`

GET `/complaints`

GET `/complaints/:id`

PATCH `/complaints/:id`

POST `/complaints/:id/resolve`

## Analytics

GET `/analytics/dashboard`

GET `/analytics/meals`

GET `/analytics/delivery`

GET `/analytics/complaints`

GET `/analytics/wastage`

---

# 32. API Response Standards

Use a consistent response structure.

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Meal delivered successfully"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "MEAL_ALREADY_DELIVERED",
    "message": "This meal has already been delivered"
  }
}
```

Use HTTP status codes correctly.

Examples:

- 200 success
- 201 created
- 400 validation error
- 401 unauthorized
- 403 forbidden
- 404 not found
- 409 conflict
- 429 rate limit
- 500 server error

---

# 33. Authentication and Authorization

Use RBAC.

## Owner

Full organization access.

## Admin

Operational property access.

## Manager

Residents + meals + complaints.

## Kitchen

Kitchen module only.

## Delivery

Delivery module only.

## Resident

Own profile + own bookings + own meals + own complaints.

Authorization must be enforced on backend, not only frontend.

---

# 34. Security Requirements

Mandatory:

- HTTPS
- password hashing
- JWT expiration
- refresh-token rotation where applicable
- rate limiting
- input validation
- SQL injection protection through ORM
- authorization checks
- secure QR tokens
- audit logging
- database backups
- environment variables for secrets
- no secrets in source code
- secure CORS configuration
- request logging without exposing sensitive data

Never trust client-supplied:

- property ID
- organization ID
- resident ID
- role
- delivery status

Backend must derive/verify these from authenticated context.

---

# 35. Notification System

Create a notification abstraction.

Example:

```text
NotificationService
├── PushProvider
├── WhatsAppProvider
└── SMSProvider
```

This prevents provider lock-in.

Notifications:

### Resident

- booking confirmed
- booking cutoff reminder
- meal packed
- meal dispatched
- meal delivered
- complaint update

### Admin

- high complaint volume
- pending meals
- delayed delivery
- abnormal operational event

---

# 36. CSV Import

This is important for adoption.

Most operators may already maintain resident lists in Excel.

Support:

```text
name
phone
email
room_number
resident_code
meal_plan
status
```

Workflow:

Upload CSV
→ validate
→ show preview
→ report errors
→ confirm import
→ create/update residents

Never silently import bad data.

---

# 37. Audit Trail

Every important mutation should create an audit record.

Examples:

- booking cancelled
- meal status changed
- delivery marked
- complaint resolved
- resident moved
- admin changed cutoff time

Audit record:

- actor
- action
- entity
- old state
- new state
- timestamp

This is especially important for meal disputes.

---

# 38. Analytics

## MVP metrics

### Fulfillment rate

Successfully delivered meals / booked meals × 100

### Missing meal rate

Missing meal complaints / delivered meals × 100

### Complaint rate

Complaints / booked meals × 100

### Average delivery time

Average:

`Delivered timestamp - Dispatch timestamp`

### Resolution time

Average:

`Resolved timestamp - Complaint timestamp`

### Booking accuracy

Actual required meals versus prepared meals.

---

# 39. Wastage Tracking

MVP may initially support manual wastage input.

Example:

```text
Prepared: 280
Consumed/delivered: 267
Remaining: 13
```

Admin enters wastage.

Later integrate automatic estimation.

Do not claim precise food-wastage measurement without a reliable data source.

---

# 40. Future AI Architecture

Do not add ML before collecting useful data.

Potential feature:

## Meal demand forecasting

Inputs:

- historical bookings
- actual deliveries
- skipped meals
- day of week
- meal type
- menu
- holidays
- exam periods
- resident population
- weather if validated as useful

Output:

```text
Expected lunch consumption: 274
Recommended preparation: 281
Confidence: 91%
```

## Anomaly detection

Detect:

- unusual missing-meal rate
- unusual wastage
- unusual delivery delays
- unusual complaint concentration

Example:

Normal missing-meal rate = 1–2%

Current = 8.7%

System creates:

`HIGH_MISSING_MEAL_ANOMALY`

---

# 41. Future Product Expansion

Phase after successful MVP:

## Phase A

Meal operations.

## Phase B

Kitchen operations.

## Phase C

Inventory.

## Phase D

Procurement.

## Phase E

Billing.

## Phase F

AI forecasting.

## Phase G

Complete PG operations.

Do not reverse this order.

---

# 42. Offline Capability

Delivery environments may have intermittent connectivity.

Future PWA behavior:

1. Download today's assigned meals.
2. Scan QR offline.
3. Store event locally.
4. Mark pending sync.
5. Sync when connectivity returns.
6. Resolve conflicts safely.

Offline support should be introduced after the basic online workflow is stable.

---

# 43. Deployment Architecture

Initial:

```text
Internet
   |
Frontend
   |
Backend API
   |
PostgreSQL
   |
Redis
```

Use managed infrastructure where possible.

Separate:

- development
- staging
- production

Never test directly on production.

---

# 44. Environment Variables

Example:

```text
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
REDIS_URL=
NEXT_PUBLIC_API_URL=
WHATSAPP_API_KEY=
SMS_API_KEY=
SENTRY_DSN=
```

Secrets must be stored in the hosting provider's secret manager/environment configuration.

---

# 45. Testing Strategy

## Unit tests

Test:

- booking logic
- cutoff logic
- meal state transitions
- permission logic
- complaint rules
- QR validation

## Integration tests

Test:

- resident booking → meal creation
- kitchen packing → delivery assignment
- QR scan → delivery
- complaint → resolution

## E2E test

The most important E2E:

```text
Create resident
→ login
→ book lunch
→ meal generated
→ kitchen prepares
→ meal packed
→ delivery scans QR
→ delivered
→ resident confirms
```

Second E2E:

```text
Book
→ prepare
→ dispatch
→ resident reports missing
→ admin investigates
→ resolve
```

---

# 46. Definition of Done

A feature is not complete until:

- backend endpoint exists
- authorization exists
- validation exists
- database migration exists
- frontend UI exists
- loading state exists
- error state exists
- success state exists
- tests exist
- audit behavior is defined
- documentation is updated

Do not mark features complete just because the UI exists.

---

# 47. UX Principles

Resident:

- maximum 2–3 taps for booking
- mobile-first
- clear status
- no unnecessary dashboards

Kitchen:

- large buttons
- minimum typing
- clear counts

Delivery:

- scan-first
- one primary action
- minimal navigation

Admin:

- information-dense but organized
- alerts first
- operational KPIs
- drill-down capability

Owner:

- outcomes first
- financial/operational insights
- trend visualization

---

# 48. MVP Roadmap

## Phase 0 — Validation

Duration: 1 week

Tasks:

- interview 20–30 PG operators
- identify actual workflows
- record current tools
- measure complaints
- measure wastage
- measure staff time
- identify one pilot

Success:

> At least one operator agrees to pilot.

---

## Phase 1 — Prototype

Duration: 1 week

Create:

Resident screens
- login
- home
- menu
- booking
- status
- complaint

Admin screens
- dashboard
- residents
- menu
- meals
- complaints

Kitchen:
- meal count
- preparation

Delivery:
- batch
- QR scan
- delivery

Success:

> Pilot operator understands the workflow without explanation.

---

## Phase 2 — MVP Development

Duration: 2–3 weeks

Build:

- auth
- tenant model
- residents
- rooms
- menu
- bookings
- meals
- QR
- kitchen
- delivery
- complaints
- audit
- dashboard

Success:

> One complete lunch can be digitally tracked end-to-end.

---

## Phase 3 — Pilot

Duration: 2 weeks

Deploy to:

100–300 residents.

Run alongside existing process initially.

Measure:

- missing meals
- complaint count
- delivery time
- staff time
- wastage
- booking accuracy

---

## Phase 4 — Productization

Add:

- WhatsApp
- push notifications
- CSV import
- reports
- better roles
- offline support
- operational alerts

---

## Phase 5 — Monetization

Test pricing.

Initial hypotheses:

Starter: ₹999/month

Growth: ₹2,499/month

Pro: ₹4,999/month

Enterprise: custom

These are hypotheses and must be validated through customer interviews.

---

# 49. Success Metrics

Primary KPI:

## Meal Fulfillment Rate

`Successfully delivered meals / booked meals × 100`

Secondary:

- missing meal rate
- complaint rate
- average delivery time
- average resolution time
- meal wastage
- staff manual hours
- booking accuracy
- resident satisfaction

Business metrics:

- pilot conversion
- paid conversion
- monthly recurring revenue
- customer retention
- properties per customer
- residents per property
- support cost

---

# 50. Pilot Measurement Framework

Before MealFlow:

Collect 7 days of baseline data.

Example:

```text
Residents: 250
Meals/day: 450
Missing meals/day: 12
Complaints/day: 15
Manual reconciliation: 2 hours/day
Estimated wastage: 15%
```

After MealFlow:

Collect the same metrics.

Compare:

```text
                 BEFORE     AFTER

Missing meals       12         5
Complaints          15         7
Manual work          2h        30m
Wastage             15%       10%
```

Do not invent results. These numbers are examples only.

---

# 51. Product Moat

The QR code is not the moat.

The moat should become:

1. Meal-event dataset
2. Operational workflow integration
3. Historical behavior
4. Demand forecasting
5. Anomaly detection
6. Kitchen optimization
7. Procurement intelligence

Long-term:

> The platform knows how food moves through residential accommodation.

---

# 52. Development Rules for Antigravity

The AI coding agent MUST follow these rules.

## Rule 1

Do not build the whole application in one generation.

Build module-by-module.

## Rule 2

Do not introduce technologies not approved in this document without explaining why.

## Rule 3

Do not add unrequested features.

## Rule 4

Do not replace PostgreSQL with MongoDB without architectural justification.

## Rule 5

Use TypeScript throughout frontend and backend.

## Rule 6

Every backend endpoint requires authorization.

## Rule 7

Every database migration must be reviewable.

## Rule 8

Every feature requires tests.

## Rule 9

Never hardcode secrets.

## Rule 10

Do not use mock data in production paths.

## Rule 11

Use seed data only for development.

## Rule 12

Maintain documentation while developing.

## Rule 13

Keep business logic in backend/domain services, not UI components.

## Rule 14

Use reusable components.

## Rule 15

Keep APIs versioned under `/api/v1`.

---

# 53. Recommended Development Order

Antigravity should implement in exactly this order:

## Sprint 1

Project setup

- monorepo
- Next.js
- NestJS
- PostgreSQL
- Prisma
- Docker
- environment configuration
- linting
- formatting
- testing

## Sprint 2

Authentication

- users
- roles
- JWT
- authorization
- tenant context

## Sprint 3

Organization and property

- organization
- property
- rooms
- staff

## Sprint 4

Residents

- resident creation
- resident profile
- room assignment
- CSV import

## Sprint 5

Menu and booking

- menu
- booking
- skip
- cutoff
- headcount

## Sprint 6

Meal engine

- meal generation
- unique IDs
- QR tokens
- state machine
- audit events

## Sprint 7

Kitchen

- dashboard
- preparation
- packing
- batches

## Sprint 8

Delivery

- delivery assignment
- QR scanning
- dispatch
- delivery
- confirmation

## Sprint 9

Complaints

- missing meal
- wrong meal
- late delivery
- investigation
- resolution

## Sprint 10

Analytics

- dashboard
- fulfillment
- complaints
- delivery time
- wastage

## Sprint 11

Notifications

- push
- WhatsApp abstraction
- SMS abstraction

## Sprint 12

Pilot hardening

- security
- error handling
- testing
- logging
- backups
- deployment

---

# 54. First Release Acceptance Criteria

The MVP can be considered ready for pilot only when:

### Resident

- can log in
- can see menu
- can book lunch
- can skip lunch
- can see meal status
- can report missing meal

### Admin

- can create property
- can add rooms
- can add/import residents
- can create menu
- can see bookings
- can see meal counts
- can see meal status
- can see complaints

### Kitchen

- can see required count
- can start preparation
- can mark meals packed

### Delivery

- can see assigned meals
- can scan QR
- can validate QR
- can mark delivered

### System

- every meal has unique ID
- every important state change is recorded
- tenant isolation works
- RBAC works
- errors are handled
- core workflows have automated tests

---

# 55. Example End-to-End Scenario

Property:

`ABC Student Hostel`

Residents:

`300`

Resident:

`Rohan`

Room:

`B-304`

Menu:

`Rajma + Rice + Roti + Salad`

At 9:15:

Rohan books lunch.

System:

```text
Booking created
Meal created
Meal ID = ML-20260824-000381
Status = BOOKED
```

At 10:45:

Kitchen starts.

```text
BOOKED
→ PREPARING
```

At 12:00:

Meal packed.

```text
PREPARING
→ PACKED
```

Delivery staff receives batch.

```text
PACKED
→ ASSIGNED
```

Staff leaves kitchen.

```text
ASSIGNED
→ DISPATCHED
```

At room B-304:

Staff scans QR.

System verifies token.

```text
Valid
Correct property
Correct meal
Not previously delivered
```

Staff confirms.

```text
DISPATCHED
→ DELIVERED
```

Rohan confirms.

```text
DELIVERED
→ CONFIRMED
```

If Rohan does not receive it:

Rohan reports:

`MISSING_MEAL`

System shows:

```text
Booked ✓
Prepared ✓
Packed ✓
Assigned ✓
Dispatched ✓
Delivered ✗
```

Admin sees exactly where investigation must begin.

---

# 56. Future Vision

Once MealFlow has operational data, expand into:

## Demand prediction

"Prepare 281 lunches tomorrow."

## Wastage prediction

"Friday lunch wastage risk: HIGH."

## Delivery anomaly

"B block has 3× normal missing-meal complaints."

## Staff analytics

"Average delivery time increased 18% this week."

## Procurement

"Estimated rice requirement for next 7 days."

## Menu intelligence

"Paneer-based dinner has 12% higher skip rate."

This is where the product becomes difficult to replace.

---

# 57. Immediate Next Steps

Do NOT begin by asking Antigravity to build every feature.

First create the repository and documentation.

Then implement:

1. Project scaffold
2. Database
3. Authentication
4. Organization/property
5. Residents/rooms
6. Menu
7. Booking
8. Meal engine
9. Kitchen
10. Delivery
11. Complaints
12. Analytics
13. Notifications
14. Testing
15. Deployment

The first technical milestone is:

> **A resident books lunch and the system generates a traceable meal that can be packed, scanned, delivered, and confirmed.**

Everything else is secondary.

---

# 58. Master Product Statement

Use this as the canonical product description throughout development:

> **MealFlow is a multi-tenant B2B SaaS platform for hostels, PGs, student accommodations, and similar residential properties. It digitizes the complete meal fulfillment lifecycle—from resident meal booking and kitchen headcount to meal preparation, QR-based identification, delivery confirmation, missing-meal complaint handling, and operational analytics. The MVP focuses on making every meal traceable and reducing manual reconciliation, delivery errors, complaints, and food wastage.**

---

# 59. Final Product Strategy

The product strategy is:

```text
                    VALIDATE
                       ↓
                 ONE PG PILOT
                       ↓
              MEAL TRACEABILITY
                       ↓
             DELIVERY RELIABILITY
                       ↓
             EXCEPTION MANAGEMENT
                       ↓
               OPERATIONAL DATA
                       ↓
               AI FORECASTING
                       ↓
             FOOD OPTIMIZATION
                       ↓
              MEAL OPERATIONS OS
                       ↓
                 PG OPERATIONS
```

The fundamental principle is:

> **Solve the meal problem first. Expand only after proving measurable value.**

