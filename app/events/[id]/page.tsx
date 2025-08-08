"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft, Users, Star } from "lucide-react"
import { EventsService, Event } from "@/lib/events"

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
              <Link href="/events" className="text-primary font-semibold">
                Etkinlikler
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary">
                Hakkımızda
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary">
                İletişim
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Etkinliklere Dön
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/70 text-white">{event.category}</Badge>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold">{event.title}</h1>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{event.rating}</span>
                  <span className="text-muted-foreground">({event.reviewCount} değerlendirme)</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">{event.description}</p>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3">Oyun Hakkında</h3>
                <div className="text-muted-foreground whitespace-pre-line">{event.longDescription}</div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Oyuncu Kadrosu</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Yönetmen:</span>
                    <span>{event.director}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="font-medium">Oyuncular:</span>
                    <div className="text-right">
                      {event.cast.map((actor, index) => (
                        <div key={index}>{actor}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-2xl text-primary">{event.price}</span>
                    <Badge variant={event.status === "Biletler Satışta" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                  </div>

                  {event.status === "Biletler Satışta" && (
                    <Button asChild className="w-full" size="lg">
                      <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                        Bilet Al <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Etkinlik Detayları</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {new Date(event.date).toLocaleDateString("tr-TR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.time}</div>
                      <div className="text-muted-foreground">{event.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.venue}</div>
                      <div className="text-muted-foreground">Ortak Sahne Tiyatro</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-3 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Yaş Sınırı: {event.ageLimit}</div>
                      <div className="text-muted-foreground">Dil: {event.language}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Konum</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Harita</span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>Ortak Sahne Tiyatro</p>
                  <p>Beyoğlu, İstanbul</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
