# Requirements Analysis: HomeGuard Alarm Portal

## 1. Product Summary

**HomeGuard Alarm Portal** is a responsive web application for Northstar Secure Ltd. that allows residential customers to configure alarm schedules, manage household members, receive event notifications, and review alarm history. The system is designed to support multiple user roles (homeowners, family members, support agents, and administrators) with role-based access controls. The MVP targets a 31 October 2026 launch with a USD 14,000 budget and 22 working-day implementation effort.

---

## 2. Functional Requirements

The following functional requirements are specified in the document:

- **FR-01**: Users can sign up using email and password.
- **FR-02**: Users must verify their email before creating their first alarm.
- **FR-03**: A homeowner can create up to 10 active alarm schedules.
- **FR-04**: Each alarm schedule requires a name, time, timezone, days of week, and enabled/disabled state.
- **FR-05**: A schedule may repeat on one or more days of the week.
- **FR-06**: A user can snooze an alarm for 5, 10, or 15 minutes.
- **FR-07**: A homeowner can invite up to 5 family members.
- **FR-08**: Family members can only edit schedules when the homeowner explicitly grants Edit permission.
- **FR-09**: Support Agents have read-only access to customer alarm configuration.
- **FR-10**: The application stores 90 days of alarm event history.
- **FR-11**: Users can filter alarm history by date, status, and alarm name.
- **FR-12**: Users receive an email when a new device signs into their account.
- **FR-13**: Critical alarm events should trigger both email and in-app notifications.
- **FR-14**: The dashboard must show the next 3 upcoming alarms.
- **FR-15**: Users can temporarily disable all alarms using Vacation Mode.

### Acceptance Criteria for Alarm Creation

1. The user cannot save an alarm without a name.
2. The user cannot save an alarm without selecting at least one day.
3. The user can select a time in 12-hour or 24-hour display format.
4. The stored alarm time must remain correct after changing the account timezone.
5. When the maximum of 10 active alarms is reached, the Create Alarm button is disabled and an explanation is shown.
6. A successful save immediately updates the dashboard's upcoming alarms list.

---

## 3. Non-Functional Requirements

- **Responsiveness**: The UI must work on desktop, tablet, and mobile screen sizes.
- **API Performance**: 95% of standard API requests should complete within 700 ms under normal load.
- **Security**: Passwords must never be stored in plaintext; all authenticated API traffic must use HTTPS.
- **Scalability**: The production system should support at least 25,000 registered users.
- **Accessibility**: WCAG 2.1 AA compliance target for core user flows.
- **Audit & Compliance**: Audit logs must be retained for 12 months.

### Preferred Technology Stack

The document specifies the following technology preferences (stated as "Preferred" not mandatory requirements):

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Next.js API routes or NestJS |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Email Notifications | Resend |
| In-App Notifications | PostgreSQL storage |
| Hosting | Vercel for frontend; managed PostgreSQL |
| Testing | Vitest/Jest, Playwright |

---

## 4. User Roles and Permissions

The following roles are defined in the document:

### Homeowner
- **Capability**: Creates and manages alarm schedules, household users, and notification preferences.
- **Permissions** (per business rules): 
  - May invite or remove Family Members (BR-01).
  - Can grant Edit or View permission to Family Members (FR-08).

### Family Member
- **Capability**: Can arm/disarm the alarm if granted permission by the homeowner.
- **Permissions** (per business rules):
  - A Family Member with View permission cannot arm, disarm, edit, or delete schedules (BR-02).
  - Edit permission grants capability to modify schedules.

### Support Agent
- **Capability**: Can view customer configuration and event logs but cannot change alarm schedules.
- **Permissions**: Read-only access to customer alarm configuration and event logs (FR-09).

### Administrator
- **Capability**: Can manage plans, user access, and system-level settings.
- **Permissions** (per business rules):
  - Can soft-delete alarm schedules and recover them for up to 30 days (BR-04).

### Business Rules Governing Access

- **BR-01**: Only the Homeowner may invite or remove Family Members.
- **BR-02**: A Family Member with View permission cannot arm, disarm, edit, or delete schedules.
- **BR-03**: If Vacation Mode is enabled, scheduled alarms do not trigger until Vacation Mode is disabled.
- **BR-04**: Deleted alarm schedules are soft-deleted and recoverable by an Administrator for 30 days.
- **BR-05**: More than 5 failed login attempts within 15 minutes locks login for 20 minutes.
- **BR-06**: Alarm times are stored in UTC and displayed in the user's selected timezone.

---

## 5. Recommended Implementation Phases

The Delivery Plan specifies the following 6-phase approach:

| Phase | Duration | Output | Priority |
|-------|----------|--------|----------|
| Discovery & UX | 3 days | Flows, edge cases, wireframe confirmation | High |
| Authentication & Roles | 4 days | Signup, verification, RBAC | High |
| Alarm Scheduling | 5 days | CRUD, recurrence, snooze, vacation mode | Critical |
| Notifications | 3 days | Email + in-app events | High |
| History & Filters | 3 days | 90-day event history and filters | Medium |
| QA & Hardening | 4 days | Automated tests, accessibility, bug fixes | High |

**Overall Estimates**:
- **Estimated implementation effort**: 22 working days
- **Budget ceiling for MVP**: USD 14,000
- **Target MVP delivery date**: 31 October 2026

---

## 6. Risks and Unresolved Questions

The document identifies the following known risks and open questions that remain unresolved:

1. **Browser-Only Timer Reliability**: Browser tabs may be closed when an alarm should trigger; therefore, browser-only timers are not reliable. This creates a risk that scheduled alarms may not fire if the browser tab is closed or the browser is not running.

2. **Email Delivery as Sole Critical Notification**: Email delivery can be delayed and must not be treated as the only critical notification mechanism. This indicates a need for redundant notification channels for critical events.

3. **SMS Notification Decision Pending**: The product team has not yet decided whether SMS notifications will be included in the MVP. This scope item remains open and must be resolved before final design and implementation.

4. **Family Member Schedule Creation Authority Unresolved**: There is an unresolved question about whether Family Members should be allowed to create new schedules. This permission boundary is not currently defined in the functional or business rules sections.

---

## 7. Contradictions Found in the Document

The document includes three intentional contradictions that require stakeholder resolution before implementation:

### T-01: Maximum Active Alarms Conflict
- **Statement A** (FR-03): "A homeowner can create up to **10 active alarm schedules**."
- **Statement B** (Draft stakeholder note, Section 10): "A draft stakeholder note says the MVP must support **20 active alarms** per homeowner."
- **Status**: Unresolved — these two figures directly conflict. The authoritative requirement is unclear.

### T-02: Alarm History Retention Conflict
- **Statement A** (FR-10): "The application stores **90 days** of alarm event history."
- **Statement B** (Legacy note, Section 10): "A legacy note says alarm history should be stored for **30 days**."
- **Status**: Unresolved — the retention period must be clarified before database design and API implementation.

### T-03: MVP Launch Date Conflict
- **Statement A** (Delivery Plan, Section 6): "Target MVP delivery date: **31 October 2026**."
- **Statement B** (Sales note, Section 10): "A sales note mentions an MVP launch date of **15 October 2026**."
- **Status**: Unresolved — the actual deadline is unclear. The 16-day discrepancy significantly affects resource allocation and scope decisions.

**Action Required**: All three contradictions (T-01, T-02, T-03) must be resolved through stakeholder sign-off before implementation begins.

---

## 8. Missing Information

The following information is referenced as necessary or implied by the document but is not specified. These gaps must be filled by stakeholders and are **not** assumed or invented in this analysis:

### Authentication & Security
- **Password complexity policy**: Minimum length, character requirements, expiration rules.
- **Session/token expiry policy**: How long sessions remain valid, refresh token behavior, auto-logout timeouts.
- **Multi-factor authentication (MFA)**: Whether MFA is required, optional, or out of scope for MVP.
- **Rate limiting beyond login**: API throttling rules, per-user or global limits, and backoff strategies beyond the 5-failed-login rule in BR-05.

### API & Integration
- **API endpoint contracts**: Detailed OpenAPI/Swagger specifications, request/response schemas, error codes, and status codes.
- **Timezone handling specifics**: How timezone conversion edge cases are handled (e.g., daylight saving transitions).
- **Device sign-in tracking**: What qualifies as a "new device" for email alerts in FR-12; fingerprinting or explicit device registration.

### Data & Deployment
- **Data residency & compliance region**: Where user data is stored, any GDPR/regional requirements, and data sovereignty rules.
- **Backup and disaster recovery**: RTO/RPO targets, backup frequency, and recovery procedures.

### Accessibility & Testing
- **Specific accessibility testing tooling**: Which WCAG 2.1 AA testing tools should be used (axe, Lighthouse, NVDA, JAWS, etc.).
- **Automated test coverage target**: Percentage of code or feature coverage required by acceptance tests.

### Roles & Administration
- **Administrator scope**: Whether Administrators are internal-only (Northstar employees) or client-facing (homeowner delegates).
- **Admin audit logging**: What Administrator actions are logged and for how long.
- **User offboarding**: Data deletion/retention policy when a homeowner account is closed.

### Pricing & Business Model
- **Pricing/plan tiers**: The document specifies a USD 14,000 MVP budget ceiling but does not define subscription tiers, freemium models, or per-feature costs.
- **Support plan details**: SLAs for support agents, escalation procedures, response time targets.

### Technology & Infrastructure
- **Preferred Technology Stack mandate level**: The "Preferred Technology Stack" (Section 5) is not explicitly marked as mandatory. It is unclear whether alternatives are acceptable for any layer.
- **Deployment & CI/CD**: GitOps strategy, automated deployment triggers, rollback procedures, and environment promotion (dev → staging → prod).

### Context Mismatch
- **Repository context mismatch**: This document describes "HomeGuard Alarm Portal" for Northstar Secure Ltd., but the containing repository is named `QAchatBot` with a to-do list application structure. The relationship between these artifacts is undefined and must be clarified before implementation begins.

---

## Summary

This requirements analysis documents **all information present** in the attached project brief, identifies **three unresolved contradictions** that block implementation decisions, lists **four open questions** that remain unresolved from the Known Risks section, and names **specific gaps** in the attachment without inventing values or assumptions. Stakeholder sign-off is required to resolve T-01, T-02, and T-03 before scope, design, and development work can proceed.
