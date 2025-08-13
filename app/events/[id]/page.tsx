"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft, Users } from "lucide-react"
import { EventsService, Event } from "@/lib/events"
import Image from "next/image"
import Script from "next/script"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params?.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) return

      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await EventsService.getEventById(parseInt(eventId))
        
        if (error) {
          console.error('Supabase error:', error)
          setError('Etkinlik bulunamadı')
          setEvent(null)
        } else {
          setEvent(data)
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Bağlantı hatası')
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Etkinlik yükleniyor...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Etkinlik bulunamadı'}</p>
          <Button asChild>
            <Link href="/events">Etkinliklere Dön</Link>
          </Button>
        </div>
      </div>
    )
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(event.date)
  eventDate.setHours(0, 0, 0, 0)
  const isPast = eventDate.getTime() < today.getTime()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Script id="breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://ortaksahne.com/' },
            { '@type': 'ListItem', position: 2, name: 'Etkinlikler', item: 'https://ortaksahne.com/events' },
            { '@type': 'ListItem', position: 3, name: event.title, item: `https://ortaksahne.com/events/${event.id}` },
          ],
        })}
      </Script>
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="group">
                <h1 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors duration-300">Ortak Sahne</h1>
              </Link>
              <span className="text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">Tiyatro</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors duration-300">
                Ana Sayfa
              </Link>
              <Link href="/events" className="text-primary font-semibold relative">
                Etkinlikler
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"></div>
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors duration-300">
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors duration-300">
                İletişim
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-8 group hover:bg-primary/10 hover:text-primary transition-all duration-300">
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Etkinliklere Dön
          </Link>
        </Button>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Image + Description side-by-side */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="relative">
                <div className="w-full max-w-md aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl group">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-white border-0 shadow-lg backdrop-blur-sm">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      {event.title}
                    </h1>
                    {/* Puan ve değerlendirmeler kaldırıldı */}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50">
                <h3 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Oyun Hakkında
                </h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{event.description}</p>
                <div className="prose prose-lg max-w-none">
                  <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {(event as any).longDescription || (event as any).long_description || 'Detaylı açıklama bulunmuyor.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cast & Crew */}
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border/50">
                <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  Oyuncu Kadrosu
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <span className="font-semibold text-foreground">Yönetmen:</span>
                      <span className="text-muted-foreground">{(event as any).director || 'Belirtilmemiş'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <span className="font-semibold text-foreground block mb-3">Oyuncular:</span>
                      <div className="space-y-2">
                        {(((event as any).cast as string[]) || ((event as any).castt as string[]) || []).length > 0 ? 
                          (((event as any).cast as string[]) || ((event as any).castt as string[]) || []).map((actor, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-muted-foreground">{actor}</span>
                            </div>
                          )) : 
                          <span className="text-muted-foreground italic">Oyuncu listesi belirtilmemiş</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Card */}
            <Card className={`shadow-xl border-0 bg-gradient-to-br from-primary/5 to-primary/10 ${isPast ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-3xl text-primary">{event.price}</span>
                    <Badge 
                      variant={event.status === "Biletler Satışta" ? "default" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      {event.status}
                    </Badge>
                  </div>

                  {event.status === "Biletler Satışta" && (
                    isPast ? (
                      <Button disabled className="w-full h-12 text-lg font-semibold bg-muted text-muted-foreground cursor-not-allowed">
                        Bilet Satışı Kapalı
                      </Button>
                    ) : (
                      <Button asChild className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90">
                        <a href={(event as any).ticketUrl || (event as any).ticket_url || '#'} target="_blank" rel="noopener noreferrer">
                          Bilet Al <ExternalLink className="w-5 h-5 ml-2" />
                        </a>
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-6 text-foreground flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  Etkinlik Detayları
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">
                        {new Date(event.date).toLocaleDateString("tr-TR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{event.time}</div>
                      <div className="text-sm text-muted-foreground">{(event as any).duration || 'Süre belirtilmemiş'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">{event.venue}</div>
                      <div className="text-sm text-muted-foreground">Ortak Sahne Tiyatro</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-foreground">Yaş Sınırı: {(event as any).ageLimit || (event as any).age_limit || 'Belirtilmemiş'}</div>
                      <div className="text-sm text-muted-foreground">Dil: {event.language || 'Belirtilmemiş'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4 text-foreground flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  Konum
                </h3>
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <span className="text-muted-foreground text-sm">Harita</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/30 rounded-xl">
                  <p className="font-semibold text-foreground">Ortak Sahne Tiyatro</p>
                  <p className="text-sm text-muted-foreground">Beyoğlu, İstanbul</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
