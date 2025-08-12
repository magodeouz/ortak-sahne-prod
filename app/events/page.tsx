"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Clock, ExternalLink, Search } from "lucide-react"
import { EventsService, Event } from "@/lib/events"

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVenue, setSelectedVenue] = useState("all")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Etkinlikleri getir
  useEffect(() => {
    async function fetchEvents() {
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
        
        setEvents(upcoming)
      } catch (err: any) {
        setError(err?.message || "Veri alınamadı")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const categories = ["all", "Klasik", "Türk Klasikleri", "Çocuk", "Müzikal", "Komedi"]
  const venues = ["all", "Ana Sahne", "Küçük Sahne"]

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesVenue = selectedVenue === "all" || event.venue === selectedVenue

    return matchesSearch && matchesCategory && matchesVenue
  })

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
              <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary">
                Yönetim
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/ortak-sahne-logo.jpg"
              alt="Ortak Sahne Logo"
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">Etkinlikler</h1>
          <p className="text-muted-foreground">Ortak Sahne'de sahnelenecek tüm oyunlar ve etkinlikler</p>
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p><strong>Hata:</strong> {error}</p>
              <p className="text-sm mt-1">Supabase'de RLS politikası eklenmesi gerekiyor.</p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Etkinlik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sahne seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Sahneler</SelectItem>
                {venues.slice(1).map((venue) => (
                  <SelectItem key={venue} value={venue}>
                    {venue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Etkinlikler yükleniyor...</p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105">
              <div className="aspect-[5/7] relative overflow-hidden">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                      event.status === "Biletler Satışta"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
                    {event.category}
                  </span>
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
                    {event.status === "Biletler Satışta" && (
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <a href={event.ticket_url || "#"} target="_blank" rel="noopener noreferrer">
                          Bilet Al <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Arama kriterlerinize uygun etkinlik bulunamadı.</p>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  )
}
