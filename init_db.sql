-- Create contact_submissions table if not exists
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table if not exists
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  stylist text
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for contact_submissions (drop first if exists to prevent error)
DROP POLICY IF EXISTS "Allow anonymous inserts for contact submissions" ON contact_submissions;
CREATE POLICY "Allow anonymous inserts for contact submissions"
  ON contact_submissions FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous inserts for bookings
DROP POLICY IF EXISTS "Allow anonymous inserts for bookings" ON bookings;
CREATE POLICY "Allow anonymous inserts for bookings"
  ON bookings FOR INSERT TO anon
  WITH CHECK (true);

-- Create a policy to allow users to view their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert bookings
DROP POLICY IF EXISTS "Allow authenticated inserts for bookings" ON bookings;
CREATE POLICY "Allow authenticated inserts for bookings"
  ON bookings FOR INSERT TO authenticated
  WITH CHECK (true);
