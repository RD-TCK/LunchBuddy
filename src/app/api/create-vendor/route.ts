import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name, property_id, delivery_college_id, requesting_user_id } = await request.json();

    if (!email || !password || !property_id || !requesting_user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Supabase with the SERVICE ROLE key to bypass RLS and create users
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: 'Server misconfiguration: Missing Service Role Key' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Verify the requesting user is actually an ADMIN for that property
    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('role, property_id')
      .eq('id', requesting_user_id)
      .single();

    if (adminError || !adminProfile || adminProfile.role !== 'ADMIN' || adminProfile.property_id !== property_id) {
      return NextResponse.json({ error: 'Unauthorized: Only the Manager of this hostel can create vendors for it.' }, { status: 403 });
    }

    // 2. Create the Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name,
        property_id: property_id, // Link them to the manager's hostel
        delivery_college_id: delivery_college_id // The college they are delivering to
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const newUserId = authData.user.id;

    // 3. Since the auth trigger automatically creates a 'RESIDENT' profile, 
    // we need to update it immediately to 'VENDOR' and set the delivery college
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'VENDOR',
        name: name,
        delivery_college_id: delivery_college_id,
        status: 'APPROVED' // Auto approve vendor
      })
      .eq('id', newUserId);

    if (profileError) {
      // Cleanup if profile update fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json({ error: 'Failed to configure vendor profile. ' + profileError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Vendor created successfully', user: authData.user });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
