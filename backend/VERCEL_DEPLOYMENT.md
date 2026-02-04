# Vercel Deployment Guide for Prisma

## Issue Fixed
The "Cannot find module '.prisma/client/default'" error has been resolved by:

1. **Removed custom output path** from Prisma schema - Using default location
2. **Updated vercel.json** to include Prisma client files in the build
3. **Updated .vercelignore** to ensure Prisma files are not excluded
4. **Added binary targets** for Vercel's serverless environment

## Configuration Changes

### 1. prisma/schema.prisma
- Removed custom `output` path (now uses default: `node_modules/.prisma/client`)
- Added `debian-openssl-3.0.x` binary target for Vercel compatibility

### 2. vercel.json
- Added `node_modules/.prisma/**` to includeFiles
- Added `node_modules/@prisma/client/**` to includeFiles

### 3. .vercelignore
- Explicitly includes `node_modules/.prisma/**`
- Explicitly includes `node_modules/@prisma/client/**`

### 4. package.json
- `@prisma/client` is in dependencies (not devDependencies) ✓
- `postinstall` script runs `prisma generate` ✓
- `vercel-build` script generates Prisma client ✓

## Deployment Steps

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "fix: Prisma client generation for Vercel serverless"
   git push origin release-branch
   ```

2. **Vercel Environment Variables:**
   Ensure these are set in Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Your JWT secret key
   - `NODE_ENV` - Set to "production"

3. **Deploy:**
   - Vercel will automatically run `vercel-build` script
   - This generates the Prisma client
   - The generated files are included in the serverless function

## Verification

After deployment, check:
1. Vercel build logs show "Prisma client generated successfully"
2. API endpoints respond correctly
3. Database queries work without errors

## Troubleshooting

If you still see the error:
1. Check Vercel build logs for Prisma generation errors
2. Verify DATABASE_URL is set correctly
3. Ensure the database is accessible from Vercel
4. Try redeploying with `vercel --prod --force`

## Binary Targets

The schema includes these binary targets:
- `native` - For local development
- `rhel-openssl-3.0.x` - For RHEL-based systems
- `debian-openssl-3.0.x` - For Vercel's Debian-based serverless functions

## Important Notes

- Never commit `node_modules/` to git
- The Prisma client is generated during build time on Vercel
- The `.vercelignore` ensures generated files are included in the deployment
- Database migrations should be run separately (not in vercel-build for production)
