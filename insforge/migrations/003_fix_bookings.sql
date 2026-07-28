-- Add stylist column to bookings table
ALTER TABLE bookings
ADD COLUMN stylist text;

-- Allow authenticated users to insert bookings
CREATE POLICY "Allow authenticated inserts for bookings"
  ON bookings FOR INSERT TO authenticated
  WITH CHECK (true);
