# 🔧 Notification Preferences Testing Guide

## Overview
Test the notification preferences system to ensure users can control which notifications they receive.

## Prerequisites
- Backend running on port 4000
- Valid JWT token for TestUser1_abc123
- MongoDB connection working

---

## Test Cases

### ✅ TEST 1: Get Default Preferences
**Endpoint:** `GET /api/notifications/preferences`  
**Auth:** Required (JWT Bearer token)  
**Expected:** All notification types enabled by default

```bash
curl -X GET http://localhost:4000/api/notifications/preferences \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Expected Response:**
```json
{
  "walletAddress": "TestUser1_abc123",
  "enablePostLikes": true,
  "enablePostComments": true,
  "enableTips": true,
  "enableFollows": true,
  "enableVentures": true,
  "enableReputation": true,
  "enableDao": true,
  "quietHoursEnabled": false,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "08:00",
  "timezone": "UTC"
}
```

---

### ✅ TEST 2: Disable Specific Notification Types
**Endpoint:** `PUT /api/notifications/preferences`  
**Auth:** Required  
**Action:** Disable likes and comments, keep tips enabled

```bash
curl -X PUT http://localhost:4000/api/notifications/preferences \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "enablePostLikes": false,
    "enablePostComments": false,
    "enableTips": true
  }'
```

**Expected Response:**
```json
{
  "message": "Notification preferences updated successfully",
  "preferences": {
    "walletAddress": "TestUser1_abc123",
    "enablePostLikes": false,
    "enablePostComments": false,
    "enableTips": true,
    "enableFollows": true,
    ...
  }
}
```

---

### ✅ TEST 3: Enable Quiet Hours
**Endpoint:** `PUT /api/notifications/preferences`  
**Action:** Set quiet hours from 10 PM to 8 AM

```bash
curl -X PUT http://localhost:4000/api/notifications/preferences \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "quietHoursEnabled": true,
    "quietHoursStart": "22:00",
    "quietHoursEnd": "08:00",
    "timezone": "America/New_York"
  }'
```

---

### ✅ TEST 4: Verify Preferences Block Notifications
**Scenario:** With likes disabled, like a post and verify NO notification is created

**Step 1:** Disable post likes
```bash
curl -X PUT http://localhost:4000/api/notifications/preferences \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "enablePostLikes": false }'
```

**Step 2:** Like a post (via MongoDB - simulating)
```javascript
// This should NOT create a notification
await notificationsService.createNotification({
  recipientWallet: 'TestUser1_abc123',
  actorWallet: 'TestUser2_def456',
  type: NotificationType.POST_LIKED,
  title: 'New like on your post!',
  message: '@TestUser2... liked your post',
  ...
});
```

**Step 3:** Check notifications count
```bash
curl http://localhost:4000/api/notifications/unread \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Expected:** Count should remain the same (notification was NOT created)

---

### ✅ TEST 5: Verify Quiet Hours Block Notifications
**Scenario:** During quiet hours, notifications should be suppressed

**Prerequisites:**
- Set system time to within quiet hours (or mock the time check)
- Enable quiet hours in preferences

**Test:** Try to create a notification during quiet hours
**Expected:** Notification is NOT created or delayed

---

## Implementation Details

### Preference Keys Mapping
```typescript
NotificationType.POST_LIKED → enablePostLikes
NotificationType.POST_COMMENTED → enablePostComments
NotificationType.TIP_RECEIVED → enableTips
NotificationType.FOLLOW_NEW → enableFollows
NotificationType.VENTURE_INVITATION → enableVentures
NotificationType.REPUTATION_MILESTONE → enableReputation
NotificationType.DAO_PROPOSAL_CREATED → enableDao
```

### Quiet Hours Logic
```typescript
// Check if current time is in quiet hours
const now = new Date();
const userTime = convertToUserTimezone(now, preferences.timezone);
const hour = userTime.getHours();

const startHour = parseInt(preferences.quietHoursStart.split(':')[0]);
const endHour = parseInt(preferences.quietHoursEnd.split(':')[0]);

// If quiet hours span midnight (e.g., 22:00 - 08:00)
if (startHour > endHour) {
  isQuietHours = hour >= startHour || hour < endHour;
} else {
  isQuietHours = hour >= startHour && hour < endHour;
}
```

---

## Success Criteria

✅ **PASS:** All default preferences are enabled  
✅ **PASS:** Users can update individual preference settings  
✅ **PASS:** Disabled notification types do NOT create notifications  
✅ **PASS:** Quiet hours correctly block notifications  
✅ **PASS:** Timezone handling works correctly  
✅ **PASS:** Preferences persist across sessions  

---

## Notes

- **Silent Failure:** NotificationsService already implements silent failure - if preferences block a notification, it simply returns `null` without throwing an error
- **Performance:** Preference checks happen in-memory after fetching once per notification
- **Database:** Preferences are stored in `notificationpreferences` collection
- **Default Behavior:** If no preferences document exists, all notifications are enabled by default

---

## Next Steps After Testing

1. ✅ Verify all 7 notification types respect preferences
2. ✅ Test timezone conversions for quiet hours
3. ✅ Ensure preferences API is JWT-protected
4. 📱 Document for Flutter integration
5. 🔥 Move to Step 7: Firebase Cloud Messaging

---

**Testing Date:** 2026-02-06  
**Status:** Ready for testing  
**Estimated Time:** 20-30 minutes
