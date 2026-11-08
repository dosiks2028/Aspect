// ===== Home page: trending votes + join the club form =====

const trending = [
  { id: 1, title: "Interstellar",    genre: "Sci-Fi",    color: "t-coral",   votes: 0, text: "For the night you want to look at the stars." },
  { id: 2, title: "Parasite",        genre: "Thriller",  color: "t-teal",    votes: 0, text: "Starts like a comedy. Ends nothing like one." },
  { id: 3, title: "Inception",       genre: "Sci-Fi",    color: "t-violet",  votes: 0, text: "A dream inside a dream. Put your phone away." },
  { id: 4, title: "The Matrix",      genre: "Sci-Fi",    color: "t-mustard", votes: 0, text: "A classic that is always fun to watch again." },
  { id: 5, title: "Spirited Away",   genre: "Animation", color: "t-coral",   votes: 0, text: "A girl, a bathhouse and a world full of spirits." },
  { id: 6, title: "Gladiator",       genre: "Action",    color: "t-teal",    votes: 0, text: "A general becomes a slave and wants his revenge." },
  { id: 7, title: "La La Land",      genre: "Musical",   color: "t-violet",  votes: 0, text: "Jazz, Los Angeles and two people with big dreams." },
  { id: 8, title: "The Godfather",   genre: "Crime",     color: "t-mustard", votes: 0, text: "A family business that nobody can refuse." }
];

const trendList = document.getElementById("trend-list");
const genreSelect = document.getElementById("genre");
const votesInfo = document.getElementById("votes-info");

function voteText(number) {
  return number === 1 ? "1 vote" : number + " votes";
}

// Fill the genre select with the genres from the array (each genre once)
function fillGenres() {
  const used = [];
  for (let i = 0; i < trending.length; i++) {
    if (used.indexOf(trending[i].genre) === -1) {
      used.push(trending[i].genre);
      const option = document.createElement("option");
      option.value = trending[i].genre;
      option.textContent = trending[i].genre;
      genreSelect.appendChild(option);
    }
  }
}

// Draw the tickets of the chosen genre
function showTrending() {
  trendList.innerHTML = "";

  for (let i = 0; i < trending.length; i++) {
    const film = trending[i];
    if (genreSelect.value !== "all" && film.genre !== genreSelect.value) continue;

    const column = document.createElement("div");
    column.className = "col-12 col-sm-6 col-lg-3";
    column.innerHTML =
      '<article class="ticket ' + film.color + '">' +
        '<div class="ticket-main">' +
          '<h3>' + film.title + '</h3>' +
          '<p class="genre">' + film.genre + '</p>' +
          '<p>' + film.text + '</p>' +
          '<button type="button" class="btn vote-btn" data-id="' + film.id + '">Vote</button>' +
        '</div>' +
        '<div class="ticket-stub">Row 5 · Seat ' + film.id + ' · <span class="vote-count">' + voteText(film.votes) + '</span></div>' +
      '</article>';
    trendList.appendChild(column);
  }
  $("#trend-list").stop(true, true).hide().fadeIn(250); // jQuery effect
}

// Calculate the total number of votes and find the leader
function showVotesInfo() {
  let total = 0;
  let leader = trending[0];
  for (let i = 0; i < trending.length; i++) {
    total = total + trending[i].votes;
    if (trending[i].votes > leader.votes) leader = trending[i];
  }
  votesInfo.textContent = total === 0
    ? "Total votes: 0. Be the first to vote!"
    : "Total votes: " + total + ". Leader: " + leader.title + ".";
}

// Click on "Vote" (one listener for all tickets)
trendList.addEventListener("click", function (event) {
  if (!event.target.classList.contains("vote-btn")) return;

  const id = Number(event.target.dataset.id);
  for (let i = 0; i < trending.length; i++) {
    if (trending[i].id === id) {
      trending[i].votes = trending[i].votes + 1;
      const counter = event.target.closest(".ticket").querySelector(".vote-count");
      counter.textContent = voteText(trending[i].votes);
      $(counter).stop(true, true).fadeTo(100, 0.3).fadeTo(150, 1); // jQuery effect: blink
    }
  }
  showVotesInfo();
});

genreSelect.addEventListener("change", showTrending);

// ----- Join the club form -----
const joinForm = document.getElementById("join-form");

function getJoinError(field) {
  const value = field.value.trim();

  if (field.id === "j-name") {
    if (value === "") return "Please enter your name.";
    if (value.length < 2 || !isNameValid(value)) return "Use at least 2 letters, no digits.";
  }
  if (field.id === "j-email") {
    if (value === "") return "Please enter your email.";
    if (!isEmailValid(value)) return "Enter a correct email, for example name@mail.com.";
  }
  if (field.id === "j-password") {
    if (field.value === "") return "Please create a password.";
    if (field.value.length < 8) return "The password must have at least 8 characters.";
    if (!/[A-Za-z]/.test(field.value) || !/[0-9]/.test(field.value)) return "Use letters and digits together.";
  }
  if (field.id === "j-confirm") {
    if (field.value === "") return "Please repeat the password.";
    if (field.value !== document.getElementById("j-password").value) return "The passwords do not match.";
  }
  if (field.id === "j-mood") {
    if (value === "") return "Please choose your favorite mood.";
  }
  return "";
}

setupForm(joinForm, getJoinError, function () {
  const name = document.getElementById("j-name").value.trim();
  const mood = document.getElementById("j-mood").value;
  document.getElementById("join-text").textContent =
    "Welcome, " + name + "! Your club card is ready. We will send you " + mood + " movies.";
  $("#join-success").stop(true, true).hide().fadeIn(500); // jQuery effect: success message
});

// ----- jQuery effects -----
$(".screen").hide().fadeIn(700); // the hero screen turns on

// Smooth scroll to the club form
$("#to-join").on("click", function (event) {
  event.preventDefault();
  $("html, body").stop(true).animate({ scrollTop: $($(this).attr("href")).offset().top - 70 }, 600);
});

// Start
fillGenres();
showTrending();
showVotesInfo();