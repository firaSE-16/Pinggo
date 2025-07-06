# UploadThing Setup Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# Clerk Configuration (if not already set)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

## Getting UploadThing Credentials

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up or log in to your account
3. Create a new project
4. Copy your `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` from the dashboard
5. Add them to your `.env.local` file

## Current Issues Fixed

1. ✅ Fixed import path in `src/utils/uploadthing.ts`
2. ✅ Fixed route handler configuration
3. ✅ Improved error handling and logging
4. ✅ Added better upload configuration (4MB max file size, 1 file max)
5. ✅ Added debugging console logs

## Testing the Upload

1. Make sure you have the environment variables set
2. Start your development server: `npm run dev`
3. Navigate to the registration page
4. Try uploading an image
5. Check the browser console for debug logs

## Troubleshooting

If uploads are still not working:

1. Check that all environment variables are set correctly
2. Verify that you're logged in with Clerk (required for auth)
3. Check the browser console for error messages
4. Check the server console for backend errors
5. Ensure your UploadThing account is active and has sufficient credits 