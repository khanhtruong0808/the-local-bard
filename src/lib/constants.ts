export const genres = [
  "Comedy",
  "Classic",
  "Contemporary/Original",
  "Fantasy/Science",
  "Historical",
  "Tragedy",
  "Romance",
  "Mystery/Thriller",
  "Drama",
  "Musical",
] as const;

export const stageTypes = [
  "Proscenium",
  "Thrust",
  "Black Box",
  "Arena",
  "Outdoor",
  "Other",
] as const;

export const theaterTypes = [
  "High School",
  "Junior College",
  "Equity Theater",
  "Play House",
  "Other",
] as const;

export const commonProductions = [
  "The Lion King",
  "Les Misérables",
  "Wicked",
  "The Phantom of the Opera",
  "Hamilton",
  "The Book of Mormon",
  "Chicago",
  "Beauty and the Beast",
  "Mamma Mia!",
  "Rent",
  "A Chorus Line",
  "Cats",
  "Into the Woods",
  "West Side Story",
  "Grease",
  "Fiddler on the Roof",
  "Sweeney Todd",
  "The Sound of Music",
  "Oklahoma!",
  "Annie",
  "Cabaret",
  "Evita",
  "The Producers",
  "South Pacific",
  "My Fair Lady",
];

export const commonPlaywrigthts = [
  "Roger Allers",
  "Howard Ashman",
  "Alan Menken",
  "Tim Rice",
  "Stephen Schwartz",
  "Victor Hugo",
  "Alain Boublil",
  "Claude-Michel Schönberg",
  "Herbert Kretzmer",
  "Stephen Sondheim",
  "James Lapine",
  "William Shakespeare",
  "Jonathan Larson",
  "Andrew Lloyd Webber",
  "Charles Hart",
  "Richard Stilgoe",
  "Trey Parker",
];

// Sacramento, CA
export const defaultMapCenter = {
  lat: 38.576657,
  lng: -121.493652,
};

export const defaultMapZoom = 12;

// Because the poster and info window sizes are based on zoom level,
// only display text when zoom level is at least this value.
export const legibleZoom = 15;
