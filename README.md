# QAchatBot

A task manager and alarm application.

## Setup

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Task Manager
A flat, single-list TO-DO app: add tasks, mark them done, and delete them.
Tasks are persisted to `data/tasks.json` on disk via a small Express REST API
(`GET/POST /api/tasks`, `PUT/DELETE /api/tasks/:id`).

### Alarms
An alarm page accessible at `/alarms.html` where users can create, manage, and monitor alarms.
Alarms are persisted to `data/alarms.json`. When the current time matches an enabled alarm's set time,
an on-screen banner appears with the alarm label and a beep sound plays.

#### Alarm API Endpoints

- `GET /api/alarms` — Returns a JSON array of all alarms.
- `POST /api/alarms` — Creates a new alarm. Required fields:
  - `time` (string, format: `"HH:MM"` in 24-hour format)
  - `label` (string, non-empty)
  Returns `201` with the created alarm object including an `id` field.
  Returns `400` if `time` is invalid or `label` is missing.
- `PUT /api/alarms/:id` — Updates an alarm's `time`, `label`, or `enabled` status.
  Returns `200` with the updated alarm or `404` if the alarm is not found.
- `DELETE /api/alarms/:id` — Deletes an alarm.
  Returns `200` or `404` if the alarm is not found.
