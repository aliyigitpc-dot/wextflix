# WextFlix — Sikkolik: The New Era Premium Streaming Platform

## Original Problem Statement
Türkçe premium dizi platformu — Sadece statik HTML/CSS/JS. Şu an tek dizi odaklı: **Sikkolik: The New Era**.

## Architecture
- **Pure static site** under `/app/frontend/public/`:
  - `/index.html` — Ana sayfa (Hero + 5 rail + detail modal + search overlay)
  - `/player.html` — Oynatıcı (video + bölüm seçici + öneri + search overlay)
  - `/style.css` — ~1900 satır, Netflix-class dark UI
  - `/script.js` — Vanilla JS (rails, modal, search, localStorage MyList, toast, hero rotation, episode previews)
- `/app/frontend/src/index.js` neutralized
- All files static — deploy-ready to Netflix/Vercel/GitHub Pages

## Sikkolik Universe (single-series mode)
3 items in the library:
1. **Sikkolik: The New Era** (id: `sikkolik`) — Main S1 with cartoon Kapak poster
2. **Sikkolik 2: The New Era** (id: `sikkolik-2`) — S2 with realistic alt cover
3. **Sikkolik: Devamı İçin Yakında** (id: `sikkolik-devami`) — Upcoming sequel poster

## Features Implemented

### v1 (MVP) → v2 (Identity + Modal) → v3 (Search + MyList) — current
- [x] Glassmorphism navbar with Netflix-class red Inter Black wordmark
- [x] Cinematic hero with Sikkolik cover backdrop (title hidden — cover has its own title)
- [x] Hero auto-rotates through 3 Sikkolik items (Main → S2 → Devamı)
- [x] **5 rails**: İzlemeye Devam Et, Listem (conditional), WextFlix Originals, Yakında Gelecekler, Bölüm Önizlemeleri
- [x] **Bölüm Önizlemeleri rail**: 8 episode preview cards using grid image cropped with CSS background-position — matches user's reference design exactly
- [x] **Detail Modal** (Netflix-style): Hero, badge, title, tagline, %match · year · age · seasons, description, status, cast/genres/production, KARAKTERLER grid (4 distinct character cards)
- [x] **Search Overlay** with live filtering by title/genre, Ctrl+K shortcut, Esc to close
- [x] **localStorage-based Listem**: Add/remove from cards (top-right button on hover), hero button, modal button. Persists across reloads. Toast notifications on add/remove.
- [x] **Navbar list count badge** updates live
- [x] **Listem rail** auto-shows when items in list
- [x] Coming-soon state with locked Play button + "Çok Yakında" red ribbon on cards
- [x] Toast notifications (success/info/error)
- [x] Fully responsive (mobile/tablet/desktop)

## Asset Inventory
- `sikkolikMain` (Image 3) — horizontal kapak (used as hero backdrop)
- `sikkolikAlt` (Image 5) — vertical S2 alternative cover
- `sikkolikSoon` (Image 4) — Devamı için Yakında poster
- `sikkolikCartoon` (original Kapak.jpeg) — cartoon vertical card poster
- `sikkolikRealistic` (4-actor realistic image) — backup
- `episodeGrid` (Image 2) — 2x4 grid of 8 episode thumbnails (cropped via CSS bg-position)
- `apoAbi`, `eniste` — character portraits

## Prioritized Backlog
- **P1**: Bölüm thumbnail'larında daha kesin crop tuning (some episodes show slightly off positions)
- **P1**: Sikkolik için gerçek bölüm video kaynağı (şu an Big Buck Bunny demo)
- **P2**: Backend (FastAPI + MongoDB) — IMDb sistem (yorum/puan/kullanıcı) — kullanıcı deploy zorluğu nedeniyle ertelendi
- **P2**: Gerçek HLS/DASH stream + WebSocket bildirimleri
- **P2**: Sikkolik için bölüm trailer'ı modal içinde preview
- **P2**: Çok dilli alt yazı seçimi

## Files Changed in v3
- `/app/frontend/public/index.html` — Updated nav (Sikkolik focus), removed dummy rails, added new rails (originals, coming-soon, episodes, mylist), added search overlay
- `/app/frontend/public/player.html` — Updated nav, added search overlay, Sikkolik series info
- `/app/frontend/public/style.css` — Added search overlay styles, toast styles, list badge, card-list-btn, episode cards, rail-empty
- `/app/frontend/public/script.js` — Full restructure: single-series Sikkolik universe, MyList localStorage helper, toast notifications, search overlay logic, modal id tracking
