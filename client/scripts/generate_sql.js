import { RESOURCES_BY_DOMAIN } from '../src/data/resourcesData.js';
import fs from 'fs';
import path from 'path';

function escapeSql(str) {
  if (!str) return 'NULL';
  // Replace single quotes with two single quotes for SQL
  return "'" + str.replace(/'/g, "''") + "'";
}

const lines = [
  '-- Auto-generated seed data for resources',
  '-- Run this in your Supabase SQL Editor to populate the resources table',
  '',
];

for (const [domainId, resources] of Object.entries(RESOURCES_BY_DOMAIN)) {
  lines.push(`-- SEED DATA FOR ${domainId.toUpperCase()}`);
  
  for (const res of resources) {
    const domain = escapeSql(domainId);
    const category = escapeSql(domainId);
    const title = escapeSql(res.title);
    const url = escapeSql(res.url);
    const desc = escapeSql(res.description);
    const type = escapeSql(res.type || 'article');
    const week = res.week || 1;
    const order = res.order || 1;
    const alt_url = escapeSql(res.alt_url);
    const alt_source = escapeSql(res.alt_source);
    
    lines.push(
      `INSERT INTO public.resources (domain, category, title, url, description, type, week_number, order_in_week, alt_url, alt_source) ` +
      `VALUES (${domain}, ${category}, ${title}, ${url}, ${desc}, ${type}, ${week}, ${order}, ${alt_url}, ${alt_source});`
    );
  }
  lines.push('');
}

const outputPath = path.resolve(process.cwd(), '../supabase/migrations/20260708000003_seed_resources.sql');
fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');

console.log(`Successfully generated SQL file at: ${outputPath}`);
