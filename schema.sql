-- Supabase SQL schema for MealFlow simple MVP

-- 1. Create custom enum types
CREATE TYPE role AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'KITCHEN_STAFF', 'DELIVERY_STAFF', 'RESIDENT');
CREATE TYPE meal_type AS ENUM ('LUNCH', 'DINNER');
CREATE TYPE meal_status AS ENUM ('BOOKED', 'PREPARING', 'PACKED', 'ASSIGNED', 'DISPATCHED', 'DELIVERED', 'CONFIRMED', 'CANCELLED');

-- 2. Create properties table (Hostels/PGs)
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role role DEFAULT 'RESIDENT'::role NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  room_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create menus table (daily available meals)
CREATE TABLE menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type meal_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (property_id, date, type)
);

-- 5. Create meals table (traceable meal instances, combining booking and meal tracking)
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE NOT NULL,
  resident_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status meal_status DEFAULT 'BOOKED'::meal_status NOT NULL,
  qr_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (menu_id, resident_id)
);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meals_modtime
BEFORE UPDATE ON meals
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- RLS (Row Level Security) - Set up basic policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

-- (For this simple MVP, we will allow all authenticated users to read/write their own property's data, or admins to do everything. 
-- To get started quickly without blocking development, you can create a policy to allow all authenticated access, and lock it down later.)
CREATE POLICY "Allow authenticated read access" ON properties FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON menus FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated access" ON meals FOR ALL TO authenticated USING (true);
