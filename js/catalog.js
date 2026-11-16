// ===== Catalog page =====
// Search + filter + sort + watchlist with total time.

let currentMood = "all"; // the mood chosen with the buttons
let watchlist = RowFive.items()
  .filter(item => item.type === "movie")
  .map(item => Number(item.key.replace("movie-", "")));

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const movieList = document.getElementById("movie-list");
const noResults = document.getElementById("no-results");
const countText = document.getElementById("movie-count");
const filterButtons = document.querySelectorAll(".filter-btn");

// Turn minutes into text: 169 -> "2 h 49 min"
function formatTime(minutes) {
  return Math.floor(minutes / 60) + " h " + (minutes % 60) + " min";
}

// Find a movie by its id
function getMovieById(id) {
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].id === id) return movies[i];
  }
  return null;
}

// Make the list of movies that fit the search text and the mood
function getFoundMovies() {
  const text = searchInput.value.trim().toLowerCase();
  const found = [];

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const moodFits = currentMood === "all" || movie.mood === currentMood;
    const textFits = movie.title.toLowerCase().includes(text) || movie.genre.toLowerCase().includes(text);
    if (moodFits && textFits) found.push(movie);
  }

  // Sort the result
  const sortBy = sortSelect.value;
  if (sortBy === "title") {
    found.sort(function (a, b) { return a.title.localeCompare(b.title); });
  } else if (sortBy === "year") {
    found.sort(function (a, b) { return a.year - b.year; });
  } else if (sortBy === "minutes") {
    found.sort(function (a, b) { return a.minutes - b.minutes; });
  }
  return found;
}

// Draw the posters
function showMovies() {
  const found = getFoundMovies();
  movieList.innerHTML = "";

  for (let i = 0; i < found.length; i++) {
    const movie = found[i];
    const saved = watchlist.indexOf(movie.id) !== -1;

    const column = document.createElement("div");
    column.className = "col-12 col-sm-6 col-lg-3";
    column.innerHTML =
      '<article class="poster ' + movie.color + '">' +
        '<div class="poster-art has-poster">' +
          '<img class="poster-img" src="' + movie.poster + '" alt="Poster of ' + movie.title + ' (' + movie.year + ')" loading="lazy">' +
          '<span class="poster-year">' + movie.year + '</span>' +
        '</div>' +
        '<div class="poster-info">' +
          '<h3>' + movie.title + '</h3>' +
          '<p class="poster-meta">' + movie.genre + ' · ' + movie.minutes + ' min</p>' +
          '<p>' + movie.text + '</p>' +
          '<span class="poster-tag">' + movie.mood + ', ' + movie.length + '</span>' +
          '<button type="button" class="btn watch-btn' + (saved ? ' saved' : '') + '" data-id="' + movie.id + '" aria-pressed="' + saved + '">' +
            (saved ? 'In my watchlist' : 'Add to watchlist') +
          '</button>' +
        '</div>' +
      '</article>';
    movieList.appendChild(column);
  }

  // Empty result
  noResults.classList.toggle("d-none", found.length !== 0);
  countText.textContent = "Showing " + found.length + " of " + movies.length + " movies";

  // jQuery effect 1: the posters fade in
  $("#movie-list").stop(true, true).hide().fadeIn(250);
}

// Draw the watchlist panel and calculate the total time
function showWatchlist() {
  const listBox = document.getElementById("watch-items");
  let totalMinutes = 0;
  listBox.innerHTML = "";

  for (let i = 0; i < watchlist.length; i++) {
    const movie = getMovieById(watchlist[i]);
    if (!movie) continue;

    totalMinutes = totalMinutes + movie.minutes;

    const item = document.createElement("li");
    item.textContent = movie.title + " (" + movie.minutes + " min)";
    listBox.appendChild(item);
  }

  document.getElementById("watch-count").textContent = watchlist.length;
  document.getElementById("watch-empty").classList.toggle("d-none", watchlist.length !== 0);
  document.getElementById("watch-total").textContent =
    watchlist.length === 0 ? "" : "Total time: " + formatTime(totalMinutes);
}

// If a poster file is missing, remove the broken image and keep the colored art
movieList.addEventListener("error", function (event) {
  if (event.target.tagName === "IMG") {
    event.target.parentElement.classList.remove("has-poster");
    event.target.remove();
  }
}, true);

// Click on "Add to watchlist" (one listener for all posters)
movieList.addEventListener("click", function (event) {
  const button = event.target.closest(".watch-btn");
  if (!button) return;

  const movie = getMovieById(Number(button.dataset.id));

  if (movie) {
    RowFive.toggle({
      key: "movie-" + movie.id,
      type: "movie",
      title: movie.title,
      minutes: movie.minutes
    });
  }
});

window.addEventListener("rowfive:change", function () {
  watchlist = RowFive.items()
    .filter(item => item.type === "movie")
    .map(item => Number(item.key.replace("movie-", "")));

  showWatchlist();

  movieList.querySelectorAll(".watch-btn").forEach(function (button) {
    const saved = RowFive.has("movie-" + button.dataset.id);

    button.classList.toggle("saved", saved);
    button.textContent = saved ? "In my watchlist" : "Add to watchlist";
    button.setAttribute("aria-pressed", String(saved));
  });
});
  

// Mood buttons
for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", function () {
    for (let j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
      filterButtons[j].setAttribute("aria-pressed", "false");
    }
    this.classList.add("active");
    this.setAttribute("aria-pressed", "true");
    currentMood = this.dataset.filter;
    showMovies();
  });
}

// Search and sort
searchInput.addEventListener("input", showMovies);
sortSelect.addEventListener("change", showMovies);

// jQuery effect 2: the watchlist panel slides open and closed
$("#watch-toggle").on("click", function () {
  const isOpen = $(this).attr("aria-expanded") === "true";
  $(this).attr("aria-expanded", !isOpen);
  $("#watch-panel").stop(true, true).slideToggle(300);
});

// jQuery effect 3 (hover): the poster picture grows. stop(true) stops the old animation
$("#movie-list").on("mouseenter", ".poster", function () {
  $(this).find(".poster-art").stop(true, true).animate({ minHeight: "200px" }, 200);
});
$("#movie-list").on("mouseleave", ".poster", function () {
  $(this).find(".poster-art").stop(true, true).animate({ minHeight: "170px" }, 200);
});

// Start
showMovies();
showWatchlist();