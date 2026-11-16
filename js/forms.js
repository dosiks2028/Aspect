// Shared form validation

function showFieldError(field, message) {
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");

  const error = field.parentElement.querySelector(".invalid-feedback");

  if (error) {
    error.id = field.id + "-error";
    error.textContent = message;
    field.setAttribute("aria-describedby", error.id);
  }
}

function clearFieldError(field) {
  field.classList.remove("is-invalid");
  field.removeAttribute("aria-invalid");

  const error = field.parentElement.querySelector(".invalid-feedback");
  if (error) error.textContent = "";
}

function validateField(field, getError) {
  const message = getError(field);

  if (message) {
    showFieldError(field, message);
    return false;
  }

  clearFieldError(field);
  return true;
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isNameValid(name) {
  const normalized = name.trim().replace(/\s+/g, " ");
  const letters = normalized.replace(/[ '\u2019-]/g, "");

  return [...letters].length >= 3 &&
    /^\p{L}+(?:[ '\u2019-]\p{L}+)*$/u.test(normalized);
}

function setupForm(form, getError, onSuccess) {
  if (!form) return;

  const fields = form.querySelectorAll(".form-control, .form-select");

  function recheck() {
    fields.forEach(function (field) {
      if (field.classList.contains("is-invalid")) {
        validateField(field, getError);
      }
    });

    $(form).next(".success-box").stop(true, true).fadeOut(200);
  }

  fields.forEach(function (field) {
    field.addEventListener("input", recheck);
    field.addEventListener("change", recheck);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    $(form).next(".success-box").stop(true, true).hide();

    let correct = true;

    fields.forEach(function (field) {
      if (!validateField(field, getError)) correct = false;
    });

    if (!correct) {
      form.querySelector(".is-invalid").focus();
      return;
    }

    // Keep the entered values if saving failed
    if (onSuccess() !== false) form.reset();
  });
}
