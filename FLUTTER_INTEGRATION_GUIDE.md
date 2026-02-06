# 📱 Flutter Integration Guide - Mosana Notifications

## Overview
This guide shows you how to integrate Mosana's notification system into your Flutter mobile app.

---

## 🔥 Features Available

### Delivery Methods:
1. **WebSocket** - Real-time notifications while app is open
2. **Firebase Push** - Push notifications when app is closed/background
3. **REST API** - Fetch notification history

### Notification Types:
- `post_liked` - Someone liked your post
- `post_commented` - Someone commented on your post
- `tip_received` - Someone tipped you
- `follow_new` - Someone followed you

---

## 📋 Prerequisites

### 1. Add Dependencies
```yaml
# pubspec.yaml
dependencies:
  firebase_core: ^2.24.0
  firebase_messaging: ^14.7.6
  web_socket_channel: ^2.4.0
  http: ^1.1.0
```

### 2. Firebase Setup

**iOS (ios/Runner/GoogleService-Info.plist):**
- Download from Firebase Console
- Add to your Xcode project

**Android (android/app/google-services.json):**
- Download from Firebase Console
- Place in `android/app/`

---

## 🚀 Implementation

### Step 1: Initialize Firebase

```dart
// main.dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

// Background message handler (must be top-level function)
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Handling background message: ${message.messageId}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase
  await Firebase.initializeApp();
  
  // Set up background handler
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
  runApp(MosanaApp());
}
```

---

### Step 2: Register FCM Token

```dart
// services/notification_service.dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class NotificationService {
  static const String baseUrl = 'https://api.mosana.xyz';
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  
  // Register FCM token with Mosana backend
  Future<void> registerFcmToken(String jwtToken) async {
    try {
      // Request permission (iOS)
      NotificationSettings settings = await _firebaseMessaging.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );
      
      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        print('User granted notification permission');
        
        // Get FCM token
        String? fcmToken = await _firebaseMessaging.getToken();
        
        if (fcmToken != null) {
          // Register with Mosana backend
          final response = await http.post(
            Uri.parse('$baseUrl/users/fcm-token'),
            headers: {
              'Authorization': 'Bearer $jwtToken',
              'Content-Type': 'application/json',
            },
            body: json.encode({'fcmToken': fcmToken}),
          );
          
          if (response.statusCode == 200) {
            print('✅ FCM token registered successfully');
          } else {
            print('❌ Failed to register FCM token: ${response.body}');
          }
        }
      }
    } catch (e) {
      print('Error registering FCM token: $e');
    }
  }
  
  // Unregister FCM token (when user logs out)
  Future<void> unregisterFcmToken(String jwtToken) async {
    try {
      String? fcmToken = await _firebaseMessaging.getToken();
      
      if (fcmToken != null) {
        await http.delete(
          Uri.parse('$baseUrl/users/fcm-token'),
          headers: {
            'Authorization': 'Bearer $jwtToken',
            'Content-Type': 'application/json',
          },
          body: json.encode({'fcmToken': fcmToken}),
        );
        
        print('✅ FCM token unregistered');
      }
    } catch (e) {
      print('Error unregistering FCM token: $e');
    }
  }
}
```

---

### Step 3: Handle Push Notifications

```dart
// services/notification_service.dart (continued)

class NotificationService {
  // ... previous code ...
  
  // Setup push notification handlers
  void setupPushNotifications(Function(RemoteMessage) onNotificationReceived) {
    // Foreground notifications (app is open)
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('📬 Notification received (foreground)');
      print('Title: ${message.notification?.title}');
      print('Body: ${message.notification?.body}');
      print('Data: ${message.data}');
      
      onNotificationReceived(message);
      
      // Show in-app notification banner
      _showInAppNotification(message);
    });
    
    // Notification clicked (app was terminated or background)
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('📬 Notification clicked');
      _handleNotificationClick(message);
    });
    
    // Check if app was opened from a notification
    _checkInitialMessage();
  }
  
  // Handle notification click
  void _handleNotificationClick(RemoteMessage message) {
    String? actionUrl = message.data['actionUrl'];
    String? notificationType = message.data['type'];
    
    if (actionUrl != null) {
      // Parse deep link
      // Example: mosana://post/abc123
      if (actionUrl.contains('mosana://post/')) {
        String postId = actionUrl.split('/').last;
        // Navigate to post detail screen
        print('Navigate to post: $postId');
      } else if (actionUrl.contains('mosana://profile/')) {
        String wallet = actionUrl.split('/').last;
        // Navigate to profile screen
        print('Navigate to profile: $wallet');
      }
    }
  }
  
  // Check if app was opened from terminated state via notification
  Future<void> _checkInitialMessage() async {
    RemoteMessage? initialMessage = 
        await FirebaseMessaging.instance.getInitialMessage();
    
    if (initialMessage != null) {
      _handleNotificationClick(initialMessage);
    }
  }
  
  // Show in-app notification banner
  void _showInAppNotification(RemoteMessage message) {
    // Use a package like flutter_local_notifications
    // or show a custom snackbar/banner
    print('Show in-app notification: ${message.notification?.title}');
  }
}
```

---

### Step 4: WebSocket Integration (Real-time)

```dart
// services/websocket_service.dart
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';

class WebSocketService {
  static const String wsUrl = 'ws://api.mosana.xyz/notifications';
  WebSocketChannel? _channel;
  
  // Connect to WebSocket
  void connect(String jwtToken, Function(Map<String, dynamic>) onNotification) {
    try {
      _channel = WebSocketChannel.connect(
        Uri.parse(wsUrl),
        // Add JWT token as query parameter or in connection
      );
      
      // Listen for messages
      _channel!.stream.listen(
        (message) {
          final data = json.decode(message);
          print('📡 WebSocket notification: $data');
          onNotification(data);
        },
        onError: (error) {
          print('WebSocket error: $error');
        },
        onDone: () {
          print('WebSocket connection closed');
        },
      );
      
      // Send authentication
      _channel!.sink.add(json.encode({
        'event': 'authenticate',
        'token': jwtToken,
      }));
      
      print('✅ WebSocket connected');
    } catch (e) {
      print('Error connecting to WebSocket: $e');
    }
  }
  
  // Disconnect
  void disconnect() {
    _channel?.sink.close();
    print('WebSocket disconnected');
  }
  
  // Send ping (keep-alive)
  void ping() {
    _channel?.sink.add(json.encode({'event': 'ping'}));
  }
}
```

---

### Step 5: Fetch Notification History (REST API)

```dart
// services/notification_api_service.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class NotificationApiService {
  static const String baseUrl = 'https://api.mosana.xyz';
  
  // Get notifications (paginated)
  Future<List<Notification>> getNotifications({
    required String jwtToken,
    int page = 1,
    int limit = 20,
  }) async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications?page=$page&limit=$limit'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
      },
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['data']['notifications'] as List)
          .map((n) => Notification.fromJson(n))
          .toList();
    }
    
    throw Exception('Failed to load notifications');
  }
  
  // Get unread count
  Future<int> getUnreadCount(String jwtToken) async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications/unread'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
      },
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['data']['count'];
    }
    
    return 0;
  }
  
  // Mark as read
  Future<void> markAsRead(String notificationId, String jwtToken) async {
    await http.put(
      Uri.parse('$baseUrl/notifications/$notificationId/read'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
      },
    );
  }
  
  // Mark all as read
  Future<void> markAllAsRead(String jwtToken) async {
    await http.put(
      Uri.parse('$baseUrl/notifications/read-all'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
      },
    );
  }
  
  // Delete notification
  Future<void> deleteNotification(String notificationId, String jwtToken) async {
    await http.delete(
      Uri.parse('$baseUrl/notifications/$notificationId'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
      },
    );
  }
  
  // Get preferences
  Future<Map<String, dynamic>> getPreferences(String jwtToken) async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications/preferences'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
      },
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['data'];
    }
    
    throw Exception('Failed to load preferences');
  }
  
  // Update preferences
  Future<void> updatePreferences(
    Map<String, dynamic> preferences,
    String jwtToken,
  ) async {
    await http.put(
      Uri.parse('$baseUrl/notifications/preferences'),
      headers: {
        'Authorization': 'Bearer $jwtToken',
        'Content-Type': 'application/json',
      },
      body: json.encode(preferences),
    );
  }
}
```

---

### Step 6: Notification Model

```dart
// models/notification.dart
class Notification {
  final String id;
  final String type;
  final String title;
  final String message;
  final Map<String, dynamic> data;
  final String? actionUrl;
  final String priority;
  final bool read;
  final DateTime createdAt;
  
  Notification({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.data,
    this.actionUrl,
    required this.priority,
    required this.read,
    required this.createdAt,
  });
  
  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      id: json['_id'],
      type: json['type'],
      title: json['title'],
      message: json['message'],
      data: json['data'] ?? {},
      actionUrl: json['actionUrl'],
      priority: json['priority'] ?? 'normal',
      read: json['read'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
```

---

## 📱 Usage Example

```dart
// main.dart or home_screen.dart

class _HomeScreenState extends State<HomeScreen> {
  final NotificationService _notificationService = NotificationService();
  final WebSocketService _wsService = WebSocketService();
  final NotificationApiService _apiService = NotificationApiService();
  
  @override
  void initState() {
    super.initState();
    _setupNotifications();
  }
  
  Future<void> _setupNotifications() async {
    String jwtToken = await getJwtToken(); // Your auth method
    
    // 1. Register FCM token
    await _notificationService.registerFcmToken(jwtToken);
    
    // 2. Setup push notification handlers
    _notificationService.setupPushNotifications((message) {
      // Handle notification received
      setState(() {
        // Update UI (e.g., show badge, refresh list)
      });
    });
    
    // 3. Connect to WebSocket for real-time
    _wsService.connect(jwtToken, (notification) {
      // Handle WebSocket notification
      print('Real-time notification: $notification');
      setState(() {
        // Update UI immediately
      });
    });
  }
  
  @override
  void dispose() {
    _wsService.disconnect();
    super.dispose();
  }
}
```

---

## 🎨 UI Components

### Notification Bell Icon with Badge

```dart
class NotificationBellIcon extends StatelessWidget {
  final int unreadCount;
  final VoidCallback onTap;
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        IconButton(
          icon: Icon(Icons.notifications),
          onPressed: onTap,
        ),
        if (unreadCount > 0)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              padding: EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
              child: Text(
                unreadCount > 99 ? '99+' : unreadCount.toString(),
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
```

---

## 🔗 API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | List notifications (paginated) |
| `/api/notifications/unread` | GET | Get unread count |
| `/api/notifications/:id/read` | PUT | Mark as read |
| `/api/notifications/read-all` | PUT | Mark all as read |
| `/api/notifications/:id` | DELETE | Delete notification |
| `/api/notifications/preferences` | GET | Get user preferences |
| `/api/notifications/preferences` | PUT | Update preferences |
| `/api/users/fcm-token` | POST | Register FCM token |
| `/api/users/fcm-token` | DELETE | Unregister FCM token |
| `ws://api.mosana.xyz/notifications` | WebSocket | Real-time notifications |

---

## 🧪 Testing

1. **Test Push Notifications:**
   - Close the app completely
   - Like a post from another account
   - You should receive a push notification

2. **Test WebSocket:**
   - Open the app
   - Like a post from another account
   - Notification should appear instantly (no delay)

3. **Test Preferences:**
   - Disable "Post Likes" in settings
   - Like a post
   - No notification should be created

---

## ✅ Checklist

Before launching:
- [ ] Firebase project configured
- [ ] FCM token registration working
- [ ] Push notifications showing on device
- [ ] WebSocket real-time working
- [ ] Deep links navigating correctly
- [ ] Notification list UI complete
- [ ] Preferences screen working
- [ ] Unread badge showing
- [ ] Tested on iOS
- [ ] Tested on Android

---

## 🚨 Troubleshooting

**Push notifications not working:**
1. Check Firebase console for errors
2. Verify google-services.json / GoogleService-Info.plist
3. Check app permissions
4. Test with Firebase Console (send test message)

**WebSocket not connecting:**
1. Check URL (ws:// for local, wss:// for production)
2. Verify JWT token is valid
3. Check backend logs

**Deep links not working:**
1. Configure app schemes (iOS: Info.plist, Android: AndroidManifest.xml)
2. Test with `mosana://` scheme

---

**Created:** 2026-02-06  
**Feature:** 13 - Notifications System  
**Status:** Complete ✅
