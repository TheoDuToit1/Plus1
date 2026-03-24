import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcbmlxdxwakkubpldype.supabase.co'
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm1seGR4d2Fra3VicGxkeXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODk2OCwiZXhwIjoyMDg5MTQ0OTY4fQ.F7wqfoRG7NW19_xLnAUiCfMoYeMFTurzVFLxO59u7_g'

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function checkMemberCoverPlans() {
  try {
    console.log('🔍 Checking member cover plans...\n')

    // Get all members
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('id, full_name, phone')
      .limit(10)

    if (membersError) {
      console.error('❌ Error fetching members:', membersError.message)
      return
    }

    if (!members || members.length === 0) {
      console.log('⚠️  No members found in database')
      return
    }

    console.log(`✅ Found ${members.length} members\n`)

    // Check each member's cover plans
    for (const member of members) {
      console.log(`👤 ${member.full_name} (${member.phone})`)
      
      const { data: coverPlans, error: plansError } = await supabase
        .from('member_cover_plans')
        .select(`
          *,
          cover_plans (plan_name, monthly_target_amount)
        `)
        .eq('member_id', member.id)
        .order('creation_order', { ascending: true })

      if (plansError) {
        console.log(`   ❌ Error: ${plansError.message}`)
      } else if (!coverPlans || coverPlans.length === 0) {
        console.log(`   ⚠️  No cover plans assigned`)
      } else {
        coverPlans.forEach(plan => {
          console.log(`   ✅ ${plan.cover_plans.plan_name}`)
          console.log(`      Target: R${plan.target_amount} | Funded: R${plan.funded_amount} | Status: ${plan.status}`)
        })
      }
      console.log('')
    }

    // Get default cover plan
    const { data: defaultPlan } = await supabase
      .from('cover_plans')
      .select('*')
      .eq('monthly_target_amount', 385)
      .eq('status', 'active')
      .single()

    if (defaultPlan) {
      console.log(`\n📋 Default Cover Plan:`)
      console.log(`   ID: ${defaultPlan.id}`)
      console.log(`   Name: ${defaultPlan.plan_name}`)
      console.log(`   Target: R${defaultPlan.monthly_target_amount}`)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

checkMemberCoverPlans()
