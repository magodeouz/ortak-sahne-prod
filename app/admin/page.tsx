"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Save, Eye, LogOut } from "lucide-react"
import { EventsService, Event } from "@/lib/events"
import { uploadEventImage } from "@/lib/storage"
import { supabase } from "@/lib/supabase"

type NewEventState = {
  title: string
  description: string
  long_description: string
  date: string
  time: string
  venue: string
  category: string
  price: string
  ticket_url: string
  image: string
  status: string
}

const defaultNewEvent: NewEventState = {
    title: "",
    description: "",
  long_description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    price: "",
  ticket_url: "",
    image: "",
  status: "Taslak",
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  const [newEvent, setNewEvent] = useState<NewEventState>(defaultNewEvent)
  const [editEvent, setEditEvent] = useState<Event | null>(null)
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({})
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [createFile, setCreateFile] = useState<File | null>(null)
  const [editFile, setEditFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Auth kontrolü
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setIsAuthed(false)
        router.replace("/admin/login")
        return
      }
      setIsAuthed(true)
    }
    checkSession()

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setIsAuthed(false)
        router.replace("/admin/login")
      } else {
        setIsAuthed(true)
      }
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [router])

  // Etkinlikleri getir
  useEffect(() => {
    if (!isAuthed) return
    async function fetchEvents() {
      try {
        setLoading(true)
        setError(null)
        const { data, error } = await EventsService.getAllEvents()
        if (error) throw error
        setEvents(data || [])
      } catch (err: any) {
        setError(err?.message || "Veri alınamadı")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [isAuthed])

  const categories = useMemo(
    () => ["Klasik", "Türk Klasikleri", "Çocuk", "Müzikal", "Komedi"],
    []
  )
  const venues = useMemo(() => ["Ana Sahne", "Küçük Sahne"], [])

  function validate(payload: Record<string, unknown>): Record<string, string> {
    const errors: Record<string, string> = {}
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || String(value).trim().length === 0) {
        errors[key] = "Bu alan zorunludur"
      }
    })
    return errors
  }

  async function handleCreate() {
    try {
      const payload = { ...newEvent }
      const errs = validate(payload)
      // Görsel için: URL boş olabilir, dosya seçilmişse kabul et
      if (!payload.image && createFile) {
        delete errs.image
      }
      setCreateErrors(errs)
      if (Object.keys(errs).length > 0) return
      
      console.log("Debug - createFile:", createFile)
      console.log("Debug - payload.image before:", payload.image)
      
      // Dosya yükleme opsiyonel: URL boşsa ve dosya varsa yükle
      if (!payload.image && createFile) {
        setUploading(true)
        console.log("Debug - Starting file upload...")
        const { publicUrl, error } = await uploadEventImage(createFile)
        console.log("Debug - Upload result:", { publicUrl, error })
        setUploading(false)
        if (error) throw error
        if (publicUrl) payload.image = publicUrl
      }
      
      console.log("Debug - Final payload:", payload)
      const { data, error } = await EventsService.createEvent(payload)
      console.log("Debug - Create event result:", { data, error })
      if (error) throw error
      if (data) setEvents((prev) => [data, ...prev])
      setNewEvent(defaultNewEvent)
    setIsAddingEvent(false)
    } catch (err: any) {
      console.error("Debug - Error in handleCreate:", err)
      alert(`Kaydetme hatası: ${err?.message || err}`)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu etkinliği silmek istiyor musunuz?")) return
    const { error } = await EventsService.deleteEvent(id)
    if (error) {
      alert(`Silme hatası: ${error.message || error}`)
      return
    }
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  async function handleUpdate() {
    if (!editEvent) return
    const { id, ...updates } = editEvent
    const errs = validate({
      title: updates.title,
      description: (updates as any).description,
      long_description: (updates as any).long_description ?? (updates as any).longDescription ?? "",
      date: updates.date,
      time: updates.time,
      venue: updates.venue,
      category: updates.category,
      price: updates.price,
      ticket_url: (updates as any).ticket_url ?? (updates as any).ticketUrl ?? "",
      image: updates.image,
      status: updates.status,
    })
    
    console.log("Debug - handleUpdate - editFile:", editFile)
    console.log("Debug - handleUpdate - updates.image before:", updates.image)
    
    // Görsel için: URL boş olabilir, dosya seçilmişse kabul
    if (!(updates as any).image && editFile) {
      delete errs.image
    }
    setEditErrors(errs)
    if (Object.keys(errs).length > 0) return
    
    // Dosya yükleme opsiyonel: editFile varsa her zaman yükle
    if (editFile) {
      setUploading(true)
      console.log("Debug - handleUpdate - Starting file upload...")
      const { publicUrl, error } = await uploadEventImage(editFile)
      console.log("Debug - handleUpdate - Upload result:", { publicUrl, error })
      setUploading(false)
      if (error) {
        alert(`Yükleme hatası: ${error.message || error}`)
        return
      }
      if (publicUrl) (updates as any).image = publicUrl
    }
    
    console.log("Debug - handleUpdate - Final updates:", updates)
    const { data, error } = await EventsService.updateEvent(id, updates)
    console.log("Debug - handleUpdate - Update result:", { data, error })
    if (error) {
      alert(`Güncelleme hatası: ${error.message || error}`)
      return
    }
    if (data) setEvents((prev) => prev.map((e) => (e.id === data.id ? data : e)))
    setEditEvent(null)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace("/admin/login")
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
            <div className="flex items-center space-x-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Siteyi Görüntüle
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-1" /> Çıkış
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/ortak-sahne-logo.jpg"
              alt="Ortak Sahne Logo"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2">Yönetim Paneli</h1>
          <p className="text-muted-foreground">Etkinlikleri yönetin</p>
          {error && (
            <div className="mt-3 p-3 rounded border border-red-200 text-red-700 bg-red-50">{error}</div>
          )}
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
                <Plus className="w-4 h-4 mr-2" /> Yeni Etkinlik
              </Button>
            </div>

            {isAddingEvent && (
              <Card>
                <CardHeader>
                  <CardTitle>Yeni Etkinlik Ekle</CardTitle>
                  <CardDescription>Supabase'e kaydedilir</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Etkinlik Adı</Label>
                      <Input id="title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select value={newEvent.category} onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea id="description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} required />
                    {createErrors.description && <p className="text-sm text-red-600 mt-1">{createErrors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="long_description">Uzun Açıklama</Label>
                    <Textarea id="long_description" value={newEvent.long_description} onChange={(e) => setNewEvent({ ...newEvent, long_description: e.target.value })} rows={6} required />
                    {createErrors.long_description && <p className="text-sm text-red-600 mt-1">{createErrors.long_description}</p>}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Tarih</Label>
                      <Input id="date" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
                      {createErrors.date && <p className="text-sm text-red-600 mt-1">{createErrors.date}</p>}
                    </div>
                    <div>
                      <Label htmlFor="time">Saat</Label>
                      <Input id="time" type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} required />
                      {createErrors.time && <p className="text-sm text-red-600 mt-1">{createErrors.time}</p>}
                    </div>
                    <div>
                      <Label htmlFor="venue">Sahne</Label>
                      <Select value={newEvent.venue} onValueChange={(value) => setNewEvent({ ...newEvent, venue: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sahne seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {venues.map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {createErrors.venue && <p className="text-sm text-red-600 mt-1">{createErrors.venue}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Fiyat</Label>
                      <Input id="price" value={newEvent.price} onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })} placeholder="Örn: 100-200 TL" required />
                      {createErrors.price && <p className="text-sm text-red-600 mt-1">{createErrors.price}</p>}
                    </div>
                    <div>
                      <Label htmlFor="ticket">Bilet Linki</Label>
                      <Input id="ticket" value={newEvent.ticket_url} onChange={(e) => setNewEvent({ ...newEvent, ticket_url: e.target.value })} placeholder="https://..." required />
                      {createErrors.ticket_url && <p className="text-sm text-red-600 mt-1">{createErrors.ticket_url}</p>}
                    </div>
                    <div>
                      <Label htmlFor="status">Durum</Label>
                      <Input id="status" value={newEvent.status} onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })} placeholder="Biletler Satışta / Yakında" required />
                      {createErrors.status && <p className="text-sm text-red-600 mt-1">{createErrors.status}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Görsel URL</Label>
                    <Input id="image" value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} placeholder="URL girebilir veya aşağıdan yükleyebilirsiniz" />
                    <div className="mt-2">
                      <input type="file" accept="image/*" onChange={(e) => setCreateFile(e.target.files?.[0] || null)} />
                    </div>
                    {createErrors.image && <p className="text-sm text-red-600 mt-1">{createErrors.image}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreate}>
                      <Save className="w-4 h-4 mr-2" /> Kaydet
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingEvent(false)}>İptal</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Mevcut Etkinlikler</CardTitle>
                <CardDescription>Supabase `events` tablosu</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-10 text-center text-muted-foreground">Yükleniyor...</div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Etkinlik</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Sahne</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell><Badge variant="secondary">{event.category}</Badge></TableCell>
                          <TableCell>{event.date ? new Date(event.date).toLocaleDateString("tr-TR") : "-"}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>
                            <Badge variant={event.status === "Biletler Satışta" ? "default" : "secondary"}>{event.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => setEditEvent(event)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Etkinliği Düzenle</DialogTitle>
                                  </DialogHeader>
                                  {editEvent && (
                                    <div className="space-y-3">
                                      <div>
                                        <Label>Başlık</Label>
                                        <Input value={editEvent.title} onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })} required />
                                        {editErrors.title && <p className="text-sm text-red-600 mt-1">{editErrors.title}</p>}
                                      </div>
                                      <div>
                                        <Label>Açıklama</Label>
                                        <Textarea value={(editEvent as any).description || ""} onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })} required />
                                        {editErrors.description && <p className="text-sm text-red-600 mt-1">{editErrors.description}</p>}
                                      </div>
                                      <div>
                                        <Label>Uzun Açıklama</Label>
                                        <Textarea rows={6} value={(editEvent as any).long_description || (editEvent as any).longDescription || ""} onChange={(e) => setEditEvent({ ...editEvent, long_description: e.target.value } as any)} required />
                                        {editErrors.long_description && <p className="text-sm text-red-600 mt-1">{editErrors.long_description}</p>}
                                      </div>
                                      <div className="grid grid-cols-3 gap-3">
                                        <div>
                                          <Label>Tarih</Label>
                                          <Input type="date" value={editEvent.date || ""} onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })} required />
                                          {editErrors.date && <p className="text-sm text-red-600 mt-1">{editErrors.date}</p>}
                                        </div>
                                        <div>
                                          <Label>Saat</Label>
                                          <Input type="time" value={editEvent.time || ""} onChange={(e) => setEditEvent({ ...editEvent, time: e.target.value })} required />
                                          {editErrors.time && <p className="text-sm text-red-600 mt-1">{editErrors.time}</p>}
                                        </div>
                                        <div>
                                          <Label>Sahne</Label>
                                          <Input value={editEvent.venue || ""} onChange={(e) => setEditEvent({ ...editEvent, venue: e.target.value })} required />
                                          {editErrors.venue && <p className="text-sm text-red-600 mt-1">{editErrors.venue}</p>}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-3 gap-3">
                                        <div>
                                          <Label>Kategori</Label>
                                          <Input value={editEvent.category || ""} onChange={(e) => setEditEvent({ ...editEvent, category: e.target.value })} required />
                                          {editErrors.category && <p className="text-sm text-red-600 mt-1">{editErrors.category}</p>}
                                        </div>
                                        <div>
                                          <Label>Fiyat</Label>
                                          <Input value={editEvent.price || ""} onChange={(e) => setEditEvent({ ...editEvent, price: e.target.value })} required />
                                          {editErrors.price && <p className="text-sm text-red-600 mt-1">{editErrors.price}</p>}
                                        </div>
                                        <div>
                                          <Label>Durum</Label>
                                          <Input value={editEvent.status || ""} onChange={(e) => setEditEvent({ ...editEvent, status: e.target.value })} required />
                                          {editErrors.status && <p className="text-sm text-red-600 mt-1">{editErrors.status}</p>}
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Bilet Linki</Label>
                                        <Input value={(editEvent as any).ticket_url || (editEvent as any).ticketUrl || ""} onChange={(e) => setEditEvent({ ...editEvent, ticket_url: e.target.value } as any)} required />
                                        {editErrors.ticket_url && <p className="text-sm text-red-600 mt-1">{editErrors.ticket_url}</p>}
                                      </div>
                                      <div>
                                        <Label>Görsel</Label>
                                        <Input value={editEvent.image || ""} onChange={(e) => setEditEvent({ ...editEvent, image: e.target.value })} placeholder="URL girebilir veya aşağıdan yükleyebilirsiniz" />
                                        <div className="mt-2">
                                          <input type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />
                                        </div>
                                        {editErrors.image && <p className="text-sm text-red-600 mt-1">{editErrors.image}</p>}
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                        <Button onClick={handleUpdate} disabled={uploading}><Save className="w-4 h-4 mr-2" /> {uploading ? 'Yükleniyor...' : 'Güncelle'}</Button>
                                        <Button variant="outline" onClick={() => setEditEvent(null)}>Kapat</Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
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
