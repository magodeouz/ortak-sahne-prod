import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Calendar, MapPin } from "lucide-react"

export default function AboutPage() {
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
              <Link href="/events" className="text-foreground hover:text-primary">
                Etkinlikler
              </Link>
              <Link href="/about" className="text-primary font-semibold">
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            2010 yılından beri sanat severlere hizmet veren Ortak Sahne, kaliteli tiyatro oyunları ve kültürel
            etkinliklerle İstanbul'un en önemli sanat merkezlerinden biri haline gelmiştir.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">14</div>
              <div className="text-sm text-muted-foreground">Yıllık Deneyim</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Sahnelenmiş Oyun</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">25</div>
              <div className="text-sm text-muted-foreground">Ödül</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Sahne</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Misyonumuz</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Ortak Sahne olarak, sanatın toplumsal dönüşümdeki gücüne inanıyor ve bu gücü izleyicilerimizle
                paylaşmayı amaçlıyoruz. Klasik eserlerden çağdaş oyunlara, çocuk tiyatrosundan müzikallere kadar geniş
                bir repertuvarla her yaştan izleyiciye hitap ediyoruz.
              </p>
              <p>
                Deneyimli oyuncu kadromuz, yaratıcı yönetmenlerimiz ve teknik ekibimizle her oyunu özenle hazırlıyor,
                izleyicilerimize unutulmaz deneyimler sunuyoruz.
              </p>
              <p>
                Sanatın evrensel dilini konuşarak, farklı kültürlerden insanları bir araya getirmeyi ve ortak bir sahne
                yaratmayı hedefliyoruz.
              </p>
            </div>
          </div>
          <div className="aspect-video">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Ortak Sahne Sahnesi"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Vision */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="lg:order-2">
            <h2 className="text-3xl font-bold mb-6">Vizyonumuz</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Türkiye'nin en prestijli tiyatro sahnelerinden biri olmak ve uluslararası arenada tanınan bir sanat
                kurumu haline gelmek vizyonumuzun temelini oluşturuyor.
              </p>
              <p>
                Genç sanatçılara fırsat tanıyarak, gelecek nesil tiyatro oyuncularının yetişmesine katkıda bulunmak ve
                sanat eğitimi alanında öncü olmak istiyoruz.
              </p>
              <p>
                Teknoloji ile sanatı harmanlayarak, çağdaş sahne sanatlarında yenilikçi yaklaşımlar geliştirmek ve
                izleyici deneyimini sürekli iyileştirmek hedeflerimiz arasında yer alıyor.
              </p>
            </div>
          </div>
          <div className="lg:order-1 aspect-video">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Tiyatro İzleyicileri"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ekibimiz</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Alanında uzman, deneyimli ve tutkulu ekibimizle her projede mükemmelliği hedefliyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Mehmet Yılmaz</h3>
              <p className="text-sm text-muted-foreground mb-2">Sanat Yönetmeni</p>
              <p className="text-xs text-muted-foreground">
                20 yıllık deneyimi ile tiyatro dünyasının önemli isimlerinden biri
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Ayşe Demir</h3>
              <p className="text-sm text-muted-foreground mb-2">Baş Oyuncu</p>
              <p className="text-xs text-muted-foreground">
                Sahne sanatları alanında ödüllü performanslarıyla tanınan oyuncu
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Can Özkan</h3>
              <p className="text-sm text-muted-foreground mb-2">Teknik Direktör</p>
              <p className="text-xs text-muted-foreground">
                Modern sahne teknolojileri konusunda uzman, yaratıcı çözümler üreten teknisyen
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
