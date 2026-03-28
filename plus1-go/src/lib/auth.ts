import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  mobile_number: string;
  full_name: string;
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  qr_code: string;
  id_number: string | null;
  email: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  bank_branch_code: string | null;
  profile_completed: boolean;
  created_at: string;
}

// Register new member
export async function register(fullName: string, mobileNumber: string, pin: string) {
  try {
    // Validate inputs
    if (!fullName || fullName.trim().length < 2) {
      throw new Error('Full name is required (minimum 2 characters)');
    }
    
    if (!/^\d{10}$/.test(mobileNumber)) {
      throw new Error('Mobile number must be exactly 10 digits');
    }
    
    if (!/^\d{6}$/.test(pin)) {
      throw new Error('PIN must be exactly 6 digits');
    }

    // Hash the PIN
    const pinHash = await bcrypt.hash(pin, 10);

    // Check if mobile number already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('mobile_number', mobileNumber)
      .single();

    if (existingUser) {
      throw new Error('Mobile number already registered');
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        mobile_number: mobileNumber,
        full_name: fullName,
        pin_hash: pinHash,
        role: 'member'
      })
      .select()
      .single();

    if (userError) throw userError;

    // Generate QR code (simple format: PLUS1-{user_id})
    const qrCode = `PLUS1-${user.id}`;

    // Create member
    const { data: member, error: memberError } = await supabase
      .from('members')
      .insert({
        user_id: user.id,
        full_name: fullName,
        phone: mobileNumber,
        qr_code: qrCode,
        profile_completed: false
      })
      .select()
      .single();

    if (memberError) throw memberError;

    // Create default cover plan
    const { error: coverError } = await supabase
      .from('member_cover_plans')
      .insert({
        member_id: member.id,
        cover_plan_id: 'cca4fd18-eb99-4a89-8f1d-165e2f9bf4ad', // Day to Day Single plan
        creation_order: 1,
        target_amount: 32000, // R320 in cents
        funded_amount: 0,
        status: 'suspended'
      });

    if (coverError) throw coverError;

    // Create session (store user ID in localStorage)
    localStorage.setItem('plus1go.user', JSON.stringify(user));
    localStorage.setItem('plus1go.member', JSON.stringify(member));

    return { user, member };
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
}

// Login
export async function login(mobileNumber: string, pin: string) {
  try {
    // Validate inputs
    if (!/^\d{10}$/.test(mobileNumber)) {
      throw new Error('Mobile number must be exactly 10 digits');
    }
    
    if (!/^\d{6}$/.test(pin)) {
      throw new Error('PIN must be exactly 6 digits');
    }

    // Get user by mobile number
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('mobile_number', mobileNumber)
      .single();

    if (userError || !user) {
      throw new Error('Invalid mobile number or PIN');
    }

    // Verify PIN
    const pinMatch = await bcrypt.compare(pin, user.pin_hash);
    if (!pinMatch) {
      throw new Error('Invalid mobile number or PIN');
    }

    // Get member data
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (memberError) throw memberError;

    // Create session
    localStorage.setItem('plus1go.user', JSON.stringify(user));
    localStorage.setItem('plus1go.member', JSON.stringify(member));

    return { user, member };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
}

// Logout
export function logout() {
  localStorage.removeItem('plus1go.user');
  localStorage.removeItem('plus1go.member');
}

// Get current user
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('plus1go.user');
  return userStr ? JSON.parse(userStr) : null;
}

// Get current member
export function getCurrentMember(): Member | null {
  const memberStr = localStorage.getItem('plus1go.member');
  return memberStr ? JSON.parse(memberStr) : null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
