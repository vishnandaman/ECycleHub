# Deployment Configuration Guide

## Environment Variables Setup

To connect your Vercel frontend with your Railway backend, you need to set up environment variables.

### 1. Create `.env` file in the frontend directory:

```bash
# Backend API URLs - Update these with your actual Railway deployment URLs
VITE_BACKEND_URL=https://your-backend-project.railway.app
VITE_ML_API_URL=https://your-ml-project.railway.app
```

### 2. Vercel Environment Variables:

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

- `VITE_BACKEND_URL`: Your Railway backend URL
- `VITE_ML_API_URL`: Your Railway ML API URL

### 3. Finding Your Railway URLs:

1. **Backend URL**: Go to Railway dashboard → Your backend project → Deployments tab
2. **ML API URL**: Go to Railway dashboard → Your ML project → Deployments tab

### 4. Example URLs:
- Backend: `https://ecyclehub-backend.railway.app`
- ML API: `https://ecyclehub-ml.railway.app`

### 5. Update the URLs:
Replace the placeholder URLs in your `.env` file with your actual Railway deployment URLs.

## Testing the Integration

After setting up the environment variables:

1. Deploy to Vercel
2. Test the E-Waste form (ML prediction)
3. Test the tracking functionality
4. Test the rewards catalog

The frontend will now use your Railway backend instead of localhost!
