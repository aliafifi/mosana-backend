# 🔥 Firebase Push Notifications Setup Guide

## Overview
This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in the Mosana backend.

---

## 📋 Step-by-Step Setup

### STEP 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com
2. Sign in with your Google account
3. You should see your existing Firebase project (or create a new one)

---

### STEP 2: Select or Create Project

**If you have an existing project:**
- Click on your project name

**If creating a new project:**
1. Click **"Add project"**
2. Enter project name: `Mosana` (or any name)
3. Disable Google Analytics (optional for testing)
4. Click **"Create project"**
5. Wait ~30 seconds for setup

---

### STEP 3: Get Service Account Credentials

1. In your Firebase project, click the **⚙️ gear icon** (Project Settings)
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"** button
4. Click **"Generate key"** in the popup
5. A JSON file will download to your computer

---

### STEP 4: Copy JSON Content

1. Open the downloaded JSON file with a text editor
2. It will look something like this:

```json
{
  "type": "service_account",
  "project_id": "mosana-xyz",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...",
  "client_email": "firebase-adminsdk-xyz@mosana-xyz.iam.gserviceaccount.com",
  "client_id": "1234567890",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

3. **IMPORTANT**: Copy the ENTIRE JSON content (all of it!)

---

### STEP 5: Add to .env File

**Option A: Inline (Recommended for testing)**

Add this line to your `.env` file:

```bash
FIREBASE_CONFIG='{"type":"service_account","project_id":"your-project-id",...}'
```

⚠️ **Important**: 
- Put the entire JSON in single quotes
- Remove all line breaks (make it one line)
- Keep all double quotes inside

**Option B: File Path (Better for production)**

1. Save the JSON file as `firebase-service-account.json` in `/home/mosana/webapp`
2. Add to `.gitignore`:
   ```
   firebase-service-account.json
   ```
3. Update `.env`:
   ```bash
   FIREBASE_CONFIG_PATH=/home/mosana/webapp/firebase-service-account.json
   ```

---

### STEP 6: Verify Setup

After adding credentials, restart the backend:

```bash
cd /home/mosana/webapp
pm2 restart mosana-api
pm2 logs mosana-api --lines 20
```

**Look for this log:**
```
✅ Firebase Admin SDK initialized successfully
```

**If you see:**
```
⚠️  Firebase not configured - push notifications disabled
```
Then the credentials are not loaded properly.

---

## 🧪 Testing Push Notifications

### 1. Register a Test FCM Token

In Flutter app (or Postman), call:

```bash
POST /api/users/fcm-token
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "fcmToken": "test_token_from_flutter_app"
}
```

### 2. Trigger a Notification

Like a post, tip someone, or follow a user. The system will:
1. Create notification in database ✅
2. Send via WebSocket (if user online) ✅
3. Send via Firebase push (if user has FCM token) ✅

### 3. Check Logs

```bash
pm2 logs mosana-api --lines 50
```

Look for:
```
✅ Push notification sent: projects/mosana-xyz/messages/12345
```

---

## 📱 Flutter Integration

In your Flutter app, you'll need to:

### 1. Add Firebase to Flutter
```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.6
```

### 2. Initialize Firebase
```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  
  // Get FCM token
  String? fcmToken = await FirebaseMessaging.instance.getToken();
  
  // Register token with backend
  await registerFcmToken(fcmToken);
  
  runApp(MyApp());
}
```

### 3. Handle Notifications
```dart
FirebaseMessaging.onMessage.listen((RemoteMessage message) {
  print('Got a message whilst in the foreground!');
  print('Message data: ${message.data}');
  
  if (message.notification != null) {
    print('Title: ${message.notification!.title}');
    print('Body: ${message.notification!.body}');
    // Show local notification or update UI
  }
});
```

---

## 🔒 Security Best Practices

1. **Never commit** `firebase-service-account.json` to Git
2. Add to `.gitignore` immediately
3. Use environment variables in production
4. Rotate service account keys periodically
5. Limit service account permissions in Firebase Console

---

## 🚨 Troubleshooting

### "Firebase not configured"
- Check if `FIREBASE_CONFIG` is in `.env`
- Verify JSON is valid (use https://jsonlint.com)
- Restart PM2: `pm2 restart mosana-api`

### "Failed to send push notification"
- Check if FCM token is valid
- Verify Firebase project has Cloud Messaging enabled
- Check Firebase Console > Cloud Messaging for quotas

### "Invalid registration token"
- Token expired or app was uninstalled
- Request new token from Flutter app
- Backend will automatically remove invalid tokens

---

## 📊 Firebase Quotas (Free Tier)

| Feature | Free Tier Limit |
|---------|----------------|
| Push notifications | Unlimited! 🎉 |
| Database reads | 50,000/day |
| Database writes | 20,000/day |
| Storage | 1 GB |
| Bandwidth | 10 GB/month |

**Good news:** Push notifications are **FREE and UNLIMITED** on Firebase! 🔥

---

## ✅ Checklist

Before moving forward, make sure:

- [ ] Firebase project created
- [ ] Service account JSON downloaded
- [ ] `FIREBASE_CONFIG` added to `.env`
- [ ] Backend restarted
- [ ] Logs show "Firebase initialized successfully"
- [ ] FCM token registration endpoint works
- [ ] Push notifications being sent (check logs)

---

## 🎯 What's Next?

Once Firebase is configured:
1. Test push notifications with real device
2. Test all 4 notification types (likes, comments, tips, follows)
3. Verify preferences control push notifications
4. Document for Flutter team
5. Mark Feature 13 as 100% COMPLETE! 🎉

---

**Need help?** Just ask me! I'm here to guide you through every step! 🚀

---

**Created:** 2026-02-06  
**Feature:** 13 - Notifications System (Step 7)  
**Status:** Ready for configuration
