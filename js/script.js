/* ==========================================================================
   CineVerse – Shared JavaScript
   --------------------------------------------------------------------------
   One script runs on every page. It checks <body data-page="..."> and only
   starts the features that page needs.

   CONTENTS
   1.  Configuration
   2.  Icons (inline SVG strings used inside generated cards)
   3.  Small helper functions
   4.  Card templates (build HTML from a movie object)
   5.  Filtering & sorting (shared by Movies and Now Showing)
   6.  Navigation bar & mobile menu
   7.  Hero carousel (homepage)
   8.  Horizontal row controls
   9.  Movie details dialog
   10. Scroll reveal animation
   11. Page: Homepage
   12. Page: Movies
   13. Page: Now Showing
   14. Page: Placeholder (booking / login / info pages)
   15. Start-up
   ========================================================================== */

/* 1. CONFIGURATION ======================================================= */

/* Change these two links when the group's real pages are ready. */
const BOOKING_PAGE = "placeholder.html?page=booking";
const LOGIN_PAGE = "placeholder.html?page=login";

/* The eight genres used for filters and genre cards. */
const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Horror", "Sci-Fi", "Animation", "Thriller"];

/* Movies featured in the homepage hero carousel (ids from js/movies.js). */
const HERO_MOVIE_IDS = [
  "project-hail-mary",
  "the-hunger-games-sunrise-on-the-reaping",
  "avatar-fire-and-ash",
  "dune-part-three"
];

/* Movie featured at the top of the Now Showing page. */
const FEATURED_NOW_SHOWING_ID = "the-hunger-games-sunrise-on-the-reaping";

/* Background image used for each genre card. */
const GENRE_IMAGES = {
  Action: "shelter",
  Adventure: "wildwood",
  Comedy: "focker-in-law",
  Drama: "hamnet",
  Horror: "scream-7",
  "Sci-Fi": "project-hail-mary",
  Animation: "hoppers",
  Thriller: "one-battle-after-another"
};

/* 2. ICONS =============================================================== */
const ICONS = {
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/></svg>'
};

/* 3. HELPER FUNCTIONS ==================================================== */

/* Shorthand for querySelector / querySelectorAll. */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* Find one movie by its id. */
function getMovieById(id) {
  return MOVIES.find((movie) => movie.id === id);
}

/* Return every movie with the given status, e.g. "now-showing". */
function getMoviesByStatus(status) {
  return MOVIES.filter((movie) => movie.status === status);
}

/* 157 -> "2h 37m" */
function formatRuntime(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

/* "2026-12-16" -> "16 Dec 2026" */
function formatDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* Days from today until a release date (0 when already released). */
function daysUntil(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const release = new Date(isoDate + "T00:00:00");
  return Math.max(0, Math.round((release - today) / 86400000));
}

/* First two genres joined, e.g. "Sci-Fi / Adventure". */
function genreLabel(movie, count = 2) {
  return movie.genres.slice(0, count).join(" / ");
}

/* Star rating markup, or "TBA" for unreleased movies. */
function ratingHTML(movie) {
  if (movie.rating === null) return '<span class="rating rating--tba">Rating TBA</span>';
  return `<span class="rating" aria-label="Rated ${movie.rating} out of 10">${ICONS.star}${movie.rating.toFixed(1)}</span>`;
}

function bookingUrl(movie) {
  return `${BOOKING_PAGE}&movie=${encodeURIComponent(movie.id)}`;
}

/* Opens a YouTube search for the official trailer in a new tab. */
function trailerUrl(movie) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " official trailer")}`;
}

/* Protects generated HTML from special characters in user input. */
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* 4. CARD TEMPLATES ====================================================== */

/* Standard poster card used for Trending and the Movies catalogue. */
function createMovieCard(movie) {
  const isShowing = movie.status === "now-showing";
  const isUpcoming = movie.status === "coming-soon";
  let badge = "";
  if (isShowing) badge = '<span class="pill pill--cyan pill--dark movie-card__badge">Now Showing</span>';
  if (isUpcoming) badge = '<span class="pill pill--primary pill--dark movie-card__badge">Coming Soon</span>';

  return `
    <article class="movie-card">
      <div class="movie-card__poster">
        ${badge}
        <img src="${movie.poster}" alt="${escapeHTML(movie.title)} poster" loading="lazy" width="500" height="750">
      </div>
      <div class="movie-card__body">
        <h3 class="movie-card__title" title="${escapeHTML(movie.title)}">${movie.title}</h3>
        <div class="movie-card__meta">
          <span class="movie-card__genre">${genreLabel(movie)}</span>
          <span class="dot" aria-hidden="true"></span>
          <span>${movie.year}</span>
        </div>
        ${ratingHTML(movie)}
        <div class="movie-card__actions">
          <button type="button" class="btn btn--ghost btn--sm" data-details="${movie.id}">View Details</button>
          ${isShowing ? `<a class="btn btn--primary btn--sm" href="${bookingUrl(movie)}">Book Now</a>` : ""}
        </div>
      </div>
    </article>`;
}

/* Action-focused card for currently showing movies. */
function createShowingCard(movie) {
  return `
    <article class="movie-card">
      <div class="movie-card__poster">
        <span class="movie-card__rating-badge">${ratingHTML(movie)}</span>
        <img src="${movie.poster}" alt="${escapeHTML(movie.title)} poster" loading="lazy" width="500" height="750">
      </div>
      <div class="movie-card__body">
        <h3 class="movie-card__title" title="${escapeHTML(movie.title)}">${movie.title}</h3>
        <div class="movie-card__meta">
          <span class="movie-card__genre">${genreLabel(movie)}</span>
          ${movie.runtime ? `<span class="dot" aria-hidden="true"></span><span>${formatRuntime(movie.runtime)}</span>` : ""}
        </div>
        <div class="movie-card__actions">
          <button type="button" class="btn btn--ghost btn--sm" data-details="${movie.id}" aria-label="Details for ${escapeHTML(movie.title)}">Details</button>
          <a class="btn btn--primary btn--sm" href="${bookingUrl(movie)}">${ICONS.ticket}Book Tickets</a>
        </div>
      </div>
    </article>`;
}

/* Wide card for upcoming releases. */
function createUpcomingCard(movie) {
  const days = daysUntil(movie.releaseDate);
  return `
    <article class="upcoming-card">
      <img class="upcoming-card__bg" src="${movie.backdrop}" alt="" loading="lazy">
      <div class="upcoming-card__poster">
        <img src="${movie.poster}" alt="${escapeHTML(movie.title)} poster" loading="lazy" width="500" height="750">
      </div>
      <div class="upcoming-card__body">
        <span class="upcoming-card__date">${ICONS.calendar}${formatDate(movie.releaseDate)}</span>
        <h3 class="upcoming-card__title">${movie.title}</h3>
        <div class="upcoming-card__genres">${movie.genres.slice(0, 3).map((g) => `<span class="tag">${g}</span>`).join("")}</div>
        <p class="upcoming-card__desc">${movie.overview}</p>
        ${days > 0 ? `<span class="countdown">In cinemas in ${days} day${days === 1 ? "" : "s"}</span>` : ""}
        <button type="button" class="btn btn--secondary btn--sm" data-details="${movie.id}">View Details</button>
      </div>
    </article>`;
}

/* Clickable genre tile that opens the Movies page pre-filtered. */
function createGenreCard(genre) {
  const count = MOVIES.filter((movie) => movie.genres.includes(genre)).length;
  const image = getMovieById(GENRE_IMAGES[genre]);
  return `
    <a class="genre-card" href="movies.html?genre=${encodeURIComponent(genre)}">
      <img src="${image.backdrop}" alt="" loading="lazy">
      <span class="genre-card__name">${genre}<span class="genre-card__count">${count} movies</span></span>
      <span class="genre-card__arrow" aria-hidden="true">${ICONS.arrow}</span>
    </a>`;
}

/* 5. FILTERING & SORTING ================================================= */

/*
  filterMovies(list, criteria)
  Returns only the movies that match ALL active criteria, so search and
  genre (and rating / year) always work together.
    criteria.search    – text to look for in the title
    criteria.genre     – "All" or a genre name
    criteria.minRating – 0 for any rating
    criteria.year      – "All" or a year as a string
*/
function filterMovies(list, criteria) {
  const search = (criteria.search || "").trim().toLowerCase();
  return list.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search);
    const matchesGenre = !criteria.genre || criteria.genre === "All" || movie.genres.includes(criteria.genre);
    const matchesRating = !criteria.minRating || (movie.rating || 0) >= criteria.minRating;
    const matchesYear = !criteria.year || criteria.year === "All" || String(movie.year) === criteria.year;
    return matchesSearch && matchesGenre && matchesRating && matchesYear;
  });
}

/* Returns a new sorted array (the original array is not changed). */
function sortMovies(list, sortKey) {
  const sorted = [...list];
  switch (sortKey) {
    case "rating-desc":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "rating-asc":
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
      return sorted.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    default:
      return sorted; // "featured" keeps the order from movies.js
  }
}

/* Builds genre filter buttons inside a container. */
function renderGenreChips(container, genres, activeGenre) {
  container.innerHTML = ["All", ...genres]
    .map((genre) => `<button type="button" class="chip${genre === activeGenre ? " is-active" : ""}" data-genre="${genre}" aria-pressed="${genre === activeGenre}">${genre}</button>`)
    .join("");
}

/* Highlights the selected chip. */
function setActiveChip(container, genre) {
  $$(".chip", container).forEach((chip) => {
    const active = chip.dataset.genre === genre;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", active);
  });
}

/* 6. NAVIGATION BAR ====================================================== */
function initNavbar() {
  const navbar = $(".navbar");
  const toggle = $(".nav-toggle");
  const menu = $("#mobile-menu");
  if (!navbar || !toggle || !menu) return;

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
  }

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));

  // Close the menu after choosing a link, pressing Escape or widening the window.
  $$("a", menu).forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) setMenu(false);
  });

  // Stronger shadow once the page is scrolled.
  const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Fill every navbar search box with the current ?search= value.
  const query = new URLSearchParams(window.location.search).get("search");
  if (query) $$('.nav-search input[name="search"]').forEach((input) => (input.value = query));

  // Login / Sign Up buttons lead to the configured login page.
  $$("[data-login]").forEach((link) => link.setAttribute("href", LOGIN_PAGE));
}

/* 7. HERO CAROUSEL ======================================================= */
function initHeroCarousel() {
  const hero = $("#hero");
  if (!hero) return;

  const movies = HERO_MOVIE_IDS.map(getMovieById).filter(Boolean);
  const slidesWrap = $(".hero__slides", hero);
  const dotsWrap = $(".hero__dots", hero);

  slidesWrap.innerHTML = movies.map((movie, index) => {
    const label = movie.status === "coming-soon" ? "Coming Soon" : movie.status === "now-showing" ? "Now Showing" : "Featured Movie";
    const isShowing = movie.status === "now-showing";
    return `
      <div class="hero__slide${index === 0 ? " is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${movies.length}: ${escapeHTML(movie.title)}" ${index === 0 ? "" : 'aria-hidden="true"'}>
        <img class="hero__bg" src="${movie.backdrop}" alt="Scene from ${escapeHTML(movie.title)}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
        <div class="hero__overlay"></div>
        <div class="container">
          <div class="hero__content">
            <span class="hero__label">${label}</span>
            <h${index === 0 ? 1 : 2} class="hero__title">${movie.title}</h${index === 0 ? 1 : 2}>
            <div class="hero__meta">
              ${ratingHTML(movie)}
              <span class="dot" aria-hidden="true"></span>
              <span>${movie.status === "coming-soon" ? formatDate(movie.releaseDate) : movie.year}</span>
              <span class="dot" aria-hidden="true"></span>
              <span>${genreLabel(movie, 3)}</span>
              ${movie.runtime ? `<span class="dot" aria-hidden="true"></span><span>${formatRuntime(movie.runtime)}</span>` : ""}
            </div>
            <p class="hero__desc">${movie.overview}</p>
            <div class="hero__actions">
              ${isShowing
                ? `<a class="btn btn--primary" href="${bookingUrl(movie)}">${ICONS.ticket}Book Tickets</a>`
                : `<a class="btn btn--primary" href="movies.html">${ICONS.compass}Explore Movies</a>`}
              <a class="btn btn--secondary" href="${trailerUrl(movie)}" target="_blank" rel="noopener">${ICONS.play}Watch Trailer</a>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");

  dotsWrap.innerHTML = movies
    .map((movie, index) => `<button type="button" class="hero__dot${index === 0 ? " is-active" : ""}" aria-label="Show ${escapeHTML(movie.title)}"${index === 0 ? ' aria-current="true"' : ""}></button>`)
    .join("");

  const slides = $$(".hero__slide", hero);
  const dots = $$(".hero__dot", hero);
  let current = 0;
  let timer = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Show slide number `index`, wrapping around at both ends. */
  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.toggleAttribute("aria-hidden", i !== current);
      $$("a, button", slide).forEach((el) => (el.tabIndex = i === current ? 0 : -1));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
      if (i === current) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function start() {
    if (reduceMotion) return;
    stop();
    timer = setInterval(() => goTo(current + 1), 7000);
  }
  function stop() {
    clearInterval(timer);
  }

  $(".hero__prev", hero).addEventListener("click", () => { goTo(current - 1); start(); });
  $(".hero__next", hero).addEventListener("click", () => { goTo(current + 1); start(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { goTo(i); start(); }));

  // Pause while the user is hovering or using the keyboard inside the hero.
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);
  hero.addEventListener("focusin", stop);
  hero.addEventListener("focusout", start);

  goTo(0);
  start();
}

/* 8. HORIZONTAL ROW CONTROLS ============================================= */
/* Prev / next buttons scroll a row by one "page" of cards. */
function initRowControls(row, prevBtn, nextBtn) {
  if (!row || !prevBtn || !nextBtn) return;
  const update = () => {
    prevBtn.disabled = row.scrollLeft <= 4;
    nextBtn.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
  };
  prevBtn.addEventListener("click", () => row.scrollBy({ left: -row.clientWidth, behavior: "smooth" }));
  nextBtn.addEventListener("click", () => row.scrollBy({ left: row.clientWidth, behavior: "smooth" }));
  row.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* 9. MOVIE DETAILS DIALOG ================================================ */
/*
  Any element with data-details="movie-id" opens this dialog.
  One click listener on the document handles every card (event delegation),
  so cards added later by filtering work automatically.
*/
function initDetailsDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "movie-dialog";
  dialog.setAttribute("aria-labelledby", "dialog-title");
  document.body.appendChild(dialog);

  function open(movie) {
    const isShowing = movie.status === "now-showing";
    const statusPill = isShowing
      ? '<span class="pill pill--cyan">Now Showing</span>'
      : movie.status === "coming-soon"
        ? `<span class="pill pill--primary">Coming ${formatDate(movie.releaseDate)}</span>`
        : `<span class="pill pill--primary">${movie.year}</span>`;

    dialog.innerHTML = `
      <div class="movie-dialog__hero">
        <img src="${movie.backdrop}" alt="Scene from ${escapeHTML(movie.title)}">
        <button type="button" class="icon-btn movie-dialog__close" aria-label="Close details">${ICONS.close}</button>
      </div>
      <div class="movie-dialog__content">
        <div class="movie-dialog__poster"><img src="${movie.poster}" alt="${escapeHTML(movie.title)} poster"></div>
        <div class="movie-dialog__info">
          ${statusPill}
          <h2 id="dialog-title">${movie.title}</h2>
          <div class="movie-dialog__meta">
            ${ratingHTML(movie)}
            <span>${formatDate(movie.releaseDate)}</span>
            ${movie.runtime ? `<span>${formatRuntime(movie.runtime)}</span>` : ""}
          </div>
          <div class="upcoming-card__genres">${movie.genres.map((g) => `<span class="tag">${g}</span>`).join("")}</div>
          <p>${movie.overview}</p>
          <div class="movie-dialog__actions">
            ${isShowing ? `<a class="btn btn--primary" href="${bookingUrl(movie)}">${ICONS.ticket}Book Tickets</a>` : ""}
            <a class="btn btn--secondary" href="${trailerUrl(movie)}" target="_blank" rel="noopener">${ICONS.play}Watch Trailer</a>
          </div>
        </div>
      </div>`;

    $(".movie-dialog__close", dialog).addEventListener("click", () => dialog.close());
    dialog.showModal();
    document.body.classList.add("no-scroll");
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-details]");
    if (!trigger) return;
    const movie = getMovieById(trigger.dataset.details);
    if (movie) open(movie);
  });

  // Clicking the dark area outside the dialog closes it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => document.body.classList.remove("no-scroll"));
}

/* 10. SCROLL REVEAL ====================================================== */
/* Sections with class "reveal" fade in when they enter the screen. */
function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

/* 11. HOMEPAGE =========================================================== */
function initHomePage() {
  initHeroCarousel();

  const trendingRow = $("#trending-row");
  trendingRow.innerHTML = getMoviesByStatus("trending").map(createMovieCard).join("");
  initRowControls(trendingRow, $("#trending-prev"), $("#trending-next"));

  const nowShowing = sortMovies(getMoviesByStatus("now-showing"), "rating-desc").slice(0, 4);
  $("#now-showing-grid").innerHTML = nowShowing.map(createShowingCard).join("");

  const upcoming = getMoviesByStatus("coming-soon")
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
    .slice(0, 4);
  $("#coming-soon-grid").innerHTML = upcoming.map(createUpcomingCard).join("");

  $("#genre-grid").innerHTML = GENRES.map(createGenreCard).join("");
}

/* 12. MOVIES PAGE ======================================================== */
function initMoviesPage() {
  const params = new URLSearchParams(window.location.search);
  const urlGenre = params.get("genre");

  /* Current filter state – every control updates this, then render() runs. */
  const state = {
    search: params.get("search") || "",
    genre: GENRES.includes(urlGenre) ? urlGenre : "All",
    minRating: 0,
    year: "All",
    sort: "featured"
  };

  const searchInput = $("#movie-search");
  const clearBtn = $("#search-clear");
  const chips = $("#genre-filters");
  const ratingSelect = $("#rating-filter");
  const yearSelect = $("#year-filter");
  const sortSelect = $("#sort-select");
  const grid = $("#movie-grid");
  const empty = $("#empty-state");
  const count = $("#results-count");

  // Build the year dropdown from the data (newest first).
  const years = [...new Set(MOVIES.map((m) => m.year))].sort((a, b) => b - a);
  yearSelect.insertAdjacentHTML("beforeend", years.map((y) => `<option value="${y}">${y}</option>`).join(""));

  renderGenreChips(chips, GENRES, state.genre);
  searchInput.value = state.search;

  /* Keep the address bar in sync so filtered views can be shared/bookmarked. */
  function updateUrl() {
    const next = new URLSearchParams();
    if (state.genre !== "All") next.set("genre", state.genre);
    if (state.search.trim()) next.set("search", state.search.trim());
    const query = next.toString();
    history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  /* Apply filters + sorting and redraw the grid. */
  function render() {
    const results = sortMovies(filterMovies(MOVIES, state), state.sort);
    grid.innerHTML = results.map(createMovieCard).join("");
    empty.hidden = results.length > 0;
    grid.hidden = results.length === 0;
    clearBtn.hidden = state.search.length === 0;

    const active = [];
    if (state.genre !== "All") active.push(state.genre);
    if (state.search.trim()) active.push(`"${escapeHTML(state.search.trim())}"`);
    count.innerHTML = `Showing <strong>${results.length}</strong> of ${MOVIES.length} movies${active.length ? ` for ${active.join(" + ")}` : ""}`;
    updateUrl();
  }

  function resetFilters() {
    Object.assign(state, { search: "", genre: "All", minRating: 0, year: "All", sort: "featured" });
    searchInput.value = "";
    ratingSelect.value = "0";
    yearSelect.value = "All";
    sortSelect.value = "featured";
    setActiveChip(chips, "All");
    render();
  }

  searchInput.addEventListener("input", () => { state.search = searchInput.value; render(); });
  clearBtn.addEventListener("click", () => { state.search = ""; searchInput.value = ""; render(); searchInput.focus(); });
  chips.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    state.genre = chip.dataset.genre;
    setActiveChip(chips, state.genre);
    render();
  });
  ratingSelect.addEventListener("change", () => { state.minRating = Number(ratingSelect.value); render(); });
  yearSelect.addEventListener("change", () => { state.year = yearSelect.value; render(); });
  sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; render(); });
  $$("[data-reset-filters]").forEach((btn) => btn.addEventListener("click", resetFilters));

  // The navbar search on this page filters instantly instead of reloading.
  $$(".nav-search").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = $("input", form).value;
    searchInput.value = state.search;
    render();
    searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }));

  render();
}

/* 13. NOW SHOWING PAGE =================================================== */
function initNowShowingPage() {
  const showing = getMoviesByStatus("now-showing");
  const featured = getMovieById(FEATURED_NOW_SHOWING_ID) || showing[0];

  $("#featured-movie").innerHTML = `
    <img class="featured__bg" src="${featured.backdrop}" alt="">
    <div class="featured__poster"><img src="${featured.poster}" alt="${escapeHTML(featured.title)} poster"></div>
    <div class="featured__body">
      <div class="featured__tags">
        <span class="pill pill--cyan">In Cinemas Now</span>
        ${featured.genres.map((g) => `<span class="tag">${g}</span>`).join("")}
      </div>
      <h2>${featured.title}</h2>
      <div class="hero__meta">
        ${ratingHTML(featured)}
        <span class="dot" aria-hidden="true"></span><span>${featured.year}</span>
        <span class="dot" aria-hidden="true"></span><span>${formatRuntime(featured.runtime)}</span>
      </div>
      <p>${featured.overview}</p>
      <div class="featured__actions">
        <a class="btn btn--primary" href="${bookingUrl(featured)}">${ICONS.ticket}Book Tickets</a>
        <a class="btn btn--secondary" href="${trailerUrl(featured)}" target="_blank" rel="noopener">${ICONS.play}Watch Trailer</a>
      </div>
    </div>`;

  const state = { search: "", genre: "All", sort: "rating-desc" };
  const searchInput = $("#showing-search");
  const clearBtn = $("#search-clear");
  const chips = $("#genre-filters");
  const sortSelect = $("#sort-select");
  const grid = $("#showing-grid");
  const empty = $("#empty-state");
  const count = $("#results-count");

  // Only offer genres that at least one showing movie has.
  const genres = GENRES.filter((g) => showing.some((m) => m.genres.includes(g)));
  renderGenreChips(chips, genres, state.genre);

  function render() {
    const results = sortMovies(filterMovies(showing, state), state.sort);
    grid.innerHTML = results.map(createShowingCard).join("");
    empty.hidden = results.length > 0;
    grid.hidden = results.length === 0;
    clearBtn.hidden = state.search.length === 0;
    count.innerHTML = `<strong>${results.length}</strong> of ${showing.length} movies in cinemas`;
  }

  function resetFilters() {
    Object.assign(state, { search: "", genre: "All", sort: "rating-desc" });
    searchInput.value = "";
    sortSelect.value = "rating-desc";
    setActiveChip(chips, "All");
    render();
  }

  searchInput.addEventListener("input", () => { state.search = searchInput.value; render(); });
  clearBtn.addEventListener("click", () => { state.search = ""; searchInput.value = ""; render(); searchInput.focus(); });
  chips.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    state.genre = chip.dataset.genre;
    setActiveChip(chips, state.genre);
    render();
  });
  sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; render(); });
  $$("[data-reset-filters]").forEach((btn) => btn.addEventListener("click", resetFilters));

  render();
}

/* 14. PLACEHOLDER PAGE =================================================== */
/*
  placeholder.html?page=booking&movie=id  – stand-in for the group's cinema
  selection page. It never claims a ticket has been booked.
*/
const PLACEHOLDER_CONTENT = {
  booking: {
    label: "Booking",
    title: "Cinema Selection",
    text: "This is where the group's cinema and showtime selection page will be connected."
  },
  login: { label: "Account", title: "Login / Sign Up", text: "Account login and registration will be added by another team member." },
  about: { label: "Company", title: "About Us", text: "Learn about CineVerse and our mission to make every movie night memorable. This page is coming soon." },
  contact: { label: "Support", title: "Contact Us", text: "Our contact page is coming soon. For now, reach us at hello@cineverse.example." },
  privacy: { label: "Legal", title: "Privacy Policy", text: "Our privacy policy page is being prepared." },
  terms: { label: "Legal", title: "Terms and Conditions", text: "Our terms and conditions page is being prepared." }
};

function initPlaceholderPage() {
  const params = new URLSearchParams(window.location.search);
  const key = PLACEHOLDER_CONTENT[params.get("page")] ? params.get("page") : "booking";
  const content = PLACEHOLDER_CONTENT[key];
  const movie = getMovieById(params.get("movie"));

  document.title = `${content.title} | CineVerse`;
  $("#placeholder-label").textContent = content.label;
  $("#placeholder-title").textContent = content.title;
  $("#placeholder-text").textContent = content.text;

  if (key === "booking") {
    $("#placeholder-notice").hidden = false;
    if (movie) {
      const box = $("#placeholder-movie");
      box.hidden = false;
      box.innerHTML = `
        <img src="${movie.poster}" alt="${escapeHTML(movie.title)} poster">
        <div>
          <h2>${movie.title}</h2>
          <p>${genreLabel(movie)} &middot; ${formatRuntime(movie.runtime)}</p>
          ${ratingHTML(movie)}
        </div>`;
    }
  }
}

/* 15. START-UP =========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initDetailsDialog();

  const page = document.body.dataset.page;
  if (page === "home") initHomePage();
  if (page === "movies") initMoviesPage();
  if (page === "now-showing") initNowShowingPage();
  if (page === "placeholder") initPlaceholderPage();

  initReveal();

  const year = $("#current-year");
  if (year) year.textContent = new Date().getFullYear();
});
