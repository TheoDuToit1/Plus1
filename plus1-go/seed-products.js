import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcbmlxdxwakkubpldype.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm1seGR4d2Fra3VicGxkeXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njg5NjgsImV4cCI6MjA4OTE0NDk2OH0.qcKXTIpZwqxuKkVAZ-m4E-LPgxcE0YQ1ANdRI9bOnfQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProducts() {
  try {
    // First, get all partners
    const { data: partners, error: partnersError } = await supabase
      .from('partners')
      .select('id, shop_name');

    if (partnersError) throw partnersError;

    console.log('Found partners:', partners);

    for (const partner of partners) {
      // Create categories for each partner
      const categories = [
        { name: 'Appetizers', display_order: 1 },
        { name: 'Main Courses', display_order: 2 },
        { name: 'Desserts', display_order: 3 }
      ];

      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .insert(categories.map(cat => ({ ...cat, partner_id: partner.id })))
        .select();

      if (categoryError) throw categoryError;

      console.log(`Created categories for ${partner.shop_name}:`, categoryData);

      // Create sample products
      const products = [
        {
          partner_id: partner.id,
          name: 'Signature Dish',
          description: 'Our most popular dish with premium ingredients',
          price: 1500,
          category: categoryData[0].id,
          is_available: true,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'
        },
        {
          partner_id: partner.id,
          name: 'Chef Special',
          description: 'Today\'s special creation by our head chef',
          price: 1800,
          category: categoryData[1].id,
          is_available: true,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'
        },
        {
          partner_id: partner.id,
          name: 'Dessert Delight',
          description: 'Sweet ending to your meal',
          price: 800,
          category: categoryData[2].id,
          is_available: true,
          image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop'
        }
      ];

      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (productError) throw productError;

      console.log(`Created products for ${partner.shop_name}:`, productData);
    }

    console.log('All products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

seedProducts();
