// ===== Series page: TV guide (search, filter, sort, evenings) + suggestion form =====

const series = [
  { id: 1, title: "Fleabag",         genre: "Comedy-drama", seasons: 2, episodes: 12,  hours: 5,    color: "t-teal",    text: "Sharp, funny and suddenly sad. Short episodes, big feelings." },
  { id: 2, title: "Chernobyl",       genre: "Drama",        seasons: 1, episodes: 5,   hours: 5.5,  color: "t-coral",   text: "The 1986 disaster, told hour by hour. Heavy, but hard to stop." },
  { id: 3, title: "The Queen's Gambit", genre: "Drama",     seasons: 1, episodes: 7,   hours: 6.5,  color: "t-violet",  text: "A girl, a chessboard and a very stylish 1960s. You do not need to know chess." },
  { id: 4, title: "Sherlock",        genre: "Crime",        seasons: 4, episodes: 13,  hours: 20,   color: "t-mustard", text: "Modern London, old Baker Street. Each episode is a full-length movie." },
  { id: 5, title: "Dark",            genre: "Sci-Fi",       seasons: 3, episodes: 26,  hours: 22,   color: "t-violet",  text: "A missing child in a small German town and a story that loops through time." },
  { id: 6, title: "Peaky Blinders",  genre: "Crime drama",  seasons: 6, episodes: 36,  hours: 35,   color: "t-coral",   text: "Birmingham, 1919. A family gang, sharp suits and big plans." },
  { id: 7, title: "Breaking Bad",    genre: "Crime drama",  seasons: 5, episodes: 62,  hours: 49,   color: "t-mustard", text: "A chemistry teacher makes one bad choice, then many more." },
  { id: 8, title: "The Office (US)", genre: "Comedy",       seasons: 9, episodes: 201, hours: 73,   color: "t-teal",    text: "Paper, desks and awkward silence. A comfort show you can start anywhere." }
];

const MAX_HOURS = 75;    // the full bar
let currentGroup = "all"; // all, short, medium or long
let hoursPerEvening = 2;

const guideList = document.getElementById("guide-list");
const searchInput = document.getElementById("s-search");
const sortSelect = document.getElementById("s-sort");
const hoursInput = document.getElementById("s-hours");
const countText = document.getElementById("s-count");
const emptyBox = document.getElementById("s-empty");
const filterButtons = document.querySelectorAll(".filter-btn");

// Which group is the series in? (by total hours)
function getGroup(hours) {
  if (hours <= 10) return "short";
  if (hours <= 40) return "medium";
  return "long";
}

function showSeries() {
  const text = searchInput.value.trim().toLowerCase();
  const found = [];

  for (let i = 0; i < series.length; i++) {
    const item = series[i];
    const groupFits = currentGroup === "all" || getGroup(item.hours) === currentGroup;
    const textFits = item.title.toLowerCase().includes(text) || item.genre.toLowerCase().includes(text);
    if (groupFits && textFits) found.push(item);
  }

  // Sort
  if (sortSelect.value === "title") {
    found.sort(function (a, b) { return a.title.localeCompare(b.title); });
  } else if (sortSelect.value === "hours") {
    found.sort(function (a, b) { return a.hours - b.hours; });
  } else if (sortSelect.value === "episodes") {
    found.sort(function (a, b) { return a.episodes - b.episodes; });
  }

  // Draw the rows
  guideList.innerHTML = "";
  for (let i = 0; i < found.length; i++) {
    const item = found[i];
    const evenings = Math.ceil(item.hours / hoursPerEvening); // calculated value
    const width = Math.max(4, Math.round(item.hours / MAX_HOURS * 100));
    const number = item.id < 10 ? "0" + item.id : item.id;

    const row = document.createElement("article");
    row.className = "guide-row " + item.color;
    row.innerHTML =
      '<div class="guide-ch"><span class="ch-label">CH</span><span class="ch-num">' + number + '</span></div>' +
      '<div class="guide-info">' +
        '<h3>' + item.title + '</h3>' +
        '<p class="guide-meta">' + item.genre + ' · ' + item.seasons + ' season(s) · ' + item.episodes + ' episodes</p>' +
        '<p>' + item.text + '</p>' +
      '</div>' +
      '<div class="guide-meter">' +
        '<p class="meter-label">About ' + evenings + ' evenings</p>' +
        '<div class="progress" role="progressbar" aria-label="' + item.title + ': about ' + item.hours + ' hours of ' + MAX_HOURS + '" aria-valuenow="' + item.hours + '" aria-valuemin="0" aria-valuemax="' + MAX_HOURS + '">' +
          '<div class="progress-bar" style="width: ' + width + '%"></div>' +
        '</div>' +
        '<p class="meter-hours">About ' + item.hours + ' hours in total</p>' +
      '</div>';
    guideList.appendChild(row);
  }

  countText.textContent = "Showing " + found.length + " of " + series.length + " series";
  emptyBox.classList.toggle("d-none", found.length !== 0); // empty result
  $("#guide-list").stop(true, true).hide().fadeIn(250);   // jQuery effect
}

// Filter buttons
for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", function () {
    for (let j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
      filterButtons[j].setAttribute("aria-pressed", "false");
    }
    this.classList.add("active");
    this.setAttribute("aria-pressed", "true");
    currentGroup = this.dataset.filter;
    showSeries();
  });
}

searchInput.addEventListener("input", showSeries);
sortSelect.addEventListener("change", showSeries);

// Hours per evening: wrong input shows an error under the field
hoursInput.addEventListener("input", function () {
  const value = Number(hoursInput.value);
  if (hoursInput.value === "" || isNaN(value) || value < 0.5 || value > 12) {
    showFieldError(hoursInput, "Enter a number from 0.5 to 12.");
    return;
  }
  clearFieldError(hoursInput);
  hoursPerEvening = value;
  showSeries();
});

// jQuery effect: on hover the tape grows
$("#guide-list").on("mouseenter", ".guide-row", function () {
  $(this).find(".progress").stop(true).animate({ height: "22px" }, 200);
});
$("#guide-list").on("mouseleave", ".guide-row", function () {
  $(this).find(".progress").stop(true).animate({ height: "14px" }, 200);
});

// ----- Suggest a series form -----
const suggestForm = document.getElementById("suggest-form");

function getSuggestError(field) {
  const value = field.value.trim();

  if (field.id === "g-name") {
    if (value === "") return "Please enter your name.";
    if (value.length < 2 || !isNameValid(value)) return "Use at least 2 letters, no digits.";
  }
  if (field.id === "g-email") {
    if (value === "") return "Please enter your email.";
    if (!isEmailValid(value)) return "Enter a correct email, for example name@mail.com.";
  }
  if (field.id === "g-title") {
    if (value === "") return "Please enter the title of the series.";
    if (value.length < 2) return "The title must have at least 2 characters.";
  }
  if (field.id === "g-genre") {
    if (value === "") return "Please choose a genre.";
  }
  if (field.id === "g-seasons") {
    const seasons = Number(value);
    if (value === "") return "Please enter the number of seasons.";
    if (!Number.isInteger(seasons) || seasons < 1 || seasons > 30) return "Enter a whole number from 1 to 30.";
  }
  if (field.id === "g-comment") {
    if (value === "") return "Please tell us why we should add it.";
    if (value.length < 10) return "Write at least 10 characters.";
  }
  return "";
}

setupForm(suggestForm, getSuggestError, function () {
  const name = document.getElementById("g-name").value.trim();
  const title = document.getElementById("g-title").value.trim();
  document.getElementById("suggest-text").textContent =
    "Thank you, " + name + "! We will watch " + title + " this week and decide if it joins the guide.";
  $("#suggest-success").stop(true, true).hide().fadeIn(500); // jQuery effect: success message
});

// Smooth scroll to the form
$("#to-suggest").on("click", function (event) {
  event.preventDefault();
  $("html, body").stop(true).animate({ scrollTop: $("#suggest").offset().top - 70 }, 600);
});

showSeries();