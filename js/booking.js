/**
 * CineVerse - Booking Flow & Cinema Selection Logic
 * Pure vanilla JavaScript for navigation, dynamic cinema rendering,
 * city filtering, and persisting booking state in localStorage.
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 1. Constants & localStorage Keys
  // ---------------------------------------------------------------------------
  const DEFAULT_CITY = "Islamabad";
  const STORAGE_KEYS = {
    BOOKING_STATE: "cineverse_booking_state",
    SELECTED_CITY: "cineverse_selected_city",
    SELECTED_CINEMA: "cineverse_selected_cinema",
    SELECTED_MOVIE: "cineverse_selected_movie",
    SELECTED_DATE: "cineverse_selected_date",
    SELECTED_TIME: "cineverse_selected_time"
  };

  // ---------------------------------------------------------------------------
  // 2. Data Arrays (Cinemas, Movies, Dates, Show Timings)
  // ---------------------------------------------------------------------------
  const CINEMAS_DATA = [
    {
      id: "cineplex-blue-area",
      name: "Cineplex Blue Area",
      city: "Islamabad",
      area: "Jinnah Avenue, Blue Area",
      distanceKm: 2.4,
      distanceText: "2.4 km away",
      screens: 5,
      rating: "4.7",
      features: ["4K Laser", "Dolby Digital", "Snack Bar"],
      imageFile: "cineplex-blue-area.svg"
    },
    {
      id: "centaurus-cinema",
      name: "Centaurus Cinema",
      city: "Islamabad",
      area: "The Centaurus Mall, Sector F-8",
      distanceKm: 4.1,
      distanceText: "4.1 km away",
      screens: 6,
      rating: "4.8",
      features: ["IMAX", "Dolby Atmos", "VIP Lounge"],
      imageFile: "centaurus-cinema.svg"
    },
    {
      id: "f9-arena",
      name: "F-9 Arena",
      city: "Islamabad",
      area: "Fatima Jinnah Park, Sector F-9",
      distanceKm: 5.8,
      distanceText: "5.8 km away",
      screens: 4,
      rating: "4.6",
      features: ["3D Ready", "Recliner Seats", "Free Parking"],
      imageFile: "f9-arena.svg"
    },
    {
      id: "bahria-cinegold-rwp",
      name: "CineGold Plex Rawalpindi",
      city: "Rawalpindi",
      area: "Bahria Town Phase 7",
      distanceKm: 16.5,
      distanceText: "16.5 km away",
      screens: 5,
      rating: "4.5",
      features: ["Gold Lounge", "Dolby Atmos", "3D"],
      imageFile: "cinema-default.svg"
    },
    {
      id: "cue-cinemas-lhr",
      name: "Cue Cinemas Gulberg",
      city: "Lahore",
      area: "Main Boulevard, Gulberg III",
      distanceKm: 3.2,
      distanceText: "3.2 km away",
      screens: 7,
      rating: "4.8",
      features: ["IMAX", "4K Projection", "Valet Parking"],
      imageFile: "cinema-default.svg"
    },
    {
      id: "nueplex-khi",
      name: "Nueplex Cinemas DHA",
      city: "Karachi",
      area: "Khayaban-e-Jami, DHA Phase 8",
      distanceKm: 4.9,
      distanceText: "4.9 km away",
      screens: 8,
      rating: "4.7",
      features: ["Ultra Screen", "Dolby Atmos", "Cafe"],
      imageFile: "cinema-default.svg"
    }
  ];

  const MOVIES_DATA = [
    {
      id: "cosmic-horizon",
      title: "Cosmic Horizon",
      genre: "Sci-Fi • Adventure",
      duration: "2h 28m",
      rating: "PG-13",
      language: "English (IMAX / 2D)",
      synopsis:
        "A deep-space exploration crew charts a wormhole beyond the edge of the solar system in search of a habitable world.",
      posterFile: "movie-poster.svg"
    },
    {
      id: "neon-shadows",
      title: "Neon Shadows",
      genre: "Action • Thriller",
      duration: "2h 12m",
      rating: "PG-13",
      language: "English (Dolby Atmos)",
      synopsis:
        "An undercover cyber-investigator races across a rain-soaked metropolis to stop a city-wide blackout before midnight.",
      posterFile: "movie-neon-shadows.svg"
    }
  ];

  const SHOW_DATES = [
    { id: "fri-21", day: "Fri", dateNum: "21", label: "Fri 21" },
    { id: "sat-22", day: "Sat", dateNum: "22", label: "Sat 22" },
    { id: "sun-23", day: "Sun", dateNum: "23", label: "Sun 23" }
  ];

  const SHOW_TIMINGS = [
    { id: "11-00-am", time: "11:00 AM", hall: "Hall 1 • Standard 2D" },
    { id: "02-00-pm", time: "2:00 PM", hall: "Hall 2 • 3D Laser" },
    { id: "05-00-pm", time: "5:00 PM", hall: "Hall 3 • Dolby Atmos" },
    { id: "08-00-pm", time: "8:00 PM", hall: "Hall 1 • IMAX" },
    { id: "11-00-pm", time: "11:00 PM", hall: "Hall 4 • VIP Recliner" }
  ];

  // ---------------------------------------------------------------------------
  // 3. Helper Functions (Paths & localStorage)
  // ---------------------------------------------------------------------------

  /**
   * Resolves the correct relative image folder depending on whether the
   * current page lives inside `/pages/` or at the project root.
   */
  function getImageBasePath() {
    return window.location.pathname.includes("/pages/") ? "../images/" : "images/";
  }

  /**
   * Safely reads the saved booking object from localStorage.
   */
  function getSavedBookingState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKING_STATE);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to read booking state from localStorage:", error);
      return null;
    }
  }

  /**
   * Saves the selected city and cinema details to localStorage.
   */
  function saveSelectedCinema(city, cinema) {
    const existingState = getSavedBookingState() || {};
    const updatedState = {
      ...existingState,
      city: city,
      cinemaId: cinema.id,
      cinemaName: cinema.name,
      cinemaArea: cinema.area,
      distanceText: cinema.distanceText,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEYS.BOOKING_STATE, JSON.stringify(updatedState));
      localStorage.setItem(STORAGE_KEYS.SELECTED_CITY, city);
      localStorage.setItem(STORAGE_KEYS.SELECTED_CINEMA, cinema.name);
    } catch (error) {
      console.warn("Unable to save selection to localStorage:", error);
    }
  }

  /**
   * Saves the selected movie, date, and showtime to localStorage.
   * Merges into existing booking state so cinema data is never overwritten.
   * @param {Object} movie     - Full movie object from MOVIES_DATA
   * @param {Object} dateObj   - Date object from SHOW_DATES
   * @param {Object} timingObj - Timing object from SHOW_TIMINGS
   */
  function saveTimingSelection(movie, dateObj, timingObj) {
    const existingState = getSavedBookingState() || {};
    const updatedState = {
      ...existingState,
      movieId:    movie.id,
      movieTitle: movie.title,
      dateId:     dateObj.id,
      dateLabel:  dateObj.label,
      timeId:     timingObj.id,
      timeLabel:  timingObj.time,
      timingHall: timingObj.hall,
      updatedAt:  new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKING_STATE,  JSON.stringify(updatedState));
      localStorage.setItem(STORAGE_KEYS.SELECTED_MOVIE, movie.title);
      localStorage.setItem(STORAGE_KEYS.SELECTED_DATE,  dateObj.label);
      localStorage.setItem(STORAGE_KEYS.SELECTED_TIME,  timingObj.time);
    } catch (error) {
      console.warn("Unable to save timing selection:", error);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Shared Mobile Hamburger Menu
  // ---------------------------------------------------------------------------

  function initMobileMenu() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navMenu = document.getElementById("primaryNav");

    if (!hamburgerBtn || !navMenu) {
      return;
    }

    function setMenuOpen(isOpen) {
      hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
      navMenu.classList.toggle("is-open", isOpen);
    }

    hamburgerBtn.addEventListener("click", function () {
      const currentlyExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
      setMenuOpen(!currentlyExpanded);
    });

    // Close menu when a nav link is clicked on small screens
    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    // Close menu with Escape key for keyboard accessibility
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Select Cinema Page (pages/select-cinema.html)
  // ---------------------------------------------------------------------------

  /**
   * Builds a single semantic <article> card element for a cinema object.
   */
  function createCinemaCard(cinema, savedCinemaId, onSelectCinema) {
    const card = document.createElement("article");
    card.className = "cinema-card";
    if (savedCinemaId === cinema.id) {
      card.classList.add("is-selected");
    }

    // Media wrapper with cinema illustration & distance badge
    const media = document.createElement("div");
    media.className = "cinema-card-media";

    const img = document.createElement("img");
    img.src = getImageBasePath() + cinema.imageFile;
    img.alt = cinema.name + " cinema hall";
    img.loading = "lazy";

    const distanceBadge = document.createElement("span");
    distanceBadge.className = "distance-badge";
    distanceBadge.textContent = cinema.distanceText;

    media.append(img, distanceBadge);

    // Card content body
    const body = document.createElement("div");
    body.className = "cinema-card-body";

    const header = document.createElement("div");
    header.className = "cinema-card-header";

    const title = document.createElement("h2");
    title.className = "cinema-title";
    title.textContent = cinema.name;

    const rating = document.createElement("span");
    rating.className = "cinema-rating";
    rating.setAttribute("aria-label", "Rating " + cinema.rating + " out of 5");
    rating.textContent = "★ " + cinema.rating;

    header.append(title, rating);

    const location = document.createElement("p");
    location.className = "cinema-location";
    location.textContent = cinema.area + ", " + cinema.city;

    const metaList = document.createElement("div");
    metaList.className = "cinema-meta";
    cinema.features.forEach(function (feature) {
      const tag = document.createElement("span");
      tag.className = "feature-tag";
      tag.textContent = feature;
      metaList.appendChild(tag);
    });

    // Footer with screen count and action button
    const footer = document.createElement("div");
    footer.className = "cinema-card-footer";

    const screensInfo = document.createElement("span");
    screensInfo.className = "screens-info";
    screensInfo.textContent = cinema.screens + " Screens Available";

    const selectBtn = document.createElement("button");
    selectBtn.type = "button";
    selectBtn.className = "btn btn-primary";
    selectBtn.textContent = "Select Cinema";
    selectBtn.addEventListener("click", function () {
      onSelectCinema(cinema);
    });

    footer.append(screensInfo, selectBtn);
    body.append(header, location, metaList, footer);
    card.append(media, body);

    return card;
  }

  /**
   * Initializes city dropdown, renders cinema cards, and handles selection.
   */
  function initSelectCinemaPage() {
    const citySelect = document.getElementById("citySelect");
    const cinemaGrid = document.getElementById("cinemaGrid");
    const resultsCount = document.getElementById("resultsCount");
    const savedSelectionBanner = document.getElementById("savedSelectionBanner");

    // Only run on select-cinema.html
    if (!citySelect || !cinemaGrid) {
      return;
    }

    const savedState = getSavedBookingState();
    // Default city is always Islamabad unless user already picked a valid city
    const initialCity =
      savedState && savedState.city ? savedState.city : DEFAULT_CITY;
    citySelect.value = initialCity;

    function updateSavedBanner() {
      if (!savedSelectionBanner) {
        return;
      }
      const latest = getSavedBookingState();
      if (latest && latest.cinemaName) {
        savedSelectionBanner.hidden = false;
        savedSelectionBanner.textContent =
          "Last selected: " + latest.cinemaName + " (" + latest.city + ")";
      } else {
        savedSelectionBanner.hidden = true;
      }
    }

    function handleCinemaSelect(cinema) {
      saveSelectedCinema(citySelect.value, cinema);
      window.location.href = "show-timings.html";
    }

    function renderCinemasForCity(selectedCity) {
      const matchingCinemas = CINEMAS_DATA.filter(function (cinema) {
        return cinema.city === selectedCity;
      });

      // Clear previous cards before rendering the new list
      cinemaGrid.innerHTML = "";

      if (resultsCount) {
        const label = matchingCinemas.length === 1 ? "cinema" : "cinemas";
        resultsCount.textContent =
          "Showing " + matchingCinemas.length + " " + label + " in " + selectedCity;
      }

      if (matchingCinemas.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "No cinemas found for " + selectedCity + " yet.";
        cinemaGrid.appendChild(empty);
        return;
      }

      const currentSaved = getSavedBookingState();
      const savedCinemaId = currentSaved ? currentSaved.cinemaId : null;

      matchingCinemas.forEach(function (cinema) {
        const card = createCinemaCard(cinema, savedCinemaId, handleCinemaSelect);
        cinemaGrid.appendChild(card);
      });
    }

    citySelect.addEventListener("change", function (event) {
      renderCinemasForCity(event.target.value);
    });

    updateSavedBanner();
    renderCinemasForCity(citySelect.value);
  }

  // ---------------------------------------------------------------------------
  // 6. Starter Hydrator for show-timings.html & seat-selection.html
  // ---------------------------------------------------------------------------

  function initSummaryContext() {
    const summaryContainer = document.getElementById("bookingContextSummary");
    if (!summaryContainer) {
      return;
    }

    const savedState = getSavedBookingState();
    summaryContainer.textContent = "";

    if (savedState && savedState.cinemaName) {
      const label = document.createElement("strong");
      label.textContent = "Selected Cinema: ";

      const details = document.createTextNode(
        savedState.cinemaName +
          " • " +
          savedState.cinemaArea +
          " (" +
          savedState.city +
          " — " +
          savedState.distanceText +
          ")"
      );

      summaryContainer.append(label, details);
    } else {
      const promptText = document.createTextNode(
        "No cinema selected yet. Please choose one on the "
      );
      const link = document.createElement("a");
      link.href = "select-cinema.html";
      link.textContent = "Select Cinema";
      link.style.color = "var(--color-accent)";
      link.style.textDecoration = "underline";
      const suffix = document.createTextNode(" page.");

      summaryContainer.append(promptText, link, suffix);
    }
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // 7. Seat Selection Page Logic
  // ---------------------------------------------------------------------------

  function initSeatSelection() {
    const seatGrid = document.getElementById('seatGrid');
    const totalPriceEl = document.getElementById('totalPrice');
    const errorMsg = document.getElementById('seatSelectionErrorMsg');
    const nextBtn = document.getElementById('nextToConfirmBtn');
    const modal = document.getElementById('bookingModal');
    const modalSeats = document.getElementById('modalSeats');
    const modalCinema = document.getElementById('modalCinema');
    const modalDateTime = document.getElementById('modalDateTime');
    const modalTotal = document.getElementById('modalTotal');
    const modalClose = document.getElementById('modalCloseBtn');

    const PRICE_PER_SEAT = 600;
    const MAX_SEATS = 8;
    const rows = ['A','B','C','D','E','F'];
    const cols = 8;
    const bookedSeats = ['C3', 'D5', 'E1']; // preset booked seats

    // Load persisted selection
    const savedState = getSavedBookingState() || {};
    let selectedSeats = savedState.seats || [];

    function renderGrid() {
      seatGrid.innerHTML = '';
      rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        for (let i = 1; i <= cols; i++) {
          const seatLabel = row + i;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'seat';
          btn.dataset.seat = seatLabel;
          btn.setAttribute('aria-label', `Seat ${seatLabel}`);
          btn.textContent = seatLabel;
          if (bookedSeats.includes(seatLabel)) {
            btn.classList.add('booked');
            btn.disabled = true;
            btn.setAttribute('aria-pressed', 'false');
          } else if (selectedSeats.includes(seatLabel)) {
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
          } else {
            btn.setAttribute('aria-pressed', 'false');
          }
          btn.addEventListener('click', () => toggleSeat(seatLabel, btn));
          rowDiv.appendChild(btn);
        }
        seatGrid.appendChild(rowDiv);
      });
      updateTotal();
    }

    function toggleSeat(seat, button) {
      const idx = selectedSeats.indexOf(seat);
      if (idx > -1) {
        selectedSeats.splice(idx, 1);
        button.classList.remove('selected');
        button.setAttribute('aria-pressed', 'false');
      } else {
        if (selectedSeats.length >= MAX_SEATS) {
          return; // max reached
        }
        selectedSeats.push(seat);
        button.classList.add('selected');
        button.setAttribute('aria-pressed', 'true');
      }
      saveSelection();
      updateTotal();
    }

    function updateTotal() {
      const total = selectedSeats.length * PRICE_PER_SEAT;
      totalPriceEl.textContent = `Total: Rs. ${total}`;
    }

    function saveSelection() {
      const state = getSavedBookingState() || {};
      state.seats = selectedSeats;
      try { localStorage.setItem(STORAGE_KEYS.BOOKING_STATE, JSON.stringify(state)); } catch (e) {}
    }

    nextBtn.addEventListener('click', () => {
      if (selectedSeats.length === 0) {
        errorMsg.hidden = false;
        return;
      }
      errorMsg.hidden = true;
      modalSeats.textContent = `Seats: ${selectedSeats.join(', ')}`;
      const saved = getSavedBookingState();
      modalCinema.textContent = `Cinema: ${saved?.cinemaName || ''}`;
      modalDateTime.textContent = `Date & Time: ${saved?.dateLabel || ''} ${saved?.timeLabel || ''}`;
      modalTotal.textContent = `Total: Rs. ${selectedSeats.length * PRICE_PER_SEAT}`;
      modal.hidden = false;
    });

    modalClose.addEventListener('click', () => { modal.hidden = true; });

    renderGrid();
  }

  // ---------------------------------------------------------------------------
  // 7. Show Timings Page (pages/show-timings.html)
  // ---------------------------------------------------------------------------

  /**
   * Initialises all interactive UI on the Show Timings page:
   *   - Populates the cinema context banner from localStorage
   *   - Renders the movie-switcher pills, date buttons and showtime slots
   *     from their respective data arrays
   *   - Keeps a live "selection summary" in sync
   *   - Validates that both a date AND a showtime have been chosen before
   *     persisting the selection and navigating to seat-selection.html
   */
  function initShowTimingsPage() {
    // Guard — only run on the page that has this root element
    if (!document.getElementById("showTimingsPage")) { return; }

    // ---- 1. Cinema context banner ----------------------------------------
    const banner      = document.getElementById("selectedCinemaBanner");
    const cinemaTitle = document.getElementById("selectedCinemaTitle");
    const cinemaMeta  = document.getElementById("selectedCinemaMeta");
    const savedState  = getSavedBookingState();

    if (savedState && savedState.cinemaName) {
      cinemaTitle.textContent = savedState.cinemaName;
      cinemaMeta.textContent  =
        savedState.cinemaArea + " • " + savedState.city +
        " (" + savedState.distanceText + ")";
    } else {
      // No cinema in localStorage — show a warning state
      cinemaTitle.textContent = "No cinema selected";
      cinemaMeta.textContent  = "Please go back and choose a cinema first.";
      if (banner) { banner.classList.add("is-warning"); }
    }

    // ---- 2. Local page state (which movie / date / time is active) --------
    var activeMovieId = MOVIES_DATA[0].id;
    var activeDateId  = null;
    var activeTimeId  = null;

    // ---- 3. Helper — update the live summary strip -----------------------
    function updateSummary() {
      var dateObj   = SHOW_DATES.find(function (d) { return d.id === activeDateId; });
      var timeObj   = SHOW_TIMINGS.find(function (t) { return t.id === activeTimeId; });
      document.getElementById("summaryDate").textContent =
        dateObj ? dateObj.label : "Not selected";
      document.getElementById("summaryTime").textContent =
        timeObj ? timeObj.time : "Not selected";
    }

    // ---- 4. Helper — update poster + details when movie changes ----------
    function renderMovieDetails(movieId) {
      var movie = MOVIES_DATA.find(function (m) { return m.id === movieId; }) || MOVIES_DATA[0];

      // Poster image
      var img = document.getElementById("moviePosterImg");
      img.src = getImageBasePath() + movie.posterFile;
      img.alt = movie.title + " movie poster";

      // Title & synopsis
      document.getElementById("movieTitle").textContent   = movie.title;
      document.getElementById("movieSynopsis").textContent = movie.synopsis;

      // Badges — rating, duration, language
      var badgesEl = document.getElementById("movieMetaBadges");
      badgesEl.innerHTML = "";
      [movie.rating, movie.duration, movie.language].forEach(function (text) {
        var tag = document.createElement("span");
        tag.className   = "feature-tag";
        tag.textContent = text;
        badgesEl.appendChild(tag);
      });

      // Keep summary movie name in sync
      document.getElementById("summaryMovie").textContent = movie.title;
    }

    // ---- 5. Render movie-switcher pill buttons ----------------------------
    var movieSwitcher = document.getElementById("movieSwitcher");
    MOVIES_DATA.forEach(function (movie) {
      var btn = document.createElement("button");
      btn.type        = "button";
      btn.className   = "movie-pill-btn" + (movie.id === activeMovieId ? " is-active" : "");
      btn.textContent = movie.title;

      btn.addEventListener("click", function () {
        activeMovieId = movie.id;
        // Toggle active class on all pills
        movieSwitcher.querySelectorAll(".movie-pill-btn").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        renderMovieDetails(activeMovieId);
      });

      movieSwitcher.appendChild(btn);
    });

    // ---- 6. Render date selector buttons ---------------------------------
    var dateSelector = document.getElementById("dateSelector");
    SHOW_DATES.forEach(function (dateObj) {
      var btn = document.createElement("button");
      btn.type      = "button";
      btn.className = "date-btn";
      btn.dataset.dateId = dateObj.id;
      btn.setAttribute("aria-label", dateObj.label);

      var daySpan = document.createElement("span");
      daySpan.className   = "date-btn-day";
      daySpan.textContent = dateObj.day;

      var numSpan = document.createElement("span");
      numSpan.className   = "date-btn-num";
      numSpan.textContent = dateObj.dateNum;

      btn.appendChild(daySpan);
      btn.appendChild(numSpan);

      btn.addEventListener("click", function () {
        activeDateId = dateObj.id;
        // Single-select: clear all, then mark this one
        dateSelector.querySelectorAll(".date-btn").forEach(function (b) {
          b.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        // Hide validation message on a valid pick
        document.getElementById("timingValidationMsg").hidden = true;
        updateSummary();
      });

      dateSelector.appendChild(btn);
    });

    // ---- 7. Render showtime slot buttons ---------------------------------
    var timeGrid = document.getElementById("timeSlotGrid");
    SHOW_TIMINGS.forEach(function (timingObj) {
      var btn = document.createElement("button");
      btn.type      = "button";
      btn.className = "time-btn";
      btn.dataset.timeId = timingObj.id;

      var labelSpan = document.createElement("span");
      labelSpan.className   = "time-btn-label";
      labelSpan.textContent = timingObj.time;

      var subSpan = document.createElement("span");
      subSpan.className   = "time-btn-sub";
      subSpan.textContent = timingObj.hall;

      btn.appendChild(labelSpan);
      btn.appendChild(subSpan);

      btn.addEventListener("click", function () {
        activeTimeId = timingObj.id;
        // Single-select
        timeGrid.querySelectorAll(".time-btn").forEach(function (b) {
          b.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        document.getElementById("timingValidationMsg").hidden = true;
        updateSummary();
      });

      timeGrid.appendChild(btn);
    });

    // ---- 8. "Next" button — validate, save, then navigate ---------------
    document.getElementById("nextToSeatsBtn").addEventListener("click", function () {
      var validationMsg = document.getElementById("timingValidationMsg");

      // Determine which fields are still missing
      if (!activeDateId && !activeTimeId) {
        validationMsg.textContent = "Please select a date and showtime before continuing.";
        validationMsg.hidden = false;
        return;
      }
      if (!activeDateId) {
        validationMsg.textContent = "Please select a date to continue.";
        validationMsg.hidden = false;
        return;
      }
      if (!activeTimeId) {
        validationMsg.textContent = "Please select a showtime to continue.";
        validationMsg.hidden = false;
        return;
      }

      // All selections valid — persist to localStorage and proceed
      validationMsg.hidden = true;
      var movie     = MOVIES_DATA.find(function (m) { return m.id === activeMovieId; });
      var dateObj   = SHOW_DATES.find(function (d) { return d.id === activeDateId; });
      var timingObj = SHOW_TIMINGS.find(function (t) { return t.id === activeTimeId; });
      saveTimingSelection(movie, dateObj, timingObj);
      window.location.href = "seat-selection.html";
    });

    // ---- 9. Initial render on page load ----------------------------------
    renderMovieDetails(activeMovieId);
    updateSummary();
  }

  // ---------------------------------------------------------------------------
  // 8. Bootstrap on DOMContentLoaded
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initSelectCinemaPage();
    initSummaryContext();    // safe no-op on pages without #bookingContextSummary
    initShowTimingsPage();   // runs only when #showTimingsPage exists
    initSeatSelection();    // runs only when seat-selection elements exist
  });
})();
