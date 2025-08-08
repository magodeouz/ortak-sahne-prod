import { supabase } from './supabase'

// Event type tanımı
export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  image?: string
  ticket_url?: string
  price: string
  status: string
  created_at?: string
  updated_at?: string
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
}