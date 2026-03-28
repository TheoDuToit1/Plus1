import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcbmlxdxwakkubpldype.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm1seGR4d2Fra3VicGxkeXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njg5NjgsImV4cCI6MjA4OTE0NDk2OH0.qcKXTIpZwqxuKkVAZ-m4E-LPgxcE0YQ1ANdRI9bOnfQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const partners = [
  {
    shop_name: "L'Artisan Bistro",
    phone: '+27123456789',
    category: 'French',
    address: '123 Main St',
    cashback_percent: 5,
    rating: 4.8,
    total_reviews: 245,
    average_prep_time_minutes: 25,
    store_logo_url: 'https://via.placeholder.com/100?text=Artisan',
    store_banner_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0cYxqjsJmhbqDBhPL4-eBXB0ls7o9NNKew1qpW12l_HoPhbr_sJ_q9NSS8h7k-PR0enSqI25FRfYp7ie8rgvxHDGyUfYUtlotDg75ucb__ElEIBRqpBrzcwP1effBn1BHjeNZ995jn-qcrQrgGus6h-6ab8BHHOpljFrcv2ebHudiiFmk4eNjaQp011cvQwYCeIUltn-FlT-QA7OwLzIhiyxYjZFV7F3EKwxRmSK_mz3wPMtl-1jWJbT5nhhKN-IVna4fpiCpZRYG',
    delivery_radius_km: 5,
    minimum_order_value: 1000,
    is_open: true,
  },
  {
    shop_name: 'Napoli Wood Fired',
    phone: '+27123456790',
    category: 'Italian',
    address: '456 Oak Ave',
    cashback_percent: 8,
    rating: 4.6,
    total_reviews: 189,
    average_prep_time_minutes: 20,
    store_logo_url: 'https://via.placeholder.com/100?text=Napoli',
    store_banner_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKkZ1Zp8xmp9FxPnk5SA4-GIB6jLM0P98WrJhORHk5F7SyGoyuFk9THapmV5tZONbEpEjh5VkKQRetw4K-6uuSIHzBrTPpLW19Zc8KT1vqXlnCX6ENSY1Wh2h3cbAcO7gCbXt0Sz75inzkkkvDkUDPQiztykylYilA60f8EG9BJCurPO44MeGTzmeIQE_rEgbTjL_Xfc3K3IUz9b03s9GryYSffiVmuUEdS4H_7FNAVfv4QZEmpX-lH9c_RtQBwNtxisDZ0HF-dNUA',
    delivery_radius_km: 8,
    minimum_order_value: 1500,
    is_open: true,
  },
  {
    shop_name: 'Sushi Zen Master',
    phone: '+27123456791',
    category: 'Japanese',
    address: '789 Pine Rd',
    cashback_percent: 10,
    rating: 4.9,
    total_reviews: 312,
    average_prep_time_minutes: 30,
    store_logo_url: 'https://via.placeholder.com/100?text=Sushi',
    store_banner_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3SAnSGUnWHx81tqOohJiQDiHKuuQps2gvVZ4DHJbngpn57Jvxz3OhaZIOVojuw-hnYvPO3ozAc9kE2H03E6CnAL7zKkaLBshIJX29i9T9XdhYfsY4ZfjoBjAisxIP4Y-0BDf_vHh8XvXGg6BYJNbqwwvvMSauOQqCRAsojPtPiBHTN5Rd0R0xv4NwbrY3mDgIBLvdNLGxlxNmB7vTWNZkOvWuaMDBgoqjv1Li7haTnCVGmKV3C7I7lDSgLhUMdbaIgHEFMZCrU0at',
    delivery_radius_km: 6,
    minimum_order_value: 2000,
    is_open: true,
  },
  {
    shop_name: 'Burger Republic',
    phone: '+27123456792',
    category: 'American',
    address: '321 Elm St',
    cashback_percent: 6,
    rating: 4.5,
    total_reviews: 156,
    average_prep_time_minutes: 20,
    store_logo_url: 'https://via.placeholder.com/100?text=Burger',
    store_banner_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhz1WoO9jgLRnz551ygQ_NfAr99Mpp6tv-LAJZ1OSjJEerQ89gvnZsTCRexeZLF1e2JwR_IW1oMZh4I0-vnf4dfvC8lE6SkVluCa5PGw1Wzpkf2DQrV8w6Eg-jdIC6kowO5ZTdq2VHEo4OGNxVxIATKXwYlik96UH26lZA9PJBKCEuPcUs4sCsJvWZG3_Ycs6L1i1jiCBxTQWqEcEsbVX8nGDRBBACt72lqERech5mLq_dQEaWYMfwt5eYadequU_lCgZ5OUyb1UYT',
    delivery_radius_km: 7,
    minimum_order_value: 1200,
    is_open: true,
  },
];

async function seedPartners() {
  try {
    console.log('Seeding partners...');
    
    const { data, error } = await supabase
      .from('partners')
      .insert(partners)
      .select();

    if (error) {
      console.error('Error inserting partners:', error);
      return;
    }

    console.log('Partners seeded successfully:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

seedPartners();
