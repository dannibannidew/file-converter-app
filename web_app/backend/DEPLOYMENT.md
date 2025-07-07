# Backend Deployment Guide

This guide will help you deploy the Flask backend to Railway, Render, or Heroku.

## Option 1: Railway (Recommended - Free & Easy)

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 2: Deploy from GitHub
1. Click "Deploy from GitHub repo"
2. Select your `file-converter-app` repository
3. Set the root directory to `web_app/backend`
4. Railway will automatically detect it's a Python app

### Step 3: Configure Environment
Railway will automatically:
- Install Python dependencies from `requirements.txt`
- Set the `PORT` environment variable
- Install FFmpeg system-wide

### Step 4: Get Your URL
Once deployed, Railway will give you a URL like:
`https://your-app-name.railway.app`

## Option 2: Render (Also Great - Free)

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Create a new Web Service

### Step 2: Connect Repository
1. Connect your GitHub repository
2. Set the root directory to `web_app/backend`
3. Choose Python as the runtime

### Step 3: Configure Build Settings
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`
- **Environment**: Python 3.11

### Step 4: Deploy
Click "Create Web Service" and wait for deployment.

## Option 3: Heroku (Paid, but Reliable)

### Step 1: Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login and Create App
```bash
heroku login
heroku create your-app-name
```

### Step 3: Deploy
```bash
cd web_app/backend
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## Update Frontend

After deploying the backend, update your frontend to use the new URL:

1. **For Railway**: Update the proxy in `web_app/frontend/package.json`:
   ```json
   "proxy": "https://your-app-name.railway.app"
   ```

2. **For Render**: Update the proxy:
   ```json
   "proxy": "https://your-app-name.onrender.com"
   ```

3. **For Heroku**: Update the proxy:
   ```json
   "proxy": "https://your-app-name.herokuapp.com"
   ```

## Redeploy Frontend

After updating the proxy:
```bash
cd web_app/frontend
npm run deploy
```

## Environment Variables

The backend automatically detects cloud environments and uses system FFmpeg. No additional configuration needed.

## Troubleshooting

### FFmpeg Issues
- Railway and Render have FFmpeg pre-installed
- If you get FFmpeg errors, the app will fall back to system FFmpeg

### Port Issues
- The app automatically uses the `PORT` environment variable
- No manual configuration needed

### CORS Issues
- CORS is already configured to allow all origins
- Should work with your GitHub Pages frontend

## Testing

After deployment, test your API:
```bash
curl https://your-app-url.railway.app/api/health
```

Should return: `{"status": "healthy"}` 