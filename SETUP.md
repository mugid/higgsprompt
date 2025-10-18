# Higgsprompt Setup Guide

This project is set up with Drizzle ORM, Better Auth, and Supabase integration. Follow these steps to get everything running.

## Prerequisites

1. A Supabase project
2. Google OAuth credentials
3. Node.js and pnpm installed

## Environment Setup

1. Copy the environment variables from `.env.local` and fill in your actual values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_supabase_database_url

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
```

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > Database to get your database URL
3. Go to Settings > API to get your anon key and service role key
4. Update your `.env.local` with these values

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Set authorized redirect URIs to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local`

## Database Setup

1. Generate and run the database migrations:

```bash
# Generate migration files
pnpm db:generate

# Push schema to database
pnpm db:push
```

## Running the Application

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- ✅ Google OAuth authentication with Better Auth
- ✅ Drizzle ORM with PostgreSQL (Supabase)
- ✅ User management and sessions
- ✅ Protected routes with authentication guards
- ✅ Example dashboard with CRUD operations
- ✅ Type-safe database queries

## Database Schema

The application includes the following tables:
- `users` - User accounts and profiles
- `accounts` - OAuth account connections
- `sessions` - User sessions
- `verification_tokens` - Email verification tokens
- `posts` - Example content management

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio

## Troubleshooting

1. **Database connection issues**: Verify your `DATABASE_URL` is correct
2. **Google OAuth issues**: Check that redirect URIs match exactly
3. **Session issues**: Ensure `BETTER_AUTH_SECRET` is set and consistent
4. **CORS issues**: Verify `BETTER_AUTH_URL` matches your development URL

## Next Steps

- Customize the database schema in `src/lib/db/schema.ts`
- Add more authentication providers
- Implement additional features in the dashboard
- Set up production deployment
