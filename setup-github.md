# GitHub Setup Guide

Follow these steps to set up your File Converter project on GitHub:

## Prerequisites

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/downloads
   - Or install via winget: `winget install Git.Git`

2. **Create a GitHub account** (if you don't have one):
   - Go to: https://github.com

## Step-by-Step Setup

### 1. Initialize Git Repository
```bash
# Open PowerShell in your project directory
cd E:\WindowsApps\FileConverter

# Initialize git repository
git init
```

### 2. Configure Git (if first time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Add Files to Git
```bash
# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: File Converter Web Application"
```

### 4. Create GitHub Repository
1. Go to https://github.com
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it "FileConverter" (or your preferred name)
5. Make it Public or Private (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 5. Connect Local Repository to GitHub
```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/FileConverter.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Project Structure on GitHub

Your repository will include:
- ✅ `README.md` - Project documentation
- ✅ `LICENSE` - MIT License
- ✅ `.gitignore` - Excludes unnecessary files
- ✅ `web_app/` - Main application code
- ✅ `ffmpeg-master-latest-win64-gpl/` - FFmpeg binaries
- ✅ `ico/` - Application icons

## Files Excluded from GitHub (.gitignore)
- `node_modules/` - Node.js dependencies
- `__pycache__/` - Python cache files
- `web_app/backend/uploads/` - Uploaded files
- `web_app/backend/outputs/` - Converted files
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)

## Next Steps

1. **Update README.md**: Replace `<your-repo-url>` with your actual GitHub repository URL
2. **Add collaborators** (if needed) via GitHub repository settings
3. **Set up GitHub Pages** (optional) for project website
4. **Create releases** when you have stable versions

## Common Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

## Troubleshooting

- **If git is not recognized**: Install Git from https://git-scm.com/downloads
- **If you get authentication errors**: Use GitHub CLI or set up SSH keys
- **If files are too large**: Check that large files are in .gitignore

## Repository URL Format
After setup, your repository will be available at:
`https://github.com/YOUR_USERNAME/FileConverter` 