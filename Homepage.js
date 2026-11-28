/* ==========================================================================
   CINEVERSE HOMEPAGE INTERACTIONS (Vanilla JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. MOVIE CATALOG DATA (Used for details, search, trailer & genre filter)
  // ------------------------------------------------------------------------
  const MOVIES = {
    'chrono-meridian': {
      title: 'Chrono Meridian',
      genre: 'Sci-Fi • Action',
      genres: ['Sci-Fi', 'Action'],
      year: '2026',
      rating: '8.9 / 10',
      status: 'Featured • Now Showing',
      poster: 'images/hero-featured.jpg',
      description:
        'When a deep-space navigator intercepts a fractured time beacon orbiting a dying star, she has forty-eight hours to rewrite humanity’s fate before the meridian collapses.',
      targetBooking: 'booking.html?movie=chrono-meridian',
      targetDetails: 'movie-details.html?movie=chrono-meridian',
      targetTrailer: 'trailer.html?movie=chrono-meridian',
    },
    'neon-protocol': {
      title: 'Neon Protocol',
      genre: 'Sci-Fi • Thriller',
      genres: ['Sci-Fi', 'Thriller'],
      year: '2026',
      rating: '8.8 / 10',
      status: 'Trending This Week',
      poster: 'images/poster-neon-protocol.jpg',
      description:
        'In a rain-drenched cyber metropolis, an ex-intelligence analyst uncovers a rogue neural network rewriting eyewitness memories.',
      targetBooking: 'booking.html?movie=neon-protocol',
      targetDetails: 'movie-details.html?movie=neon-protocol',
    },
    'starlight-drift': {
      title: 'Starlight Drift',
      genre: 'Sci-Fi • Adventure',
      genres: ['Sci-Fi', 'Adventure'],
      year: '2026',
      rating: '8.6 / 10',
      status: 'Trending This Week',
      poster: 'images/poster-starlight-drift.svg',
      description:
        'A lone starship pilot risks a dangerous jump through an unstable violet wormhole to deliver humanity’s last seed vault.',
      targetBooking: 'booking.html?movie=starlight-drift',
      targetDetails: 'movie-details.html?movie=starlight-drift',
    },
    'shadow-requiem': {
      title: 'Shadow Requiem',
      genre: 'Action • Thriller',
      genres: ['Action', 'Thriller'],
      year: '2026',
      rating: '8.4 / 10',
      status: 'Trending This Week',
      poster: 'images/poster-shadow-requiem.svg',
      description:
        'A former covert specialist races across midnight rooftops to stop a city-wide blackout syndicate before dawn.',
      targetBooking: 'booking.html?movie=shadow-requiem',
      targetDetails: 'movie-details.html?movie=shadow-requiem',
    },
    'luminous-vale': {
      title: 'Luminous Vale',
      genre: 'Animation • Adventure',
      genres: ['Animation', 'Adventure'],
      year: '2026',
      rating: '8.7 / 10',
      status: 'Trending This Week',
      poster: 'images/poster-luminous-vale.jpg',
      description:
        'Armed with a living star-crystal, a young cartographer journeys into a bioluminescent forest to restore the valley’s fading light.',
      targetBooking: 'booking.html?movie=luminous-vale',
      targetDetails: 'movie-details.html?movie=luminous-vale',
    },
    'crimson-echo': {
      title: 'Crimson Echo',
      genre: 'Horror • Thriller',
      genres: ['Horror', 'Thriller'],
      year: '2026',
      rating: '8.1 / 10',
      status: 'Trending This Week',
      poster: 'images/poster-crimson-echo.svg',
      description:
        'Audio engineers restoring tapes inside a cliffside observatory awaken an acoustic anomaly that echoes back from the dark.',
      targetBooking: 'booking.html?movie=crimson-echo',
      targetDetails: 'movie-details.html?movie=crimson-echo',
    },
    'velocity-zero': {
      title: 'Velocity Zero',
      genre: 'Action • Sci-Fi',
      genres: ['Action', 'Sci-Fi'],
      year: '2026',
      rating: '8.3 / 10',
      status: 'Trending This Week',
      poster: 'images/poster-velocity-zero.svg',
      description:
        'An underground hypercar courier accepts one final midnight run across elevated neon highways where stopping means capture.',
      targetBooking: 'booking.html?movie=velocity-zero',
      targetDetails: 'movie-details.html?movie=velocity-zero',
    },
    'quantum-heist': {
      title: 'The Quantum Heist',
      genre: 'Sci-Fi • Action',
      genres: ['Sci-Fi', 'Action'],
      year: 'Dec 18, 2026',
      rating: 'Coming Soon',
      status: 'Upcoming Release',
      poster: 'images/poster-quantum-heist.jpg',
      description:
        'An elite team of temporal thieves targets an off-world archive locked inside a folding quantum vault.',
      targetDetails: 'movie-details.html?movie=quantum-heist',
    },
    'arctic-abyss': {
      title: 'Arctic Abyss',
      genre: 'Thriller • Adventure',
      genres: ['Thriller', 'Adventure'],
      year: 'Jan 15, 2027',
      rating: 'Coming Soon',
      status: 'Upcoming Release',
      poster: 'images/poster-arctic-abyss.jpg',
      description:
        'Beneath four miles of polar ice, a research crew awakens a submerged signal older than civilization.',
      targetDetails: 'movie-details.html?movie=arctic-abyss',
    },
    'midnight-encore': {
      title: 'Midnight Encore',
      genre: 'Comedy • Drama',
      genres: ['Comedy', 'Drama'],
      year: 'Feb 05, 2027',
      rating: 'Coming Soon',
      status: 'Upcoming Release',
      poster: 'images/poster-midnight-encore.jpg',
      description:
        'Over one chaotic New Year’s Eve in a rooftop jazz lounge, a washed-up composer gets one last chance at an encore.',
      targetDetails: 'movie-details.html?movie=midnight-encore',
    },
    'astral-horizon': {
      title: 'Astral Horizon',
      genre: 'Adventure • Drama',
      genres: ['Adventure', 'Drama'],
      year: 'Feb 26, 2027',
      rating: 'Coming Soon',
      status: 'Upcoming Release',
      poster: 'images/poster-starlight-drift.svg',
      description:
        'Two estranged siblings chart a one-way voyage across the outer rim to rescue a lost colony ship.',
      targetDetails: 'movie-details.html?movie=astral-horizon',
    },
  };

  // ------------------------------------------------------------------------
  // 2. DOM REFERENCES
  // ------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchPanel = document.getElementById('search-bar-panel');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('movie-search-input');
  const searchResults = document.getElementById('search-results');

  const trendingCarousel = document.getElementById('trending-carousel');
  const trendingPrevBtn = document.getElementById('trending-prev-btn');
  const trendingNextBtn = document.getElementById('trending-next-btn');

  const genreCards = document.querySelectorAll('.genre-card');
  const genreFeedback = document.getElementById('genre-feedback');

  const infoModal = document.getElementById('info-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  let lastFocusedElement = null;

  // ------------------------------------------------------------------------
  // 3. STICKY HEADER & ACTIVE NAV LINK HIGHLIGHTING
  // ------------------------------------------------------------------------
  const trackedSections = ['home', 'trending', 'coming-soon', 'genres']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateHeaderAndActiveNav() {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const scrollPosition = window.scrollY + 140;
    let currentSectionId = 'home';

    trackedSections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const targetId = link.getAttribute('data-section');
      link.classList.toggle('active', targetId === currentSectionId);
    });
  }

  window.addEventListener('scroll', updateHeaderAndActiveNav, { passive: true });
  updateHeaderAndActiveNav();

  // ------------------------------------------------------------------------
  // 4. MOBILE HAMBURGER MENU
  // ------------------------------------------------------------------------
  function setMobileMenuOpen(isOpen) {
    primaryNav.classList.toggle('open', isOpen);
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  hamburgerBtn.addEventListener('click', () => {
    const isCurrentlyOpen = primaryNav.classList.contains('open');
    setMobileMenuOpen(!isCurrentlyOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (primaryNav.classList.contains('open')) {
        setMobileMenuOpen(false);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. SEARCH PANEL (Live Movie Filter)
  // ------------------------------------------------------------------------
  function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (!normalized) {
      return;
    }

    const matches = Object.entries(MOVIES).filter(([, movie]) => {
      return (
        movie.title.toLowerCase().includes(normalized) ||
        movie.genre.toLowerCase().includes(normalized)
      );
    });

    if (matches.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'search-empty';
      emptyMsg.textContent = `No movies matched "${query}". Try "Sci-Fi", "Action", or "Neon".`;
      searchResults.appendChild(emptyMsg);
      return;
    }

    matches.forEach(([movieId, movie]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-result-item';
      btn.innerHTML = `
        <div>
          <div class="search-result-title">${movie.title}</div>
          <div class="search-result-meta">${movie.genre} &bull; ${movie.year}</div>
        </div>
        <span aria-hidden="true">&rarr;</span>
      `;
      btn.addEventListener('click', () => {
        closeSearchPanel();
        openMovieModal(movieId, 'details');
      });
      searchResults.appendChild(btn);
    });
  }

  function openSearchPanel() {
    searchPanel.hidden = false;
    searchToggleBtn.setAttribute('aria-expanded', 'true');
    searchInput.focus();
  }

  function closeSearchPanel() {
    searchPanel.hidden = true;
    searchToggleBtn.setAttribute('aria-expanded', 'false');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  searchToggleBtn.addEventListener('click', () => {
    if (searchPanel.hidden) {
      openSearchPanel();
    } else {
      closeSearchPanel();
    }
  });

  searchCloseBtn.addEventListener('click', closeSearchPanel);
  searchInput.addEventListener('input', (event) => {
    renderSearchResults(event.target.value);
  });

  // ------------------------------------------------------------------------
  // 6. TRENDING MOVIES CAROUSEL CONTROLS
  // ------------------------------------------------------------------------
  function scrollTrendingCarousel(direction) {
    if (!trendingCarousel) return;
    const card = trendingCarousel.querySelector('.movie-card');
    const step = card ? card.offsetWidth + 22 : 280;
    trendingCarousel.scrollBy({
      left: direction * step * 2,
      behavior: 'smooth',
    });
  }

  trendingPrevBtn.addEventListener('click', () => scrollTrendingCarousel(-1));
  trendingNextBtn.addEventListener('click', () => scrollTrendingCarousel(1));

  // ------------------------------------------------------------------------
  // 7. GENRE SELECTION INTERACTION
  // ------------------------------------------------------------------------
  genreCards.forEach((card) => {
    card.addEventListener('click', () => {
      const selectedGenre = card.getAttribute('data-genre');
      const slug = selectedGenre.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      genreCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      const matchingMovies = Object.values(MOVIES).filter((movie) =>
        movie.genres.includes(selectedGenre)
      );

      const titlesText =
        matchingMovies.length > 0
          ? matchingMovies.map((m) => m.title).join(', ')
          : 'Catalog titles available on the full Movies page';

      genreFeedback.hidden = false;
      genreFeedback.innerHTML = `
        <div class="genre-feedback-text">
          <strong>${selectedGenre}</strong> selected &mdash; Featured on homepage: ${titlesText}.
          Placeholder destination: <code>movies.html?genre=${slug}</code>
        </div>
        <button type="button" class="btn btn-card-primary" id="genre-route-btn">
          Preview Movies Route
        </button>
      `;

      const routeBtn = document.getElementById('genre-route-btn');
      routeBtn.addEventListener('click', () => {
        openPlaceholderModal(
          `${selectedGenre} Movies Catalog`,
          `movies.html?genre=${slug}`,
          `This button navigates to the dedicated ${selectedGenre} movies catalog page (not yet implemented in this homepage-only build).`
        );
      });
    });
  });

  // ------------------------------------------------------------------------
  // 8. MODAL SYSTEM (Movie Details, Booking Targets, Trailers, Placeholders)
  // ------------------------------------------------------------------------
  function showModal(contentHtml) {
    lastFocusedElement = document.activeElement;
    modalBody.innerHTML = contentHtml;
    infoModal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeModal() {
    infoModal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function openMovieModal(movieId, actionType) {
    const movie = MOVIES[movieId];
    if (!movie) return;

    const isBooking = actionType === 'book';
    const isTrailer = actionType === 'trailer';

    let actionLabel = 'Movie Details Preview';
    let targetRoute = movie.targetDetails;
    let noticeText =
      'The full movie details page is a placeholder target for the next project milestone.';

    if (isBooking) {
      actionLabel = 'Ticket Booking Destination';
      targetRoute = movie.targetBooking;
      noticeText =
        'Seat selection and ticket checkout live on the dedicated Booking page (placeholder target — no booking has been processed).';
    } else if (isTrailer) {
      actionLabel = 'Official Trailer Preview';
      targetRoute = movie.targetTrailer;
      noticeText =
        'The dedicated video player / trailer page is a placeholder target in this homepage-only prototype.';
    }

    showModal(`
      <div class="modal-movie-layout">
        <img src="${movie.poster}" alt="${movie.title} poster" class="modal-poster" />
        <div>
          <span class="modal-eyebrow">${movie.status}</span>
          <h2 id="modal-title" class="modal-title">${movie.title}</h2>
          <p class="modal-meta">${movie.genre} &bull; ${movie.year} &bull; Rating: ${movie.rating}</p>
          <p class="modal-description">${movie.description}</p>
          <div class="modal-placeholder-box">
            <strong>${actionLabel}:</strong> ${noticeText}<br />
            Target URL: <code>${targetRoute}</code>
          </div>
          <div class="modal-actions">
            ${
              movie.targetBooking && !isBooking
                ? `<button type="button" class="btn btn-primary" id="modal-switch-book">Continue to Booking Target</button>`
                : ''
            }
            <button type="button" class="btn btn-secondary" id="modal-dismiss-btn">Close Preview</button>
          </div>
        </div>
      </div>
    `);

    const switchBookBtn = document.getElementById('modal-switch-book');
    if (switchBookBtn) {
      switchBookBtn.addEventListener('click', () => openMovieModal(movieId, 'book'));
    }

    const dismissBtn = document.getElementById('modal-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeModal);
    }
  }

  function openPlaceholderModal(title, targetUrl, description) {
    showModal(`
      <div>
        <span class="modal-eyebrow">Placeholder Navigation Target</span>
        <h2 id="modal-title" class="modal-title">${title}</h2>
        <p class="modal-description">${description}</p>
        <div class="modal-placeholder-box">
          Defined target route: <code>${targetUrl}</code>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" id="modal-dismiss-btn">Back to Homepage</button>
        </div>
      </div>
    `);

    const dismissBtn = document.getElementById('modal-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeModal);
    }
  }

  // Movie action buttons ("Book Now", "View Details")
  document.querySelectorAll('.movie-action-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const movieId = button.getAttribute('data-movie-id');
      const action = button.getAttribute('data-action') || 'details';
      openMovieModal(movieId, action);
    });
  });

  // Hero "Watch Trailer" button
  const watchTrailerBtn = document.getElementById('watch-trailer-btn');
  if (watchTrailerBtn) {
    watchTrailerBtn.addEventListener('click', () => {
      openMovieModal('chrono-meridian', 'trailer');
    });
  }

  // Navbar "Login / Sign Up" placeholder buttons (desktop + mobile menu)
  document.querySelectorAll('#auth-placeholder-btn, .js-auth-trigger').forEach((authBtn) => {
    authBtn.addEventListener('click', () => {
      if (primaryNav.classList.contains('open')) {
        setMobileMenuOpen(false);
      }
      openPlaceholderModal(
        'Login / Sign Up',
        'login.html',
        'User authentication is handled on a separate page outside this homepage scope. No account or backend session is created here.'
      );
    });
  });

  // Placeholder links ("View All Movies", Footer info links, etc.)
  document.querySelectorAll('[data-placeholder-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = link.getAttribute('data-placeholder-link');
      const label = link.textContent.trim() || link.getAttribute('aria-label') || 'Page';
      openPlaceholderModal(
        label,
        target,
        `This link points to a placeholder destination (${target}) outside the CineVerse homepage.`
      );
    });
  });

  // Close modal handlers (Button, Backdrop click, Escape key)
  modalCloseBtn.addEventListener('click', closeModal);

  infoModal.addEventListener('click', (event) => {
    if (event.target === infoModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (!infoModal.hidden) {
        closeModal();
      } else if (!searchPanel.hidden) {
        closeSearchPanel();
      } else if (primaryNav.classList.contains('open')) {
        setMobileMenuOpen(false);
      }
    }
  });
});
