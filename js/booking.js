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
    SELECTED_CINEMA: "cineverse_selected_cinema"
  };

  // ---------------------------------------------------------------------------
  // 2. Cinema Data Array (rendered dynamically onto select-cinema.html)
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
  // 7. Bootstrap on DOMContentLoaded
  // ---------------------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initSelectCinemaPage();
    initSummaryContext();
  });
})();
