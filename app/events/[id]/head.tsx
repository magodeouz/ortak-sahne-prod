import { Metadata } from 'next'
import { EventsService } from '@/lib/events'

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number(params.id)
  const { data } = await EventsService.getEventById(id)
  const title = data ? `${data.title} – Ortak Sahne | ${data.date} / ${data.venue}` : 'Etkinlik – Ortak Sahne'
  const description = data?.description || 'Ortak Sahne etkinliği'
  const url = `https://ortaksahne.com/events/${id}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: data?.image ? [{ url: data.image }] : undefined,
      type: 'article',
    },
  }
}

export default function Head() {
  return null
}


