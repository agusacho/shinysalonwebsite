-- Add user_id column to bookings table, allowing null for guest bookings
ALTER TABLE bookings
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create a policy to allow users to view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
