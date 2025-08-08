"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, Eye } from "lucide-react"
import Link from "next/link"

// Mock data - gerçek uygulamada API'den gelecek
const mockEvents = [
  {
    id: 1,
    title: "Hamlet",
    category: "Klasik",
    date: "2024-02-15",
    venue: "Ana Sahne",
    status: "Aktif",
    ticketsSold: 120,
  },
  {
    id: 2,
    title: "Aşk-ı Memnu",
    category: "Türk Klasikleri",
    date: "2024-02-22",
    venue: "Küçük Sahne",
    status: "Aktif",
    ticketsSold: 85,
  },
]

export default function AdminPage() {
  const [events, setEvents] = useState(mockEvents)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    price: "",
    ticketUrl: "",
    image: "",
  })

  const handleAddEvent = () => {
    const event = {
      id: Date.now(),
      ...newEvent,
      status: "Aktif",
      ticketsSold: 0,
    }
    setEvents([...events, event])
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      category: "",
      price: "",
      ticketUrl: "",
      image: "",
    })
    setIsAddingEvent(false)
  }

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id))
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
              <span className="text-sm text-muted-foreground">Yönetim Paneli</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Siteyi Görüntüle
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Yönetim Paneli</h1>
          <p className="text-muted-foreground">Etkinlikleri ve site içeriğini yönetin</p>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Etkinlikler</TabsTrigger>
            <TabsTrigger value="content">Site İçeriği</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Etkinlik Yönetimi</h2>
              <Button onClick={() => setIsAddingEvent(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Etkinlik
              </Button>
            </div>

            {isAddingEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Yeni Etkinlik Ekle</CardTitle>
                  <CardDescription>Yeni bir etkinlik oluşturun</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Etkinlik Adı</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Örn: Hamlet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={newEvent.category}
                        onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Klasik">Klasik</SelectItem>
                          <SelectItem value="Türk Klasikleri">Türk Klasikleri</SelectItem>
                          <SelectItem value="Çocuk">Çocuk</SelectItem>
                          <SelectItem value="Müzikal">Müzikal</SelectItem>
                          <SelectItem value="Komedi">Komedi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Etkinlik açıklaması..."
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Tarih</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Saat</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="venue">Sahne</Label>
                      <Select
                        value={newEvent.venue}
                        onValueChange={(value) => setNewEvent({ ...newEvent, venue: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sahne seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ana Sahne">Ana Sahne</SelectItem>
                          <SelectItem value="Küçük Sahne">Küçük Sahne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Fiyat</Label>
                      <Input
                        id="price"
                        value={newEvent.price}
                        onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                        placeholder="Örn: 100-200 TL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ticketUrl">Bilet Satış Linki</Label>
                      <Input
                        id="ticketUrl"
                        value={newEvent.ticketUrl}
                        onChange={(e) => setNewEvent({ ...newEvent, ticketUrl: e.target.value })}
                        placeholder="https://biletix.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Görsel URL</Label>
                    <Input
                      id="image"
                      value={newEvent.image}
                      onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                      placeholder="Görsel URL'si"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddEvent}>
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                      İptal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Mevcut Etkinlikler</CardTitle>
                <CardDescription>Tüm etkinlikleri görüntüleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Etkinlik</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Sahne</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Satılan Bilet</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{event.category}</Badge>
                        </TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString("tr-TR")}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>
                          <Badge variant={event.status === "Aktif" ? "default" : "secondary"}>{event.status}</Badge>
                        </TableCell>
                        <TableCell>{event.ticketsSold}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site İçeriği Yönetimi</CardTitle>
                <CardDescription>Ana sayfa ve diğer sayfa içeriklerini düzenleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Ana Sayfa Başlık</Label>
                  <Input id="hero-title" defaultValue="Ortak Sahne'ye Hoş Geldiniz" placeholder="Ana sayfa başlığı" />
                </div>
                <div>
                  <Label htmlFor="hero-description">Ana Sayfa Açıklama</Label>
                  <Textarea
                    id="hero-description"
                    defaultValue="Sanatın ve kültürün buluştuğu nokta. En kaliteli tiyatro oyunları ve etkinliklerle sizleri bekliyoruz."
                    placeholder="Ana sayfa açıklaması"
                  />
                </div>
                <div>
                  <Label htmlFor="about-text">Hakkımızda Metni</Label>
                  <Textarea
                    id="about-text"
                    defaultValue="2010 yılından beri sanat severlere hizmet veren Ortak Sahne..."
                    placeholder="Hakkımızda metni"
                    rows={6}
                  />
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  İçeriği Kaydet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Genel Ayarlar</CardTitle>
                <CardDescription>Site ayarlarını yönetin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Site Adı</Label>
                  <Input id="site-name" defaultValue="Ortak Sahne" placeholder="Site adı" />
                </div>
                <div>
                  <Label htmlFor="contact-email">İletişim E-postası</Label>
                  <Input id="contact-email" defaultValue="info@ortaksahne.com" placeholder="İletişim e-postası" />
                </div>
                <div>
                  <Label htmlFor="contact-phone">İletişim Telefonu</Label>
                  <Input id="contact-phone" defaultValue="+90 212 555 0123" placeholder="İletişim telefonu" />
                </div>
                <div>
                  <Label htmlFor="address">Adres</Label>
                  <Textarea id="address" defaultValue="Beyoğlu, İstanbul" placeholder="Adres bilgisi" />
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Ayarları Kaydet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
