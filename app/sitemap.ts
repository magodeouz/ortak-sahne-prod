import { MetadataRoute } from 'next'
import { EventsService } from '@/lib/events'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ortaksahne.com'
  const { data } = await EventsService.getAllEvents()
  const eventUrls: MetadataRoute.Sitemap = (data || []).map((e) => ({
    url: `${baseUrl}/events/${e.id}`,
    lastModified: e.created_at ? new Date(e.created_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  return [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/atolyeler`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...eventUrls,
  ]
}


