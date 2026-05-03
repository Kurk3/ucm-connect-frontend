<template>
  <div class="lp">
    <!-- NAV -->
    <nav class="nav">
      <div class="nav-left">
        <span class="nav-logo">
          <img class="sm:h-8 h-4 w-auto min-w-[100px]" src="@/assets/img/ucm-connect-logo-black.png" alt="UCM Connect">
        </span>
      </div>
      <div class="nav-links">
        <a @click="scrollTo('features')">Funkcie</a>
        <a @click="scrollTo('showcase')">Ukážka</a>
        <a @click="scrollTo('team')">Tím</a>
      </div>
      <div class="nav-right">
        <router-link to="/login" class="nav-btn">Prihlásiť sa</router-link>
      </div>
      <button class="nav-mobile" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span /><span />
      </button>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <h1>Študentská platforma<br>aká má byť</h1>
        <p class="hero-desc">
          UCM Connect je jednoduchý spôsob, ako zdieľať, hľadať a organizovať
          všetko dôležité pre tvoje štúdium na UCM.
        </p>
        <div class="hero-actions">
          <router-link to="/register" class="btn-hero">
            <span class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            </span>
            Zaregistruj sa
          </router-link>
          <a class="btn-ghost" @click="scrollTo('features')">Zisti viac</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/img/landing/hero_devices.png" alt="UCM Connect na rôznych zariadeniach" />
      </div>
    </section>

    <!-- UNOBTRUSIVE DESIGN HEADLINE -->
    <section class="design-intro" id="features">
      <h2 class="gradient-title">Moderný dizajn, ktorý<br>zapadne do tvojho štúdia</h2>
    </section>

    <!-- FEATURE: Clipboard History style -->
    <section class="feature-section">
      <div class="feature-block feature-block--centered">
        <h3>Neobmedzená<br>história príspevkov</h3>
        <p class="feature-block-desc">Všetky príspevky, komentáre a materiály na jednom mieste. Nič sa nestratí.</p>
        <div class="feature-image-showcase">
          <img src="@/assets/img/landing/laptop.png" alt="UCM Connect na laptope" class="feature-laptop" />
        </div>
      </div>
    </section>

    <!-- SEARCH / FIND ANYTHING -->
    <section class="feature-section feature-section--light">
      <div class="feature-block feature-block--centered">
        <h3>Nájdi čokoľvek<br>v sekunde</h3>
        <div class="search-demo">
          <div class="search-bar">
            <div class="search-tags">
              <span class="search-tag tag-blue">Predmety</span>
              <span class="search-tag tag-orange">Materiály</span>
            </div>
            <span class="search-text">programovanie v Jave</span>
            <span class="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK ACCESS -->
    <section class="feature-section">
      <div class="feature-block feature-block--centered">
        <h3>Rýchly prístup k tomu,<br>čo potrebuješ najčastejšie</h3>
        <div class="quick-access-cloud">
          <div class="qa-item" v-for="(item, i) in quickAccessItems" :key="i"
               :style="{ animationDelay: `${i * 0.1}s` }">
            <span class="qa-icon">{{ item.icon }}</span>
            <span class="qa-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SYNC & PRIVACY -->
    <section class="twin-section">
      <div class="twin-card">
        <div class="twin-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3478f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        </div>
        <h4>Synchronizácia<br>naprieč zariadeniami</h4>
        <p>Pristupuj k príspevkom z akéhokoľvek zariadenia. Dáta sú vždy aktuálne.</p>
      </div>
      <div class="twin-card">
        <div class="twin-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3478f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h4>Ochrana súkromia<br>od základu</h4>
        <p>Tvoje dáta sú bezpečne uložené. Rešpektujeme tvoje súkromie na 100%.</p>
      </div>
    </section>

    <!-- POWERFUL FEATURES HEADLINE -->
    <section class="power-headline">
      <h2 class="gradient-title">Silné funkcie<br>pre tvoju produktivitu</h2>
    </section>

    <!-- FEATURE CARDS GRID -->
    <section class="feature-cards-section" id="showcase">
      <div class="feature-cards-grid">
        <div class="fcard fcard--wide">
          <div class="fcard-header">
            <h4>Komunitné príspevky</h4>
            <p>Zdieľaj skúsenosti, pýtaj sa otázky a hlasuj za najlepšie odpovede v predmetových kategóriách.</p>
          </div>
          <div class="fcard-visual">
            <div class="fcard-stats">
              <div class="stat-item">
                <span class="stat-value">3/19</span>
                <span class="stat-label">Predmetov</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">28m 40s</span>
                <span class="stat-label">Ø čas odozvy</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">9m 21s</span>
                <span class="stat-label">Ø riešenie</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fcard fcard--accent">
          <div class="fcard-header">
            <h4>Vlastné pravidlá</h4>
            <p>Každý predmet má pravidlá a odporúčania od komunity, aby si sa vedel rýchlo zorientovať.</p>
          </div>
        </div>

        <div class="fcard fcard--preview">
          <div class="fcard-header">
            <h4>Ukážka a úprava</h4>
            <p>Pred zverejnením si pozri náhľad a uprav formátovanie príspevku v reálnom čase.</p>
          </div>
        </div>

        <div class="fcard fcard--small">
          <div class="fcard-header">
            <h4>Discord integrácia</h4>
            <p>Prepoj účet s Discordom a dostávaj notifikácie priamo na server.</p>
          </div>
        </div>

        <div class="fcard fcard--small">
          <div class="fcard-header">
            <h4>Používateľské profily</h4>
            <p>Sleduj svoju aktivitu, obľúbené predmety a historiu príspevkov.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- A BETTER PLATFORM - DARK SECTION -->
    <section class="dark-section">
      <h2>Lepšia platforma<br>pre každého</h2>
      <p class="dark-subtitle">
        Či už si prvák alebo končíš štúdium, UCM Connect<br>
        ti pomôže na každom kroku.
      </p>
      <div class="dark-image">
        <img src="@/assets/img/landing/laptop.png" alt="UCM Connect platforma" />
      </div>
      <div class="dark-features">
        <div class="dark-feature" v-for="df in darkFeatures" :key="df.title">
          <span class="dark-feature-icon">{{ df.icon }}</span>
          <h4>{{ df.title }}</h4>
          <p>{{ df.desc }}</p>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials" id="team">
      <h2>Študenti UCM si<br>UCM Connect obľúbili</h2>
      <div class="testimonial-grid">
        <div class="testimonial-card" v-for="(t, i) in testimonials" :key="i">
          <p class="testimonial-text">„{{ t.text }}"</p>
          <div class="testimonial-author">
            <strong>{{ t.name }}</strong>
            <span>{{ t.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="team-section">
      <div class="section-header-center">
        <p class="section-label">Kto za tým stojí</p>
        <h2>Študentský projekt KAI UCM</h2>
        <p class="section-desc-center">
          Dvaja študenti, jedna vízia — platforma, ktorá mení spôsob,
          akým študenti spolupracujú a pripravujú sa na skúšky.
        </p>
      </div>
      <div class="team-cards">
        <div class="team-card">
          <img src="@/assets/img/landing/team-1.png" alt="Andrej Folta" />
          <strong>Andrej Folta</strong>
          <span>Full-stack vývojár</span>
        </div>
        <div class="team-card">
          <img src="@/assets/img/landing/team-2.png" alt="Adam Kurek" />
          <strong>Adam Kurek</strong>
          <span>Full-stack vývojár</span>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-card">
        <h2>Priprav sa na ďalší<br>semester s nami</h2>
        <p>Zaregistruj sa a pridaj sa ku komunite, ktorá ti uľahčí štúdium.</p>
        <div class="cta-actions">
          <router-link to="/register" class="btn-cta-primary">Vytvoriť účet</router-link>
          <router-link to="/login" class="btn-cta-secondary">Prihlásiť sa</router-link>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-logo">🎓 ucm connect</span>
        <span class="footer-copy">© 2025 · Študentský projekt KAI UCM v Trnave</span>
      </div>
    </footer>

    <!-- MOBILE MENU -->
    <Transition name="fade">
      <div class="overlay" v-if="menuOpen" @click="menuOpen = false">
        <div class="overlay-menu" @click.stop>
          <a @click="scrollTo('features')">Funkcie</a>
          <a @click="scrollTo('showcase')">Ukážka</a>
          <a @click="scrollTo('team')">Tím</a>
          <router-link to="/login" class="overlay-login">Prihlásiť sa</router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuOpen = ref(false)

const quickAccessItems = [
  { icon: '📊', label: 'Výsledky skúšok' },
  { icon: '📚', label: 'Prednášky' },
  { icon: '💻', label: 'Code Snippets' },
  { icon: '📧', label: 'E-mail šablóny' },
  { icon: '🔖', label: 'Prečítať neskôr' },
  { icon: '🗂️', label: 'Materiály z cvičení' },
]

const darkFeatures = [
  { icon: '💻', title: 'Pre vývojárov', desc: 'Zdieľaj code snippets a technické riešenia so spolužiakmi z informatických predmetov.' },
  { icon: '📝', title: 'Pre študentov', desc: 'Nájdi odpovede na otázky o predmetoch, skúškach a študijných materiáloch.' },
  { icon: '🎯', title: 'Pre organizátorov', desc: 'Zdieľaj informácie o podujatiach, workshopoch a možnostiach pre študentov.' },
  { icon: '💼', title: 'Pre absolventov', desc: 'Pomôž mladším spolužiakom svojimi skúsenosťami a kontaktmi z praxe.' },
]

const testimonials = [
  { name: 'Martinko P.', role: '2. ročník, Aplikovaná informatika', text: 'Konečne miesto, kde nájdem všetko na jednom mieste. Už nemusím prehľadávať desiatky skupín na Facebooku.' },
  { name: 'Zuzka M.', role: '1. ročník, Mediálna komunikácia', text: 'Ako prváčka som sa vďaka UCM Connect zorientovala oveľa rýchlejšie. Starší študenti tu zdieľajú super tipy.' },
  { name: 'Tomáš K.', role: '3. ročník, Informatika', text: 'Discord integrácia je geniálna. Dostávam notifikácie o nových príspevkoch priamo na náš študentský server.' },
  { name: 'Jana S.', role: 'Absolventka 2024', text: 'Aj po skončení školy sa rada vrátim a poradím mladším. Je fajn, že takáto platforma existuje.' },
  { name: 'Peter R.', role: '2. ročník, Informatika', text: 'Príspevky s code snippetmi sú mega užitočné. Ušetrilo mi to hodiny googlienia pri semestrálkach.' },
  { name: 'Katka D.', role: '1. ročník, Aplikovaná informatika', text: 'Mať komunitu, kde sa môžem opýtať bez strachu z hlúpych otázok — presne toto som hľadala.' },
]

const scrollTo = (id: string) => {
  menuOpen.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ===== BASE ===== */
.lp {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1d1d1f;
  background: #fff;
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}
.lp *, .lp *::before, .lp *::after { box-sizing: border-box; margin: 0; padding: 0; }
a { cursor: pointer; text-decoration: none; color: inherit; }

/* ===== NAV ===== */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 3rem;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.nav-left { flex: 1; }
.nav-right { flex: 1; display: flex; justify-content: flex-end; }
.nav-logo {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.nav-logo-icon {
  font-size: 1.2rem;
}
.nav-links {
  display: flex;
  gap: 2.25rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: #555;
}
.nav-links a {
  transition: color 0.2s;
  position: relative;
}
.nav-links a:hover { color: #1d1d1f; }
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 1.5px;
  background: #3478f6;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}
.nav-links a:hover::after {
  transform: scaleX(1);
}
.nav-btn {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.45rem 1.15rem;
  background: #3478f6;
  color: #fff;
  border-radius: 980px;
  transition: all 0.2s;
}
.nav-btn:hover {
  background: #2563eb;
  transform: scale(1.03);
}
.nav-mobile {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.nav-mobile span {
  display: block;
  width: 20px;
  height: 2px;
  background: #1d1d1f;
  border-radius: 1px;
}

/* ===== HERO ===== */
.hero {
  padding: 3rem 3rem 0;
  text-align: center;
  max-width: 1100px;
  margin: 0 auto;
}
.hero-content {
  max-width: 680px;
  margin: 0 auto;
  padding-bottom: 3rem;
}
.hero h1 {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.035em;
  margin-bottom: 1rem;
  color: #1d1d1f;
}
.hero-desc {
  font-size: 1.05rem;
  line-height: 1.65;
  color: #6e6e73;
  max-width: 520px;
  margin: 0 auto 1.75rem;
}
.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
}
.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.4rem;
  background: #3478f6;
  color: #fff;
  border-radius: 980px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-hero:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(52, 120, 246, 0.35);
}
.btn-icon {
  display: flex;
  align-items: center;
}
.btn-ghost {
  font-size: 0.85rem;
  font-weight: 600;
  color: #3478f6;
  padding: 0.65rem 1.2rem;
  border-radius: 980px;
  transition: all 0.2s;
}
.btn-ghost:hover {
  background: rgba(52, 120, 246, 0.08);
}

.hero-image {
  max-width: 900px;
  margin: 0 auto;
}
.hero-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* ===== DESIGN INTRO / GRADIENT TITLE ===== */
.design-intro {
  padding: 6rem 3rem 3rem;
  text-align: center;
}
.gradient-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #3478f6 0%, #8b5cf6 50%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ===== FEATURE SECTIONS ===== */
.feature-section {
  padding: 4rem 3rem;
}
.feature-section--light {
  background: #f5f5f7;
}
.feature-block {
  max-width: 900px;
  margin: 0 auto;
}
.feature-block--centered {
  text-align: center;
}
.feature-block h3 {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin-bottom: 1rem;
  color: #1d1d1f;
}
.feature-block-desc {
  font-size: 0.95rem;
  color: #6e6e73;
  line-height: 1.6;
  max-width: 420px;
  margin: 0 auto 2rem;
}
.feature-image-showcase {
  max-width: 700px;
  margin: 0 auto;
}
.feature-laptop {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

/* ===== SEARCH DEMO ===== */
.search-demo {
  max-width: 520px;
  margin: 2rem auto 0;
}
.search-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e5e5ea;
  border-radius: 980px;
  padding: 0.6rem 1rem 0.6rem 0.6rem;
  gap: 0.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-bar:hover {
  border-color: #3478f6;
  box-shadow: 0 4px 20px rgba(52, 120, 246, 0.12);
}
.search-tags {
  display: flex;
  gap: 0.35rem;
}
.search-tag {
  padding: 0.3rem 0.7rem;
  border-radius: 980px;
  font-size: 0.72rem;
  font-weight: 600;
}
.tag-blue {
  background: #3478f6;
  color: #fff;
}
.tag-orange {
  background: #f97316;
  color: #fff;
}
.search-text {
  flex: 1;
  font-size: 0.88rem;
  color: #1d1d1f;
  text-align: left;
  font-weight: 500;
}
.search-icon {
  color: #8e8e93;
  display: flex;
  align-items: center;
}

/* ===== QUICK ACCESS CLOUD ===== */
.quick-access-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  max-width: 600px;
  margin: 2rem auto 0;
}
.qa-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  background: #f5f5f7;
  border-radius: 980px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #1d1d1f;
  transition: all 0.3s ease;
  animation: floatIn 0.6s ease both;
}
.qa-item:hover {
  background: #3478f6;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 120, 246, 0.25);
}
.qa-icon {
  font-size: 1rem;
}
@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== TWIN SECTION ===== */
.twin-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 3rem 5rem;
}
.twin-card {
  padding: 2.5rem 2rem;
  background: #f5f5f7;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}
.twin-card:hover {
  transform: translateY(-4px);
}
.twin-icon {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}
.twin-card h4 {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.6rem;
  line-height: 1.3;
}
.twin-card p {
  font-size: 0.82rem;
  color: #6e6e73;
  line-height: 1.55;
}

/* ===== POWER HEADLINE ===== */
.power-headline {
  padding: 5rem 3rem 3rem;
  text-align: center;
}

/* ===== FEATURE CARDS ===== */
.feature-cards-section {
  padding: 0 3rem 5rem;
  max-width: 1000px;
  margin: 0 auto;
}
.feature-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.fcard {
  background: #f5f5f7;
  border-radius: 20px;
  padding: 1.75rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.fcard:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
.fcard--wide {
  grid-column: span 2;
}
.fcard--accent {
  background: linear-gradient(135deg, #3478f6, #8b5cf6);
  * {
    color: #fff !important;
  }
}

.fcard--preview {
  background: linear-gradient(135deg, #f97316, #ef4444);
  * {
    color: #fff !important;
  }
}
.fcard-header h4 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  letter-spacing: -0.01em;
}
.fcard-header p {
  font-size: 0.8rem;
  color: #6e6e73;
  /* color: #fff; */
  line-height: 1.5;
}
.fcard-visual {
  margin-top: 1.5rem;
}
.fcard-stats {
  display: flex;
  gap: 1.5rem;
}
.stat-item {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3478f6;
}
.stat-label {
  font-size: 0.7rem;
  color: #8e8e93;
  margin-top: 0.15rem;
}

/* ===== DARK SECTION ===== */
.dark-section {
  background: #1d1d1f;
  color: #fff;
  padding: 5rem 3rem;
  text-align: center;
}
.dark-section h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
}
.dark-subtitle {
  font-size: 0.95rem;
  color: #86868b;
  line-height: 1.6;
  margin-bottom: 3rem;
}
.dark-image {
  max-width: 750px;
  margin: 0 auto 3.5rem;
}
.dark-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}
.dark-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
}
.dark-feature-icon {
  font-size: 1.35rem;
  display: block;
  margin-bottom: 0.6rem;
}
.dark-feature h4 {
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}
.dark-feature p {
  font-size: 0.78rem;
  color: #86868b;
  line-height: 1.55;
}

/* ===== TESTIMONIALS ===== */
.testimonials {
  padding: 5rem 3rem;
  text-align: center;
}
.testimonials h2 {
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-bottom: 3rem;
}
.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}
.testimonial-card {
  padding: 1.75rem;
  border: 1px solid #e5e5ea;
  border-radius: 16px;
  text-align: left;
  transition: all 0.3s ease;
}
.testimonial-card:hover {
  border-color: #3478f6;
  box-shadow: 0 4px 20px rgba(52, 120, 246, 0.08);
  transform: translateY(-2px);
}
.testimonial-text {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #1d1d1f;
  margin-bottom: 1.25rem;
  font-style: italic;
}
.testimonial-author strong {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
}
.testimonial-author span {
  font-size: 0.72rem;
  color: #86868b;
}

/* ===== TEAM ===== */
.team-section {
  padding: 5rem 3rem;
  border-top: 1px solid #e5e5ea;
}
.section-header-center {
  text-align: center;
  margin-bottom: 3rem;
}
.section-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3478f6;
  margin-bottom: 0.6rem;
}
.section-header-center h2 {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 0.6rem;
}
.section-desc-center {
  font-size: 0.9rem;
  color: #6e6e73;
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}
.team-cards {
  display: flex;
  gap: 2rem;
  justify-content: center;
}
.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.team-card img {
  width: 180px;
  height: 220px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 0.85rem;
  background: #f5f5f7;
  transition: transform 0.3s ease;
}
.team-card:hover img {
  transform: scale(1.03);
}
.team-card strong {
  font-size: 0.9rem;
  font-weight: 700;
}
.team-card span {
  font-size: 0.78rem;
  color: #86868b;
}

/* ===== CTA SECTION ===== */
.cta-section {
  padding: 3rem 3rem 5rem;
}
.cta-card {
  max-width: 700px;
  margin: 0 auto;
  padding: 3.5rem 3rem;
  background: linear-gradient(135deg, #eef2ff 0%, #fef3c7 50%, #fce7f3 100%);
  border-radius: 24px;
  text-align: center;
}
.cta-card h2 {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.25;
  margin-bottom: 0.6rem;
}
.cta-card p {
  font-size: 0.9rem;
  color: #6e6e73;
  margin-bottom: 1.75rem;
}
.cta-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}
.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.5rem;
  background: #3478f6;
  color: #fff;
  border-radius: 980px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-cta-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(52, 120, 246, 0.35);
}
.btn-cta-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.5rem;
  border: 1.5px solid #1d1d1f;
  border-radius: 980px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1d1d1f;
  transition: all 0.2s;
  text-decoration: none;
}
.btn-cta-secondary:hover {
  background: #1d1d1f;
  color: #fff;
}

/* ===== FOOTER ===== */
.footer {
  padding: 1.5rem 3rem;
  border-top: 1px solid #e5e5ea;
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-logo {
  font-weight: 700;
  font-size: 0.82rem;
  color: #1d1d1f;
}
.footer-copy {
  font-size: 0.72rem;
  color: #86868b;
}

/* ===== OVERLAY ===== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(4px);
}
.overlay-menu {
  width: 300px;
  background: #fff;
  height: 100%;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.1);
}
.overlay-menu a {
  font-size: 1rem;
  font-weight: 600;
  color: #1d1d1f;
  transition: color 0.2s;
}
.overlay-menu a:hover {
  color: #3478f6;
}
.overlay-login {
  margin-top: 1rem;
  padding: 0.65rem 1.25rem;
  background: #3478f6;
  color: #fff !important;
  border-radius: 980px;
  text-align: center;
  font-size: 0.85rem !important;
  font-weight: 600 !important;
}
.overlay-login:hover {
  background: #2563eb;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .nav { padding: 0.75rem 1.25rem; }
  .nav-links, .nav-right { display: none; }
  .nav-mobile { display: flex; }

  .hero { padding: 2rem 1.25rem 0; }
  .hero h1 { font-size: 2rem; }

  .design-intro { padding: 4rem 1.25rem 2rem; }

  .feature-section { padding: 3rem 1.25rem; }

  .twin-section {
    grid-template-columns: 1fr;
    padding: 2rem 1.25rem 3rem;
  }

  .power-headline { padding: 3rem 1.25rem 2rem; }

  .feature-cards-section { padding: 0 1.25rem 3rem; }
  .feature-cards-grid {
    grid-template-columns: 1fr;
  }
  .fcard--wide { grid-column: span 1; }

  .dark-section { padding: 3rem 1.25rem; }
  .dark-features {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .testimonials { padding: 3rem 1.25rem; }
  .testimonial-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .team-section { padding: 3rem 1.25rem; }
  .team-cards { flex-direction: column; align-items: center; }

  .cta-section { padding: 2rem 1.25rem 3rem; }
  .cta-card { padding: 2.5rem 1.5rem; }

  .footer { padding: 1.25rem; }
  .footer-inner { flex-direction: column; gap: 0.5rem; text-align: center; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .feature-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .fcard--wide { grid-column: span 2; }
  .dark-features {
    grid-template-columns: repeat(2, 1fr);
  }
  .testimonial-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>