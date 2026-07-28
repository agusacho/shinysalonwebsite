-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for contact_submissions
CREATE POLICY "Allow anonymous inserts for contact submissions"
  ON contact_submissions FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous inserts for bookings
CREATE POLICY "Allow anonymous inserts for bookings"
  ON bookings FOR INSERT TO anon
  WITH CHECK (true);
