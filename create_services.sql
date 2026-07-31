-- Create services catalog table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  price_from integer NOT NULL,
  price_to integer,
  description text,
  duration_minutes integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services"
  ON services FOR SELECT TO anon, authenticated
  USING (true);

-- Insert sample data
INSERT INTO services (category, name, price_from, price_to, description, duration_minutes) VALUES
  ('Hair Services', 'Potong+Cuci+Blow+Tonic+Vit', 40000, NULL, 'Paket lengkap potong rambut, cuci, blow dry, tonic, dan vitamin rambut.', 90),
  ('Hair Services', 'Cuci+Blow+Tonic+Vit', 30000, NULL, 'Cuci rambut, blow dry, tonic, dan vitamin untuk rambut bersih bersinar.', 60),
  ('Hair Services', 'Cuci+Catok+Tonic+Vit', 40000, 50000, 'Cuci rambut, pelurusan dengan catok, tonic, dan vitamin.', 75),
  ('Hair Services', 'Creambath+Blow+Tonic+Vit', 60000, NULL, 'Perawatan creambath untuk menutrisi rambut, dilanjutkan blow dry.', 90),
  ('Hair Services', 'Hair Mask+Blow+Tonic+Vit', 70000, NULL, 'Masker rambut intensif untuk rambut kering dan rusak.', 90),
  ('Hair Services', 'Hair Spa+Blow+Tonic+Vit', 85000, NULL, 'Perawatan spa rambut mewah untuk peremajaan total.', 120),
  ('Keratin Treat', 'Hair Mask Keratin+Blow+Tonic+Vit', 80000, NULL, 'Masker keratin untuk rambut halus dan mudah diatur.', 90),
  ('Keratin Treat', 'Smoothing Keratin Short', 300000, 400000, 'Perawatan keratin smoothing untuk rambut pendek.', 150),
  ('Keratin Treat', 'Smoothing Keratin Medium', 400000, 500000, 'Perawatan keratin smoothing untuk rambut medium.', 180),
  ('Keratin Treat', 'Smoothing Keratin Long', 500000, 600000, 'Perawatan keratin smoothing untuk rambut panjang.', 210),
  ('Keratin Treat', 'Filler Keratin', 350000, 650000, 'Filler keratin untuk memulihkan kekuatan dan struktur rambut.', 120),
  ('Colouring', 'Bleaching all Hair', 150000, 300000, 'Proses bleaching seluruh rambut sesuai panjang rambut.', 120),
  ('Colouring', 'Colouring all Hair', 120000, 300000, 'Pewarnaan seluruh rambut dengan cat premium pilihan.', 120),
  ('Colouring', 'Peakaboo or Highlight', 220000, 450000, 'Teknik pewarnaan peekaboo atau highlight yang stylish.', 150),
  ('Colouring', 'Ombre', 250000, 500000, 'Pewarnaan ombre bergradasi yang indah.', 180)
ON CONFLICT DO NOTHING;
