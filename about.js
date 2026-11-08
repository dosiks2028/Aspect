// ===== About page: FAQ (search + jQuery accordion) + feedback form =====

const faqs = [
  { id: 1, category: "Movies",  question: "Where can I watch these movies?",  answer: "We do not stream anything. Row Five only helps you choose. Then you open your favorite service and press play." },
  { id: 2, category: "Movies",  question: "How do you choose the movies?",    answer: "We picked them by hand. For every mood we chose one short and one long movie that we would happily watch again." },
  { id: 3, category: "Website", question: "Is this a real company?",          answer: "No, it is a student project made for the Web Technologies 1 course." },
  { id: 4, category: "Movies",  question: "Can I suggest a movie?",           answer: "Yes. Use the form on this page and tell us the title. We read every message." },
  { id: 5, category: "Club",    question: "How much is one seat?",            answer: "A seat at our movie night costs 1500 tenge. You can reserve it on the Movie Picker page." },
  { id: 6, category: "Club",    question: "Do I need to pay online?",         answer: "No. This is a student project without a backend, so the reservation form does not take any money." },
  { id: 7, category: "Website", question: "Are the series times exact?",      answer: "They are close. We count the length of all episodes and round it. We also count two hours per evening." },
  { id: 8, category: "Website", question: "Does the website work on a phone?", answer: "Yes. Every page is made for 375px, 768px and 1280px screens." }
];

const faqBox = document.getElementById("faq");
const faqSearch = document.getElementById("faq-search");
const faqCategory = document.getElementById("faq-category");
const faqCount = document.getElementById("faq-count");
const faqEmpty = document.getElementById("faq-empty");

// Draw the questions that fit the search text and the category
function showFaq() {
  const text = faqSearch.value.trim().toLowerCase();
  let shown = 0;
  faqBox.innerHTML = "";

  for (let i = 0; i < faqs.length; i++) {
    const item = faqs[i];
    const categoryFits = faqCategory.value === "all" || item.category === faqCategory.value;
    const textFits = item.question.toLowerCase().includes(text) || item.answer.toLowerCase().includes(text);
    if (!categoryFits || !textFits) continue;

    const element = document.createElement("div");
    element.className = "accordion-item";
    element.innerHTML =
      '<h3 class="accordion-header">' +
        '<button class="accordion-button collapsed" type="button" aria-expanded="false">' + item.question + '</button>' +
      '</h3>' +
      '<div class="accordion-collapse" style="display: none;">' +
        '<div class="accordion-body">' + item.answer + '</div>' +
      '</div>';
    faqBox.appendChild(element);
    shown = shown + 1;
  }

  faqCount.textContent = "Showing " + shown + " of " + faqs.length + " questions";
  faqEmpty.classList.toggle("d-none", shown !== 0); // empty result
}

faqSearch.addEventListener("input", showFaq);
faqCategory.addEventListener("change", showFaq);

// jQuery accordion: open one answer, close the others
$("#faq").on("click", ".accordion-button", function () {
  const panel = $(this).closest(".accordion-item").find(".accordion-collapse");

  $(".accordion-collapse").not(panel).stop(true, true).slideUp(250);
  $(".accordion-button").not(this).addClass("collapsed").attr("aria-expanded", "false");

  panel.stop(true, true).slideToggle(250);
  $(this).toggleClass("collapsed");
  $(this).attr("aria-expanded", !$(this).hasClass("collapsed"));
});

// ----- Feedback form -----
const feedbackForm = document.getElementById("feedback-form");

function getFeedbackError(field) {
  const value = field.value.trim();

  if (field.id === "f-name") {
    if (value === "") return "Please enter your name.";
    if (value.length < 2 || !isNameValid(value)) return "Use at least 2 letters, no digits.";
  }
  if (field.id === "f-email") {
    if (value === "") return "Please enter your email.";
    if (!isEmailValid(value)) return "Enter a correct email, for example name@mail.com.";
  }
  if (field.id === "f-topic") {
    if (value === "") return "Please choose a topic.";
  }
  if (field.id === "f-rating") {
    const rating = Number(value);
    if (value === "") return "Please rate the website.";
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "Choose a whole number from 1 to 5.";
  }
  if (field.id === "f-message") {
    if (value === "") return "Please write a message.";
    if (value.length < 10) return "The message must have at least 10 characters.";
  }
  return "";
}

setupForm(feedbackForm, getFeedbackError, function () {
  const name = document.getElementById("f-name").value.trim();
  document.getElementById("feedback-text").textContent =
    "Thank you, " + name + "! Your message is on its way to the crew.";
  $("#feedback-success").stop(true, true).hide().fadeIn(500); // jQuery effect: success message
});

// Smooth scroll to the form
$("#to-feedback").on("click", function (event) {
  event.preventDefault();
  $("html, body").stop(true).animate({ scrollTop: $("#feedback").offset().top - 70 }, 600);
});

// Hover effect on the crew cards
$(".cast").hover(
  function () { $(this).stop(true).fadeTo(150, 0.9); },
  function () { $(this).stop(true).fadeTo(150, 1); }
);

showFaq();