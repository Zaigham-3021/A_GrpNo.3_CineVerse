/* CineVerse Shared Real Movies Catalog, Bookings Data & QR Generator */

const CINEVERSE_STORAGE_KEY = 'cineverse_bookings_v3';

const SEAT_CATEGORIES = {
  A: { code: 'A', label: 'Category A', price: 6000 },
  B: { code: 'B', label: 'Category B', price: 4000 },
  C: { code: 'C', label: 'Category C', price: 3000 },
  D: { code: 'D', label: 'Category D', price: 1500 }
};

function getSeatCategory(seatCode) {
  const row = String(seatCode || '').trim().charAt(0).toUpperCase();
  return SEAT_CATEGORIES[row] || SEAT_CATEGORIES.D;
}

function calculateSeatsTotal(seats) {
  const list = Array.isArray(seats)
    ? seats
    : String(seats || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
  return list.reduce((sum, seat) => sum + getSeatCategory(seat).price, 0);
}

function formatPKR(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`;
}

const PAKISTAN_CINEMAS = [
  'Nueplex Cinemas, Askari IV — Karachi',
  'Cinepax Packages Mall — Lahore',
  'Centaurus Cineplex — Islamabad',
  'Universal Cinemas Emporium — Lahore',
  'Arena Cinema Bahria Town — Rawalpindi'
];

const MOVIE_CATALOG = [
  // ACTION
  {
    id: 'act-1',
    title: 'Top Gun: Maverick',
    year: '2022',
    genre: 'action',
    genreLabel: 'Action',
    rating: '8.2',
    duration: '2h 10m',
    desc: 'After thirty years of service, Pete "Maverick" Mitchell trains a new generation of TOPGUN graduates for a daring mission.',
    poster: 'posters/top-gun-maverick.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=qSqVVswa420',
    popular: true
  },
  {
    id: 'act-2',
    title: 'John Wick: Chapter 4',
    year: '2023',
    genre: 'action',
    genreLabel: 'Action',
    rating: '7.7',
    duration: '2h 49m',
    desc: 'John Wick uncovers a path to defeating The High Table, facing deadly adversaries across New York, Paris, Osaka, and Berlin.',
    poster: 'posters/john-wick-4.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=yjRHkeiaWZ8',
    popular: true
  },
  {
    id: 'act-3',
    title: 'The Dark Knight',
    year: '2008',
    genre: 'action',
    genreLabel: 'Action',
    rating: '9.0',
    duration: '2h 32m',
    desc: 'Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos and tests the hero’s moral limits.',
    poster: 'posters/the-dark-knight.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    popular: true
  },
  {
    id: 'act-4',
    title: 'Mad Max: Fury Road',
    year: '2015',
    genre: 'action',
    genreLabel: 'Action',
    rating: '8.1',
    duration: '2h 00m',
    desc: 'In a post-apocalyptic wasteland, Max teams up with Imperator Furiosa to flee a tyrannical warlord across the desert.',
    poster: 'posters/mad-max-fury-road.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=hEJnMQG9ev8',
    popular: false
  },

  // COMEDY
  {
    id: 'com-1',
    title: 'Deadpool & Wolverine',
    year: '2024',
    genre: 'comedy',
    genreLabel: 'Comedy',
    rating: '7.6',
    duration: '2h 08m',
    desc: 'Wade Wilson’s peaceful life is upended when the TVA recruits him alongside a reluctant Wolverine to save his universe.',
    poster: 'posters/deadpool-wolverine.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    popular: true
  },
  {
    id: 'com-2',
    title: 'Barbie',
    year: '2023',
    genre: 'comedy',
    genreLabel: 'Comedy',
    rating: '6.8',
    duration: '1h 54m',
    desc: 'Barbie and Ken leave the perfection of Barbieland on a hilarious journey of self-discovery into the real world.',
    poster: 'posters/barbie.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=jNoET7IGhcA',
    popular: false
  },
  {
    id: 'com-3',
    title: 'The Hangover',
    year: '2009',
    genre: 'comedy',
    genreLabel: 'Comedy',
    rating: '7.7',
    duration: '1h 40m',
    desc: 'Three groomsmen wake up in Las Vegas with no memory of the previous night and must find the missing groom before the wedding.',
    poster: 'posters/the-hangover.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=tcdUhdOlz9M',
    popular: false
  },
  {
    id: 'com-4',
    title: 'Free Guy',
    year: '2021',
    genre: 'comedy',
    genreLabel: 'Comedy',
    rating: '7.1',
    duration: '1h 55m',
    desc: 'A bank teller discovers he is actually a background player inside an open-world video game and decides to become the hero.',
    poster: 'posters/free-guy.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=XmvdgF_wo0U',
    popular: false
  },

  // HORROR
  {
    id: 'hor-1',
    title: 'The Conjuring',
    year: '2013',
    genre: 'horror',
    genreLabel: 'Horror',
    rating: '7.5',
    duration: '1h 52m',
    desc: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
    poster: 'posters/the-conjuring.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=k10ETkdJBKc',
    popular: true
  },
  {
    id: 'hor-2',
    title: 'A Quiet Place',
    year: '2018',
    genre: 'horror',
    genreLabel: 'Horror',
    rating: '7.5',
    duration: '1h 30m',
    desc: 'A family struggles to survive in complete silence while hiding from blind monsters that hunt strictly by sound.',
    poster: 'posters/a-quiet-place.png',
    trailerUrl: 'https://www.youtube.com/watch?v=WR7cc5t7tv8',
    popular: false
  },
  {
    id: 'hor-3',
    title: 'IT',
    year: '2017',
    genre: 'horror',
    genreLabel: 'Horror',
    rating: '7.3',
    duration: '2h 15m',
    desc: 'In the town of Derry, seven young outcasts band together to confront a shape-shifting evil known as Pennywise.',
    poster: 'posters/it-2017.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=hQAubDBwHwU',
    popular: false
  },
  {
    id: 'hor-4',
    title: 'Smile',
    year: '2022',
    genre: 'horror',
    genreLabel: 'Horror',
    rating: '6.5',
    duration: '1h 55m',
    desc: 'After witnessing a traumatic incident involving a patient, Dr. Rose Cotter experiences terrifying events she cannot explain.',
    poster: 'posters/smile-2022.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=BcSKurwjifE',
    popular: false
  },

  // ROMANCE
  {
    id: 'rom-1',
    title: 'La La Land',
    year: '2016',
    genre: 'romance',
    genreLabel: 'Romance',
    rating: '8.0',
    duration: '2h 08m',
    desc: 'A jazz pianist and an aspiring actress fall in love while chasing their dreams in Los Angeles.',
    poster: 'posters/la-la-land.png',
    trailerUrl: 'https://www.youtube.com/watch?v=0pdqf4P9MB8',
    popular: true
  },
  {
    id: 'rom-2',
    title: 'The Notebook',
    year: '2004',
    genre: 'romance',
    genreLabel: 'Romance',
    rating: '7.8',
    duration: '2h 03m',
    desc: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom despite social divides.',
    poster: 'posters/the-notebook.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=BjJcYdEOI0k',
    popular: false
  },
  {
    id: 'rom-3',
    title: 'Titanic',
    year: '1997',
    genre: 'romance',
    genreLabel: 'Romance',
    rating: '7.9',
    duration: '3h 14m',
    desc: 'An aristocrat and a penniless artist fall in love aboard the ill-fated R.M.S. Titanic on its maiden voyage.',
    poster: 'posters/titanic.png',
    trailerUrl: 'https://www.youtube.com/watch?v=kVrqfYjkTdQ',
    popular: false
  },
  {
    id: 'rom-4',
    title: 'Past Lives',
    year: '2023',
    genre: 'romance',
    genreLabel: 'Romance',
    rating: '7.8',
    duration: '1h 46m',
    desc: 'Two deeply connected childhood friends are wrested apart and reunite in New York two decades later for one fateful week.',
    poster: 'posters/past-lives.png',
    trailerUrl: 'https://www.youtube.com/watch?v=kA244xewjcI',
    popular: false
  }
];

const DEFAULT_BOOKINGS = {
  upcoming: [
    {
      bookingId: 'CV-849201',
      movieId: 'act-1',
      title: 'Top Gun: Maverick',
      cinema: 'Cinepax Packages Mall — Lahore',
      date: 'Dec 05, 2026',
      time: '08:30 PM',
      seatNo: 'A-03, A-04',
      totalPrice: 12000
    },
    {
      bookingId: 'CV-902418',
      movieId: 'rom-1',
      title: 'La La Land',
      cinema: 'Nueplex Cinemas, Askari IV — Karachi',
      date: 'Dec 12, 2026',
      time: '06:45 PM',
      seatNo: 'C-05, C-06',
      totalPrice: 6000
    }
  ],
  past: [
    {
      bookingId: 'CV-512094',
      movieId: 'com-3',
      title: 'The Hangover',
      cinema: 'Centaurus Cineplex — Islamabad',
      date: 'Oct 18, 2026',
      time: '07:15 PM',
      seatNo: 'D-02',
      totalPrice: 1500
    },
    {
      bookingId: 'CV-384712',
      movieId: 'hor-1',
      title: 'The Conjuring',
      cinema: 'Universal Cinemas Emporium — Lahore',
      date: 'Sep 04, 2026',
      time: '10:30 PM',
      seatNo: 'B-04, B-05',
      totalPrice: 8000
    }
  ]
};

function getStoredBookings() {
  try {
    const raw = localStorage.getItem(CINEVERSE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CINEVERSE_STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
      return JSON.parse(JSON.stringify(DEFAULT_BOOKINGS));
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.upcoming) || !Array.isArray(parsed.past)) {
      throw new Error('Invalid booking data');
    }
    return parsed;
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_BOOKINGS));
  }
}

function saveBookings(data) {
  try {
    localStorage.setItem(CINEVERSE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Ignore storage quota errors in restricted environments
  }
}

function findMovieById(movieId) {
  return MOVIE_CATALOG.find((m) => m.id === movieId) || MOVIE_CATALOG[0];
}

function createPosterHTML(movie) {
  const safeTitle = movie.title.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<img src="${movie.poster}" alt="${safeTitle} official movie poster" loading="lazy" />`;
}

function createQrCodeSVG(seedText) {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash * 31 + seedText.charCodeAt(i)) >>> 0;
  }

  const size = 15;
  let cells = '';
  const isFinder = (r, c) =>
    (r < 4 && c < 4) ||
    (r < 4 && c >= size - 4) ||
    (r >= size - 4 && c < 4);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c)) continue;
      const bit = ((hash >> ((r * 5 + c * 3) % 24)) ^ (r * 7 + c * 11)) & 1;
      if (bit === 1) {
        cells += `<rect x="${c * 6 + 5}" y="${r * 6 + 5}" width="5" height="5" rx="0.8" fill="#0f172a"/>`;
      }
    }
  }

  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Ticket QR Code">
      <rect width="100" height="100" fill="#ffffff"/>
      <rect x="5" y="5" width="22" height="22" rx="3" fill="none" stroke="#0f172a" stroke-width="4"/>
      <rect x="12" y="12" width="8" height="8" rx="1.5" fill="#0f172a"/>
      <rect x="73" y="5" width="22" height="22" rx="3" fill="none" stroke="#0f172a" stroke-width="4"/>
      <rect x="80" y="12" width="8" height="8" rx="1.5" fill="#0f172a"/>
      <rect x="5" y="73" width="22" height="22" rx="3" fill="none" stroke="#0f172a" stroke-width="4"/>
      <rect x="12" y="80" width="8" height="8" rx="1.5" fill="#0f172a"/>
      ${cells}
    </svg>
  `;
}
