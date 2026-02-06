#!/bin/bash

# Test Notifications Flow
# Creates posts, likes them, adds comments, checks notifications

API="http://localhost:4000/api"

echo "=== TESTING NOTIFICATIONS FLOW ==="
echo ""

# Test users
USER1="TestUser1_abc123xyz"
USER2="TestUser2_def456uvw"

echo "Step 1: Create JWT tokens for test users..."
TOKEN1=$(curl -s -X POST "$API/auth/login" -H "Content-Type: application/json" -d "{\"walletAddress\":\"$USER1\"}" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
TOKEN2=$(curl -s -X POST "$API/auth/login" -H "Content-Type: application/json" -d "{\"walletAddress\":\"$USER2\"}" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN1" ] || [ -z "$TOKEN2" ]; then
  echo "❌ Failed to get tokens"
  exit 1
fi
echo "✅ Tokens obtained"
echo ""

echo "Step 2: User1 creates a post..."
POST_RESPONSE=$(curl -s -X POST "$API/posts" \
  -H "Authorization: Bearer $TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello from User1! Testing notifications 🔔"}')

POST_ID=$(echo $POST_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -z "$POST_ID" ]; then
  echo "❌ Failed to create post"
  echo "Response: $POST_RESPONSE"
  exit 1
fi
echo "✅ Post created: $POST_ID"
echo ""

echo "Step 3: User2 likes User1's post..."
LIKE_RESPONSE=$(curl -s -X POST "$API/posts/$POST_ID/like" \
  -H "Authorization: Bearer $TOKEN2")

if echo $LIKE_RESPONSE | grep -q "success.*true"; then
  echo "✅ Post liked (notification should be created!)"
else
  echo "⚠️  Like response: $LIKE_RESPONSE"
fi
echo ""

echo "Step 4: Check User1's notifications..."
NOTIF_RESPONSE=$(curl -s "$API/notifications" \
  -H "Authorization: Bearer $TOKEN1")

echo "Notifications for User1:"
echo $NOTIF_RESPONSE | grep -o '"unread":[0-9]*' || echo "No notifications field found"
echo ""

UNREAD_COUNT=$(echo $NOTIF_RESPONSE | grep -o '"unread":[0-9]*' | grep -o '[0-9]*')
if [ "$UNREAD_COUNT" -gt 0 ]; then
  echo "✅ SUCCESS! User1 has $UNREAD_COUNT unread notification(s)"
  echo ""
  echo "Notification details:"
  echo $NOTIF_RESPONSE | python3 -m json.tool 2>/dev/null || echo $NOTIF_RESPONSE
else
  echo "⚠️  No notifications found yet. Response:"
  echo $NOTIF_RESPONSE
fi
echo ""

echo "Step 5: User2 adds a comment..."
COMMENT_RESPONSE=$(curl -s -X POST "$API/posts/$POST_ID/comments" \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great post! Testing comment notifications 💬"}')

if echo $COMMENT_RESPONSE | grep -q "success.*true"; then
  echo "✅ Comment added (notification should be created!)"
else
  echo "⚠️  Comment response: $COMMENT_RESPONSE"
fi
echo ""

sleep 1

echo "Step 6: Check User1's notifications again..."
NOTIF_RESPONSE2=$(curl -s "$API/notifications" \
  -H "Authorization: Bearer $TOKEN1")

UNREAD_COUNT2=$(echo $NOTIF_RESPONSE2 | grep -o '"unread":[0-9]*' | grep -o '[0-9]*')
echo "✅ User1 now has $UNREAD_COUNT2 unread notification(s)"
echo ""

echo "Step 7: Get unread count..."
UNREAD=$(curl -s "$API/notifications/unread" \
  -H "Authorization: Bearer $TOKEN1")
echo "Unread endpoint: $UNREAD"
echo ""

echo "Step 8: Check notification details..."
echo $NOTIF_RESPONSE2 | python3 -m json.tool 2>/dev/null | grep -A 5 '"type":' | head -20

echo ""
echo "=== TEST COMPLETE ==="
echo "Expected: 2 notifications (1 like + 1 comment)"
echo "Actual: $UNREAD_COUNT2 notifications"

if [ "$UNREAD_COUNT2" -eq 2 ]; then
  echo "✅ ✅ ✅ SUCCESS! Notifications working perfectly!"
else
  echo "⚠️  Check logs above for details"
fi
