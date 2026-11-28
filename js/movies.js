/* ==========================================================================
   CineVerse – Movie data
   --------------------------------------------------------------------------
   Every page reads movies from this single array, so cards, filters and
   sorting never need duplicated HTML.

   status values:
     "trending"     – popular titles shown in "Trending Now"
     "now-showing"  – currently in cinemas (can be booked)
     "coming-soon"  – upcoming releases (rating is null until release)
     "catalog"      – other titles available in the Movies catalogue

   Real titles, synopses, ratings and artwork sourced from The Movie Database
   (TMDB). Images are stored locally in assets/posters and assets/backdrops.
   ========================================================================== */

const MOVIES = [
  {
    "id": "avatar-fire-and-ash",
    "title": "Avatar: Fire and Ash",
    "status": "trending",
    "genres": [
      "Sci-Fi",
      "Adventure",
      "Fantasy"
    ],
    "releaseDate": "2025-12-17",
    "year": 2025,
    "rating": 7.6,
    "runtime": 198,
    "overview": "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
    "poster": "assets/posters/avatar-fire-and-ash.jpg",
    "backdrop": "assets/backdrops/avatar-fire-and-ash.jpg"
  },
  {
    "id": "scream-7",
    "title": "Scream 7",
    "status": "trending",
    "genres": [
      "Horror",
      "Mystery",
      "Crime"
    ],
    "releaseDate": "2026-02-25",
    "year": 2026,
    "rating": 6.2,
    "runtime": 114,
    "overview": "When a new Ghostface killer emerges in the quiet town where Sidney Prescott has built a new life, her darkest fears are realized as her daughter becomes the next target. Determined to protect her family, Sidney must face the horrors of her past to put an end to the bloodshed once and for all.",
    "poster": "assets/posters/scream-7.jpg",
    "backdrop": "assets/backdrops/scream-7.jpg"
  },
  {
    "id": "the-super-mario-galaxy-movie",
    "title": "The Super Mario Galaxy Movie",
    "status": "trending",
    "genres": [
      "Family",
      "Comedy",
      "Adventure",
      "Fantasy",
      "Animation"
    ],
    "releaseDate": "2026-04-01",
    "year": 2026,
    "rating": 8.2,
    "runtime": 98,
    "overview": "Having thwarted Bowser's previous plot to marry Princess Peach, Mario and Luigi now face a fresh threat in Bowser Jr., who is determined to liberate his father from captivity and restore the family legacy. Alongside companions new and old, the brothers travel across the stars to stop the young heir's crusade.",
    "poster": "assets/posters/the-super-mario-galaxy-movie.jpg",
    "backdrop": "assets/backdrops/the-super-mario-galaxy-movie.jpg"
  },
  {
    "id": "send-help",
    "title": "Send Help",
    "status": "trending",
    "genres": [
      "Horror",
      "Thriller",
      "Comedy"
    ],
    "releaseDate": "2026-01-22",
    "year": 2026,
    "rating": 7.0,
    "runtime": 113,
    "overview": "Two colleagues become stranded on a deserted island, the only survivors of a plane crash. On the island, they must overcome past grievances and work together to survive, but ultimately, it's a battle of wills and wits to make it out alive.",
    "poster": "assets/posters/send-help.jpg",
    "backdrop": "assets/backdrops/send-help.jpg"
  },
  {
    "id": "goat",
    "title": "GOAT",
    "status": "trending",
    "genres": [
      "Animation",
      "Comedy",
      "Family"
    ],
    "releaseDate": "2026-02-11",
    "year": 2026,
    "rating": 8.0,
    "runtime": 100,
    "overview": "A small goat with big dreams gets a once-in-a-lifetime shot to join the pros and play roarball, a high-intensity, co-ed, full-contact sport dominated by the fastest, fiercest animals in the world.",
    "poster": "assets/posters/goat.jpg",
    "backdrop": "assets/backdrops/goat.jpg"
  },
  {
    "id": "hoppers",
    "title": "Hoppers",
    "status": "trending",
    "genres": [
      "Animation",
      "Adventure",
      "Comedy",
      "Family",
      "Sci-Fi"
    ],
    "releaseDate": "2026-03-04",
    "year": 2026,
    "rating": 8.1,
    "runtime": 104,
    "overview": "Scientists have discovered how to 'hop' human consciousness into lifelike robotic animals, allowing people to communicate with animals as animals. Animal lover Mabel seizes an opportunity to use the technology, uncovering mysteries within the animal world beyond anything she could have imagined.",
    "poster": "assets/posters/hoppers.jpg",
    "backdrop": "assets/backdrops/hoppers.jpg"
  },
  {
    "id": "zootopia-2",
    "title": "Zootopia 2",
    "status": "trending",
    "genres": [
      "Adventure",
      "Animation",
      "Comedy",
      "Mystery",
      "Family"
    ],
    "releaseDate": "2025-11-26",
    "year": 2025,
    "rating": 7.7,
    "runtime": 108,
    "overview": "After cracking the biggest case in Zootopia's history, rookie cops Judy Hopps and Nick Wilde find themselves on the twisting trail of a great mystery when Gary De'Snake arrives and turns the animal metropolis upside down. To crack the case, Judy and Nick must go undercover to unexpected new parts of town, where their growing partnership is tested like never before.",
    "poster": "assets/posters/zootopia-2.jpg",
    "backdrop": "assets/backdrops/zootopia-2.jpg"
  },
  {
    "id": "shelter",
    "title": "Shelter",
    "status": "trending",
    "genres": [
      "Action",
      "Crime",
      "Thriller"
    ],
    "releaseDate": "2026-01-28",
    "year": 2026,
    "rating": 7.7,
    "runtime": 107,
    "overview": "A man living in self-imposed exile on a remote island rescues a young girl from a violent storm, setting off a chain of events that forces him out of seclusion to protect her from enemies tied to his past.",
    "poster": "assets/posters/shelter.jpg",
    "backdrop": "assets/backdrops/shelter.jpg"
  },
  {
    "id": "the-bluff",
    "title": "The Bluff",
    "status": "trending",
    "genres": [
      "Drama",
      "Action",
      "Thriller"
    ],
    "releaseDate": "2026-02-17",
    "year": 2026,
    "rating": 6.7,
    "runtime": 103,
    "overview": "When her tranquil life on a remote island is shattered by the return of her vengeful former captain, a skilled ex-pirate must confront her bloody past and unleash her deadly talents to save her family from a ruthless siege.",
    "poster": "assets/posters/the-bluff.jpg",
    "backdrop": "assets/backdrops/the-bluff.jpg"
  },
  {
    "id": "project-hail-mary",
    "title": "Project Hail Mary",
    "status": "trending",
    "genres": [
      "Sci-Fi",
      "Adventure"
    ],
    "releaseDate": "2026-03-15",
    "year": 2026,
    "rating": 8.6,
    "runtime": 157,
    "overview": "Science teacher Ryland Grace wakes up on a spaceship light years from home with no recollection of who he is or how he got there. As his memory returns, he begins to uncover his mission: solve the riddle of the mysterious substance causing the sun to die out. He must call on his scientific knowledge and unorthodox ideas to save everything on Earth from extinction.",
    "poster": "assets/posters/project-hail-mary.jpg",
    "backdrop": "assets/backdrops/project-hail-mary.jpg"
  },
  {
    "id": "the-hunger-games-sunrise-on-the-reaping",
    "title": "The Hunger Games: Sunrise on the Reaping",
    "status": "now-showing",
    "genres": [
      "Sci-Fi",
      "Action",
      "Adventure"
    ],
    "releaseDate": "2026-11-18",
    "year": 2026,
    "rating": 7.7,
    "runtime": 159,
    "overview": "Return to the world of Panem 24 years before Katniss Everdeen volunteers in her sister's place, commencing on the morning of the reaping of the 50th Hunger Games, also known as the Second Quarter Quell.",
    "poster": "assets/posters/the-hunger-games-sunrise-on-the-reaping.jpg",
    "backdrop": "assets/backdrops/the-hunger-games-sunrise-on-the-reaping.jpg"
  },
  {
    "id": "clayface",
    "title": "Clayface",
    "status": "now-showing",
    "genres": [
      "Horror",
      "Thriller",
      "Sci-Fi"
    ],
    "releaseDate": "2026-10-19",
    "year": 2026,
    "rating": 7.4,
    "runtime": 109,
    "overview": "Matt Hagen's meteoric rise from Gotham street kid to Hollywood leading man is tragically cut short when a local crime boss's actions leave him horribly disfigured. Abandoned by his team and with nothing left, Matt seeks out a cutting edge treatment that miraculously returns him to his former self… but also unexpectedly affects his grip on reality, spiraling him down a destructive path of all-consuming revenge.",
    "poster": "assets/posters/clayface.jpg",
    "backdrop": "assets/backdrops/clayface.jpg"
  },
  {
    "id": "the-cat-in-the-hat",
    "title": "The Cat in the Hat",
    "status": "now-showing",
    "genres": [
      "Animation",
      "Fantasy",
      "Adventure",
      "Family",
      "Comedy"
    ],
    "releaseDate": "2026-10-31",
    "year": 2026,
    "rating": 7.3,
    "runtime": 108,
    "overview": "Assigned his toughest mission yet, the Cat must cheer up siblings Gabby and Sebastian as they adjust to life in a new town. Known for pushing boundaries, this agent of chaos must prove himself or risk losing his magical hat forever.",
    "poster": "assets/posters/the-cat-in-the-hat.jpg",
    "backdrop": "assets/backdrops/the-cat-in-the-hat.jpg"
  },
  {
    "id": "focker-in-law",
    "title": "Focker In-Law",
    "status": "now-showing",
    "genres": [
      "Comedy",
      "Romance"
    ],
    "releaseDate": "2026-11-21",
    "year": 2026,
    "rating": 7.0,
    "runtime": 105,
    "overview": "Henry, son of Greg and Pam Focker, aims to marry Olivia, a strong-willed former hostage negotiator who appears to be his complete mismatch. To Greg's shock, father-in-law Jack Byrnes takes a liking to Olivia, and her unprecedented rise into his Circle of Trust sparks chaos in the family before Jack's 80th birthday party.",
    "poster": "assets/posters/focker-in-law.jpg",
    "backdrop": "assets/backdrops/focker-in-law.jpg"
  },
  {
    "id": "hexed",
    "title": "Hexed",
    "status": "now-showing",
    "genres": [
      "Animation",
      "Fantasy",
      "Family"
    ],
    "releaseDate": "2026-11-25",
    "year": 2026,
    "rating": 6.0,
    "runtime": 103,
    "overview": "An impulsive and unconventional teenage girl named Billie discovers secret magical abilities which, once unleashed, hurtle her into a spectacle-filled journey out of suburbia and into a vast witch realm called Hexe. Forced to team up with her cautious mother, Alice, they uncover family mysteries that could change the world of witches forever.",
    "poster": "assets/posters/hexed.jpg",
    "backdrop": "assets/backdrops/hexed.jpg"
  },
  {
    "id": "wildwood",
    "title": "Wildwood",
    "status": "now-showing",
    "genres": [
      "Animation",
      "Adventure",
      "Fantasy"
    ],
    "releaseDate": "2026-10-22",
    "year": 2026,
    "rating": 8.5,
    "runtime": 132,
    "overview": "Prue and her classmate Curtis are drawn into a magical forest filled with enchanted creatures, loyal allies, and formidable adversaries as they embark on a desperate quest to rescue Prue's abducted baby brother from a murder of crows led by a mysterious woman named Alexandra.",
    "poster": "assets/posters/wildwood.jpg",
    "backdrop": "assets/backdrops/wildwood.jpg"
  },
  {
    "id": "how-to-rob-a-bank",
    "title": "How to Rob a Bank",
    "status": "now-showing",
    "genres": [
      "Action",
      "Crime",
      "Thriller"
    ],
    "releaseDate": "2026-11-10",
    "year": 2026,
    "rating": 6.6,
    "runtime": 122,
    "overview": "A crew of social media-savvy bank robbers broadcasts their daring heists, unaware that their growing viral fame has put them in the crosshairs of a veteran FBI agent and a brilliant software engineer. Despite the unlikely duo closing in, the crime ring pushes past their limits, putting everything on the line for their most ambitious heist yet.",
    "poster": "assets/posters/how-to-rob-a-bank.jpg",
    "backdrop": "assets/backdrops/how-to-rob-a-bank.jpg"
  },
  {
    "id": "ebenezer",
    "title": "Ebenezer",
    "status": "now-showing",
    "genres": [
      "Fantasy",
      "Comedy"
    ],
    "releaseDate": "2026-11-11",
    "year": 2026,
    "rating": 7.6,
    "runtime": 115,
    "overview": "An elderly miser embarks on a supernatural journey after visits from the ghost of his former business partner and the Spirits of Christmas Past, Present, and Yet to Come force him to confront his past and fight for a second chance at happiness.",
    "poster": "assets/posters/ebenezer.jpg",
    "backdrop": "assets/backdrops/ebenezer.jpg"
  },
  {
    "id": "avengers-doomsday",
    "title": "Avengers: Doomsday",
    "status": "coming-soon",
    "genres": [
      "Sci-Fi",
      "Action",
      "Adventure"
    ],
    "releaseDate": "2026-12-16",
    "year": 2026,
    "rating": null,
    "runtime": 165,
    "overview": "Beloved heroes from three distinct universes are set on a deadly collision course and face an existential threat unlike anything they've ever encountered.",
    "poster": "assets/posters/avengers-doomsday.jpg",
    "backdrop": "assets/backdrops/avengers-doomsday.jpg"
  },
  {
    "id": "dune-part-three",
    "title": "Dune: Part Three",
    "status": "coming-soon",
    "genres": [
      "Sci-Fi",
      "Adventure"
    ],
    "releaseDate": "2026-12-15",
    "year": 2026,
    "rating": null,
    "runtime": 150,
    "overview": "Nearly two decades after he seized control of the Imperium, Paul Atreides is now a ruthless Emperor, and must face the consequences of his reign as old allies return, terrifying new threats emerge, and betrayal lurks in every shadow. Haunted by visions of Imperial collapse and the reappearance of his long-lost love, Paul is drawn into a sweeping conspiracy, with Chani at the heart of its unfolding mystery. As enemies close in, Paul must confront the true cost of power and the fate of those he loves the most.",
    "poster": "assets/posters/dune-part-three.jpg",
    "backdrop": "assets/backdrops/dune-part-three.jpg"
  },
  {
    "id": "violent-night-2",
    "title": "Violent Night 2",
    "status": "coming-soon",
    "genres": [
      "Action",
      "Comedy"
    ],
    "releaseDate": "2026-12-02",
    "year": 2026,
    "rating": 5.8,
    "runtime": 110,
    "overview": "When Santa forgets the true meaning of Christmas, he finds himself in the heart of a lively mall community in desperate need of his help. Sapped of his magic, he’ll need another way to take on the goons threatening the mall, and time is running out. Santa has to rediscover his faith in goodness and call in some last-minute reinforcements from the one person no baddie wants to tangle with: Mrs. Claus.",
    "poster": "assets/posters/violent-night-2.jpg",
    "backdrop": "assets/backdrops/violent-night-2.jpg"
  },
  {
    "id": "the-angry-birds-movie-3",
    "title": "The Angry Birds Movie 3",
    "status": "coming-soon",
    "genres": [
      "Adventure",
      "Animation",
      "Comedy",
      "Family"
    ],
    "releaseDate": "2026-12-23",
    "year": 2026,
    "rating": null,
    "runtime": 96,
    "overview": "Red faces his greatest challenge yet—surviving fatherhood… while saving the world.",
    "poster": "assets/posters/the-angry-birds-movie-3.jpg",
    "backdrop": "assets/backdrops/the-angry-birds-movie-3.jpg"
  },
  {
    "id": "the-gallerist",
    "title": "The Gallerist",
    "status": "coming-soon",
    "genres": [
      "Comedy",
      "Drama"
    ],
    "releaseDate": "2026-12-04",
    "year": 2026,
    "rating": null,
    "runtime": 94,
    "overview": "Set against the glittering excess of Art Basel Miami, a desperate gallery owner conspires to pass off an accidental corpse as the centerpiece of her debut show.",
    "poster": "assets/posters/the-gallerist.jpg",
    "backdrop": "assets/backdrops/the-gallerist.jpg"
  },
  {
    "id": "black-adam",
    "title": "Black Adam",
    "status": "catalog",
    "genres": [
      "Action",
      "Adventure",
      "Sci-Fi"
    ],
    "releaseDate": "2022-10-19",
    "year": 2022,
    "rating": 6.7,
    "runtime": 125,
    "overview": "Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods—and imprisoned just as quickly—Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.",
    "poster": "assets/posters/black-adam.jpg",
    "backdrop": "assets/backdrops/black-adam.jpg"
  },
  {
    "id": "black-panther-wakanda-forever",
    "title": "Black Panther: Wakanda Forever",
    "status": "catalog",
    "genres": [
      "Action",
      "Adventure",
      "Sci-Fi"
    ],
    "releaseDate": "2022-11-09",
    "year": 2022,
    "rating": 7.0,
    "runtime": 162,
    "overview": "Queen Ramonda, Shuri, M’Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T’Challa’s death.  As the Wakandans strive to embrace their next chapter, the heroes must band together with the help of War Dog Nakia and Everett Ross and forge a new path for the kingdom of Wakanda.",
    "poster": "assets/posters/black-panther-wakanda-forever.jpg",
    "backdrop": "assets/backdrops/black-panther-wakanda-forever.jpg"
  },
  {
    "id": "avatar-the-way-of-water",
    "title": "Avatar: The Way of Water",
    "status": "catalog",
    "genres": [
      "Action",
      "Adventure",
      "Sci-Fi"
    ],
    "releaseDate": "2022-12-14",
    "year": 2022,
    "rating": 7.6,
    "runtime": 192,
    "overview": "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    "poster": "assets/posters/avatar-the-way-of-water.jpg",
    "backdrop": "assets/backdrops/avatar-the-way-of-water.jpg"
  },
  {
    "id": "sinners",
    "title": "Sinners",
    "status": "catalog",
    "genres": [
      "Horror",
      "Action",
      "Thriller"
    ],
    "releaseDate": "2025-04-16",
    "year": 2025,
    "rating": 7.5,
    "runtime": 138,
    "overview": "Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even greater evil is waiting to welcome them back.",
    "poster": "assets/posters/sinners.jpg",
    "backdrop": "assets/backdrops/sinners.jpg"
  },
  {
    "id": "one-battle-after-another",
    "title": "One Battle After Another",
    "status": "catalog",
    "genres": [
      "Thriller",
      "Crime",
      "Comedy"
    ],
    "releaseDate": "2025-09-23",
    "year": 2025,
    "rating": 7.3,
    "runtime": 162,
    "overview": "Washed-up revolutionary Bob exists in a state of stoned paranoia, surviving off-grid with his spirited, self-reliant daughter, Willa. When his evil nemesis resurfaces after 16 years and she goes missing, the former radical scrambles to find her, father and daughter both battling the consequences of his past.",
    "poster": "assets/posters/one-battle-after-another.jpg",
    "backdrop": "assets/backdrops/one-battle-after-another.jpg"
  },
  {
    "id": "hamnet",
    "title": "Hamnet",
    "status": "catalog",
    "genres": [
      "Drama",
      "Romance"
    ],
    "releaseDate": "2025-11-26",
    "year": 2025,
    "rating": 7.7,
    "runtime": 125,
    "overview": "The powerful story of love and loss that inspired the creation of Shakespeare's timeless masterpiece, Hamlet.",
    "poster": "assets/posters/hamnet.jpg",
    "backdrop": "assets/backdrops/hamnet.jpg"
  },
  {
    "id": "wicked-for-good",
    "title": "Wicked: For Good",
    "status": "catalog",
    "genres": [
      "Fantasy",
      "Adventure",
      "Romance"
    ],
    "releaseDate": "2025-11-19",
    "year": 2025,
    "rating": 6.6,
    "runtime": 137,
    "overview": "As an angry mob rises against the Wicked Witch, Glinda and Elphaba must unite one last time with honesty and empathy to fulfill their shared destiny and change the fate of Oz forever.",
    "poster": "assets/posters/wicked-for-good.jpg",
    "backdrop": "assets/backdrops/wicked-for-good.jpg"
  }
];
