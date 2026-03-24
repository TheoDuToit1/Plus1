import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gcbmlxdxwakkubpldype.supabase.co'
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm1seGR4d2Fra3VicGxkeXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODk2OCwiZXhwIjoyMDg5MTQ0OTY4fQ.F7wqfoRG7NW19_xLnAUiCfMoYeMFTurzVFLxO59u7_g'

const supabase = createClient(supabaseUrl, supabaseServiceRole)

async function initDefaultCoverPlan() {
  try {
    console.log('🔍 Checking for default cover plan...\n')

    // Check if default cover plan exists
    const { data: existingPlan, error: checkError } = await supabase
      .from('cover_plans')
      .select('*')
      .eq('monthly_target_amount', 385)
      .eq('status', 'active')
      .maybeSingle()

    if (checkError) {
      console.error('❌ Error checking cover_plans table:', checkError.message)
      return
    }

    if (existingPlan) {
      console.log('✅ Default cover plan already exists:')
      console.log(`   ID: ${existingPlan.id}`)
      console.log(`   Name: ${existingPlan.plan_name}`)
      console.log(`   Target: R${existingPlan.monthly_target_amount}`)
      console.log(`   Status: ${existingPlan.status}`)
      return
    }

    console.log('⚠️  Default cover plan not found. Creating...\n')

    // Create default cover plan
    const { data: newPlan, error: insertError } = await supabase
      .from('cover_plans')
      .insert({
        plan_name: 'Day to Day Single',
        monthly_target_amount: 385,
        plan_level: 1,
        status: 'active',
        provider_id: null // Will be set when provider is added
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error creating default cover plan:', insertError.message)
      return
    }

    console.log('✅ Default cover plan created successfully!')
    console.log(`   ID: ${newPlan.id}`)
    console.log(`   Name: ${newPlan.plan_name}`)
    console.log(`   Target: R${newPlan.monthly_target_amount}`)
    console.log(`   Status: ${newPlan.status}`)

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

initDefaultCoverPlan()
