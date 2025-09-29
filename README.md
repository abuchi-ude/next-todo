
# Next Todo App

A full-featured Todo application built with Next.js 15, React 19, Firebase, and TailwindCSS. This project demonstrates modern Next.js App Router patterns, authentication, protected routes, and real-time data management.

## Features

- **Authentication:** Firebase Auth for secure login/signup, including Google login.
- **Protected Routes:** All main pages (todos, add-todo, search, details) require authentication.
- **Todo Management:** Add, edit, delete, and mark todos as completed or pending.
- **Pagination:** Efficiently browse large lists of todos.
- **Search:** Instantly search todos by title.
- **Optimistic UI:** Fast updates for todo status and edits.
- **Responsive Design:** Mobile-friendly, modern UI with TailwindCSS.
- **Custom Components:** Checkbox, Pagination, Nav, Seperator, AuthGuard.
- **Loading States:** Overlay spinner for all async actions.
- **Error & Success Messages:** User feedback for all actions.
- **Firebase & JSONPlaceholder:** Combines real user todos (Firebase) and sample todos (JSONPlaceholder) for demo purposes.
- **App Router:** Uses Next.js App Router for file-based routing and layouts.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Firebase v12** (Auth, Firestore)
- **TailwindCSS v4**
- **Phosphor Icons (React)**
- **ESLint** (with Next.js config)

## Project Structure

```
next-todo/
├── public/
│   └── *.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── add-todo/page.tsx
│   │   ├── todos/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuthGuard.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Home/
│   │   ├── Nav.tsx
│   │   ├── Pagination.tsx
│   │   └── Seperator.tsx
│   ├── hooks/
│   │   └── useTodos.ts
│   └── lib/
│       └── firebase.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.js
├── eslint.config.mjs
└── README.md
```

## Setup & Installation

1. **Clone the repository:**
	```bash
	git clone (https://github.com/abuchi-ude/next-todo)
	cd next-todo
	```

2. **Install dependencies:**
	```bash
	pnpm install
	# or npm install, yarn install, bun install
	```

3. **Configure Firebase:**
	- Create a Firebase project.
	- Enable Authentication (Email/Password, Google).
	- Enable Firestore Database.
	- Copy your Firebase config to `src/lib/firebase.ts`.

4. **Run the development server:**
	```bash
	pnpm dev
	# or npm run dev, yarn dev, bun dev
	```

5. **Open the app:**
	- Visit [http://localhost:3000](http://localhost:3000)

## Usage

- **Sign Up / Login:** Access via `/signup` or `/login`.
- **Todos:** View, edit, complete, or delete todos at `/todos`.
- **Add Todo:** Create new todos at `/add-todo`.
- **Search:** Find todos by title at `/search`.
- **Todo Details:** View details at `/todos/[id]`.
- **Protected Routes:** All main pages redirect to `/login` if not authenticated.

## Customization

- **Styling:** Modify `globals.css` and Tailwind config for custom themes.
- **Components:** Extend or replace components in `src/components/`.
- **Firebase:** Adjust Firestore rules for production security.

## Scripts

- `pnpm dev` — Start development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint

## Environment Variables

Set your Firebase config in `src/lib/firebase.ts`. No `.env` file is required unless you add custom secrets.

## Contributing

Feel free to fork and modify for your own use. Pull requests and issues are welcome for improvements.

---
