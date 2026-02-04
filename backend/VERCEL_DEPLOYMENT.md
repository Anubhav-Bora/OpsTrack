# Vercel Deployment Guide for Express + Prisma Backend

## Overview
This backend is configured to deploy as a Vercel serverless function with Prisma ORM.

## Key Configuration Files

### 1. `vercel.json`
- Configures the serverless function entry point (`api/index.ts`)
- Includes Prisma schema file in the build
- Sets up routing to direct all requests to the serverless function
- References environment variables

### 2. `prisma/schema.prisma`
- **Important**: Specifies explicit output path for generated client
- Includes `binaryTargets` for Vercel's runtime environment (RHEL-based)
- Binary targets: `["native", "rhel-openssl-3.0.x"]`

### 3. `.vercelignore`
- Ensures `node_modules/.prisma` is NOT ignored
- The generated Prisma client must be included in the deployment

### 4. `package.json`
- `postinstall`: Runs `prisma generate` after dependencies install
- `vercel-build`: Custom build script that generates Prisma client and runs migrations

## Environment Variables

Set these in your Vercel project settings:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

## Deployment Steps

1. **Connect Repository to Vercel**
   - Import your repository in Vercel dashboard
   - Set root directory to `backend/`

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel project settings
   - Ensure `DATABASE_URL` includes `?sslmode=require` for secure connections

3. **Deploy**
   - Push to your connected branch (e.g., `release-branch`)
   - Vercel will automatically:
     - Install dependencies
     - Run `prisma generate` (via postinstall)
     - Run `vercel-build` script
     - Deploy the serverless function

## Troubleshooting

### "Cannot find module '.prisma/client/default'" Error

This error occurs when the Prisma client isn't properly generated or included. Fixed by:
- ✅ Explicit output path in `schema.prisma`
- ✅ Correct binary targets for Vercel runtime
- ✅ `.vercelignore` includes generated client
- ✅ `vercel-build` script generates client

### Database Connection Issues

- Ensure `DATABASE_URL` is set in Vercel environment variables
- Use connection pooling (we use `pg` Pool with Prisma adapter)
- Include `?sslmode=require` in connection string for production databases

### Migration Issues

- Migrations run during `vercel-build` via `prisma migrate deploy`
- For production, ensure migrations are tested in staging first
- Consider running migrations separately if needed

## Local Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

## Architecture Notes

- **Singleton Pattern**: Prisma client uses singleton pattern to prevent connection exhaustion in serverless
- **Connection Pooling**: Uses `@prisma/adapter-pg` with `pg` Pool for efficient connection management
- **Serverless Entry**: `api/index.ts` exports the Express app for Vercel's serverless runtime
