"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"
import { EventsService, Event } from "@/lib/events"

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Yaklaşan etkinlikleri getir
  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        setLoading(true)
        setError(null)
        const { data, error } = await EventsService.getAllEvents()
        if (error) throw error
        
        // Bugünden sonraki etkinlikleri filtrele ve tarihe göre sırala
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const upcoming = (data || [])
          .filter(event => new Date(event.date) >= today)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4)
        
        setUpcomingEvents(upcoming)
      } catch (err: any) {
        setError(err?.message || "Veri alınamadı")
      } finally {
        setLoading(false)
      }
    }
    fetchUpcomingEvents()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Ortak Sahne</h1>
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
              <Link href="/contact" className="text-foreground hover:text-primary">
                İletişim
              </Link>
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
                Yönetim
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/ortak-sahne-logo.jpg"
              alt="Ortak Sahne Logo"
              className="h-24 w-auto"
            />
          </div>
          <h2 className="text-5xl font-bold mb-6">Ortak Sahne'ye Hoş Geldiniz</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sanatın ve kültürün buluştuğu nokta. En kaliteli tiyatro oyunları ve etkinliklerle sizleri bekliyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/events">Etkinlikleri Görüntüle</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-900 bg-transparent"
            >
              Hakkımızda
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Yaklaşan Etkinlikler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Önümüzdeki günlerde sahnelenecek en önemli oyunlar ve etkinlikler
            </p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[5/7] rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-semibold mb-2">Henüz Etkinlik Yok</h3>
              <p className="text-muted-foreground">Yakında harika etkinlikler eklenecek!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.slice(0, 4).map((event) => (
                <Card key={event.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105">
                  <div className="aspect-[5/7] relative overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-xs font-medium bg-primary/90 px-2 py-1 rounded-full inline-block">
                        {event.category}
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-5">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {event.description}
                    </p>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-2 text-primary" />
                        {new Date(event.date).toLocaleDateString("tr-TR")}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-2 text-primary" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-2 text-primary" />
                        {event.venue}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary text-sm bg-primary/10 px-3 py-1 rounded-full">{event.price}</span>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                          <Link href={`/events/${event.id}`}>
                            Detaylar
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <a href={event.ticket_url || "#"} target="_blank" rel="noopener noreferrer">
                            Bilet Al <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {upcomingEvents.length > 4 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <Link href="/events">
                  Tüm Etkinlikleri Gör
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Ortak Sahne Hakkında</h3>
              <p className="text-muted-foreground mb-4">
                2010 yılından beri sanat severlere hizmet veren Ortak Sahne, kaliteli tiyatro oyunları ve kültürel
                etkinliklerle İstanbul'un en önemli sanat merkezlerinden biri haline gelmiştir.
              </p>
              <p className="text-muted-foreground mb-6">
                Deneyimli oyuncu kadromuz ve modern sahne teknolojimizle, her yaştan izleyiciye unutulmaz deneyimler
                sunuyoruz.
              </p>
              <Button asChild>
                <Link href="/about">Daha Fazla Bilgi</Link>
              </Button>
            </div>
            <div className="aspect-video">
              <img
                src="/public/ortaksahneimg.jpg"
                alt="Ortak Sahne İç Görünüm"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Ortak Sahne</h4>
              <p className="text-sm text-muted-foreground">Sanatın ve kültürün buluştuğu nokta</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/events" className="text-muted-foreground hover:text-primary">
                    Etkinlikler
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Telefon: +90 212 555 0123</li>
                <li>E-posta: info@ortaksahne.com</li>
                <li>Adres: Beyoğlu, İstanbul</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sosyal Medya</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Instagram
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Ortak Sahne. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}