# Vercel Deployment Guide

## Quick Deployment Steps

### Option 1: Using Vercel CLI (Interactive)

1. **Run the deployment command:**
   ```bash
   vercel
   ```

2. **Answer the prompts:**
   - `Set up and deploy?` → **Yes** (Y)
   - `Which scope?` → **chilliroger's projects**
   - `Link to existing project?` → **No** (N)
   - `What's your project's name?` → **enthiran2** (or any name you prefer)
   - `In which directory is your code located?` → **./** (just press Enter)

3. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy from GitHub (Recommended)

Since your code is on GitHub, you can also deploy directly from there:

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: **ChilliRoger/enthiran2.0**
4. Vercel will auto-detect the settings
5. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your API key from .env file
6. Click "Deploy"

## Important: Add Environment Variable

After deployment, you MUST add your API key:

### Via Vercel Dashboard:
1. Go to your project on Vercel
2. Click "Settings"
3. Click "Environment Variables"
4. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyAGBmDHT6jsLJcLWry8P7yQRB8f1bnbZ4k`
   - **Environment:** Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy the project

### Via Vercel CLI:
```bash
vercel env add GEMINI_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development
```

## Verify Deployment

After deployment, you'll get a URL like:
- **Production:** https://enthiran2.vercel.app
- **Preview:** https://enthiran2-xxx.vercel.app

Visit the URL and test:
1. Check if the page loads
2. Try sending a message
3. Verify the chatbot responds

## Troubleshooting

### If you get API errors:
- Ensure environment variable is set correctly
- Redeploy after adding env variables
- Check Vercel function logs

### If deployment fails:
- Check `vercel.json` is present
- Ensure `requirements.txt` is up to date
- Check Python version compatibility

## Redeploy After Changes

When you make changes:
```bash
git add .
git commit -m "Your changes"
git push
vercel --prod
```

Or just push to GitHub, and Vercel will auto-deploy if connected.
