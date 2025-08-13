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
              <Link href="/atolyeler" className="text-foreground hover:text-primary">
                Atölyeler
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
          <div className="flex items-center justify-center mb-6">
            <img
              src="/ortak-sahne-logo.jpg"
              alt="Ortak Sahne Logo"
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            2010 yılından beri sanat severlere hizmet veren Ortak Sahne, kaliteli tiyatro oyunları ve kültürel
            etkinliklerle Türkiye'nin en önemli sanat merkezlerinden biri haline gelmiştir.
          </p>
        </div>

        {/* Ortak Sahne Hakkında (Detay) */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50">
            <h2 className="text-3xl font-bold mb-6">Ortak Sahne Hakkında</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Ortak Sahne, 2014 yılı Şubat ayında Mahmut Ünver tarafından kurulan özel bir prodüksiyon tiyatrosudur. 
                Oyuncuların ve tiyatroların çalışma şekillerine ve koşullarına farklı bir anlayış getirmek üzere yola çıkmıştır.
              </p>
              <p>
                2014 yılında İzmir ve Hatay şubelerinde oyunculuk, konservatuvar hazırlık ve drama eğitimleri verilmeye başlandı. 
                Aynı yıl Ege Tıp Oyuncuları ve Dokuz Eylül Tıp Oyuncularının oyun organizasyonları üstlenildi. 
                Ege Üniversitesi Eczacılık Fakültesi ile Aşık Veysel Görme Engelliler Okulu’nun ortak çalışması olan “BENDE VARIM, BURADAYIM” 
                projesine destek verilerek projenin tiyatro oyunu prodüksiyonu gerçekleştirildi.
              </p>
              <p>
                2014 – 2015 sezonu Kandemir Konduk’un yazdığı “Yeni Yasaklar” adlı oyun ile açıldı; güncel taşlamalarla günümüz yasaklarına 
                yeni bir eleştiri getirildi. Sonraki sezonlarda iki yetişkin oyunu ve bir çocuk oyunuyla perde açan Ortak Sahne, 
                çeşitli tiyatroların oyunlarını da seyirciyle buluşturmaya devam etti.
              </p>
              <p>
                “Tiyatroların Ortak Sahnesi” anlayışıyla; dileyen tiyatrolara gişe ve reklam desteği verilmekte, oyun ve/veya turne 
                organizasyonları üstlenilmekte ve kendi oyuncularıyla prodüksiyonlar gerçekleştirilmektedir. Ortak Sahne’nin herhangi bir kurum, 
                kuruluş, dernek ya da vakıfla bağlantısı yoktur; tamamen özel ve ismi tescilli bir markadır.
              </p>
            </div>
          </div>
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
                Oyuncuların ve tiyatroların çalışma şekillerine farklı bir anlayış kazandırmak; eğitim, prodüksiyon ve 
                organizasyon desteğiyle tiyatro ekosistemini güçlendirmek.
              </p>
              <p>
                İzmir ve Hatay başta olmak üzere; oyunculuk, konservatuvar hazırlık ve drama eğitimleriyle genç yeteneklerin 
                gelişimini desteklemek; bağımsız tiyatroların oyun ve turne organizasyonlarını üstlenmek.
              </p>
              <p>
                “Tiyatroların Ortak Sahnesi” yaklaşımıyla; gişe ve reklam desteği sağlamak, kendi oyuncularımızla nitelikli 
                prodüksiyonlar üretmek ve tiyatroyu her yaştan izleyiciyle buluşturmak.
              </p>
            </div>
            </div>
            <div className="h-40 sm:h-56 md:h-72 lg:h-80">
              <img
                src="/placeholder.svg"
                alt="Tiyatro Sahnesi"
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
                Türkiye’de bağımsız tiyatroların buluştuğu en kapsayıcı platform olmak; yerelden ulusala ve uluslararası 
                düzeye uzanan sürdürülebilir bir tiyatro ağı kurmak.
              </p>
              <p>
                Genç sanatçıların yetişmesine katkı sunan, erişilebilir ve kapsayıcı sanatsal üretimi destekleyen; 
                turne ve ortak yapımlarla daha geniş kitlelere ulaşan bir yapı olmak.
              </p>
              <p>
                Üretimde kaliteyi, iş birliklerinde şeffaflığı ve izleyici deneyiminde mükemmelliği esas alan bir 
                tiyatro ekosistemine öncülük etmek.
              </p>
            </div>
          </div>
          <div className="lg:order-1 h-40 sm:h-56 md:h-72 lg:h-80">
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
