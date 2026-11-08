// ===== Movie Picker page =====
// Part 1: mood form -> ticket.  Part 2: table.  Part 3: booking form.

const SEAT_PRICE = 1500; // tenge per seat

// ---------- Part 1: mood form ----------
const pickerForm = document.getElementById("picker-form");
const pickerError = document.getElementById("picker-error");
const result = document.getElementById("result");

// Find the movie for a mood and a length
function findMovie(mood, length) {
  for (let i = 0; i < movies.length; i++) {
    if (movies[i].mood === mood && movies[i].length === length) {
      return movies[i];
    }
  }
  return null;
}

pickerForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stay on the page

  const mood = pickerForm.elements["mood"].value;     // "" if nothing is chosen
  const length = pickerForm.elements["duration"].value;

  // Wrong input: one of the questions is not answered
  if (mood === "" || length === "") {
    pickerError.textContent = "Please answer both questions to get your ticket.";
    pickerError.hidden = false;
    return;
  }
  pickerError.hidden = true;

  const movie = findMovie(mood, length);
  result.innerHTML =
    '<article class="ticket ' + movie.color + '">' +
      '<div class="ticket-main">' +
        '<h3>' + movie.title + '</h3>' +
        '<p class="genre">' + movie.genre + ' · ' + movie.year + '</p>' +
        '<p>' + movie.text + '</p>' +
      '</div>' +
      '<div class="ticket-stub">Row 5 · ' + movie.minutes + ' min</div>' +
    '</article>';

  // jQuery effect 1: the ticket slides down. stop(true, true) finishes the old animation first
  $("#result .ticket").stop(true, true).hide().slideDown(400);
});

// Hide the error as soon as the visitor chooses an answer
pickerForm.addEventListener("change", function () {
  pickerError.hidden = true;
});

// ---------- Part 2: table made from the array ----------
const tableBody = document.getElementById("programme-body");

function buildTable() {
  for (const mood in moodNames) {
    const shortMovie = findMovie(mood, "short");
    const longMovie = findMovie(mood, "long");

    const row = document.createElement("tr");
    row.innerHTML =
      '<th scope="row">' + moodNames[mood] + '</th>' +
      '<td>' + shortMovie.title + ', ' + shortMovie.minutes + ' min</td>' +
      '<td>' + longMovie.title + ', ' + longMovie.minutes + ' min</td>';
    tableBody.appendChild(row);
  }
}
buildTable();

// ---------- Part 3: booking form ----------
const bookingForm = document.getElementById("booking-form");
const movieSelect = document.getElementById("movie");
const seatsInput = document.getElementById("seats");
const totalText = document.getElementById("total");
const fields = bookingForm.querySelectorAll(".form-control, .form-select");

// Fill the select with the movies from the array
for (let i = 0; i < movies.length; i++) {
  const option = document.createElement("option");
  option.value = movies[i].id;
  option.textContent = movies[i].title;
  movieSelect.appendChild(option);
}

// Return an error text for one field, or "" if the field is correct
function getError(field) {
  const value = field.value.trim();

  if (field.id === "name") {
    if (value === "") return "Please enter your name.";
    if (value.length < 2) return "The name must have at least 2 letters.";
    if (!/^[A-Za-zА-Яа-яЁё\s'-]+$/.test(value)) return "The name can contain only letters.";
  }

  if (field.id === "email") {
    if (value === "") return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a correct email, for example name@mail.com.";
  }

  if (field.id === "phone") {
    const digits = value.replace(/[\s()-]/g, ""); // remove spaces, brackets and dashes
    if (value === "") return "Please enter your phone number.";
    if (!/^\+7\d{10}$/.test(digits)) return "Use the format +7 701 123 45 67.";
  }

  if (field.id === "movie") {
    if (value === "") return "Please choose a movie.";
  }

  if (field.id === "date") {
    if (value === "") return "Please choose a date.";
    const chosen = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (chosen < today) return "The date cannot be in the past.";
  }

  if (field.id === "seats") {
    const seats = Number(value);
    if (value === "") return "Please enter the number of seats.";
    if (!Number.isInteger(seats) || seats < 1 || seats > 6) return "Choose from 1 to 6 seats.";
  }

  return "";
}

// Show or remove the error under one field
function checkField(field) {
  const message = getError(field);
  const errorBox = field.parentElement.querySelector(".invalid-feedback");

  if (message === "") {
    field.classList.remove("is-invalid");
    errorBox.textContent = "";
    return true;
  }
  field.classList.add("is-invalid");
  errorBox.textContent = message;
  return false;
}

// Calculate the total price
function updateTotal() {
  const seats = Number(seatsInput.value);
  let total = 0;
  if (Number.isInteger(seats) && seats >= 1 && seats <= 6) {
    total = seats * SEAT_PRICE;
  }
  totalText.textContent = total + " ₸";
  return total;
}

// While typing: fix the error of the field at once, update the total
for (let i = 0; i < fields.length; i++) {
  const field = fields[i];
  field.addEventListener("input", function () {
    if (field.classList.contains("is-invalid")) {
      checkField(field); // the error disappears when the field is corrected
    }
    updateTotal();
    $("#success-box").stop(true, true).fadeOut(200); // jQuery effect 2
  });
  field.addEventListener("change", function () {
    if (field.classList.contains("is-invalid")) checkField(field);
  });
}

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let allCorrect = true;
  for (let i = 0; i < fields.length; i++) {
    if (!checkField(fields[i])) allCorrect = false;
  }
  if (!allCorrect) return; // errors are shown under the fields

  const name = document.getElementById("name").value.trim();
  const movieTitle = movieSelect.options[movieSelect.selectedIndex].textContent;
  const date = document.getElementById("date").value;
  const total = updateTotal();

  document.getElementById("success-text").textContent =
    "Thank you, " + name + "! " + seatsInput.value + " seat(s) for " + movieTitle +
    " on " + date + " are reserved. Total: " + total + " ₸.";

  bookingForm.reset();
  updateTotal();
  $("#success-box").stop(true, true).hide().fadeIn(500); // jQuery effect 2: success message
});

// ---------- jQuery effects ----------
// Effect 3: smooth scroll to the booking form
$("#to-reserve").on("click", function (event) {
  event.preventDefault();
  $("html, body").stop(true).animate({ scrollTop: $("#reserve").offset().top - 70 }, 600, function () {
    $("#name").focus();
  });
});

// Hover effect on the main buttons
$(".btn-seat").hover(
  function () { $(this).stop(true).fadeTo(150, 0.8); },
  function () { $(this).stop(true).fadeTo(150, 1); }
);
