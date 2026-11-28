/* CineVerse Interactive Logic Across All 3 Pages */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'my-bookings') initMyBookingsPage();
  if (page === 'categories') initCategoriesPage();
  if (page === 'about') initAboutPage();
});

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* =========================================
   PAGE 1: MY BOOKINGS
   ========================================= */
function initMyBookingsPage() {
  const choiceView = document.getElementById('bookingsChoiceView');
  const detailView = document.getElementById('bookingsDetailView');
  const btnUpcoming = document.getElementById('btnUpcoming');
  const btnPast = document.getElementById('btnPast');
  const upcomingCountBadge = document.getElementById('upcomingCountBadge');
  const pastCountBadge = document.getElementById('pastCountBadge');
  const detailTitle = document.getElementById('detailSectionTitle');
  const detailPill = document.getElementById('detailStatusPill');
  const ticketsContainer = document.getElementById('ticketsContainer');

  const cancelModal = document.getElementById('cancelModal');
  const cancelModalText = document.getElementById('cancelModalText');
  const btnCancelYes = document.getElementById('btnCancelYes');
  const btnCancelNo = document.getElementById('btnCancelNo');

  let currentMode = null; // 'upcoming' | 'past'
  let pendingCancelId = null;

  function updateCounts() {
    const data = getStoredBookings();
    upcomingCountBadge.textContent = `${data.upcoming.length} Active`;
    pastCountBadge.textContent = `${data.past.length} Past`;
  }

  function returnToMyBookingsHome() {
    currentMode = null;
    detailView.hidden = true;
    choiceView.hidden = false;
    updateCounts();
  }

  function openTicketsView(mode) {
    currentMode = mode;
    choiceView.hidden = true;
    detailView.hidden = false;
    renderTickets(mode);
  }

  function renderTickets(mode) {
    const data = getStoredBookings();
    const list = mode === 'upcoming' ? data.upcoming : data.past;

    if (mode === 'upcoming') {
      detailTitle.textContent = 'Upcoming Tickets';
      detailPill.textContent = 'Valid • Not Expired';
      detailPill.className = 'status-pill valid';
    } else {
      detailTitle.textContent = 'Past Tickets';
      detailPill.textContent = 'Expired';
      detailPill.className = 'status-pill expired';
    }

    if (list.length === 0) {
      ticketsContainer.innerHTML = `
        <div class="glass-card empty-state">
          <h3>No ${mode === 'upcoming' ? 'Upcoming' : 'Past'} Tickets</h3>
          <p>${
            mode === 'upcoming'
              ? 'You have no active upcoming bookings right now. Browse Categories to book a new movie!'
              : 'No past ticket history available.'
          }</p>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:center;">
            <button type="button" class="btn btn-secondary js-back-home">${
              mode === 'upcoming' ? 'Close Ticket' : 'Back to My Booking Page'
            }</button>
            <a href="categories.html" class="btn btn-primary">Explore Categories</a>
          </div>
        </div>
      `;
      bindTicketButtons();
      return;
    }

    ticketsContainer.innerHTML = list
      .map((ticket) => {
        const movie = findMovieById(ticket.movieId);
        const isUpcoming = mode === 'upcoming';
        const qrClass = isUpcoming ? 'qr-green' : 'qr-gray';
        const qrStatusText = isUpcoming ? 'Valid • Not Expired' : 'Expired Pass';
        const qrSubText = isUpcoming ? 'Scan at cinema gate' : 'Showtime has passed';

        const actionButtons = isUpcoming
          ? `
            <div class="ticket-actions-bar">
              <button type="button" class="btn btn-secondary js-back-home">Close Ticket</button>
              <button type="button" class="btn btn-danger js-cancel-booking" data-booking-id="${escapeHtml(
                ticket.bookingId
              )}" data-movie-title="${escapeHtml(ticket.title)}">Cancel Booking</button>
            </div>
          `
          : `
            <div class="ticket-actions-bar">
              <button type="button" class="btn btn-primary js-back-home">Back to My Booking Page</button>
            </div>
          `;

        const ticketTotal =
          typeof ticket.totalPrice === 'number'
            ? ticket.totalPrice
            : calculateSeatsTotal(ticket.seatNo);

        return `
          <div class="ticket-wrapper">
            <article class="ticket-card ${isUpcoming ? '' : 'past-ticket'}">
              <div class="ticket-poster-col">
                <a href="${escapeHtml(movie.trailerUrl)}" target="_blank" rel="noopener noreferrer" class="ticket-poster-img" title="Watch ${escapeHtml(ticket.title)} Trailer on YouTube">
                  ${createPosterHTML(movie)}
                </a>
              </div>

              <div class="ticket-info-col">
                <h3 class="ticket-movie-title">
                  <a href="${escapeHtml(movie.trailerUrl)}" target="_blank" rel="noopener noreferrer" class="movie-card-title-link">${escapeHtml(ticket.title)}</a>
                </h3>
                <div class="ticket-cinema">📍 ${escapeHtml(ticket.cinema)}</div>
                <div class="ticket-meta-grid">
                  <div class="ticket-meta-item">
                    <span class="meta-label">Date</span>
                    <span class="meta-value">${escapeHtml(ticket.date)}</span>
                  </div>
                  <div class="ticket-meta-item">
                    <span class="meta-label">Time</span>
                    <span class="meta-value">${escapeHtml(ticket.time)}</span>
                  </div>
                  <div class="ticket-meta-item">
                    <span class="meta-label">Seat No</span>
                    <span class="meta-value">${escapeHtml(ticket.seatNo)}</span>
                  </div>
                  <div class="ticket-meta-item">
                    <span class="meta-label">Booking ID</span>
                    <span class="meta-value mono">${escapeHtml(ticket.bookingId)}</span>
                  </div>
                  <div class="ticket-meta-item">
                    <span class="meta-label">Total Price</span>
                    <span class="meta-value">${escapeHtml(formatPKR(ticketTotal))}</span>
                  </div>
                </div>
                <a href="${escapeHtml(movie.trailerUrl)}" target="_blank" rel="noopener noreferrer" class="ticket-trailer-link">▶ Watch Official Trailer on YouTube ↗</a>
              </div>

              <div class="ticket-qr-col">
                <div class="qr-status-box ${qrClass}">
                  <div class="qr-code-frame">
                    ${createQrCodeSVG(ticket.bookingId)}
                  </div>
                  <span class="qr-status-label">${qrStatusText}</span>
                  <span class="qr-subtext">${qrSubText}</span>
                </div>
              </div>
            </article>
            ${actionButtons}
          </div>
        `;
      })
      .join('');

    bindTicketButtons();
  }

  function bindTicketButtons() {
    ticketsContainer.querySelectorAll('.js-back-home').forEach((btn) => {
      btn.addEventListener('click', returnToMyBookingsHome);
    });

    ticketsContainer.querySelectorAll('.js-cancel-booking').forEach((btn) => {
      btn.addEventListener('click', () => {
        pendingCancelId = btn.dataset.bookingId;
        const title = btn.dataset.movieTitle;
        cancelModalText.textContent = `Are you sure you want to cancel your booking for "${title}" (${pendingCancelId})?`;
        cancelModal.classList.add('open');
      });
    });
  }

  btnUpcoming.addEventListener('click', () => openTicketsView('upcoming'));
  btnPast.addEventListener('click', () => openTicketsView('past'));

  btnCancelNo.addEventListener('click', () => {
    pendingCancelId = null;
    cancelModal.classList.remove('open');
  });

  btnCancelYes.addEventListener('click', () => {
    if (!pendingCancelId) return;
    const data = getStoredBookings();
    data.upcoming = data.upcoming.filter((t) => t.bookingId !== pendingCancelId);
    saveBookings(data);
    pendingCancelId = null;
    cancelModal.classList.remove('open');
    updateCounts();
    renderTickets('upcoming');
    showToast('Booking cancelled and cleared from Upcoming.');
  });

  cancelModal.addEventListener('click', (e) => {
    if (e.target === cancelModal) {
      pendingCancelId = null;
      cancelModal.classList.remove('open');
    }
  });

  updateCounts();

  // Optional direct jump via query string (?view=upcoming)
  const params = new URLSearchParams(window.location.search);
  if (params.get('view') === 'upcoming') {
    openTicketsView('upcoming');
  } else if (params.get('view') === 'past') {
    openTicketsView('past');
  }
}

/* =========================================
   PAGE 2: CATEGORIES
   ========================================= */
function initCategoriesPage() {
  const categoryButtons = document.querySelectorAll('.category-option-btn');
  const selectedGenreHeading = document.getElementById('selectedGenreHeading');
  const categoryMoviesGrid = document.getElementById('categoryMoviesGrid');
  const popularMoviesGrid = document.getElementById('popularMoviesGrid');

  const bookModal = document.getElementById('bookModal');
  const bookModalMovie = document.getElementById('bookModalMovie');
  const bookCinema = document.getElementById('bookCinema');
  const bookDate = document.getElementById('bookDate');
  const bookTime = document.getElementById('bookTime');
  const seatGrid = document.getElementById('seatGrid');
  const selectedSeatsSummary = document.getElementById('selectedSeatsSummary');
  const bookingTotalPrice = document.getElementById('bookingTotalPrice');
  const btnBookClose = document.getElementById('btnBookClose');
  const btnBookConfirm = document.getElementById('btnBookConfirm');

  let activeMovie = null;
  let selectedSeats = ['C-03', 'C-04'];

  // Populate cinemas
  bookCinema.innerHTML = PAKISTAN_CINEMAS.map(
    (c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`
  ).join('');

  function renderMovieCard(movie, showRatingProminently) {
    return `
      <article class="movie-card">
        <a href="${escapeHtml(movie.trailerUrl)}" target="_blank" rel="noopener noreferrer" class="movie-poster-wrap" aria-label="Watch ${escapeHtml(movie.title)} trailer on YouTube">
          ${createPosterHTML(movie)}
          <span class="movie-genre-tag">${escapeHtml(movie.genreLabel)}</span>
          <span class="movie-rating-badge">★ ${escapeHtml(movie.rating)}</span>
          <div class="trailer-hover-overlay">
            <span class="trailer-play-pill">▶ Watch Trailer</span>
          </div>
        </a>
        <div class="movie-card-body">
          <h3 class="movie-card-title">
            <a href="${escapeHtml(movie.trailerUrl)}" target="_blank" rel="noopener noreferrer" class="movie-card-title-link">${escapeHtml(movie.title)}</a>
          </h3>
          <div class="movie-card-meta">
            <span>${escapeHtml(movie.year)} • ${escapeHtml(movie.duration)}</span>
            <span class="movie-rating-inline">★ ${escapeHtml(movie.rating)} / 10</span>
          </div>
          ${
            showRatingProminently
              ? ''
              : `<p class="movie-card-desc">${escapeHtml(movie.desc)}</p>`
          }
          <div class="movie-card-actions">
            <a href="${escapeHtml(movie.trailerUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-trailer">▶ Watch YouTube Trailer</a>
            <button type="button" class="btn btn-primary js-book-now" data-movie-id="${escapeHtml(
              movie.id
            )}">Book Now</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCategoryMovies(genre) {
    const labelMap = {
      action: 'Action',
      comedy: 'Comedy',
      horror: 'Horror',
      romance: 'Romance'
    };
    selectedGenreHeading.textContent = labelMap[genre] || 'Action';
    const filtered = MOVIE_CATALOG.filter((m) => m.genre === genre);
    categoryMoviesGrid.innerHTML = filtered.map((m) => renderMovieCard(m, false)).join('');
    bindBookNowButtons(categoryMoviesGrid);
  }

  function renderPopularMovies() {
    const popular = MOVIE_CATALOG.filter((m) => m.popular);
    popularMoviesGrid.innerHTML = popular.map((m) => renderMovieCard(m, true)).join('');
    bindBookNowButtons(popularMoviesGrid);
  }

  function renderSeats() {
    const rows = ['A', 'B', 'C', 'D'];
    seatGrid.innerHTML = rows
      .map((row) => {
        const cat = SEAT_CATEGORIES[row];
        const rowSeats = Array.from({ length: 6 }, (_, i) => `${row}-0${i + 1}`);
        return `
          <div class="seat-row-block tier-${row.toLowerCase()}">
            <div class="seat-row-info">
              <span class="seat-row-cat">Cat ${row}</span>
              <span class="seat-row-price">${formatPKR(cat.price)}</span>
            </div>
            <div class="seat-row-buttons">
              ${rowSeats
                .map(
                  (seat) => `
                    <button type="button" class="seat-btn ${
                      selectedSeats.includes(seat) ? 'selected' : ''
                    }" data-seat="${seat}" title="${cat.label} — ${formatPKR(cat.price)}">${seat}</button>
                  `
                )
                .join('')}
            </div>
          </div>
        `;
      })
      .join('');

    const total = calculateSeatsTotal(selectedSeats);
    selectedSeatsSummary.textContent = selectedSeats.join(', ');
    bookingTotalPrice.textContent = formatPKR(total);

    seatGrid.querySelectorAll('.seat-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const seat = btn.dataset.seat;
        if (selectedSeats.includes(seat)) {
          if (selectedSeats.length > 1) {
            selectedSeats = selectedSeats.filter((s) => s !== seat);
          }
        } else {
          selectedSeats.push(seat);
        }
        renderSeats();
      });
    });
  }

  function openBookModal(movieId) {
    activeMovie = findMovieById(movieId);
    bookModalMovie.textContent = `Reserving seats for "${activeMovie.title}" (${activeMovie.genreLabel} • ★ ${activeMovie.rating})`;
    selectedSeats = ['C-03', 'C-04'];
    renderSeats();
    bookModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    bookModal.scrollTop = 0;
    const card = bookModal.querySelector('.modal-card');
    if (card) card.scrollTop = 0;
  }

  function closeBookModal() {
    bookModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function bindBookNowButtons(scope) {
    scope.querySelectorAll('.js-book-now').forEach((btn) => {
      btn.addEventListener('click', () => openBookModal(btn.dataset.movieId));
    });
  }

  categoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderCategoryMovies(btn.dataset.genre);
    });
  });

  btnBookClose.addEventListener('click', closeBookModal);
  bookModal.addEventListener('click', (e) => {
    if (e.target === bookModal) closeBookModal();
  });

  btnBookConfirm.addEventListener('click', () => {
    if (!activeMovie) return;
    const data = getStoredBookings();
    const newId = 'CV-' + Math.floor(100000 + Math.random() * 900000);
    const totalPrice = calculateSeatsTotal(selectedSeats);
    data.upcoming.unshift({
      bookingId: newId,
      movieId: activeMovie.id,
      title: activeMovie.title,
      cinema: bookCinema.value,
      date: bookDate.value,
      time: bookTime.value,
      seatNo: selectedSeats.join(', '),
      totalPrice
    });
    saveBookings(data);
    closeBookModal();
    showToast(`Booked "${activeMovie.title}" (${newId}) — ${formatPKR(totalPrice)}! Added to My Bookings -> Upcoming.`);
  });

  renderCategoryMovies('action');
  renderPopularMovies();
}

/* =========================================
   PAGE 3: ABOUT & CONTACT
   ========================================= */
function initAboutPage() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('contactFeedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in Name, Email, Subject, and Message.');
      return;
    }

    feedback.textContent = `Thank you, ${name}! Your message "${subject}" has been sent to the CineVerse Pakistan team.`;
    feedback.classList.add('success');
    form.reset();
    showToast('Message sent to CineVerse!');
  });
}
