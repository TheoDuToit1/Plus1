-- Create join_requests table for member-shop connection requests
CREATE TABLE IF NOT EXISTS join_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, shop_id)
);

-- Add RLS policies
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- Members can view their own requests
CREATE POLICY "Members can view own requests" ON join_requests
  FOR SELECT USING (auth.uid() = member_id);

-- Members can create requests
CREATE POLICY "Members can create requests" ON join_requests
  FOR INSERT WITH CHECK (auth.uid() = member_id);

-- Shops can view requests for their shop
CREATE POLICY "Shops can view their requests" ON join_requests
  FOR SELECT USING (
    shop_id IN (
      SELECT id FROM shops WHERE id = shop_id
    )
  );

-- Shops can update requests for their shop
CREATE POLICY "Shops can update their requests" ON join_requests
  FOR UPDATE USING (
    shop_id IN (
      SELECT id FROM shops WHERE id = shop_id
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_join_requests_member_id ON join_requests(member_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_shop_id ON join_requests(shop_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);