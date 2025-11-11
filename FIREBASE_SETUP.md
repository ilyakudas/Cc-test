# Firebase Setup Guide

## Status: Setup Complete! ✓

Your site is live at: **https://cc-test-e3ccf.web.app**

This repository is configured to automatically deploy to Firebase Hosting using GitHub Actions.

---

## Setup Steps (For Reference)

Below are the steps that were completed to set up Firebase Hosting:

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project
4. Copy your **Project ID** (you'll need this later)

## Step 2: Update Configuration Files

Replace `your-firebase-project-id` with your actual Firebase Project ID in these files:

- `.firebaserc` (line 3)
- `.github/workflows/firebase-hosting-merge.yml` (line 19)
- `.github/workflows/firebase-hosting-pull-request.yml` (line 17)

## Step 3: Generate Firebase Service Account Key

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to the **Service Accounts** tab
3. Click **Generate New Private Key**
4. Download the JSON file (keep this secure!)

## Step 4: Add GitHub Secret

1. Go to your GitHub repository settings
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT`
5. Value: Paste the entire contents of the JSON file from Step 3
6. Click **Add secret**

## Step 5: Enable Firebase Hosting

1. In the Firebase Console, go to **Hosting** from the left menu
2. Click **Get Started** and follow the prompts
3. Your site will be available at: `https://your-project-id.web.app`

## How It Works

- **On Push to main/master**: Automatically deploys to your live Firebase Hosting site
- **On Pull Request**: Creates a preview deployment so you can test changes before merging

## Local Testing (Optional)

To test Firebase Hosting locally:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if needed)
firebase init hosting

# Serve locally
firebase serve
```

## Deployment

Once configured, simply push to your main branch or merge a PR:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Your site will automatically deploy to Firebase Hosting!

## Need Help?

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
