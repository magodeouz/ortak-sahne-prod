-- Events tablosu için test verisi
-- Bu script'i Supabase SQL Editor'da çalıştırın

-- Önce RLS politikası ekleyin (isteğe bağlı)
CREATE POLICY "Enable read access for all users" ON events
FOR SELECT USING (true);

-- Test verilerini ekleyin
INSERT INTO events (title, description, date, time, venue, category, image, price, status) VALUES
('Hamlet', 'Shakespeare''in ölümsüz eseri modern yorumuyla sahnede', '2024-02-15', '20:00', 'Ana Sahne', 'Klasik', '/placeholder.svg?height=300&width=400', '150-300 TL', 'Biletler Satışta'),
('Aşk-ı Memnu', 'Halit Ziya Uşaklıgil''in klasik romanından uyarlama', '2024-02-22', '19:30', 'Küçük Sahne', 'Türk Klasikleri', '/placeholder.svg?height=300&width=400', '100-200 TL', 'Biletler Satışta'),
('Çocuk Tiyatrosu: Kırmızı Başlıklı Kız', 'Çocuklar için renkli ve eğlenceli bir masal', '2024-02-25', '14:00', 'Ana Sahne', 'Çocuk', '/placeholder.svg?height=300&width=400', '50-80 TL', 'Biletler Satışta'),
('Müzikal: Les Misérables', 'Victor Hugo''nun ünlü romanından müzikal uyarlama', '2024-03-05', '20:30', 'Ana Sahne', 'Müzikal', '/placeholder.svg?height=300&width=400', '200-400 TL', 'Yakında'),
('Komedi: Evlilik Oyunu', 'Güldürü dolu bir evlilik hikayesi', '2024-03-12', '20:00', 'Küçük Sahne', 'Komedi', '/placeholder.svg?height=300&width=400', '80-150 TL', 'Yakında');

-- Events tablosunun yapısını kontrol edin
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;