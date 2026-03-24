import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcbmlxdxwakkubpldype.supabase.co'
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm1seGR4d2Fra3VicGxkeXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODk2OCwiZXhwIjoyMDg5MTQ0OTY4fQ.F7wqfoRG7NW19_xLnAUiCfMoYeMFTurzVFLxO59u7_g'

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function verifyMemberDashboardData() {
  try {
    console.log('🔍 Verifying Member Dashboard Data...\n')

    // Get the most recent member
    const { data: members } = await supabase
      .from('members')
      .select('id, full_name, phone')
      .order('created_at', { ascending: false })
      .limit(1)

    if (!members || members.length === 0) {
      console.log('❌ No members found')
      return
    }

    const member = members[0]
    console.log(`👤 Testing with member: ${member.full_name} (${member.phone})`)
    console.log(`   Member ID: ${member.id}\n`)

    // Test the exact query used in the dashboard
    const { data: coverPlansData, error: coverPlansError } = await supabase
      .from('member_cover_plans')
      .select(`
        *,
        cover_plans (plan_name)
      `)
      .eq('member_id', member.id)
      .order('creation_order', { ascending: true })

    console.log('📋 Cover Plans Query Result:')
    if (coverPlansError) {
      console.log('   ❌ Error:', coverPlansError.message)
    } else if (!coverPlansData || coverPlansData.length === 0) {
      console.log('   ⚠️  No cover plans found')
    } else {
      console.log(`   ✅ Found ${coverPlansData.length} cover plan(s)`)
      coverPlansData.forEach((plan, index) => {
        console.log(`\n   Plan ${index + 1}:`)
        console.log(`   - Name: ${plan.cover_plans.plan_name}`)
        console.log(`   - Target: R${plan.target_amount}`)
        console.log(`   - Funded: R${plan.funded_amount}`)
        console.log(`   - Status: ${plan.status}`)
        console.log(`   - Creation Order: ${plan.creation_order}`)
      })
    }

    console.log('\n✅ Dashboard data verification complete!')
    console.log('\n💡 If the dashboard is not showing this data:')
    console.log('   1. Clear your browser cache (Ctrl+Shift+Delete)')
    console.log('   2. Hard refresh the page (Ctrl+Shift+R)')
    console.log('   3. Check browser console for errors (F12)')
    console.log('   4. Verify you are logged in with the correct member')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

verifyMemberDashboardData()
