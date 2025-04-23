import { supabase } from "./supaBaseClient";

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Simple query to test the connection - just getting the current time from Supabase
    const { data, error } = await supabase.from('notes').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      console.error('Error details:', error);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Response data:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Execute the test
testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log('Connection test completed successfully.');
    } else {
      console.log('Connection test failed.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
  });