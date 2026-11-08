// Shared data: the 8 movies of Row Five.
// Used by picker.js (picker, table, booking form) and catalog.js (posters).
const movies = [
  { id: 1, title: "The Grand Budapest Hotel", poster: "https://s1.afisha.ru/mediastorage/24/b5/687ddb862d9443df956e0cf2b524.jpg", year: 2014, genre: "Comedy",    mood: "laugh",  length: "short", minutes: 99,  color: "t-mustard", text: "A hotel, a thief and a lot of pastel." },
  { id: 2, title: "Knives Out", poster: "https://m.media-amazon.com/images/S/pv-target-images/d9d2d1ec786a966c11727f54c4965c2e2a3ac3e7c965b34be5fdb27b5a5cfd0b.jpg",               year: 2019, genre: "Mystery",   mood: "laugh",  length: "long",  minutes: 130, color: "t-mustard", text: "One family, one mystery, one very curious detective." },
  { id: 3, title: "Whiplash", poster: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10488558_p_v12_ai.jpg",                 year: 2014, genre: "Drama",     mood: "thrill", length: "short", minutes: 107, color: "t-coral",   text: "A young drummer and a teacher who is never satisfied." },
  { id: 4, title: "The Dark Knight", poster: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",          year: 2008, genre: "Action",    mood: "thrill", length: "long",  minutes: 152, color: "t-coral",   text: "Batman against the Joker. Hold on to your popcorn." },
  { id: 5, title: "Ex Machina", poster: "https://m.media-amazon.com/images/I/71UxhMFjSlL._AC_UF894,1000_QL80_.jpg",               year: 2014, genre: "Sci-Fi",    mood: "mind",   length: "short", minutes: 108, color: "t-violet",  text: "One house, three people and a very clever machine." },
  { id: 6, title: "Interstellar", poster: "https://m.media-amazon.com/images/I/716P1xCmnPL.jpg",             year: 2014, genre: "Sci-Fi",    mood: "mind",   length: "long",  minutes: 169, color: "t-violet",  text: "For the night you want to look at the stars." },
  { id: 7, title: "Coco", poster: "https://i.pinimg.com/736x/bf/c3/49/bfc349d5a88a141d6c27ffa79ada0c2d.jpg",                     year: 2017, genre: "Animation", mood: "feel",   length: "short", minutes: 105, color: "t-teal",    text: "Music, family and a night where you may need a tissue." },
  { id: 8, title: "Forrest Gump", poster: "https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_.jpg",             year: 1994, genre: "Drama",     mood: "feel",   length: "long",  minutes: 142, color: "t-teal",    text: "One simple man walks through fifty years of history." }
];

// Names of the moods (used for the table and the filter)
const moodNames = {
  laugh: "I want to laugh",
  thrill: "Edge of my seat",
  mind: "Blow my mind",
  feel: "I want to feel"
};