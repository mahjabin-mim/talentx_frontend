# TalentX Frontend

Next.js frontend for TalentX authentication, onboarding, and employer/talent flows.

## Requirements

Install these before running the project:

- Node.js 20 or newer
- npm 10 or newer
- The TalentX backend running locally at `https://localhost:5000`

Optional for Google sign-in:

- Google OAuth client ID
- Google OAuth client secret

## Tech Stack

- Next.js 16
- React 19
- NextAuth
- TanStack Query
- Zustand
- Axios
- Tailwind CSS

## Setup After Cloning

### 1. Go to the frontend project

```bash
cd talentx2026q1.frontend
```

### 2. Install packages

```bash
npm install
```

### 3. Create your local environment file

Copy the example file and update the values if needed:

```bash
cp .env.example .env.local
```

Use these values for local development:

```env
NEXT_PUBLIC_API_URL=https://localhost:5000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=replace-with-google-client-id
GOOGLE_CLIENT_SECRET=replace-with-google-client-secret
```

Notes:

- `NEXT_PUBLIC_API_URL` is required because the app calls the backend API from the browser.
- `NEXTAUTH_SECRET` should be any long random string for local development.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are only needed if you want Google sign-in to work.
- Google OAuth callback URL for local development is `http://localhost:3000/api/auth/callback/google`.

### 4. Make sure the backend is running

The frontend expects the backend API to be available at:

```text
https://localhost:5000/api/v1
```

If the browser blocks API requests because of the local HTTPS certificate, start the backend once and trust the .NET development certificate.

### 5. Start the frontend

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run test:coverage
```

## Backend Integration

This frontend is wired to these backend auth endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/oauth/google`

Flow summary:

1. Registration calls the backend register endpoint immediately.
2. Login calls the backend login endpoint.
3. Access and refresh tokens are stored in frontend auth state.
4. API requests attach the bearer token automatically.
5. Expired access tokens are refreshed automatically on `401`.

## Quick Checks

Run these before pushing changes:

```bash
npm run lint
npm run build
npm run test
```
