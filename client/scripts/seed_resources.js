import { createClient } from '@supabase/supabase-js';
import { RESOURCES_BY_DOMAIN } from '../src/data/resourcesData.js';
import fs from 'fs';
import path from 'path';

try {
  const envPath = path.resolve(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
} catch (e) {
  console.error("Could not load .env file", e);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use anon key, since we need to bypass RLS or ensure RLS allows insert
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Starting migration of seed data to Supabase...');
  
  let totalInserted = 0;

  for (const [domainId, resources] of Object.entries(RESOURCES_BY_DOMAIN)) {
    console.log(`Processing domain: ${domainId} (${resources.length} resources)`);
    
    for (const res of resources) {
      const payload = {
        domain: domainId,
        category: domainId,
        title: res.title,
        url: res.url,
        description: res.description,
        type: res.type || 'article',
        week_number: res.week,
        order_in_week: res.order,
        alt_url: res.alt_url || null,
        alt_source: res.alt_source || null
      };
      
      const { error } = await supabase.from('resources').insert(payload);
      
      if (error) {
        console.error(`Failed to insert ${res.title}:`, error.message);
      } else {
        totalInserted++;
      }
    }
  }
  
  console.log(`\nMigration complete! Successfully inserted ${totalInserted} resources.`);
}

seed();
