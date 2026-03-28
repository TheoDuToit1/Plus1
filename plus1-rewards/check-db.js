import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcbmlxdxwakkubpldype.supabase.co'
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm1seGR4d2Fra3VicGxkeXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODk2OCwiZXhwIjoyMDg5MTQ0OTY4fQ.F7wqfoRG7NW19_xLnAUiCfMoYeMFTurzVFLxO59u7_g'

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function checkTables() {
  try {
    console.log('🔍 Checking Supabase Tables...\n')

    // Check specific tables
    const tableNames = ['shops', 'members', 'wallets', 'transactions', 'monthly_invoices', 'policy_plans', 'agents']

    console.log('📊 Checking Core Tables:')
    console.log('─'.repeat(60))

    const results = {}

    for (const tableName of tableNames) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })

        if (!error) {
          results[tableName] = { status: '✅', rows: count || 0 }
          console.log(`✅ ${tableName.padEnd(20)} | ${count || 0} rows`)
        } else {
          results[tableName] = { status: '❌', error: error.message }
          console.log(`❌ ${tableName.padEnd(20)} | ${error.message}`)
        }
      } catch (e) {
        results[tableName] = { status: '⚠️', error: e.message }
        console.log(`⚠️  ${tableName.padEnd(20)} | ${e.message}`)
      }
    }

    console.log('─'.repeat(60))

    // Summary
    const successful = Object.values(results).filter(r => r.status === '✅').length
    const failed = Object.values(results).filter(r => r.status === '❌').length

    console.log(`\n📈 Summary:`)
    console.log(`   ✅ Tables Found: ${successful}/${tableNames.length}`)
    console.log(`   ❌ Tables Missing: ${failed}/${tableNames.length}`)

    if (successful > 0) {
      console.log('\n✅ Database connection successful!')
    } else {
      console.log('\n⚠️  No tables found. You may need to run the database schema.')
    }

  } catch (error) {
    console.error('❌ Connection Error:', error.message)
  }
}

checkTables()
