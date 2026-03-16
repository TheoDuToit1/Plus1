// =====================================================
// CLEAR SUPABASE STORAGE BUCKETS
// =====================================================
// Run this in browser console or as a Node.js script
// Make sure you have supabase client initialized

// Option 1: Browser Console (if supabase client is available)
// =====================================================

async function clearAllStorageBuckets() {
  // List of bucket names to clear
  const buckets = ['avatars', 'documents', 'images'];
  
  for (const bucketName of buckets) {
    try {
      console.log(`🗑️ Clearing bucket: ${bucketName}`);
      
      // List all files in the bucket
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list();
      
      if (listError) {
        console.log(`❌ Error listing files in ${bucketName}:`, listError.message);
        continue;
      }
      
      if (!files || files.length === 0) {
        console.log(`✅ Bucket ${bucketName} is already empty`);
        continue;
      }
      
      // Delete all files
      const fileNames = files.map(file => file.name);
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove(fileNames);
      
      if (deleteError) {
        console.log(`❌ Error deleting files from ${bucketName}:`, deleteError.message);
      } else {
        console.log(`✅ Cleared ${fileNames.length} files from ${bucketName}`);
      }
      
    } catch (error) {
      console.log(`❌ Error processing bucket ${bucketName}:`, error.message);
    }
  }
  
  console.log('🎉 Storage bucket clearing complete!');
}

// Run the function
// clearAllStorageBuckets();

// Option 2: Manual clearing via Supabase Dashboard
// =====================================================

/*
MANUAL STEPS:

1. Go to your Supabase Dashboard
2. Navigate to Storage section
3. For each bucket (avatars, documents, images, etc.):
   a. Click on the bucket name
   b. Select all files (Ctrl+A or Cmd+A)
   c. Click the Delete button
   d. Confirm deletion

4. Repeat for all buckets

This is the safest method and doesn't require any code.
*/

// Option 3: Node.js Script
// =====================================================

/*
// If running as Node.js script, first install and import supabase:
// npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Then run clearAllStorageBuckets() function above
*/

// Option 4: Individual bucket clearing
// =====================================================

async function clearSpecificBucket(bucketName) {
  try {
    console.log(`🗑️ Clearing bucket: ${bucketName}`);
    
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list();
    
    if (listError) throw listError;
    
    if (!files || files.length === 0) {
      console.log(`✅ Bucket ${bucketName} is already empty`);
      return;
    }
    
    const fileNames = files.map(file => file.name);
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(fileNames);
    
    if (deleteError) throw deleteError;
    
    console.log(`✅ Cleared ${fileNames.length} files from ${bucketName}`);
    
  } catch (error) {
    console.log(`❌ Error clearing bucket ${bucketName}:`, error.message);
  }
}

// Usage examples:
// clearSpecificBucket('avatars');
// clearSpecificBucket('documents');
// clearSpecificBucket('images');