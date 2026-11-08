// Small helpers for form validation (used by home.js, about.js, series.js)

// Show an error text under a field
function showFieldError(field, message) {
  field.classList.add("is-invalid");
  field.parentElement.querySelector(".invalid-feedback").textContent = message;
}

// Remove the error under a field
function clearFieldError(field) {
  field.classList.remove("is-invalid");
  field.parentElement.querySelector(".invalid-feedback").textContent = "";
}

// Check one field with the function getError (it returns "" if the field is correct)
function validateField(field, getError) {
  const message = getError(field);
  if (message === "") {
    clearFieldError(field);
    return true;
  }
  showFieldError(field, message);
  return false;
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isNameValid(name) {
  return /^[A-Za-zА-Яа-яЁё\s'-]+$/.test(name);
}

// Connect a form: check on submit, fix errors while typing,
// call onSuccess() when all fields are correct, then clear the form
function setupForm(form, getError, onSuccess) {
  const fields = form.querySelectorAll(".form-control, .form-select");

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const recheck = function () {
      if (field.classList.contains("is-invalid")) validateField(field, getError);
      $(form).next(".success-box").stop(true, true).fadeOut(200); // hide the old success message
    };
    field.addEventListener("input", recheck);
    field.addEventListener("change", recheck);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let allCorrect = true;
    for (let i = 0; i < fields.length; i++) {
      if (!validateField(fields[i], getError)) allCorrect = false;
    }
    if (allCorrect) {
      onSuccess();
      form.reset();
    }
  });
}

// Hover effect for buttons (jQuery)
$(".btn-seat").hover(
  function () { $(this).stop(true).fadeTo(150, 0.8); },
  function () { $(this).stop(true).fadeTo(150, 1); }
);
