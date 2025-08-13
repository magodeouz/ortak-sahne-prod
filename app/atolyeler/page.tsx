"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, ExternalLink, Menu } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventsService, Event } from "@/lib/events"

export default function WorkshopsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const { data, error } = await EventsService.getAllEvents()
        if (error) throw error
        const list = (data || []).filter((e) =>
          (e.category || "").toLowerCase().includes("atölye") || (e.category || "").toLowerCase().includes("atolye")
        )
        // split and sort like events page
        const today = new Date(); today.setHours(0,0,0,0)
        const upcoming = list.filter(e => new Date(e.date) >= today).sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime())
        const past = list.filter(e => new Date(e.date) < today).sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime())
        setEvents([...upcoming, ...past])
      } catch (err:any) {
        setError(err?.message || "Veri alınamadı")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const today = new Date(); today.setHours(0,0,0,0)
  const upcomingEvents = events.filter(e => new Date(e.date) >= today)
  const pastEvents = events.filter(e => new Date(e.date) < today)
  const upcomingCount = upcomingEvents.length
  const pastCount = pastEvents.length

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
              <Link href="/" className="text-foreground hover:text-primary">Ana Sayfa</Link>
              <Link href="/events" className="text-foreground hover:text-primary">Etkinlikler</Link>
              <Link href="/atolyeler" className="text-primary font-semibold">Atölyeler</Link>
              <Link href="/about" className="text-foreground hover:text-primary">Hakkımızda</Link>
              <Link href="/contact" className="text-foreground hover:text-primary">İletişim</Link>
            </div>
            <div className="md:hidden">
              <button aria-label="Menü" className="p-2 rounded-md border text-foreground border-border hover:bg-muted" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src="/ortak-sahne-logo.jpg" alt="Ortak Sahne Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Atölyeler</h1>
          <p className="text-muted-foreground">Ortak Sahne'de düzenlenen atölye çalışmalarını keşfedin</p>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p><strong>Hata:</strong> {error}</p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mx-auto grid w-full max-w-sm grid-cols-2 rounded-lg border bg-muted p-1">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md">Gelecek ({upcomingCount})</TabsTrigger>
              <TabsTrigger value="archive" className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md">Arşiv ({pastCount})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Atölyeler yükleniyor...</p>
          </div>
        )}

        {/* Upcoming */}
        {!loading && activeTab === "upcoming" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="relative max-w-sm w-full mx-auto group overflow-hidden border border-border/60 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <Link href={`/events/${event.id}`} className="block">
                  <div className="aspect-[3/4] sm:aspect-[4/5] relative overflow-hidden bg-muted">
                    <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 right-3 z-[2]">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${event.status === "Biletler Satışta" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">{event.category}</span>
                    </div>
                  </div>
                </Link>
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-base sm:text-lg font-bold group-hover:text-primary transition-colors duration-300">{event.title}</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0">
                  <div className="space-y-2 sm:space-y-3 mb-4">
                    <div className="flex items-center text-[11px] sm:text-xs text-muted-foreground"><Calendar className="w-3 h-3 mr-2 text-primary" />{new Date(event.date).toLocaleDateString("tr-TR")}</div>
                    <div className="flex items-center text-[11px] sm:text-xs text-muted-foreground"><Clock className="w-3 h-3 mr-2 text-primary" />{event.time}</div>
                    <div className="flex items-center text-[11px] sm:text-xs text-muted-foreground"><MapPin className="w-3 h-3 mr-2 text-primary" />{event.venue}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-xs sm:text-sm bg-primary/10 px-2 sm:px-3 py-1 rounded-full">{event.price}</span>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="h-8 sm:h-9 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                        <Link href={`/events/${event.id}`}>Detaylar</Link>
                      </Button>
                      {event.status === "Biletler Satışta" && (
                        <Button asChild size="sm" className="h-8 sm:h-9 bg-primary hover:bg-primary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <a href={event.ticket_url || "#"} target="_blank" rel="noopener noreferrer">Bilet Al <ExternalLink className="w-3 h-3 ml-1" /></a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="text-center py-12"><p className="text-muted-foreground">Gelecek atölye bulunamadı.</p></div>
            )}
          </div>
        )}

        {/* Archive */}
        {!loading && activeTab === "archive" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pastEvents.map((event) => (
              <Card key={event.id} className="relative max-w-sm w-full mx-auto group overflow-hidden border border-border/60 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="aspect-[3/4] sm:aspect-[4/5] relative overflow-hidden bg-muted">
                  <Link href={`/events/${event.id}`} className="block">
                    <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-black/20 z-[1]" />
                  </Link>
                  <div className="absolute top-3 right-3 z-[2]">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg bg-gray-500 text-white`}>Geçti</span>
                  </div>
                  <div className="absolute bottom-3 left-3 z-[2]">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">{event.category}</span>
                  </div>
                </div>
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-base sm:text-lg font-bold">{event.title}</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{event.description}</p>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0">
                  <div className="space-y-2 sm:space-y-3 mb-4">
                    <div className="flex items-center text-[11px] sm:text-xs text-muted-foreground"><Calendar className="w-3 h-3 mr-2 text-primary" />{new Date(event.date).toLocaleDateString("tr-TR")}</div>
                    <div className="flex items-center text-[11px] sm:text-xs text-muted-foreground"><Clock className="w-3 h-3 mr-2 text-primary" />{event.time}</div>
                    <div className="flex items-center text-[11px] sm:text-xs text-muted-foreground"><MapPin className="w-3 h-3 mr-2 text-primary" />{event.venue}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-xs sm:text-sm bg-primary/10 px-2 sm:px-3 py-1 rounded-full">{event.price}</span>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="h-8 sm:h-9 border-primary text-primary">
                        <Link href={`/events/${event.id}`}>Detaylar</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pastEvents.length === 0 && (
              <div className="text-center py-12"><p className="text-muted-foreground">Arşivde atölye bulunamadı.</p></div>
            )}
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-background border-b shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Menü</h2>
              <button aria-label="Kapat" className="p-2" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <nav className="grid gap-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary">Ana Sayfa</Link>
              <Link href="/events" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary">Etkinlikler</Link>
              <Link href="/atolyeler" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary">Atölyeler</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary">Hakkımızda</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary">İletişim</Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}


