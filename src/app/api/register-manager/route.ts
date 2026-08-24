import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, propertyName, propertyAddress, email, password } = await request.json();

    if (!name || !propertyName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    // 1. Create the new Hostel/PG property in the properties table
    const { data: propData, error: propError } = await supabaseAdmin
      .from('properties')
      .insert({
        name: propertyName.trim(),
        address: propertyAddress ? propertyAddress.trim() : null
      })
      .select('id')
      .single();

    if (propError) {
      return NextResponse.json({ error: 'Failed to create hostel property: ' + propError.message }, { status: 500 });
    }

    const propertyId = propData.id;

    // 2. Create the Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name.trim(),
        property_id: propertyId
      }
    });

    if (authError) {
      // Rollback created property
      await supabaseAdmin.from('properties').delete().eq('id', propertyId);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const newUserId = authData.user.id;

    // 3. Update the newly created profile row
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        role: 'ADMIN',
        name: name.trim(),
        property_id: propertyId,
        status: 'APPROVED' // Auto-approve the manager since they are registering a new property
      })
      .eq('id', newUserId);

    if (profileError) {
      // Clean up both created user and property on failure
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      await supabaseAdmin.from('properties').delete().eq('id', propertyId);
      return NextResponse.json({ error: 'Failed to configure manager profile: ' + profileError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Manager and Hostel registered successfully', user: authData.user });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
