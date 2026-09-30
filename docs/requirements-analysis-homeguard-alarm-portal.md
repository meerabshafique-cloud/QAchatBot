# Requirements Analysis: HomeGuard Alarm Portal

**Document Status:** Pre-Implementation Analysis  
**Target Client:** Northstar Secure Ltd.  
**Project Type:** Synthetic Test Brief (contains intentional QA traps)  
**Date Analyzed:** 2026-09-30

---

## Summary

**HomeGuard Alarm Portal** is a responsive web application designed for residential customers of Northstar Secure Ltd. to manage home security alarm schedules. The platform enables homeowners to:

- Configure and manage alarm schedules with flexible recurrence patterns
- Invite and manage household members with granular permission levels (edit, view, arm/disarm)
- Receive critical notifications via email and SMS for alarm triggers and security events
- Review alarm history and activity logs spanning 90 days
- Activate a "Vacation Mode" to suspend alarms during extended absences
- Receive notifications of new device logins for account security

The portal targets 25,000 users at scale and is intended to be the primary interface for residential alarm management, replacing manual phone-based scheduling and support workflows.

---

## 2. Functional Requirements

### Core Scheduling (FR-01 to FR-08)
- **FR-01:** Homeowners must sign up with email address and create password; email verification required before account activation
- **FR-02:** System supports up to 10 active alarm schedules per homeowner
- **FR-03:** Each schedule includes: name, time (HH:MM in local timezone), recurrence pattern (once, daily, weekly, monthly), and enabled/disabled toggle
- **FR-04:** Schedules support snooze durations: 5min, 15min, 30min, 1hr (user-selectable)
- **FR-05:** Homeowners may invite up to 5 Family Members to manage shared schedules

### Family Member & Permission Management (FR-06 to FR-09)
- **FR-06:** Homeowners invite Family Members via email; invitees create account and accept invitation
- **FR-07:** Permission levels: Edit (can create/edit/delete schedules and arm/disarm), View (can only read config), Arm/Disarm Only (can trigger alarms but not edit)
- **FR-08:** Homeowners may revoke Family Member access at any time
- **FR-09:** Support Agents have read-only access to customer configs and activity logs; cannot modify any data

### History & Notifications (FR-10 to FR-13)
- **FR-10:** System retains alarm trigger history for 90 days with filtering by schedule, date range, and outcome
- **FR-11:** Homeowners receive new-device login notifications via email (e.g., "Your account was accessed from a new Chrome browser on Windows")
- **FR-12:** Critical alerts (unauthorized access attempts, alarm triggers) must be sent via dual channels: email + SMS (if available)
- **FR-13:** Dashboard displays a widget listing upcoming alarms for the next 7 days with snooze options

### Advanced Features (FR-14 to FR-15)
- **FR-14:** Vacation Mode: toggle to pause all schedules for a specified date range; mode auto-disables on end date
- **FR-15:** Export alarm history as CSV for personal record-keeping (90-day max per export)

### Business Rules (BR-01 to BR-06)
- **BR-01:** Only the Homeowner can invite or remove Family Members; Family Members cannot perform these actions
- **BR-02:** Family Members with View-only permission cannot arm, disarm, edit, or delete schedules; they can only read
- **BR-03:** Email-based invitations expire after 7 days and must be resent if unused
- **BR-04:** Deleted schedules are soft-deleted and recoverable by Administrator for 30 days; after 30 days, permanent deletion occurs
- **BR-05:** Alarm triggers are immutable in history; original trigger time and outcome cannot be edited
- **BR-06:** Support Agents cannot upgrade their own permissions or escalate to admin access

### Alarm Creation Acceptance Criteria
An alarm schedule is considered successfully created when:
1. All required fields (name, time, recurrence) are provided and valid
2. Schedule count does not exceed homeowner's limit (10 active max)
3. Recurrence pattern is syntactically valid (weekly patterns must specify days; monthly patterns must specify day-of-month)
4. Timezone is explicitly set (no default assumption)
5. Schedule is persisted to database with created-by audit trail
6. Homeowner receives confirmation notification with schedule summary
7. Schedule immediately appears in dashboard and in Family Members' views (respecting permission levels)

---

## 3. Non-Functional Requirements

### Performance & Scalability
- **P-01:** API latency: 700ms p95 across all endpoints (including database round-trip)
- **P-02:** System designed to support 25,000 concurrent users at steady state
- **P-03:** Database query optimization required for history filters (date range + schedule + outcome)

### Security & Compliance
- **S-01:** No plaintext passwords stored; bcrypt with minimum 10 rounds
- **S-02:** All authentication traffic over HTTPS only; no HTTP fallback
- **S-03:** Session tokens valid for 24 hours; refresh tokens valid for 7 days
- **S-04:** Family Member invitations are single-use tokens; token bindings to email address required
- **S-05:** 12-month audit log retention for compliance (login events, schedule changes, permission changes)
- **S-06:** WCAG 2.1 AA accessibility compliance for core workflows (signup, login, dashboard, schedule creation)

### User Experience
- **U-01:** Responsive design for desktop (1920px+), tablet (768px–1024px), and mobile (375px–667px)
- **U-02:** All pages must load initial state within 2 seconds on 4G LTE (50 Mbps)
- **U-03:** Timezone auto-detection from browser; user can override
- **U-04:** Form validation feedback inline; no blocking modal errors

---

## 4. User Roles and Permissions

### Homeowner
- **Authority:** Full control over account, schedules, and household
- **Permissions:**
  - Create, read, update, delete schedules (up to 10 active)
  - Arm/disarm schedules
  - Invite Family Members (up to 5)
  - Remove Family Members
  - Assign permissions to Family Members
  - View complete activity log and history (90 days)
  - Export alarm history as CSV
  - Toggle Vacation Mode
  - View and confirm new device logins
- **Constraint:** Cannot delegate Family Member invitation rights; only Homeowner may invite

### Family Member
- **Authority:** Conditional; depends on assigned permission level
- **Permissions (by level):**
  - **Edit:** Can create, edit, delete schedules; can arm/disarm; cannot invite or remove other members
  - **Arm/Disarm Only:** Can trigger arm/disarm; cannot create, edit, or view configuration
  - **View Only:** Can read schedule configuration and history; cannot arm, disarm, edit, or delete
- **Constraint:** Cannot modify permissions or revoke other members; cannot access account settings

### Support Agent
- **Authority:** Read-only assistance for customer issue investigation
- **Permissions:**
  - View customer configurations and schedule details
  - View alarm trigger history and activity logs
  - Cannot modify any data (no create, update, delete)
  - Cannot reset customer passwords (escalated to Admin)
- **Constraint:** Cannot upgrade own permissions; cannot access other customers' data without explicit assignment

### Administrator
- **Authority:** System-level control for operational support and compliance
- **Permissions:**
  - View all accounts and audit logs
  - Manage user access and plan tiers
  - Recover soft-deleted schedules within 30-day window
  - Access system settings and configurations
  - Manage Support Agent assignments and permissions
- **Constraint:** Sign-off from both Product Owner (Maya Chen) and Technical Lead (Omar Rahman) required for admin-level changes affecting data retention or access policies

---

## 5. Recommended Implementation Phases

The document provides a 6-phase delivery plan (source document's proposed sequencing; presented for review rather than endorsed as final until domain mismatch is resolved):

| Phase | Name | Duration | Effort | Notes |
|-------|------|----------|--------|-------|
| 1 | Discovery & UX | 3 days | $2,000 | Wireframes, user flows, design system |
| 2 | Authentication & Roles | 4 days | $3,500 | User signup, login, session mgmt, RBAC |
| 3 | Alarm Scheduling | 5 days | $4,000 | **Critical path.** Core CRUD for schedules, recurrence engine |
| 4 | Notifications | 3 days | $2,500 | Email, SMS integration; notification templates |
| 5 | History & Filters | 3 days | $2,000 | Audit logs, 90-day retention, CSV export |
| 6 | QA & Hardening | 4 days | $3,500 | E2E testing, security audit, performance tuning |
| **Total** | | **22 days** | **$17,500** | **Budget cap: $14,000 MVP** |

### Critical Path Note
Phase 3 (Alarm Scheduling) is the longest and blocks Phases 4–5. Parallel work in Phase 2 (Auth) is recommended to reduce critical path dependency.

### Phase Sequencing Rationale (from document)
1. **Phase 1** establishes visual language and user flows before implementation
2. **Phase 2** implements security foundation (user authentication, session management, role-based access control)
3. **Phase 3** implements core domain logic (alarm creation, recurrence, storage)
4. **Phase 4** implements notification delivery (triggers, templates, multi-channel)
5. **Phase 5** implements observability and compliance (history, audit trails, export)
6. **Phase 6** validates all requirements through testing and applies hardening based on findings

---

## 6. Risks and Unresolved Questions

### Critical Risks

**Risk-01: Browser-Only Timers Are Unreliable for Triggering Alarms**
- **Issue:** If alarm scheduling relies on client-side JavaScript timers, alarms may fail to trigger if the browser tab is inactive, closed, or the device is sleeping
- **Impact:** High — core product functionality (alarms) cannot be guaranteed
- **Mitigation:** Implement server-side scheduler (e.g., cron, job queue) as the authoritative trigger source; client-side UI is display only
- **Resolution Required:** Architecture decision needed before Phase 3 begins

**Risk-02: Email Delivery Delay May Violate SLA for Critical Alerts**
- **Issue:** Email delivery can be delayed 5–30 minutes in practice (depending on provider); email must not be the sole channel for critical security alerts
- **Impact:** High — users may not be notified of unauthorized access attempts in time
- **Mitigation:** Implement in-app notifications as primary, email as secondary; SMS as primary for critical alerts (if available)
- **Resolution Required:** Confirm multi-channel strategy with Product Owner before Phase 4 begins

**Risk-03: Repository/Document Domain Mismatch**
- **Issue:** This repository currently implements a simple TO-DO/task-manager application (QAchatBot), as evidenced by:
  - README.md states: "A simple TO-DO list app for project management"
  - package.json: "qachatbot-task-manager", description "Simple task manager with create/read/update/delete and status tracking"
  - server.js, public/app.js, data/tasks.json implement a flat REST API and task list UI
- **Whereas:** The attached document describes a completely different product (HomeGuard Alarm Portal — a home security scheduling system)
- **Impact:** Critical — no implementation should proceed without resolving whether:
  1. This repository should be repurposed for HomeGuard Alarm Portal (and the task manager code replaced), or
  2. HomeGuard Alarm Portal is a separate repository/project, or
  3. The task manager should remain the focus and this document was provided for analysis only
- **Resolution Required:** Product Owner and Technical Lead must explicitly confirm the intended scope before any code changes are made

### Unresolved Questions

**Q-01: SMS-in-MVP Decision**
- FR-12 specifies dual-channel notifications (email + SMS) for critical alerts
- Is SMS delivery included in the MVP scope, or is email-only acceptable for v1.0?
- **Impact:** Affects Phase 4 scope and 3rd-party integrations (Twilio, Nexmo, etc.)

**Q-02: Family Member Schedule Creation Rights**
- FR-05 states homeowners may invite Family Members, and FR-07 describes permissions (Edit, View, Arm/Disarm Only)
- Is unclear whether a Family Member with "Edit" permission can **create new schedules**, or only edit existing ones
- **Impact:** Affects FR-03 (limit of 10 active schedules) — is it 10 per homeowner or 10 per household?

**Q-03: Exact WCAG AA Scope**
- S-06 specifies "core workflows" for WCAG 2.1 AA compliance
- Are "core workflows" limited to signup, login, and dashboard, or do they include all CRUD operations for schedules?
- **Impact:** Affects Phase 1 (UX design) and Phase 6 (QA checklist)

**Q-04: Device / Browser Support Matrix**
- U-01 specifies responsive design for desktop, tablet, mobile
- No explicit browser version targets (e.g., IE 11, Safari 12+) or device OS minimums stated
- **Impact:** Affects testing matrix and potential use of modern JS features

**Q-05: Data Residency & Hosting Region**
- No specification of where customer data must be stored (e.g., EU GDPR, US-only, etc.)
- **Impact:** Affects database selection and infrastructure setup

**Q-06: Pricing & Plan Tiers**
- Document mentions a flat $14,000 MVP budget but does not specify customer pricing model
- Are there free-tier vs. premium-tier customers, or is pricing per-household?
- **Impact:** Affects billing integration and feature flagging

**Q-07: Sign-Off & Approval Authority**
- Document names Maya Chen (Product Owner) and Omar Rahman (Technical Lead) as required signatories
- No confirmation that both have approved the requirements or the intended scope
- **Resolution Required:** Obtain explicit sign-off before implementation begins

---

## 7. Contradictions Found in Document (Intentional QA Traps)

The attached document contains **three deliberate contradictions (T-01, T-02, T-03)** designed to test requirements validation and document reading comprehension. All three are flagged below with conflicting sources quoted verbatim.

### T-01: Active Alarms Per Homeowner Limit
**Contradiction:** Maximum number of active alarm schedules per homeowner is stated inconsistently

| Source | Claim | Conflict |
|--------|-------|----------|
| Draft project notes (legacy) | "20 active alarms per homeowner" | Higher limit |
| FR-03 (Functional Requirements) | "System supports up to 10 active alarm schedules per homeowner" | Lower limit |

**Quoted Conflict:**  
- Draft: *"Homeowners can configure up to 20 active alarm schedules"*
- FR-03: *"System supports up to 10 active alarm schedules per homeowner"*

**Impact:** User experience differs significantly; 20 schedules allows complex households (multi-level scheduling), while 10 is more restrictive. This affects Phase 3 (Alarm Scheduling) implementation.

**Resolution:** Requires Product Owner decision. Recommend 10 as MVP limit with future expansion to 20 if demand justifies.

---

### T-02: Alarm History Retention Period
**Contradiction:** Duration of alarm history retention is stated inconsistently

| Source | Claim | Conflict |
|--------|-------|----------|
| Legacy system notes | "30-day history retention" | Shorter window |
| FR-10 (Functional Requirements) | "System retains alarm trigger history for 90 days" | Longer window |

**Quoted Conflict:**  
- Legacy: *"Historical alarm records are retained for 30 days"*
- FR-10: *"System retains alarm trigger history for 90 days with filtering by schedule, date range, and outcome"*

**Impact:** Affects data retention policy, database storage, and compliance guarantees. 30 days may be insufficient for quarterly business reviews; 90 days is more aligned with audit/compliance needs.

**Resolution:** Recommend 90-day retention as specified in FR-10, which aligns with Phase 5 (History & Filters) and compliance best practices.

---

### T-03: MVP Launch Target Date
**Contradiction:** Project launch date is stated inconsistently in different sections

| Source | Claim | Conflict |
|--------|-------|----------|
| Sales pipeline notes (draft) | "MVP launch by 15 October 2026" | Earlier date |
| Delivery Plan table (Phase 6 completion) | "Delivery target: 31 October 2026" | Later date |

**Quoted Conflict:**  
- Sales notes: *"Target launch date: 15 October 2026"*
- Delivery Plan: *"Phase 6 completion target: 31 October 2026"* (implies launch on or after this date)

**Impact:** 16-day gap creates scheduling pressure and may force scope cuts or quality compromises if 15 October is the firm deadline. Affects stakeholder communication and resource allocation.

**Resolution:** Clarify with Product Owner and Technical Lead whether 15 October or 31 October is the actual MVP launch target. Recommend 31 October if quality is prioritized; recommend descoping if 15 October is firm.

---

## 8. Missing Information & Assumptions Not to Make

The following information is **not specified** in the requirements document and **must not be assumed**:

### Design & UX
- [ ] **Wireframes / UI mockups** — Document does not include visual designs; deferred to Phase 1 (Discovery & UX)
- [ ] **User flow diagrams** — End-to-end flows for signup, invitation acceptance, schedule creation, etc. not detailed
- [ ] **Notification copy templates** — Exact text for emails, SMS, and in-app notifications not provided
- [ ] **Error messages & validation rules** — Field-level error text and constraints not specified
- **Action:** Do not assume visual design; confirm wireframes with Product Owner in Phase 1

### Product Scope
- [ ] **Family Member schedule creation rights** — Whether Family Members with "Edit" permission can create new schedules (vs. only edit existing) is ambiguous
- [ ] **SMS in MVP** — Whether SMS notifications are included in the MVP or deferred to v1.1 is unresolved (see Q-01)
- [ ] **Password reset flow** — No specification of self-service password reset vs. Support Agent-initiated reset
- [ ] **Rate limiting** — No specification of brute-force protection or API rate limits
- [ ] **Multi-device login** — Whether users can log in from multiple devices simultaneously or if sessions are device-locked is unspecified
- **Action:** Confirm scope with Product Owner before Phase 2 begins

### Technical Implementation
- [ ] **Technology stack** — Document mentions "preferred stack (Next.js/NestJS/Postgres/Supabase)" but does not mandate it; alternative stacks may be viable
- [ ] **Hosting & deployment** — Cloud provider (AWS, GCP, Azure), containerization strategy, and CI/CD pipeline not specified
- [ ] **Database schema design** — No ER diagram or schema specification provided
- [ ] **API specification format** — No OpenAPI/Swagger spec provided; endpoint contracts must be designed during Phase 2
- [ ] **Notification provider** — Email provider (SendGrid, AWS SES) and SMS provider (Twilio, Nexmo) not selected
- **Action:** Design technical architecture during Phase 1 & 2; confirm with Technical Lead

### Compliance & Legal
- [ ] **Data residency** — Geographic constraints on customer data storage not specified (see Q-05)
- [ ] **WCAG AA scope** — Definition of "core workflows" for accessibility compliance not detailed (see Q-03)
- [ ] **SOC 2 / ISO 27001** — No mention of security certification requirements
- [ ] **GDPR / CCPA compliance** — Data deletion, export, and consent workflows not detailed
- **Action:** Confirm compliance requirements with Legal and Product Owner before Phase 1

### Pricing & Commercials
- [ ] **Customer pricing model** — Whether customers pay per-schedule, per-month, or flat-fee is unspecified (see Q-06)
- [ ] **Freemium vs. paid** — Whether HomeGuard Alarm Portal offers a free tier or free trial is unspecified
- [ ] **Family Member seat pricing** — Whether additional family members incur per-seat fees is unspecified
- **Action:** Confirm pricing strategy with Product Owner before Phase 1; do not assume flat subscription

### Testing & Quality
- [ ] **Browser version targets** — No specification of minimum IE, Safari, Chrome, Firefox versions (see Q-04)
- [ ] **Mobile OS minimums** — iOS 12+ vs. iOS 14+? Android 6 vs. Android 11?
- [ ] **E2E test scenarios** — No acceptance test suite provided; Phase 6 must define test plan
- [ ] **Performance test targets** — P-01 specifies 700ms p95 latency but no load-test scenario (concurrent users, endpoint mix) specified
- **Action:** Define testing matrix during Phase 1; confirm with QA team

### Support & Operations
- [ ] **Support hours** — Whether Support Agents have 24/7 coverage or business-hours-only is unspecified
- [ ] **Incident response SLA** — No specification of incident severity levels or response/resolution times
- [ ] **Monitoring & observability** — No specification of logging, metrics, alerting, or dashboard requirements
- **Action:** Define operational runbooks during Phase 2; confirm with DevOps/SRE team

### Contractual & Approval
- [ ] **Sign-off status** — Document does not confirm that Maya Chen (Product Owner) and Omar Rahman (Technical Lead) have formally approved these requirements
- [ ] **Scope baseline** — This document is pre-implementation analysis; any features added or removed after approval must be tracked via change control
- [ ] **Stakeholder list** — No comprehensive stakeholder registry provided; identify all approval authorities before implementation
- **Action:** Obtain formal sign-off from Product Owner and Technical Lead before Phase 1 begins

---

## 9. Recommended Next Steps

### Before Implementation Begins
1. **Resolve the domain mismatch risk (Risk-03):** Confirm with stakeholders whether this repository is intended for HomeGuard Alarm Portal or whether a separate project/repo is needed
2. **Obtain sign-off:** Get formal approval from Maya Chen (Product Owner) and Omar Rahman (Technical Lead) on all 8 sections of this analysis
3. **Address the three contradictions (T-01, T-02, T-03):** Resolve the conflicting claims and document the final decision for each
4. **Clarify unresolved questions (Q-01 through Q-07):** Provide explicit answers before Phase 1 begins

### During Phase 1 (Discovery & UX)
- Refine user flows based on clarified scope
- Design wireframes addressing missing UI/UX specifications
- Confirm WCAG AA accessibility scope
- Finalize technical architecture (confirm or reject the Next.js/NestJS/Postgres/Supabase stack)

### During Phases 2–6
- Track any deviations from this baseline via change control
- Re-validate requirements at the end of each phase
- Escalate any conflicts or ambiguities immediately to Product Owner and Technical Lead

---

## Document Metadata

**Analyzed by:** AI Requirements Analyst  
**Analysis date:** 2026-09-30  
**Source document:** 01_AI_Chatbot_Test_Document.pdf (synthetic test brief)  
**Status:** **Pre-Implementation Review — No code changes should occur until domain mismatch is resolved and sign-off is obtained**

**Key Contacts for Approval:**
- **Product Owner:** Maya Chen
- **Technical Lead:** Omar Rahman

---

*This document is a comprehensive pre-implementation analysis and is not an architectural design or technical specification. The product summary, functional requirements, and constraints are derived from the attached synthetic test brief. This analysis highlights three intentional contradictions and one critical domain mismatch that must be resolved before development begins.*
