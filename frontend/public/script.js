/* ============================================================
   WextFlix — Vanilla JS
   Handles: navbar, rails, card rendering, mobile menu, hero rotation, detail modal
============================================================ */

// ---------------------------------------------------------------
// Asset URLs (Sikkolik original artwork)
// ---------------------------------------------------------------
const ASSETS = {
    // Main horizontal cover with SIKKOLIK title on right side
    sikkolikMain: "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/pbkuny4o_ChatGPT%20Image%205%20Haz%202026%2018_12_55.png",
    // Alternative Sikkolik 2 cover (older + younger gangster)
    sikkolikAlt: "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/qv7cqj7u_ChatGPT%20Image%2015%20Haz%202026%2020_54_03.png",
    // "Devamı için Yakında" continuation teaser
    sikkolikSoon: "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/f44169hq_ChatGPT%20Image%2015%20Haz%202026%2021_13_41.png",
    // 8-episode preview grid (2x4)
    episodeGrid: "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/rrf9b99e_ChatGPT%20Image%205%20Haz%202026%2018_19_42.png",
    // Realistic cast image (used as additional backdrop)
    sikkolikRealistic: "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/bmpt03yz_ChatGPT%20Image%2015%20Haz%202026%2021_11_02.png",
    // Cartoon poster (Tunahan + Alp) — old kapak
    sikkolikCartoon: "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/a0gqz6br_Kapak.jpeg",
    // Character images — corrected mapping per canon:
    //   Apo Abi  = bıyıklı, gri kazaklı (yeni illüstrasyon)
    //   Enişte   = beyaz saçlı patron (eski "apoAbi" dosyası)
    //   Kero     = bıyıklı / çevik (eski "eniste" dosyası)
    apoAbi: "./apo-abi.jpeg",
    eniste: "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/61nqdr1m_Apo%20abinin%20eni%C5%9Ftesi.jpeg",
    kero:   "https://customer-assets.emergentagent.com/job_cinema-connect-49/artifacts/dagwhyyz_Karakter%20Kero.jpeg"
};

// ---------------------------------------------------------------
// Dataset (Türkçe örnek diziler).
// ---------------------------------------------------------------
const POSTERS = [
    ASSETS.sikkolikPoster,
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80",
    "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=600&q=80",
    "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
    "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=600&q=80",
    "https://images.unsplash.com/photo-1532800783378-1bed60adaf58?w=600&q=80",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&q=80",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80",
    "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=600&q=80",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&q=80",
    "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80",
    "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=600&q=80",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&q=80"
];

// ---------------------------------------------------------------
// Sikkolik Universe — single-series mode
// All cards across the site reference these items
// ---------------------------------------------------------------
const SIKKOLIK_MAIN = {
    id: "sikkolik",
    title: "Sikkolik: The New Era",
    genre: "Suç · Dram · Gerilim",
    episodes: 8,
    year: 2026,
    poster: ASSETS.sikkolikCartoon,
    isNew: true,
    isSoon: false
};

const SIKKOLIK_DEVAMI = {
    id: "sikkolik-devami",
    title: "Sikkolik: Devamı İçin Yakında",
    genre: "Suç · Mistik · Dram",
    episodes: 8,
    year: 2027,
    poster: ASSETS.sikkolikSoon,
    isSoon: true
};

const SIKKOLIK_CONTINUE = {
    ...SIKKOLIK_MAIN,
    progress: 42,
    episodeNum: 1,
    episodeTitle: "Yeni Başlangıç"
};

// Rails
const RAIL_CONTINUE = [SIKKOLIK_CONTINUE];
const RAIL_ORIGINALS = [SIKKOLIK_MAIN];
const RAIL_COMING_SOON = [SIKKOLIK_DEVAMI];

// 8 Episode Previews (positions on the 4x2 grid image)
const EPISODE_PREVIEWS = [
    { num: 1, title: "Yeni Başlangıç", desc: "İki farklı hayat, aynı hedef. Sikkolik The New Era başlıyor.", duration: "48 dk", gridPos: "0% 0%", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", released: true },
    { num: 2, title: "Güven Meselesi", desc: "Geçmişin gölgeleri, geleceği şekillendirir. Her adımda güven sınanır.", duration: "46 dk", gridPos: "33.33% 0%" },
    { num: 3, title: "Masadakiler", desc: "Masaya oturmak kolay, kalkarken aynı olmak zordur.", duration: "52 dk", gridPos: "66.66% 0%" },
    { num: 4, title: "Zirveye Doğru", desc: "Hedef büyüdükçe, yalnızlık da büyür. Zirveye giden yol, cesaret ister.", duration: "49 dk", gridPos: "100% 0%" },
    { num: 5, title: "Baskın", desc: "Plan devreye giriyor. Bu gece dengeler değişecek.", duration: "47 dk", gridPos: "0% 100%" },
    { num: 6, title: "İhanet", desc: "En yakınından gelen darbe, en derin izi bırakır.", duration: "50 dk", gridPos: "33.33% 100%" },
    { num: 7, title: "Düşüş", desc: "Her düşüş, bir son değil. Bazen yeniden doğuşun başlangıcıdır.", duration: "55 dk", gridPos: "66.66% 100%" },
    { num: 8, title: "Yeni Dönem", desc: "Her şey değişti. Çünkü bu, yeni bir çağın başlangıcı.", duration: "62 dk", gridPos: "100% 100%" }
];

// Hero rotation pool — Sikkolik only
const HERO_POOL = [
    {
        id: "sikkolik",
        badge: "WEXTFLIX ORIGINAL · 1. BÖLÜM YAYINDA",
        title: "",
        tagline: '"Parayı kovaladılar. Asla bulamayacaklar."',
        year: 2026,
        seasons: "",
        genre: "Suç · Dram · Gerilim",
        desc: "Tunahan ve Alp — iki yakın arkadaş, büyük parayı kovalarken her gece daha karanlık bir sokağa düşer. Para hep bir adım önde, hep ulaşamadıkları yerde. Sonunda anlarlar ki parayı asla bulamayacaklar — ama parayı kovalayan, kendini kaybeder.",
        // Cover rotates between main artwork, alternative and cartoon kapak
        covers: [
            { bg: ASSETS.sikkolikMain, bgPosition: "right center" },
            { bg: ASSETS.sikkolikAlt, bgPosition: "center center" },
            { bg: ASSETS.sikkolikCartoon, bgPosition: "center center" }
        ],
        bg: ASSETS.sikkolikMain,
        bgPosition: "right center",
        released: true
    },
    {
        id: "sikkolik-devami",
        badge: "DEVAMI İÇİN YAKINDA",
        title: "",
        tagline: '"Zaman parçalandı. Yeni bir döngü başlıyor."',
        year: 2027,
        seasons: "Devamı · Yakında",
        genre: "Suç · Mistik · Dram",
        desc: "Geçmişin sırrı, geleceğin anahtarı. Saatin çatladığı yerde, yeni bir kıyamet doğar. Enişte, son perdede sahnede.",
        bg: ASSETS.sikkolikSoon,
        bgPosition: "center top",
        soon: true
    }
];

// ---------------------------------------------------------------
// Detailed series info — opened in modal on card click
// ---------------------------------------------------------------
const SERIES_DETAILS = {
    sikkolik: {
        badge: "WEXTFLIX ORIGINAL · 1. BÖLÜM YAYINDA",
        title: "Sikkolik: The New Era",
        tagline: '"Parayı kovaladılar. Asla bulamayacaklar."',
        hero: ASSETS.sikkolikMain,
        heroPosition: "center",
        match: "%98 eşleşme",
        year: "2026",
        age: "18+",
        seasons: "",
        desc: "Tunahan ve Alp — iki yakın arkadaş, büyük parayı kovalarken her gece daha karanlık bir sokağa düşer. Uyuşturucu, borç, ihanet… Para hep bir adım önde, hep ulaşamadıkları yerde. Bir yandan Apo Abi ve eniştesinin etrafındaki gizem büyür: kim kimin için çalışıyor, kimse bilmiyor. Sonunda anlarlar ki parayı asla bulamayacaklar — ama parayı kovalayan, kendini kaybeder.",
        status: "1. bölüm yayında.",
        cast: "Tunahan, Alp, Apo Abi, Enişte, Kero",
        genres: "Suç, Dram, Gerilim",
        soon: false,
        characters: [
            { name: "Tunahan", trait: "Soğukkanlı. Hesaplı. Tehlikeli.", img: ASSETS.sikkolikCartoon, position: "12% 22%", size: "230% auto" },
            { name: "Alp", trait: "Genç. Hırslı. Sınır tanımaz.", img: ASSETS.sikkolikCartoon, position: "88% 22%", size: "230% auto" },
            { name: "Apo Abi", trait: "Bıyıklı patron. Sözü kanun.", img: ASSETS.apoAbi, position: "center", size: "cover" },
            { name: "Enişte", trait: "Beyaz saçlı. Perdeyi açan el.", img: ASSETS.eniste, position: "center", size: "cover" },
            { name: "Kero", trait: "amınagoyum yaz.", img: ASSETS.kero, position: "center", size: "cover" }
        ]
    },
    "sikkolik-devami": {
        badge: "DEVAMI İÇİN YAKINDA",
        title: "Sikkolik: Devamı İçin Yakında",
        tagline: '"Yakında."',
        hero: ASSETS.sikkolikSoon,
        heroPosition: "center top",
        match: "",
        year: "2027",
        age: "",
        seasons: "",
        desc: "",
        status: "Yakında.",
        cast: "",
        genres: "",
        soon: true,
        minimal: true,
        characters: []
    }
};

// ---------------------------------------------------------------
// My List — localStorage backed
// ---------------------------------------------------------------
const MY_LIST_KEY = "wextflix:mylist";

const MyList = {
    _set: null,
    _load() {
        if (this._set) return this._set;
        try {
            const raw = localStorage.getItem(MY_LIST_KEY);
            this._set = new Set(raw ? JSON.parse(raw) : []);
        } catch (_) {
            this._set = new Set();
        }
        return this._set;
    },
    _save() {
        try {
            localStorage.setItem(MY_LIST_KEY, JSON.stringify([...this._load()]));
        } catch (_) {
            /* localStorage not available */
        }
    },
    has(id) { return id ? this._load().has(id) : false; },
    add(id) { this._load().add(id); this._save(); },
    remove(id) { this._load().delete(id); this._save(); },
    toggle(id) {
        if (!id) return false;
        const has = this.has(id);
        if (has) this.remove(id); else this.add(id);
        return !has; // returns true if NOW in list
    },
    all() { return [...this._load()]; },
    count() { return this._load().size; }
};

// ---------------------------------------------------------------
// User ratings (IMDb-style) — persisted on backend (FastAPI + Mongo)
// Endpoints:
//   GET  /api/ratings/{ep_num}?voter_id=...  -> { avg, count, mine }
//   POST /api/ratings/{ep_num}  body: { voter_id, score }
// Voter identity is a UUID stored in localStorage so the same browser
// cannot inflate vote counts; submitting again replaces the prior vote.
// ---------------------------------------------------------------
const API_BASE = ((window.WEXTFLIX_API_BASE || "").replace(/\/$/, "")) + "/api";
const VOTER_KEY = "wextflix:voter_id";
function getVoterId() {
    let id = null;
    try { id = localStorage.getItem(VOTER_KEY); } catch (_) {}
    if (!id) {
        id = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : "v-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
        try { localStorage.setItem(VOTER_KEY, id); } catch (_) {}
    }
    return id;
}

const Ratings = {
    _cache: {}, // epNum -> { avg, count, mine }
    getCached(epNum) { return this._cache[epNum] || null; },
    async fetch(epNum) {
        try {
            const url = `${API_BASE}/ratings/${epNum}?voter_id=${encodeURIComponent(getVoterId())}`;
            const res = await fetch(url, { credentials: "omit" });
            if (!res.ok) return null;
            const d = await res.json();
            if (!d || !d.count) { delete this._cache[epNum]; return null; }
            this._cache[epNum] = d;
            return d;
        } catch (_) { return null; }
    },
    async preload(epNums) {
        await Promise.all(epNums.map((n) => this.fetch(n)));
        return this._cache;
    },
    async fetchAll() {
        try {
            const url = `${API_BASE}/ratings?voter_id=${encodeURIComponent(getVoterId())}`;
            const res = await fetch(url, { credentials: "omit" });
            if (!res.ok) return this._cache;
            const list = await res.json();
            list.forEach((r) => { this._cache[r.ep_num] = r; });
            return this._cache;
        } catch (_) { return this._cache; }
    },
    async submit(epNum, score) {
        score = Math.max(1, Math.min(10, Math.round(score)));
        try {
            const res = await fetch(`${API_BASE}/ratings/${epNum}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ voter_id: getVoterId(), score })
            });
            if (!res.ok) return null;
            const d = await res.json();
            this._cache[epNum] = d;
            return d;
        } catch (_) { return null; }
    }
};

// ---------------------------------------------------------------
// Toast notifications
// ---------------------------------------------------------------
function showToast(message, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("data-testid", "toast");
    const icon = type === "success" ? "check" : type === "error" ? "xmark" : "info";
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 350);
    }, 2400);
}

// All items by id — used for My List & Search
const ALL_ITEMS_BY_ID = {
    "sikkolik": SIKKOLIK_MAIN,
    "sikkolik-devami": SIKKOLIK_DEVAMI
};

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function buildCard(item, opts = {}) {
    const poster = item.poster || ASSETS.sikkolikAlt;
    const showProgress = typeof item.progress === "number";
    const progressEl = showProgress
        ? `<div class="card-progress"><div class="card-progress-bar" style="width:${item.progress}%"></div></div>`
        : "";
    const isSoon = item.isSoon;
    const newEl = isSoon
        ? `<div class="card-soon">Çok Yakında</div>`
        : (item.isNew ? `<div class="card-new">Yeni</div>` : "");

    const slug = item.id || item.title.replace(/\s+/g, "-").toLowerCase();
    const tid = `card-${slug}`;
    const playLabel = isSoon
        ? `<i class="fa-solid fa-circle-info"></i> Detay`
        : `<i class="fa-solid fa-play"></i> Oynat`;
    const inList = MyList.has(item.id);

    return `
        <a class="card ${inList ? 'in-list' : ''}" href="#${slug}" data-id="${item.id || ''}" data-title="${item.title}" data-testid="${tid}">
            <img class="card-img" src="${poster}" alt="${item.title}" loading="lazy" />
            <div class="card-original-tag" data-testid="card-original-tag-${slug}">WEXTFLIX ORIGINAL</div>
            <div class="card-episodes">${item.episodes} Bölüm</div>
            ${newEl}
            <button class="card-list-btn ${inList ? 'active' : ''}" data-list-toggle="${item.id}" data-testid="list-toggle-${slug}" aria-label="Listeye ekle/kaldır">
                <i class="fa-solid fa-${inList ? 'check' : 'plus'}"></i>
            </button>
            <div class="card-overlay">
                <div class="card-title">${item.title}</div>
                <div class="card-meta">
                    <span><i class="fa-solid fa-clapperboard"></i> ${item.genre}</span>
                    <span><i class="fa-solid fa-calendar"></i> ${item.year}</span>
                </div>
                <span class="card-play">${playLabel}</span>
            </div>
            ${progressEl}
        </a>
    `;
}

function renderRail(railId, items) {
    const el = document.getElementById(railId);
    if (!el) return;
    if (!items || items.length === 0) {
        el.innerHTML = `<div class="rail-empty" data-testid="rail-empty-${railId}">
            <i class="fa-regular fa-bookmark"></i>
            <p>Henüz listene bir şey eklemedin. Bir karta tıklayıp "Listeme Ekle"ye dokunabilirsin.</p>
        </div>`;
        return;
    }
    el.innerHTML = items.map((item) => buildCard(item)).join("");
}

function renderEpisodeRail(railId) {
    const el = document.getElementById(railId);
    if (!el) return;
    const draw = () => {
        el.innerHTML = EPISODE_PREVIEWS.map((ep) => `
            <a class="card card-episode" href="./player.html?ep=${ep.num}" data-testid="ep-card-${ep.num}">
                <div class="ep-card-thumb" style="background-image:url(${ASSETS.episodeGrid}); background-position:${ep.gridPos}; background-size:400% 200%"></div>
                <div class="ep-card-num">${ep.num}. BÖLÜM</div>
                ${(() => { const r = ep.released ? Ratings.getCached(ep.num) : null; return r ? `<div class="ep-card-rating" title="${r.count} oy"><i class="fa-solid fa-star"></i> ${r.avg.toFixed(1)}</div>` : ""; })()}
                <div class="ep-card-overlay">
                    <div class="ep-card-title">${ep.title}</div>
                    <div class="ep-card-desc">${ep.desc}</div>
                    <div class="ep-card-meta"><i class="fa-regular fa-clock"></i> ${ep.duration}</div>
                </div>
            </a>
        `).join("");
    };
    draw();
    // Fetch live ratings from backend, then re-render so the badges appear
    const nums = EPISODE_PREVIEWS.filter((e) => e.released).map((e) => e.num);
    if (nums.length) Ratings.preload(nums).then(draw).catch(() => {});
}

function bindRailNav() {
    $$(".row-rail").forEach((rail) => {
        const track = rail.querySelector(".rail-track");
        const prev = rail.querySelector("[data-rail-prev]");
        const next = rail.querySelector("[data-rail-next]");
        if (!track) return;
        const step = () => Math.max(track.clientWidth * 0.8, 320);
        prev && prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
        next && next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    });
}

function bindNavbar() {
    const nav = document.getElementById("navbar");
    const onScroll = () => {
        if (!nav) return;
        if (window.scrollY > 30) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = document.getElementById("mobileToggle");
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
        toggle.addEventListener("click", () => links.classList.toggle("open"));
    }
}

function rotateHero() {
    const badgeEl = document.getElementById("heroBadge");
    const titleEl = document.getElementById("heroTitle");
    const taglineEl = document.getElementById("heroTagline");
    const ratingEl = document.getElementById("heroRating");
    const yearEl = document.getElementById("heroYear");
    const seasonsEl = document.getElementById("heroSeasons");
    const genreEl = document.getElementById("heroGenre");
    const descEl = document.getElementById("heroDesc");
    const bgEl = document.getElementById("heroBg");
    const actionsEl = document.getElementById("heroActions");
    if (!bgEl) return;

    const buildActions = (h) => {
        const addedLabel = MyList.has(h.id) ? "Listemde" : "Listeme Ekle";
        const addedIcon = MyList.has(h.id) ? "check" : "plus";
        if (h.soon) {
            // Upcoming series (Sikkolik: Devamı) — just "Yakında", no info block
            return `
                <button class="btn btn-locked" data-testid="hero-soon-btn">
                    <i class="fa-regular fa-clock"></i> Yakında
                </button>
                <button class="btn btn-ghost" data-hero-list="${h.id || ''}" data-testid="hero-list-btn">
                    <i class="fa-solid fa-${addedIcon}"></i> ${addedLabel}
                </button>`;
        }
        // Released — first episode is live, link straight to it
        return `
            <a href="./player.html?ep=1" class="btn btn-primary" data-testid="hero-play-btn">
                <i class="fa-solid fa-play"></i> İzle
            </a>
            <button class="btn btn-ghost" data-hero-list="${h.id || ''}" data-testid="hero-list-btn">
                <i class="fa-solid fa-${addedIcon}"></i> ${addedLabel}
            </button>
            <button class="btn btn-ghost" id="heroInfoBtn" data-id="${h.id || ''}" data-testid="hero-info-btn">
                <i class="fa-solid fa-circle-info"></i> Daha Fazla Bilgi
            </button>`;
    };

    let i = 0;
    const apply = () => {
        const h = HERO_POOL[i % HERO_POOL.length];
        if (titleEl) titleEl.style.opacity = 0;
        if (taglineEl) taglineEl.style.opacity = 0;
        if (descEl) descEl.style.opacity = 0;
        bgEl.style.opacity = 0.4;
        setTimeout(() => {
            if (badgeEl) {
                badgeEl.innerHTML = `<span class="pulse"></span> ${h.badge || "ÖNE ÇIKAN"}`;
            }
            // Title intentionally blank — cover image carries the title
            if (titleEl) titleEl.textContent = h.title || "";
            if (titleEl) titleEl.style.display = h.title ? "block" : "none";
            if (taglineEl) taglineEl.textContent = h.tagline || "";
            if (ratingEl) ratingEl.parentElement && (ratingEl.parentElement.style.display = "none");
            if (yearEl) yearEl.textContent = h.year || "2026";
            if (seasonsEl) { seasonsEl.textContent = h.seasons || ""; seasonsEl.style.display = h.seasons ? "" : "none"; }
            if (genreEl) genreEl.textContent = h.genre || "";
            if (descEl) descEl.textContent = h.desc;
            // Rotate cover artwork for this hero (e.g. Sikkolik alt cover swap)
            const cover = h.covers ? h.covers[i % h.covers.length] : { bg: h.bg, bgPosition: h.bgPosition };
            bgEl.style.backgroundImage = `url(${cover.bg})`;
            bgEl.style.backgroundPosition = cover.bgPosition || "center";
            if (actionsEl) actionsEl.innerHTML = buildActions(h);
            if (titleEl) titleEl.style.transition = "opacity 0.6s ease";
            if (taglineEl) taglineEl.style.transition = "opacity 0.6s ease";
            if (descEl) descEl.style.transition = "opacity 0.6s ease";
            bgEl.style.transition = "opacity 1.2s ease, background-image 1.2s ease";
            if (titleEl) titleEl.style.opacity = 1;
            if (taglineEl) taglineEl.style.opacity = 1;
            if (descEl) descEl.style.opacity = 1;
            bgEl.style.opacity = 1;

            const infoBtn = document.getElementById("heroInfoBtn");
            if (infoBtn && h.id) {
                infoBtn.addEventListener("click", () => openDetail(h.id));
            }
        }, 280);
        i++;
    };
    apply();
    setInterval(apply, 9000);
}

// ---------------------------------------------------------------
// Detail Modal
// ---------------------------------------------------------------
function openDetail(id) {
    const data = SERIES_DETAILS[id];
    if (!data) return;
    const modal = document.getElementById("detailModal");
    if (!modal) return;

    modal.setAttribute("data-current-id", id);
    const heroEl = document.getElementById("modalHero");
    heroEl.style.backgroundImage = `url(${data.hero})`;
    heroEl.style.backgroundPosition = data.heroPosition || "center top";
    document.getElementById("modalBadge").textContent = data.badge;
    document.getElementById("modalTitle").textContent = data.title;
    document.getElementById("modalTagline").textContent = data.tagline;
    document.getElementById("modalMatch").textContent = data.match;
    document.getElementById("modalYear").textContent = data.year;
    document.getElementById("modalAge").textContent = data.age;
    document.getElementById("modalSeasons").textContent = data.seasons;
    document.getElementById("modalDesc").textContent = data.desc;
    document.getElementById("modalStatus").innerHTML = data.soon
        ? `<i class="fa-solid fa-check"></i><span>${data.status}</span>`
        : "";
    document.getElementById("modalCast").textContent = data.cast;
    document.getElementById("modalGenres").textContent = data.genres;

    // Update add button icon based on list state
    const addBtn = document.querySelector('[data-testid="modal-add-btn"]');
    if (addBtn) {
        const has = MyList.has(id);
        const icon = addBtn.querySelector("i");
        if (icon) icon.className = `fa-solid fa-${has ? 'check' : 'plus'}`;
    }

    // Render characters
    const grid = document.getElementById("characterGrid");
    if (grid && data.characters) {
        grid.innerHTML = data.characters.map((c) => `
            <div class="character-card" data-testid="char-${c.name.toLowerCase()}">
                <div class="character-img" style="background-image:url(${c.img}); background-position:${c.position || 'center'}; background-size:${c.size || 'cover'}"></div>
                <div class="character-info">
                    <div class="character-name">${c.name}</div>
                    <div class="character-trait">${c.trait}</div>
                </div>
            </div>
        `).join("");
    }

    // Minimal-mode modal (upcoming series — only show "Yakında")
    const minimal = !!data.minimal;
    const hideIfMinimal = (sel) => {
        const el = modal.querySelector(sel);
        if (el) el.style.display = minimal ? "none" : "";
    };
    [
        ".modal-tagline", ".modal-meta-row", ".modal-desc",
        ".modal-info-grid", ".character-grid",
        '[data-testid="modal-add-btn"]', '[data-testid="modal-list-btn"]'
    ].forEach(hideIfMinimal);
    // Hide character section header too
    const charHeader = modal.querySelector(".section-title-characters, [data-testid='char-section-title']");
    if (charHeader) charHeader.style.display = minimal ? "none" : "";
    if (grid) grid.style.display = minimal ? "none" : "";

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeDetail() {
    const modal = document.getElementById("detailModal");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
}

function refreshMyListUI(id) {
    // Update card list buttons
    $$(`[data-list-toggle="${id}"]`).forEach((btn) => {
        const has = MyList.has(id);
        btn.classList.toggle("active", has);
        const icon = btn.querySelector("i");
        if (icon) icon.className = `fa-solid fa-${has ? 'check' : 'plus'}`;
        const card = btn.closest(".card");
        if (card) card.classList.toggle("in-list", has);
    });
    // Update hero list button
    $$(`[data-hero-list="${id}"]`).forEach((btn) => {
        const has = MyList.has(id);
        btn.innerHTML = `<i class="fa-solid fa-${has ? 'check' : 'plus'}"></i> ${has ? "Listemde" : "Listeme Ekle"}`;
    });
    // Update navbar list count badge
    const badge = document.getElementById("listCountBadge");
    if (badge) {
        const c = MyList.count();
        badge.textContent = c > 0 ? c : "";
        badge.style.display = c > 0 ? "inline-flex" : "none";
    }
    // Re-render My List rail if visible
    renderMyListRail();
}

function renderMyListRail() {
    const rail = document.getElementById("rail-mylist");
    if (!rail) return;
    const ids = MyList.all();
    const items = ids.map((id) => ALL_ITEMS_BY_ID[id]).filter(Boolean);
    renderRail("rail-mylist", items);
    // Show/hide the entire section
    const section = document.getElementById("section-mylist");
    if (section) {
        section.style.display = items.length > 0 ? "" : "none";
    }
}

function bindModal() {
    const modal = document.getElementById("detailModal");
    const closeBtn = document.getElementById("modalClose");
    if (closeBtn) closeBtn.addEventListener("click", closeDetail);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeDetail();
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeDetail();
            closeSearch();
        }
    });

    // Global click delegation
    document.addEventListener("click", (e) => {
        // List toggle on card
        const listBtn = e.target.closest("[data-list-toggle]");
        if (listBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = listBtn.getAttribute("data-list-toggle");
            const nowIn = MyList.toggle(id);
            const item = ALL_ITEMS_BY_ID[id];
            const t = item ? item.title : id;
            showToast(nowIn ? `${t} listene eklendi` : `${t} listenden çıkarıldı`, nowIn ? "success" : "info");
            refreshMyListUI(id);
            return;
        }
        // Hero list button
        const heroListBtn = e.target.closest("[data-hero-list]");
        if (heroListBtn) {
            e.preventDefault();
            const id = heroListBtn.getAttribute("data-hero-list");
            const nowIn = MyList.toggle(id);
            const item = ALL_ITEMS_BY_ID[id];
            const t = item ? item.title : id;
            showToast(nowIn ? `${t} listene eklendi` : `${t} listenden çıkarıldı`, nowIn ? "success" : "info");
            refreshMyListUI(id);
            return;
        }
        // Card click → open detail modal
        const card = e.target.closest(".card");
        if (!card) return;
        const id = card.getAttribute("data-id");
        if (id && SERIES_DETAILS[id]) {
            e.preventDefault();
            openDetail(id);
        }
    });

    // Modal list / play / like buttons
    const modalAddBtn = document.querySelector('[data-testid="modal-add-btn"]');
    if (modalAddBtn) {
        modalAddBtn.addEventListener("click", () => {
            const id = modal && modal.getAttribute("data-current-id");
            if (!id) return;
            const nowIn = MyList.toggle(id);
            const item = ALL_ITEMS_BY_ID[id];
            const t = item ? item.title : id;
            showToast(nowIn ? `${t} listene eklendi` : `${t} listenden çıkarıldı`, nowIn ? "success" : "info");
            refreshMyListUI(id);
            const icon = modalAddBtn.querySelector("i");
            if (icon) icon.className = `fa-solid fa-${nowIn ? 'check' : 'plus'}`;
        });
    }
}

// ---------------------------------------------------------------
// Search Modal
// ---------------------------------------------------------------
function openSearch() {
    const overlay = document.getElementById("searchOverlay");
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    const input = document.getElementById("searchInput");
    if (input) {
        input.value = "";
        runSearch("");
        setTimeout(() => input.focus(), 150);
    }
}

function closeSearch() {
    const overlay = document.getElementById("searchOverlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
}

function runSearch(query) {
    const results = document.getElementById("searchResults");
    if (!results) return;
    const q = (query || "").toLowerCase().trim();
    const allItems = Object.values(ALL_ITEMS_BY_ID);
    const filtered = q
        ? allItems.filter((it) =>
            it.title.toLowerCase().includes(q) ||
            (it.genre || "").toLowerCase().includes(q)
          )
        : allItems;
    if (filtered.length === 0) {
        results.innerHTML = `<div class="search-empty" data-testid="search-empty">
            <i class="fa-regular fa-face-frown"></i>
            <p>"${query}" için sonuç bulunamadı.</p>
        </div>`;
        return;
    }
    results.innerHTML = filtered.map((item) => `
        <a class="search-result" href="#${item.id}" data-id="${item.id}" data-testid="search-result-${item.id}">
            <div class="search-result-thumb" style="background-image:url(${item.poster})"></div>
            <div class="search-result-info">
                <h4>${item.title}</h4>
                <div class="search-result-meta">${item.genre} · ${item.year} · ${item.episodes} Bölüm</div>
                ${item.rating ? `<div class="search-result-rating"><i class="fa-solid fa-star"></i> ${item.rating}</div>` : ""}
            </div>
        </a>
    `).join("");
    // Bind clicks
    results.querySelectorAll(".search-result").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            const id = el.getAttribute("data-id");
            closeSearch();
            setTimeout(() => openDetail(id), 250);
        });
    });
}

function bindSearch() {
    const input = document.getElementById("searchInput");
    const closeBtn = document.getElementById("searchClose");
    const overlay = document.getElementById("searchOverlay");
    if (input) {
        input.addEventListener("input", (e) => runSearch(e.target.value));
    }
    if (closeBtn) closeBtn.addEventListener("click", closeSearch);
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeSearch();
        });
    }
    // Search trigger buttons
    $$('[data-search-trigger]').forEach((btn) => {
        btn.addEventListener("click", openSearch);
    });
    // Keyboard shortcut: '/' or 'Ctrl+K'
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            openSearch();
        }
    });
}

// ---------------------------------------------------------------
// Init Home
// ---------------------------------------------------------------
function initHome() {
    if (!document.getElementById("rail-originals")) return;

    renderRail("rail-continue", RAIL_CONTINUE);
    renderRail("rail-originals", RAIL_ORIGINALS);
    renderRail("rail-coming-soon", RAIL_COMING_SOON);
    renderEpisodeRail("rail-episodes");
    renderMyListRail();

    bindRailNav();
    bindNavbar();
    bindModal();
    bindSearch();
    rotateHero();

    // Update list count badge initially
    refreshMyListUI("");
}

// ---------------------------------------------------------------
// Init Player — uses Sikkolik episode previews
// ---------------------------------------------------------------
const EPISODES = EPISODE_PREVIEWS;

const RECOMMENDATIONS = [
    { id: "sikkolik-devami", title: "Sikkolik: Devamı İçin Yakında", tags: "Suç · Mistik", poster: ASSETS.sikkolikSoon },
    { id: "sikkolik", title: "Sikkolik: The New Era", tags: "Suç · Dram", poster: ASSETS.sikkolikAlt }
];

function buildEpisode(ep, isActive) {
    return `
        <div class="episode-item ${isActive ? "active" : ""}" data-testid="episode-${ep.num}" data-ep-num="${ep.num}">
            <div class="ep-num">${String(ep.num).padStart(2, "0")}</div>
            <div class="ep-thumb" style="background-image:url(${ASSETS.episodeGrid}); background-position:${ep.gridPos}; background-size:400% 200%"></div>
            <div class="ep-info">
                <h4>${ep.title}</h4>
                <p>${ep.desc}</p>
            </div>
            <div class="ep-duration">${ep.duration}</div>
        </div>
    `;
}

function buildRec(rec) {
    const slug = (rec.id || rec.title.replace(/\s+/g, "-").toLowerCase());
    return `
        <a href="#${slug}" class="rec-item" data-rec-id="${rec.id || ''}" data-testid="rec-${slug}">
            <div class="rec-thumb" style="background-image:url(${rec.poster})"></div>
            <div class="rec-meta">
                <h5>${rec.title}</h5>
                <div class="rec-tags">${rec.tags}</div>
                ${rec.rating ? `<div class="rec-rating"><i class="fa-solid fa-star"></i> ${rec.rating}</div>` : ""}
            </div>
        </a>
    `;
}

function initPlayer() {
    const epList = document.getElementById("episodesList");
    if (!epList) return;

    // Determine active episode from query
    const params = new URLSearchParams(window.location.search);
    const requestedEp = parseInt(params.get("ep")) || 1;
    epList.innerHTML = EPISODES.map((ep) => buildEpisode(ep, ep.num === requestedEp)).join("");
    epList.addEventListener("click", (e) => {
        const item = e.target.closest(".episode-item");
        if (!item) return;
        $$(".episode-item").forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
    });

    const recList = document.getElementById("recList");
    if (recList) {
        recList.innerHTML = RECOMMENDATIONS.map(buildRec).join("");
        recList.addEventListener("click", (e) => {
            const rec = e.target.closest(".rec-item");
            if (!rec) return;
            e.preventDefault();
            const id = rec.getAttribute("data-rec-id");
            if (id) window.location.href = `/#${id}`;
        });
    }

    // Update player title to current episode
    const ep = EPISODES.find((e) => e.num === requestedEp) || EPISODES[0];
    const titleEl = document.getElementById("playerTitle");
    if (titleEl) titleEl.textContent = `Sikkolik · ${ep.num}. Bölüm: ${ep.title}`;

    // Swap video source per-episode if videoUrl provided
    const vidEl = document.getElementById("playerVideo");
    if (vidEl && ep.videoUrl) {
        const src = vidEl.querySelector("source");
        if (src) src.src = ep.videoUrl;
        vidEl.load();
    }

    // ===== IMDb-style user rating widget =====
    const rateBox = document.getElementById("rateBox");
    const rateStars = document.getElementById("rateStars");
    const rateStatus = document.getElementById("rateStatus");
    const tag = document.getElementById("epRatingTag");
    const tagVal = document.getElementById("epRatingValue");
    const tagCount = document.getElementById("epRatingCount");

    const applyRating = (r) => {
        if (r && tag) {
            tag.style.display = "";
            tagVal.textContent = r.avg.toFixed(1);
            tagCount.textContent = `(${r.count} oy)`;
        } else if (tag) {
            tag.style.display = "none";
        }
        if (rateStatus) {
            rateStatus.textContent = r && r.mine
                ? `Senin puanın: ${r.mine}/10 · Ortalama ${r.avg.toFixed(1)} (${r.count} oy)`
                : "Henüz puan yok — ilk sen oyla.";
        }
        if (rateStars) {
            const mine = r && r.mine ? r.mine : 0;
            [...rateStars.children].forEach((b, i) => {
                b.classList.toggle("filled", i < mine);
            });
        }
    };

    const refreshRating = async () => {
        const r = await Ratings.fetch(ep.num);
        applyRating(r);
    };

    if (rateBox) {
        if (!ep.released) {
            rateBox.style.display = "none";
        } else if (rateStars) {
            rateStars.innerHTML = Array.from({ length: 10 }, (_, i) =>
                `<button type="button" class="rate-star" data-score="${i + 1}" aria-label="${i + 1} puan"><i class="fa-solid fa-star"></i></button>`
            ).join("");
            rateStars.addEventListener("click", async (e) => {
                const btn = e.target.closest(".rate-star");
                if (!btn) return;
                const r = await Ratings.submit(ep.num, parseInt(btn.dataset.score, 10));
                if (r) {
                    applyRating(r);
                    if (typeof showToast === "function") showToast("Oyun kaydedildi");
                } else if (typeof showToast === "function") {
                    showToast("Oy gönderilemedi", "error");
                }
            });
            refreshRating();
        }
    }

    // Player controls
    const playBtn = document.getElementById("playToggle");
    const centerPlay = document.getElementById("centerPlay");
    const video = document.getElementById("playerVideo");
    const poster = document.getElementById("playerPoster");

    const togglePlay = () => {
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => {});
            if (poster) poster.style.opacity = 0;
            if (centerPlay) centerPlay.style.display = "none";
            playBtn && (playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>');
        } else {
            video.pause();
            if (centerPlay) centerPlay.style.display = "flex";
            playBtn && (playBtn.innerHTML = '<i class="fa-solid fa-play"></i>');
        }
    };
    playBtn && playBtn.addEventListener("click", togglePlay);
    centerPlay && centerPlay.addEventListener("click", togglePlay);

    const muteBtn = document.getElementById("muteToggle");
    muteBtn && muteBtn.addEventListener("click", () => {
        if (!video) return;
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted
            ? '<i class="fa-solid fa-volume-xmark"></i>'
            : '<i class="fa-solid fa-volume-high"></i>';
    });

    const fsBtn = document.getElementById("fsToggle");
    fsBtn && fsBtn.addEventListener("click", () => {
        const frame = document.querySelector(".player-frame");
        if (!frame) return;
        if (!document.fullscreenElement) frame.requestFullscreen?.();
        else document.exitFullscreen?.();
    });

    if (video) {
        const fill = document.getElementById("progressFill");
        const current = document.getElementById("timeCurrent");
        const total = document.getElementById("timeTotal");
        const bar = document.getElementById("progressBar");

        const fmt = (s) => {
            if (!isFinite(s)) return "0:00";
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60).toString().padStart(2, "0");
            return `${m}:${sec}`;
        };

        video.addEventListener("loadedmetadata", () => {
            if (total) total.textContent = fmt(video.duration);
        });
        video.addEventListener("timeupdate", () => {
            if (!video.duration) return;
            const pct = (video.currentTime / video.duration) * 100;
            if (fill) fill.style.width = pct + "%";
            if (current) current.textContent = fmt(video.currentTime);
        });
        bar && bar.addEventListener("click", (e) => {
            if (!video.duration) return;
            const rect = bar.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            video.currentTime = ratio * video.duration;
        });
    }

    bindNavbar();
    bindSearch();
}

// ---------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initHome();
    initPlayer();
});
