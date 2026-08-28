# OSMANDESIGN — Proje Notları

Osman Özdemir'in kişisel portfolyo sitesi. Statik HTML/CSS/JS, build adımı yok.

## Yapı

| Dosya | İçerik |
|---|---|
| `index.html` | Tek sayfa akışı: hero, `#hakkimda`, `#projeler`, `#surec`, `#blog`, `#iletisim` |
| `hakkimda.html` `projeler.html` `deneyim.html` `surec.html` `blog.html` `iletisim.html` | Ayrı iç sayfalar |
| `style.css` | Tüm stiller tek dosyada (~3.3 MB — logolar `:root` içinde base64 data URI olarak gömülü) |
| `app.js` | Menü, filtre pill'leri, `data-count` sayaç animasyonu, `.reveal` scroll animasyonları |
| `yazi-*.html` | Tekil blog yazısı sayfaları (`yazi-art-director`, `yazi-reklam-ajansi`, `yazi-grafik-tasarim`) |
| `behance-projeler.json` | Behance proje listesi verisi |
| `img/` | Proje kapak görselleri (`.webp`) |

## Local önizleme

```
python3 -m http.server 8912 --bind 127.0.0.1
```
→ http://127.0.0.1:8912/

## Versiyonlama

Git kullanılmıyor. Değişiklikten önce elle adlandırılmış yedek alınır:
`cp index.html index.html.bakabout` gibi. `.bak*` dosyaları depoda birikir, silinmez.

## CSS konvansiyonları

- Tema değişkenleri `:root` içinde: `--bg`, `--surface`, `--line`, `--text`, `--muted`, `--accent` (`#ff6044`).
- Tipografi: başlık/gövde `Space Grotesk`, etiket ve meta `JetBrains Mono` (uppercase, letter-spacing ~0.08em).
- Yeni bir görünüm istendiğinde mevcut kuralı değiştirmek yerine **varyant class'ı** eklenir ve `style.css` sonuna yazılır. Böylece aynı bileşeni kullanan diğer sayfalar etkilenmez.

### Bileşen taksonomisi

- `.bento` / `.bcard` — proje kartı grid'i. `.bcard` içinde `.bshot` (kapak), `.bhead`/`.blabel` (eyebrow), `.bfoot`/`.btitle`/`.bmeta`/`.bgo` (alt blok). Kapak görseli varsa `.bshot ~ .bfoot` seçicisi devreye girer ve eyebrow gizlenir.
- `.bento-liste` — `projeler.html` tam liste varyantı (CTA kartı gizli).
- `.bento-sevora` — `projeler.html` proje grid'inin güncel görünümü. Kart arka planı/çerçevesi yok, sadece `border-radius:20px` görsel + altında başlık ve kategori; ok butonu gizli. 3 kolon, ≤1020px 2 kolon, ≤680px tek kolon.
- `.stat-grid` / `.stat` — istatistik kartları. Üstte turuncu 2px çizgi (`::before`), sağ üstte `.stat-dots`, `.stat-num` sayaç (`data-count` + `data-suffix`).
- `.stat-big` — `index.html` `#hakkimda` içindeki kompakt 2×2 istatistik varyantı. Kart bir grid'dir: etiket satırı üstte tam genişlik, altta rakam solda / açıklama sağda, dikeyde ortalı.
- `.ai-marquee` / `.ai-track` / `.ai-item` — yapay zekâ ve üretim araçları için sonsuz akan logo şeridi. Logolar `Logo/ai/*.svg` içinden inline gömülür, `fill="currentColor"` ile tema rengini alır; marka rengi `--brand` özel değişkeniyle her öğeye ayrı verilir ve hover'da devreye girer.
- `.sec-dark` — siyah zeminli bölüm sarmalayıcısı (`#projeler`, `#surec`). İçindeki `section-head`, `bento-sevora` ve `sec-more` renkleri bu sınıfın altında yeniden tanımlanır.
- `.prc-*` — süreç bölümü kartları. `.prc-grid` `width:100vw; margin-left:calc(50% - 50vw)` ile `.wrap` sınırını aşıp tam ekran genişliğine yayılır; kartlar `gap:0` ile yapışıktır ve ayrımı paylaşılan 1px kenarlıkla yapar. Kolonlar `nth-child(3n+2)` / `(3n+3)` ile kademeli aşağı kayar.
- `.blog-grid` / `.blog-card` — blog kartları. Kartlar `gap:0` ile yapışık, kolonlar `nth-child(2)` 40px / `nth-child(3)` 80px kademeli iner. İç yapı: `.bc-top` (tarih + `.bc-dots`), `.bc-shot` (kapak), `.bc-body` (`.bc-tag`, başlık, özet, `.bc-more`). Hover'da üstteki turuncu çizgi soldan açılır.
- `.bc-shot-1/2/3` — blog kapakları fotoğraf değil, `::before` ve `::after` katmanlarıyla kurulmuş CSS kompozisyonlarıdır. Gerçek görsel gelirse bu kuralları `background-image` ile değiştir.
- `.art-*` — yazı sayfası düzeni: `.art-hero` (breadcrumb, mono meta, başlık, lead), `.art-body` (68ch gövde, `h2` üstten çizgili), `.art-next` (sıradaki yazı bağlantısı).
- `.svc-eyebrow` — bölüm etiketi: turuncu kare + mono numara + ad (`■ 01 HAKKIMDA`). Koyu bölümlerde `.sec-dark` altında rengi açılır.
- `.mission-statement` — kelime kelime aydınlanan büyük misyon cümlesi (`data-words` ile `app.js` işler). `.mission-note` altındaki muted gövde paragrafı.
- `.exp-row` — deneyim satırı (logo, tarih, rol, açıklama). Artık yalnızca `deneyim.html` içinde.

## Sayfa özel notları

- **Kullanılmayan CSS**: `.why-*`, `.svc-sec`/`.svc-item`/`.svc-stage`, `.wa-*`, `.iso-*` kuralları ve `app.js` sonundaki hizmet etkileşim bloğu, ana sayfadan kaldırılan iki bölümden kalmadır. Yeniden kullanılabilir; silmeden önce sor.

- **Ana sayfa akışı ve numaralandırma**: Hero → müşteri logo şeridi → `01 Hakkımda` → `02 Projeler` → `03 Süreç` → Blog → İletişim. Bölüm numaraları `.svc-eyebrow` içinde elle yazılır; bölüm eklenir/çıkarılırsa numaraları elden geçir.
- **`index.html` `#hakkimda`**: büyük başlık yok — sol kolonda portre kartı, sağ kolonda misyon cümlesi + `.stat-big` grid'i + yapay zekâ logo şeridi. Deneyim listesi ve hizmet satırları bu sayfadan çıkarıldı; sayfa içi `#deneyim` anchor'ı yok, menü `deneyim.html`'e gider.
- **Menü sırası**: Ana Sayfa · Hakkımda · Projeler · Deneyim · Süreç · Blog · İletişim. Sıra 7 sayfanın hem `nav-mid` hem `mp-links` bloklarında aynıdır — birini değiştirirken hepsini değiştir.
- **Müşteri logo şeridi** (`.marquee-strip`): logolar `<a>` etiketidir, markanın kendi sitesine açılır. Kaynak görsellerin oranı farklı olduğu için bazıları `.lg-tall` (kare oranlı: Leodent, ADX) veya `.lg-wide` (çok geniş: Biruni, Turkish Technic, Sporterest) sınıfı alır. TCI Aircraft Interiors'ın resmi adresi doğrulanamadı, linksiz duruyor.
- **Blog**: üç yazı yayında; kartlar hem `index.html` `#blog` hem `blog.html` içinde **birebir aynı markup** ile durur — birini değiştirirken diğerini de değiştir. Kart tarihleri ilgili `yazi-*.html` sayfasının `.art-meta` tarihiyle eşleşmelidir.
- **Footer**: İletişim kolonu ve telif barı 10 sayfanın hepsinden kaldırıldı; footer'da logo + "Sayfalar" ve "Sosyal" kolonları kalır.
- **Üst menü**: Deneyim bağlantısı `nav-mid`'den çıkarıldı; sayfa hâlâ menü panelinden ve footer'dan erişilebilir.
- **İstatistik değerleri** sitedeki gerçek verilerden gelir (Projeler 12+ = Behance'teki çalışma sayısı, Kurum 5, Deneyim 9+, Sektör 20+). Yeni sayı eklerken uydurma, kaynağını doğrula.
