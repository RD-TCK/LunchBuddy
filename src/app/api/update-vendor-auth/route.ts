import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { vendor_id, email, password, requesting_user_id } = await request.json();

    if (!vendor_id || !requesting_user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseServiceKey) {
      return NextResponse.json({ error: 'Server misconfiguration: Missing Service Role Key' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Verify the requesting user is an ADMIN
    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('role, property_id')
      .eq('id', requesting_user_id)
      .single();

    if (adminError || !adminProfile || adminProfile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Only hostel managers can edit vendors.' }, { status: 403 });
    }

    // 2. Verify the vendor belongs to this manager's property
    const { data: vendorProfile } = await supabaseAdmin
      .from('profiles')
      .select('property_id, role')
      .eq('id', vendor_id)
      .single();

    if (!vendorProfile || vendorProfile.role !== 'VENDOR' || vendorProfile.property_id !== adminProfile.property_id) {
      return NextResponse.json({ error: 'This vendor does not belong to your hostel.' }, { status: 403 });
    }

    // 3. Update auth user (email and/or password)
    const updatePayload: any = {};
    if (email && email.trim()) updatePayload.email = email.trim();
    if (password && password.trim()) updatePayload.password = password.trim();

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No email or password provided to update.' }, { status: 400 });
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(vendor_id, updatePayload);

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 4. If email was changed, also update in profiles table
    if (updatePayload.email) {
      await supabaseAdmin
        .from('profiles')
        .update({ email: updatePayload.email })
        .eq('id', vendor_id);
    }

    return NextResponse.json({ message: 'Vendor credentials updated successfully.' });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
