import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary">Ortak Sahne</h1>
              </Link>
              <span className="text-sm text-muted-foreground">Tiyatro</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-primary">
                Ana Sayfa
              </Link>
              <Link href="/events" className="text-foreground hover:text-primary">
                Etkinlikler
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary">
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-primary font-semibold">
                İletişim
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçin.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Bize Yazın</CardTitle>
              <CardDescription>Mesajınızı bırakın, en kısa sürede size dönüş yapalım.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Ad</Label>
                  <Input id="firstName" placeholder="Adınız" />
                </div>
                <div>
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input id="lastName" placeholder="Soyadınız" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" placeholder="E-posta adresiniz" />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" placeholder="Telefon numaranız" />
              </div>
              <div>
                <Label htmlFor="subject">Konu</Label>
                <Input id="subject" placeholder="Mesaj konusu" />
              </div>
              <div>
                <Label htmlFor="message">Mesaj</Label>
                <Textarea id="message" placeholder="Mesajınızı buraya yazın..." rows={6} />
              </div>
              <Button className="w-full">Mesaj Gönder</Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Adres</h3>
                    <p className="text-muted-foreground">
                      Ortak Sahne Tiyatro
                      <br />
                      İstiklal Caddesi No: 123
                      <br />
                      Beyoğlu, İstanbul 34430
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Telefon</h3>
                    <p className="text-muted-foreground">+90 212 555 0123</p>
                    <p className="text-muted-foreground">+90 212 555 0124 (Bilet)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">E-posta</h3>
                    <p className="text-muted-foreground">info@ortaksahne.com</p>
                    <p className="text-muted-foreground">bilet@ortaksahne.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Çalışma Saatleri</h3>
                    <p className="text-muted-foreground">
                      Pazartesi - Cuma: 10:00 - 18:00
                      <br />
                      Cumartesi: 10:00 - 16:00
                      <br />
                      Pazar: Kapalı
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Konum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">Harita Görünümü</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Taksim Meydanı'na 5 dakika yürüme mesafesinde, metro ve otobüs hatlarına yakın konumumuzla kolayca
                  ulaşabilirsiniz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sosyal Medya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    YouTube
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Sosyal medya hesaplarımızdan etkinliklerimizi takip edebilir, backstage görüntüleri ve özel içeriklere
                  ulaşabilirsiniz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
