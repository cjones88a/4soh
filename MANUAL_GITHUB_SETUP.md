# Manual GitHub Setup Instructions

## Step 1: Create New Repository
1. Go to https://github.com/new
2. Repository name: `race-tracker`
3. Description: `Strava race tracking application with OAuth integration`
4. Make it **Public**
5. **Don't** initialize with README, .gitignore, or license (we already have files)
6. Click **"Create repository"**

## Step 2: Push Code
After creating the repository, run these commands:

```bash
cd ~/race-tracker
git remote add origin https://YOUR_TOKEN@github.com/cjones88a/race-tracker.git
git push -u origin main
```

## Alternative: Use Existing 4soh Repository
If you want to use the existing 4soh repository, you can:

1. Go to https://github.com/cjones88a/4soh
2. Delete the existing README.md
3. Then run:
```bash
cd ~/race-tracker
git remote add origin https://YOUR_TOKEN@github.com/cjones88a/4soh.git
git push -u origin main --force
```

## What Will Be Pushed
- ✅ Complete Next.js race tracking application
- ✅ Strava OAuth implementation (with current issues)
- ✅ Database schema with Prisma
- ✅ OAuth issue analysis document (`OAUTH_ISSUE_SUMMARY.md`)
- ✅ All configuration files
- ✅ Ready for another AI to analyze

## Current OAuth Issue Summary
Strava returns "Bad Request" with `"field":"redirect_uri","code":"invalid"` despite clean URLs. The most likely cause is that the Authorization Callback Domain in your Strava app settings doesn't match the current production URL.

**Current production URL**: `race-tracker-mb6mlvmq9-cjones88as-projects.vercel.app`
**Strava app callback domain**: Needs to be updated to match this URL

## Files Ready for AI Analysis
- `OAUTH_ISSUE_SUMMARY.md` - Complete OAuth problem analysis
- `app/api/strava/auth/route.ts` - OAuth initiation
- `app/api/strava/callback/route.ts` - OAuth callback
- `prisma/schema.prisma` - Database schema
- `config/segments.ts` - Segment configuration
