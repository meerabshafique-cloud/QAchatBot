# QAchatBot

A simple TO-DO list app for project management.

## Setup

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Feature

A flat, single-list TO-DO app: add tasks, mark them done, and delete them.
Tasks are persisted to `data/todos.json` on disk via a small Express REST API
(`GET/POST /api/todos`, `PUT/DELETE /api/todos/:id`).
