import { supabase } from './supabase'

// Event type tanımı (Supabase tablo şemasına uyumlu)
export interface Event {
  id: number
  title: string
  description: string
  long_description?: string
  // UI tarafında kullanılan camelCase alanlar, tip uyumu için opsiyonel
  longDescription?: string
  date: string
  time: string
  venue: string
  category: string
  image?: string
  ticket_url?: string
  ticketUrl?: string
  price: string
  status: string
  tickets_sold?: number
  duration?: string
  director?: string
  castt?: string[]
  cast?: string[]
  rating?: number
  review_count?: number
  reviewCount?: number
  age_limit?: string
  ageLimit?: string
  language?: string
  created_at?: string
}

// Events servis fonksiyonları
export class EventsService {
  // Tüm etkinlikleri getir
  static async getAllEvents(): Promise<{ data: Event[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // ID'ye göre etkinlik getir
  static async getEventById(id: number): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // Son etkinlikleri getir (ana sayfa için)
  static async getRecentEvents(limit: number = 3): Promise<{ data: Event[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // Yaklaşan etkinlikleri getir
  static async getUpcomingEvents(limit: number = 5): Promise<{ data: Event[] | null; error: any }> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(limit)

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // Kategoriye göre etkinlikleri getir
  static async getEventsByCategory(category: string): Promise<{ data: Event[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('category', category)
        .order('date', { ascending: true })

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // Yeni etkinlik oluştur
  static async createEvent(payload: Partial<Event>): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(payload)
        .select('*')
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // Etkinlik güncelle
  static async updateEvent(id: number, updates: Partial<Event>): Promise<{ data: Event | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  // Etkinlik sil
  static async deleteEvent(id: number): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      return { error }
    } catch (err) {
      return { error: err }
    }
  }
}