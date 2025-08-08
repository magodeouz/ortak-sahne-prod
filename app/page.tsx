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

  // Ana sayfa için yaklaşan etkinlikleri çek
  useEffect(() => {
    async function fetchUpcomingEvents() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await EventsService.getUpcomingEvents(3)
        
        if (error) {
          console.error('Supabase error:', error)
          setError('Etkinlikler yüklenemedi')
          setUpcomingEvents([])
        } else {
          setUpcomingEvents(data || [])
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Bağlantı hatası')
        setUpcomingEvents([])
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
      <section className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Yaklaşan Etkinlikler</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bu ay sahnelenecek olan muhteşem oyunlarımızı kaçırmayın
            </p>
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-md mx-auto">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Etkinlikler yükleniyor...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.date).toLocaleDateString("tr-TR")}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.venue}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">{event.price}</span>
                      <Button asChild size="sm">
                        <a href={event.ticket_url || "#"} target="_blank" rel="noopener noreferrer">
                          Bilet Al <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {upcomingEvents.length === 0 && !loading && (
                <div className="text-center py-8 col-span-full">
                  <p className="text-muted-foreground">Henüz etkinlik bulunmuyor.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/events">Tüm Etkinlikleri Görüntüle</Link>
            </Button>
          </div>
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
                src="/placeholder.svg?height=400&width=600"
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