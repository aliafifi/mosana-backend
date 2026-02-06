// Simple notification test using MongoDB directly
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://mosanaAdmin:Mosana2026!SecureDB@localhost:27017/mosana?authSource=admin';
const testUser1 = 'TestUser1_abc123';
const testUser2 = 'TestUser2_def456';

async function test() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('mosana');
    
    console.log('=== NOTIFICATION TEST ===\n');
    
    // Step 1: Create test post
    console.log('Step 1: Creating test post...');
    const postResult = await db.collection('posts').insertOne({
      walletAddress: testUser1,
      content: 'Test post for notifications 🔔',
      mediaUrls: [],
      tags: [],
      likedBy: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const postId = postResult.insertedId;
    console.log(`✅ Post created: ${postId}\n`);
    
    // Step 2: Create notification (simulate like)
    console.log('Step 2: Creating LIKE notification...');
    await db.collection('notifications').insertOne({
      recipientWallet: testUser1,
      actorWallet: testUser2,
      type: 'post_liked',
      title: 'New like on your post!',
      message: `@${testUser2.slice(0,10)}... liked your post`,
      data: { postId: postId.toString() },
      actionUrl: `mosana://post/${postId}`,
      priority: 'normal',
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Like notification created\n');
    
    // Step 3: Create comment notification
    console.log('Step 3: Creating COMMENT notification...');
    await db.collection('notifications').insertOne({
      recipientWallet: testUser1,
      actorWallet: testUser2,
      type: 'post_commented',
      title: 'New comment on your post!',
      message: `@${testUser2.slice(0,10)}... commented: "Great post!"`,
      data: { postId: postId.toString() },
      actionUrl: `mosana://post/${postId}`,
      priority: 'normal',
      read: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Comment notification created\n');
    
    // Step 4: Query notifications
    console.log('Step 4: Querying notifications for User1...');
    const notifications = await db.collection('notifications')
      .find({ recipientWallet: testUser1 })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`✅ Found ${notifications.length} notification(s)\n`);
    
    notifications.forEach((notif, i) => {
      console.log(`Notification ${i+1}:`);
      console.log(`  Type: ${notif.type}`);
      console.log(`  Title: ${notif.title}`);
      console.log(`  Message: ${notif.message}`);
      console.log(`  Read: ${notif.read}`);
      console.log(`  Created: ${notif.createdAt.toISOString()}`);
      console.log('');
    });
    
    // Step 5: Count unread
    const unreadCount = await db.collection('notifications')
      .countDocuments({ recipientWallet: testUser1, read: false });
    
    console.log(`📊 Unread count: ${unreadCount}`);
    console.log('');
    
    console.log('=== TEST COMPLETE ===');
    console.log(notifications.length === 2 ? '✅ ✅ ✅ SUCCESS!' : '⚠️  Check results');
    
  } finally {
    await client.close();
  }
}

test().catch(console.error);
