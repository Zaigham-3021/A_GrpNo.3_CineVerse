# CineVerse

*Your Movie. Your Moment. Your Universe.*

University cinema ticket-booking website built with HTML5, CSS3 and Vanilla JavaScript (no frameworks).

## Pages
- `index.html`: homepage (hero carousel, Trending, Now Showing, Coming Soon, Browse by Genre, promo banner)
- `movies.html`: full catalogue with search, genre/rating/year filters, sorting, and an empty state
- `now-showing.html`: featured film and films in cinemas, with search, genre filter, sorting, and Book Tickets
- `placeholder.html`: placeholder for booking, login and footer pages (no booking is made)

## Structure
```
css/style.css   shared design system (tokens, nav, cards, toolbar, footer, responsive)
js/movies.js    single source of movie data
js/script.js    shared + page-specific behaviour (data-page on <body>)
assets/         local posters, backdrops, favicon
```

Open `index.html` directly, or serve the folder (for example `python3 -m http.server`). All paths are relative, so the site works on GitHub Pages.

Movie data and images come from The Movie Database (TMDB). This product uses TMDB data but is not endorsed or certified by TMDB.
