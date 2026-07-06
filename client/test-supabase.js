import { supabase } from './src/lib/supabase.js';
import { addComment, getComments, deleteComment } from './src/services/commentService.js';
import { getResources } from './src/services/resourceService.js';
import { submitSolution, getMySubmissions } from './src/services/submissionService.js';

// Helper for color logging
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function logHeader(title) {
  console.log(`\n${colors.bright}${colors.blue}=== ${title} ===${colors.reset}`);
}

async function runTestSuite() {
  logHeader('INITIALIZING SUPABASE CLIENT');
  console.log(`${colors.cyan}Supabase URL:${colors.reset} ${supabase.supabaseUrl}`);
  
  let testUserEmail = `test.student.${Date.now()}@mnit.ac.in`;
  let testUserPassword = 'SecurePassword123!';
  let userId = null;

  // 1. Check schemas & accessibility of all tables
  logHeader('TESTING TABLE SCHEMA ACCESSIBILITY');
  const tables = ['profiles', 'problems', 'submissions', 'comments', 'events', 'resources'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`${colors.red}❌ Table "${table}" error:${colors.reset} ${error.message} (Status: ${error.status || 'unknown'})`);
      } else {
        console.log(`${colors.green}   Table "${table}":${colors.reset} Reachable. Rows returned: ${data.length}`);
      }
    } catch (e) {
      console.log(`${colors.red}❌ Table "${table}" exception:${colors.reset} ${e.message}`);
    }
  }

  // 1.5. Testing Domain Restriction
  logHeader('TESTING SIGNUP DOMAIN RESTRICTION');
  const invalidEmail = `hacker.${Date.now()}@gmail.com`;
  console.log(`Attempting signup with non-college email: ${invalidEmail}`);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: invalidEmail,
      password: 'HackerPassword123!',
    });
    if (error) {
      console.log(`${colors.green}   SignUp blocked as expected: ${error.message}${colors.reset}`);
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      // Sometimes supabase auth allows signup request but user identities is empty if domain restriction is set up on auth settings
      console.log(`${colors.green}   SignUp blocked or requires validation.${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ SignUp succeeded for non-college email (Domain restriction failed)!${colors.reset}`);
    }
  } catch (e) {
    console.log(`${colors.green}   SignUp exception occurred (blocked as expected): ${e.message}${colors.reset}`);
  }

  // 2. Auth Flow: Sign Up
  logHeader('TESTING USER SIGN UP FLOW');
  console.log(`Registering new test user: ${testUserEmail}`);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testUserEmail,
      password: testUserPassword,
    });

    if (error) {
      console.log(`${colors.red}❌ Sign Up Failed:${colors.reset} ${error.message}`);
      return;
    }

    userId = data.user?.id;
    console.log(`${colors.green}✅ Sign Up Successful!${colors.reset}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Session Created: ${data.session ? 'Yes' : 'No (Requires email confirmation/auto-confirm status check)'}`);
  } catch (e) {
    console.log(`${colors.red}❌ Sign Up Exception:${colors.reset} ${e.message}`);
    return;
  }

  // 3. Auth Flow: Sign In (Ensure we have a valid session)
  logHeader('TESTING USER SIGN IN FLOW');
  console.log(`Signing in as: ${testUserEmail}`);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUserEmail,
      password: testUserPassword,
    });

    if (error) {
      console.log(`${colors.red}❌ Sign In Failed:${colors.reset} ${error.message}`);
      return;
    }

    console.log(`${colors.green}✅ Sign In Successful!${colors.reset}`);
    console.log(`   Access Token: Present`);
    console.log(`   User Email in Session: ${data.user?.email}`);
  } catch (e) {
    console.log(`${colors.red}❌ Sign In Exception:${colors.reset} ${e.message}`);
    return;
  }

  // 4. Profiles: Retrieve profile (automatically created by DB trigger)
  logHeader('TESTING PROFILE RETRIEVAL');
  console.log(`Fetching profile for User ID: ${userId}`);
  let profile = null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.log(`${colors.red}❌ Profile Fetch Failed:${colors.reset} ${error.message}`);
    } else {
      profile = data;
      console.log(`${colors.green}✅ Profile Fetched Successfully!${colors.reset}`);
      console.log(JSON.stringify(profile, null, 2));
    }
  } catch (e) {
    console.log(`${colors.red}❌ Profile Fetch Exception:${colors.reset} ${e.message}`);
  }

  // 5. Profiles: Update profile details
  if (profile) {
    logHeader('TESTING PROFILE UPDATE');
    const updates = {
      name: 'Test Student',
      college_id: '2026UCP1234',
      branch: 'Computer Science and Engineering',
      codeforces_handle: 'test_cf_user',
      leetcode_handle: 'test_lc_user',
      codechef_handle: 'test_cc_user',
      linkedin_url: 'https://linkedin.com/in/test-student',
      github_url: 'https://github.com/test-student',
      skills: ['React', 'PostgreSQL', 'Supabase'],
    };

    console.log('Applying profile updates...');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.log(`${colors.red}❌ Profile Update Failed:${colors.reset} ${error.message}`);
      } else {
        console.log(`${colors.green}✅ Profile Updated Successfully!${colors.reset}`);
        console.log(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.log(`${colors.red}❌ Profile Update Exception:${colors.reset} ${e.message}`);
    }
  }

  // 6. Test events table insertions (if RLS allows)
  logHeader('TESTING EVENT CREATION (RLS VERIFICATION)');
  const newEvent = {
    title: `Mock Hackathon ${Date.now()}`,
    event_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    venue: 'Console Club Lab, CSE Dept',
    description: 'A mock hackathon event for testing Supabase database RLS rules.',
  };

  try {
    const { data, error } = await supabase
      .from('events')
      .insert(newEvent)
      .select();

    if (error) {
      console.log(`${colors.yellow}⚠️ Event creation failed (likely restricted by RLS for standard members):${colors.reset} ${error.message}`);
    } else {
      console.log(`${colors.green}✅ Event created successfully (Are events open to members or is RLS bypassed?):${colors.reset}`);
      console.log(data);
    }
  } catch (e) {
    console.log(`${colors.red}❌ Event creation exception:${colors.reset} ${e.message}`);
  }

  // 6.2. Test Comments, Resources, and Submissions Services
  logHeader('TESTING CLIENT SERVICES (COMMENTS, RESOURCES, SUBMISSIONS)');
  try {
    // A. Resources Service
    console.log('Testing getResources()...');
    const resourcesList = await getResources();
    console.log(`${colors.green}✅ Resources Fetched successfully!${colors.reset} Count: ${resourcesList.length}`);

    // B. Comments Service
    const mockTargetId = userId; // Using user's own UUID as a target since target_id is generic UUID
    console.log(`Posting a comment for target ID: ${mockTargetId}...`);
    const comment = await addComment(userId, mockTargetId, 'Testing comments service implementation!');
    console.log(`${colors.green}✅ Comment created successfully!${colors.reset}`);
    console.log(`   Author: ${comment.profiles?.name || 'Anonymous'}`);
    console.log(`   Content: "${comment.content}"`);

    console.log('Fetching comments for target...');
    const commentsForTarget = await getComments(mockTargetId);
    console.log(`${colors.green}✅ Comments fetched successfully!${colors.reset} Count: ${commentsForTarget.length}`);

    console.log('Deleting our test comment...');
    await deleteComment(comment.id);
    console.log(`${colors.green}✅ Comment deleted successfully!${colors.reset}`);

    // C. Submissions Service
    console.log('Fetching problems list to find a target for submission...');
    const { data: problems, error: problemsError } = await supabase.from('problems').select('*').limit(1);
    
    if (problemsError) {
      console.log(`${colors.red}❌ Failed to query problems for submission test:${colors.reset} ${problemsError.message}`);
    } else if (problems.length === 0) {
      console.log(`${colors.yellow}⚠️ No problems found in database. Skipping submission service test (requires a valid problem reference).${colors.reset}`);
    } else {
      const problemId = problems[0].id;
      console.log(`Submitting solution status for Problem: "${problems[0].title}" (ID: ${problemId})...`);
      const submission = await submitSolution(userId, problemId, 'Correct', 2);
      console.log(`${colors.green}✅ Solution submitted successfully!${colors.reset}`);
      console.log(`   Status: ${submission.status}`);
      console.log(`   Attempts: ${submission.attempts}`);

      console.log('Fetching our submissions history...');
      const mySubmissions = await getMySubmissions(userId);
      console.log(`${colors.green}✅ Submissions history fetched successfully!${colors.reset} Count: ${mySubmissions.length}`);
    }
  } catch (e) {
    console.log(`${colors.red}❌ Client services testing exception:${colors.reset} ${e.message}`);
  }

  // 6.5. Test Storage Buckets & Policies
  logHeader('TESTING STORAGE BUCKETS');
  try {
    console.log('Testing file upload to "resumes" bucket...');
    const testFileContent = 'Hello, this is a mock resume upload test.';
    const testFilePath = `${userId}/test-resume.txt`;
    
    // Convert string to Blob / Buffer / Uint8Array for browser-safe uploading
    const fileData = typeof Blob !== 'undefined' 
      ? new Blob([testFileContent], { type: 'text/plain' }) 
      : Buffer.from(testFileContent);

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(testFilePath, fileData, {
        contentType: 'text/plain',
        upsert: true
      });

        if (uploadError) {
          console.log(`${colors.red}❌ Resume upload failed:${colors.reset} ${uploadError.message}`);
        } else {
          console.log(`${colors.green}✅ Resume uploaded successfully!${colors.reset} Path: ${uploadData.path}`);

          // Download (Read)
          console.log('Testing file download from "resumes" bucket...');
          const { data: downloadData, error: downloadError } = await supabase.storage
            .from('resumes')
            .download(testFilePath);

          if (downloadError) {
            console.log(`${colors.red}❌ Resume download failed:${colors.reset} ${downloadError.message}`);
          } else {
            console.log(`${colors.green}✅ Resume downloaded successfully!${colors.reset}`);
            
            // Clean up: Delete
            console.log('Cleaning up: deleting mock resume...');
            const { error: deleteError } = await supabase.storage
              .from('resumes')
              .remove([testFilePath]);

            if (deleteError) {
              console.log(`${colors.red}❌ Failed to delete mock resume during cleanup:${colors.reset} ${deleteError.message}`);
            } else {
              console.log(`${colors.green}✅ Mock resume deleted successfully (cleanup complete).${colors.reset}`);
            }
        }
      }
  } catch (e) {
    console.log(`${colors.red}❌ Storage testing exception:${colors.reset} ${e.message}`);
  }

  // 7. Auth Flow: Sign Out
  logHeader('TESTING AUTH SIGN OUT');
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(`${colors.red}❌ Sign Out Failed:${colors.reset} ${error.message}`);
    } else {
      console.log(`${colors.green}✅ Sign Out Successful!${colors.reset}`);
    }
  } catch (e) {
    console.log(`${colors.red}❌ Sign Out Exception:${colors.reset} ${e.message}`);
  }

  logHeader('TEST SUITE COMPLETED');
}

runTestSuite();
