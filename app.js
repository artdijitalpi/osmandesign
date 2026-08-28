  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Mission statement: kelimeler scroll ile koyulasir
  const azMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stmt = document.querySelector('[data-words]');
  let words = [];
  if (stmt) stmt.dataset.tr = stmt.textContent.trim();
  window.kelimele = function(metin){
    if (!stmt) return;
    const src = String(metin).trim().split(/\s+/);
    stmt.textContent = '';
    src.forEach((w, i) => {
      const sp = document.createElement('span');
      sp.className = 'w';
      sp.textContent = w;
      stmt.appendChild(sp);
      if (i < src.length - 1) stmt.appendChild(document.createTextNode(' '));
    });
    words = [...stmt.querySelectorAll('.w')];
    if (azMotion) words.forEach(w => w.classList.add('on'));
    else paintWords();
  };
  if (stmt) window.kelimele(stmt.dataset.tr);
  function paintWords(){
    if (!stmt || !words.length || azMotion) return;
    const r = stmt.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = (vh * 0.85 - r.top) / (r.height + vh * 0.25);
    const n = Math.round(Math.min(Math.max(p, 0), 1) * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  }
  paintWords();
  window.addEventListener('scroll', paintWords, { passive:true });
  window.addEventListener('resize', paintWords);

  // Istatistik sayaclari
  const nums = document.querySelectorAll('.stat-num[data-count]');
  const numIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const hedef = parseInt(el.dataset.count, 10) || 0;
      const ek = el.dataset.suffix || '';
      obs.unobserve(el);
      if (azMotion || hedef === 0) { el.textContent = hedef + ek; return; }
      const sure = 1100, bas = performance.now();
      const adim = (t) => {
        const k = Math.min((t - bas) / sure, 1);
        el.textContent = Math.round(hedef * (1 - Math.pow(1 - k, 3))) + ek;
        if (k < 1) requestAnimationFrame(adim);
      };
      requestAnimationFrame(adim);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => numIO.observe(n));

  // Header switches from light-on-photo to dark-on-cream after the hero
  const headerEl = document.getElementById('siteHeader');
  const heroEl = document.getElementById('heroSection');
  function toggleHeader(){
    if (!headerEl) return;
    if (!heroEl) { headerEl.classList.add('scrolled'); return; }  // alt sayfalarda hero yok
    const trigger = heroEl.offsetHeight - 90;
    headerEl.classList.toggle('scrolled', window.scrollY > trigger);
  }
  toggleHeader();
  window.addEventListener('scroll', toggleHeader, { passive:true });

  // Menu panel toggle
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('menuOverlay');
  const scrim = document.getElementById('menuScrim');
  function setMenu(open){
    toggle.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeMenu(){ setMenu(false); }
  toggle.setAttribute('aria-expanded','false');
  toggle.addEventListener('click', () => setMenu(!overlay.classList.contains('open')));
  scrim.addEventListener('click', closeMenu);
  overlay.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeMenu(); });
  // Iletisim formu: alanlar dolana kadar gonder kapali
  const cf = document.querySelector('.cf');
  if (cf) {
    const btn = cf.querySelector('.cf-btn');
    const state = cf.querySelector('.cf-state');
    window.formSync = () => {
      const ok = cf.checkValidity();
      btn.disabled = !ok;
      state.textContent = window.cev ? window.cev(ok ? 'Gönder' : 'Form eksik') : (ok ? 'Gönder' : 'Form eksik');
    };
    const sync = window.formSync;
    cf.addEventListener('input', sync);
    cf.addEventListener('submit', (e) => {
      e.preventDefault();
      state.textContent = window.cev ? window.cev('Gönderildi ✓') : 'Gönderildi ✓';
      btn.disabled = true;
    });
    sync();
  }

  // Proje filtresi (projeler.html)
  const pills = document.querySelectorAll('.filter-bar .pill');
  if (pills.length) {
    const kartlar = [...document.querySelectorAll('.bento [data-cat]')];
    pills.forEach(p => p.addEventListener('click', () => {
      const f = p.dataset.filter;
      pills.forEach(x => x.classList.toggle('on', x === p));
      kartlar.forEach(k => {
        const goster = f === 'all' || k.dataset.cat === f;
        k.classList.toggle('gizli', !goster);
      });
    }));
  }
  // ---- Dil (TR / EN) ----
  const EN = {"MENÜ": "MENU", "Ana Sayfa": "Home", "Projeler": "Projects", "Hakkımda": "About", "Deneyim": "Experience", "Süreç": "Process", "Blog": "Blog", "İletişim": "Contact", "PROJEYİ BAŞLAT": "START PROJECT", "Sr. Art Director · Marka & Dijital Tasarım": "Sr. Art Director · Brand & Digital Design", "Marka · Kampanya": "Brand · Campaign", "Art Direction": "Art Direction", "Kurucuların ve büyüyen markaların fikirlerini kusursuz dijital deneyimlere": "I help founders and growing brands turn their ideas into", "dönüştürmelerine yardımcı oluyorum.": "refined digital experiences.", "Marka Kimliği": "Brand Identity", "Web Tasarımı": "Web Design", "Birlikte çalıştığım markalardan bazıları": "Some of the brands I have worked with", "Tasarımı sadece güzel görünmesi için değil, doğru anlaşılması için kullanıyorum.": "I use design not just to look good, but to be understood correctly.", "İletişime Geç": "Get in touch", "Misyonum": "My mission", "Merhaba, ben Osman. Dokuz yıldır sağlık, havacılık ve spor markaları için görsel sistemler kuruyorum — işi güzel değil, anlaşılır kılan tarafıyla ilgileniyorum.": "Hi, I'm Osman. For nine years I have built visual systems for healthcare, aviation and sportswear brands, drawn to the side of the work that makes things clear rather than merely pretty.", "Yıl": "Years", "Kurum": "Companies", "Sektör": "Industries", "Proje": "Projects", "2017'den bu yana ajans ve kurumsal tarafta tasarım.": "Agency and in-house design since 2017.", "Slazenger, TCI Aircraft, Medipol, Admirise ve DijitalPi.": "Slazenger, TCI Aircraft, Medipol, Admirise and DijitalPi.", "Sağlık, havacılık, spor giyim ve dijital ajans.": "Healthcare, aviation, sportswear and digital agency.", "Yer tutucu — gerçek proje sayını birlikte gireceğiz.": "Placeholder — we will enter your real project count together.", "Meslek": "Profession", "Konum": "Location", "İstanbul, Türkiye": "Istanbul, Turkey", "İstanbul, TR": "Istanbul, TR", "Merhaba, ben Osman. Marka kimliği ve dijital ürün tasarımı üzerine çalışıyorum.": "Hi, I'm Osman. I work on brand identity and digital product design.", "Bu metni kendi hikayenle değiştireceğiz — nerede çalıştığını, hangi projelerde yer aldığını, tasarıma nasıl baktığını buraya yazacağız.": "This text will be replaced with your own story — where you have worked, which projects you took part in, and how you approach design.", "Şimdilik yer tutucu: net bir görsel sistem kurup bunu kullanılabilir, sürdürülebilir bir arayüze dönüştürmeyi önemsiyorum.": "Placeholder for now: I care about building a clear visual system and turning it into a usable, sustainable interface.", "Logo · Sistem": "Logo · System", "Görsel Dil": "Visual Language", "2017'den bu yana ajans ve kurumsal tarafta; grafik tasarımdan art direction'a.": "Agency and in-house since 2017; from graphic design to art direction.", "Eki 2024 — Devam ediyor": "Oct 2024 — Present", "1 yıl 11 ay": "1 yr 11 mos", "DijitalPi · Tam zamanlı": "DijitalPi · Full-time", "İstanbul, TR · Ofiste": "Istanbul, TR · On-site", "Markaların dijital dünyadaki görsel kimliğini güçlendiren yaratıcı kampanya süreçlerini yönetiyorum: konsept geliştirme, art direction ve yaratıcı ekip iş akışları.": "I lead creative campaign processes that strengthen brands' visual identities in the digital world: concept development, art direction and creative team workflows.", "Kas 2024 — Haz 2025": "Nov 2024 — Jun 2025", "8 ay": "8 mos", "Admirise Digital Performance Agency · Yarı zamanlı": "Admirise Digital Performance Agency · Part-time", "Frankfurt, Almanya · Uzaktan": "Frankfurt, Germany · Remote", "Dijital marka iletişiminin yaratıcı gelişimine katkı verdim; konsept geliştirme, görsel kimlik ve kampanya tasarımına odaklandım.": "I contributed to the creative development of digital brand communications, focusing on concept development, visual identity and campaign design.", "Mar 2021 — Eyl 2024": "Mar 2021 — Sep 2024", "3 yıl 7 ay": "3 yrs 7 mos", "Medipol Sağlık Grubu · Tam zamanlı": "Medipol Health Group · Full-time", "Sağlık sektöründe kurumsal iletişim projelerinin art direction ve yaratıcı tasarım süreçlerini yürüttüm; hastane kampanyaları ve sosyal medya için görsel çözümler geliştirdim.": "I ran art direction and creative design for corporate communication projects in healthcare, developing visual solutions for hospital campaigns and social media.", "Ara 2018 — Şub 2021": "Dec 2018 — Feb 2021", "2 yıl 3 ay": "2 yrs 3 mos", "TCI Aircraft Interiors · Tam zamanlı": "TCI Aircraft Interiors · Full-time", "Havacılık sektörü için kurumsal ve teknik tasarım projeleri: marka iletişim materyalleri, kataloglar, fuar görselleri ve dijital varlıklar.": "Corporate and technical design projects for the aviation industry: brand communication materials, catalogues, exhibition visuals and digital assets.", "Haz 2017 — Ara 2018": "Jun 2017 — Dec 2018", "1 yıl 7 ay": "1 yr 7 mos", "Slazenger Türkiye · Tam zamanlı": "Slazenger Türkiye · Full-time", "Spor giyim markası için ürün, kampanya ve mağaza iletişimi görsellerini tasarladım.": "I designed product, campaign and in-store communication visuals for a sportswear brand.", "Öne çıkan iş": "Featured work", "Kapsam": "Scope", "Marka kimliğinden dijital ürüne kadar tek bir görsel sistem.": "One visual system, from brand identity through to digital product.", "Logo, tipografi, renk ve arayüz aynı mantıkla kuruluyor — her yerde tutarlı kalsın diye.": "Logo, typography, colour and interface are built on the same logic, so everything stays consistent.", "2017'den bu yana tasarım": "Designing since 2017", "Web tasarımı": "Web design", "Kampanya": "Campaign", "Art direction": "Art direction", "Görsel dil": "Visual language", "Marka kimliği": "Brand identity", "Kurumsal kimlik": "Corporate identity", "Sıradaki": "Next", "Bir sonraki proje seninki olsun.": "Let the next project be yours.", "Seçili Projeler": "Selected Projects", "Her proje bir soruna nasıl yaklaştığımı, kurduğum sistemi ve sonucu gösterir.": "Each project shows how I approached a problem, the system I built and the outcome.", "Nasıl Çalışıyorum": "How I Work", "İlk görüşmeden teslime kadar net ve takip edilebilir bir süreç.": "A clear, trackable process from the first call to delivery.", "Keşif": "Discovery", "Hedeflerini, kitleni ve markanın ihtiyacını anlıyorum. Proje bir yön kazanıyor.": "I get to know your goals, audience and what the brand needs. The project finds its direction.", "Tasarım": "Design", "Görsel sistemi kuruyorum — tipografi, renk, düzen — ve netleştirene kadar birlikte gözden geçiriyoruz.": "I build the visual system — typography, colour, layout — and we review it together until it is clear.", "Uygulama": "Build", "Tasarımı kullanılabilir bir arayüze dönüştürüyorum, tüm ekran boyutlarında test ediyorum.": "I turn the design into a usable interface and test it across every screen size.", "Teslim": "Delivery", "Son rötuşlar, kontroller ve teslim. İhtiyacın olursa sonrası için de buradayım.": "Final touches, checks and handover. I am here afterwards too if you need me.", "Notlar": "Notes", "Tasarım sürecinden ve işimden aklımda kalanlar.": "Things that stayed with me from the design process and my work.", "Yazı Başlığı Bir": "Post Title One", "Yazı Başlığı İki": "Post Title Two", "Yazı Başlığı Üç": "Post Title Three", "Kısa özet buraya gelecek.": "A short summary goes here.", "Marka": "Brand", "Bir proje mi var aklında? Konuşalım.": "Got a project in mind? Let's talk.", "Hedefini, zaman çizelgeni ve nasıl yardımcı olabileceğimi kısaca yaz — sana en kısa sürede dönüş yapayım.": "Tell me briefly about your goal, your timeline and how I can help — I will get back to you shortly.", "E-posta": "Email", "Adın": "Your name", "Nasıl yardımcı olabilirim?": "How can I help?", "Form eksik": "Form incomplete", "Gönder": "Send", "Gönderildi ✓": "Sent ✓", "Yazdıklarını yalnızca bu talebe dönüş yapmak için kullanıyorum.": "I use what you write only to respond to this enquiry.", "Sayfalar": "Pages", "Sosyal": "Social", "© 2026 OSMANDESIGN. Tüm hakları saklıdır.": "© 2026 OSMANDESIGN. All rights reserved.", "Tasarım & Kod — OSMANDESIGN": "Design & Code — OSMANDESIGN", "Adın Soyadın": "Your full name", "ornek@mail.com": "you@mail.com", "Projenden kısaca bahset...": "Tell me briefly about your project...", "Menü": "Menu", "Ana menü": "Main menu", "Site menüsü": "Site menu", "01 / Çalışmalar": "01 / Work", "02 / Profil": "02 / Profile", "03 / Kariyer": "03 / Career", "04 / Yöntem": "04 / Method", "05 / Yazılar": "05 / Writing", "06 / Bağlantı": "06 / Contact", "Tümü": "All", "Çalışmaları keşfet": "Explore work", "Proje filtresi": "Project filter", "Tümünü gör": "See all", "Yaz bana": "Write to me", "Hedefini ve zaman çizelgeni yaz, en kısa sürede dönüş yapayım.": "Tell me your goal and timeline, and I will get back to you shortly.", "Osman Özdemir portresi": "Portrait of Osman Özdemir", "Sosyal Medya": "Social Media", "Web Görselleri": "Web Visuals", "Behance'te yayınladığım 12 çalışma — marka kimliği, web tasarımı ve sosyal medya.": "12 projects published on Behance — brand identity, web design and social media."};
  const ATTRS = ['placeholder','aria-label','alt','title'];
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n){
      const p = n.parentNode;
      if (!p || /SCRIPT|STYLE/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
      return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push([n, n.nodeValue]);
  const attrNodes = [];
  document.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(el => {
    ATTRS.forEach(a => { if (el.hasAttribute(a)) attrNodes.push([el, a, el.getAttribute(a)]); });
  });
  let dil = localStorage.getItem('od-lang') || 'tr';
  const cev = (tr) => dil === 'en' ? (EN[tr.trim()] ?? tr) : tr;
  window.cev = cev;
  function uygula(){
    nodes.forEach(([n, tr]) => {
      const t = tr.trim();
      n.nodeValue = (dil === 'en' && EN[t]) ? tr.replace(t, EN[t]) : tr;
    });
    attrNodes.forEach(([el, a, tr]) => el.setAttribute(a, (dil === 'en' && EN[tr]) ? EN[tr] : tr));
    document.documentElement.lang = dil;
    document.querySelectorAll('.lang button').forEach(b => {
      const on = b.dataset.lang === dil;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const stmtEl = document.querySelector('[data-words]');
    if (stmtEl && window.kelimele) window.kelimele(cev(stmtEl.dataset.tr));
    if (typeof formSync === 'function') formSync();
  }
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    dil = b.dataset.lang; localStorage.setItem('od-lang', dil); uygula();
  }));
  uygula();
/* HIZMETLER — liste secimi ile izometrik sahne degisimi */
(function () {
  const list = document.querySelector('.svc-list');
  const stage = document.querySelector('.svc-stage');
  if (!list || !stage) return;

  const CIKTI = {
    marka: 'Marka kılavuzu · Logo sistemi · Tipografi ölçeği',
    web: 'Duyarlı arayüz · Bileşen kütüphanesi · Canlı yayın',
    art: 'Kampanya görselleri · Sosyal medya şablonları · Görsel dil'
  };
  const out = stage.querySelector('.ssf-value');

  function sec(btn) {
    if (!btn || btn.classList.contains('on')) return;
    list.querySelectorAll('.svc-item').forEach(b => {
      const on = b === btn;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const v = btn.dataset.view;
    stage.dataset.view = v;
    if (out && CIKTI[v]) out.textContent = CIKTI[v];
  }

  list.addEventListener('click', e => sec(e.target.closest('.svc-item')));
  list.addEventListener('mouseover', e => sec(e.target.closest('.svc-item')));
})();
