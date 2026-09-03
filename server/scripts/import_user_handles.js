require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gxbhswojyrlifgqhjwqv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4Ymhzd29qeXJsaWZncWhqd3F2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzMzMTY0MCwiZXhwIjoyMDk4OTA3NjQwfQ.Y7FtT9Lv9mN_tBje5jJ_vtMW_kqUTjgkKSu2G5RgxII';

const supabase = createClient(supabaseUrl, supabaseKey);

function deriveCollegeIdFromEmail(email) {
  if (!email) return '';
  return email.trim().slice(0, 11).toUpperCase();
}

async function importHandles() {
  const dataPath = path.join(__dirname, '../data/user_data_export.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const exportData = JSON.parse(rawData);
  const users = exportData.users || [];

  console.log(`Found ${users.length} users in JSON export.`);

  // 1. Fetch existing profiles
  const { data: existingProfiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('*');

  if (profilesErr) {
    console.error('Error fetching existing profiles:', profilesErr.message);
    process.exit(1);
  }

  console.log(`Fetched ${existingProfiles.length} existing profiles from Supabase.`);

  // 2. Fetch all auth users via admin API
  const { data: authData, error: authErr } = await supabase.auth.admin.listUsers();
  const authUsers = authData?.users || [];
  console.log(`Fetched ${authUsers.length} existing Auth users from Supabase.`);

  let updatedCount = 0;
  let insertedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const email = (user.email || '').trim().toLowerCase();
    const collegeId = deriveCollegeIdFromEmail(email);
    const name = user.name || '';
    const cfHandle = user.codeforces?.handle ? user.codeforces.handle.trim() : null;
    const lcHandle = user.leetcode?.handle ? user.leetcode.handle.trim() : null;

    if (!cfHandle && !lcHandle) {
      skippedCount++;
      continue;
    }

    // Match existing profile by email or college_id
    let existingProfile = existingProfiles.find(p => {
      const pEmail = (p.email || '').trim().toLowerCase();
      const pCollegeId = (p.college_id || '').trim().toUpperCase();
      return (email && pEmail === email) || (collegeId && pCollegeId === collegeId);
    });

    let userId = existingProfile?.id;

    // If no existing profile, find or create auth user
    if (!userId) {
      let authUser = authUsers.find(u => (u.email || '').trim().toLowerCase() === email);
      
      if (!authUser) {
        // Create auth user
        const { data: createdAuth, error: createErr } = await supabase.auth.admin.createUser({
          email: email,
          email_confirm: true,
          user_metadata: { full_name: name }
        });

        if (createErr) {
          console.error(`[${i+1}/${users.length}] Auth creation failed for ${name} (${email}):`, createErr.message);
          errorCount++;
          continue;
        }
        authUser = createdAuth.user;
      }

      userId = authUser.id;
    }

    // Upsert profile record
    const profilePayload = {
      id: userId,
      email: email,
      name: name,
      college_id: collegeId,
      codeforces_handle: cfHandle,
      leetcode_handle: lcHandle,
      profile_completed: true
    };

    const { error: upsertErr } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    if (upsertErr) {
      console.error(`[${i+1}/${users.length}] Profile upsert failed for ${name} (${email}):`, upsertErr.message);
      errorCount++;
    } else {
      if (existingProfile) updatedCount++;
      else insertedCount++;
      console.log(`[${i+1}/${users.length}] Successfully saved handles for ${name} (CF: ${cfHandle || 'none'}, LC: ${lcHandle || 'none'})`);
    }
  }

  console.log('\n========================================');
  console.log('MIGRATION COMPLETED SUCCESSFULLY!');
  console.log(`Updated Existing Profiles : ${updatedCount}`);
  console.log(`Inserted New Profiles      : ${insertedCount}`);
  console.log(`Skipped (No Handles)      : ${skippedCount}`);
  console.log(`Failed                    : ${errorCount}`);
  console.log('========================================\n');
}

importHandles().catch(console.error);
