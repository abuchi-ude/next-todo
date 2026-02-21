
# Next Todo App

A full-featured Todo application updated to the latest Next/React toolchain. Built with Tailwind CSS for a responsive UI and designed to work with Firebase real-time data as well as a REST API for sample or external data sources. This project demonstrates Next.js App Router patterns, authentication with Firebase, protected routes, and real-time data management.

## Features

- **Authentication:** Firebase Auth for signup/login (Email/Password + Google).
- **Protected Routes:** Main pages (`/todos`, `/add-todo`, `/search`, `/todos/[id]`) are protected.
- **Todo Management:** Create, edit, delete, and toggle todos.
- **Pagination & Search:** Browse and search large lists of todos.
- **Optimistic UI & Loading States:** Fast, responsive updates with user feedback.
- **Responsive Design:** Mobile-friendly UI using TailwindCSS.
- **Custom Components:** Reusable components in `src/components/`.
- **Data Sources:** Combines Firestore user todos with JSONPlaceholder sample todos.

## Tech Stack (updated)

- **Next.js:** 16.x (app router; project upgraded to latest Next release used in this repo)
- **React:** 19.x
- **TypeScript:** 5.x
- **Firebase:** 12.x (Auth, Firestore)
- **TailwindCSS:** 4.x
- **Phosphor Icons (React)**
- **ESLint:** 9.x with Next.js config (legacy `.eslintrc.cjs` used to avoid flat-config issues)

## Project Structure

```
next-todo/
├── public/
├── src/
│   ├── app/                # Next App Router pages + layout
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Client hooks (e.g. `useTodos` marked as client)
│   └── lib/                # Firebase initialization (`src/lib/firebase.ts`)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
├── .eslintrc.cjs           # Legacy ESLint config (replaced flat config)
└── README.md
```

## Setup & Installation

1. Clone the repository:

```bash
git clone (https://github.com/abuchi-ude/next-todo)
cd next-todo
```

2. Install dependencies:

```bash
pnpm install
# or npm install, yarn install
```

3. Configure Firebase:

- Create a Firebase project.
- Enable Authentication (Email/Password, Google) and Firestore.
- Update the config in `src/lib/firebase.ts` (the file exports `auth` and `db`, which are guarded to only initialize on the client).

4. Run the dev server:

```bash
pnpm dev
```

5. Open the app at http://localhost:3000

## Usage

- **Sign Up / Login:** `/signup` or `/login`.
- **Todos:** `/todos` to view and manage todos.
- **Add Todo:** `/add-todo`.
- **Search:** `/search`.
- **Todo Details:** `/todos/[id]`.
- **Protected Routes:** Unauthenticated users are redirected to `/login`.

## Notable codebase updates (after upgrade)

- Project upgraded to the latest Next and React releases supported here (Next 16.x / React 19.x).
- ESLint configuration: the project had a flat-config that caused a circular plugin error after upgrading; it was replaced with a legacy `.eslintrc.cjs` using `next/core-web-vitals` to restore linting.
- `src/hooks/useTodos.ts` is marked with `"use client"` because it uses client-only APIs (Firebase Auth, IndexedDB persistence, React hooks).
- `src/lib/firebase.ts` guards initialization so `auth` and `db` are only created on the client (`typeof window !== 'undefined'`) to prevent server-side runtime errors.

These changes were made to resolve build/lint/runtime issues introduced by dependency upgrades.

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- `pnpm exec tsc --noEmit` — Run TypeScript typecheck

## Environment & Notes

- Put your Firebase configuration in `src/lib/firebase.ts` (the file is currently checked into the repo for demo purposes — replace with env variables or move to a server-side secret for production).
- `auth` and `db` are guarded and may be `null` on the server; only use them in client code or check for `null` before using them in server-side modules.

## Contributing

Contributions welcome — open PRs or issues for improvements.

---
