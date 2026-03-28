import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcbmlxdxwakkubpldype.supabase.co'
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm1seGR4d2Fra3VicGxkeXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODk2OCwiZXhwIjoyMDg5MTQ0OTY4fQ.F7wqfoRG7NW19_xLnAUiCfMoYeMFTurzVFLxO59u7_g'

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function listTables() {
  const suspected = ['policies', 'policy_holders', 'members', 'partners', 'shops', 'policy_plans'];
  
  for (const name of suspected) {
    const { data, error } = await supabase.from(name).select('*').limit(5);
    if (error) {
      console.log(`❌ ${name}: ${error.message}`);
    } else {
      console.log(`✅ ${name}: Found ${data?.length || 0} sample rows`);
      if (data && data.length > 0) {
        console.log(JSON.stringify(data[0], null, 2));
      }
    }
  }
}

listTables();
