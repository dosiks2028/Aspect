// Demo accounts and saved items.
// Never use real passwords on this student website.

(function () {
  "use strict";

  const keys = {
    accounts: "rowFiveAccounts",
    session: "rowFiveSession",
    items: "rowFiveItems"
  };

  // Read JSON. Empty or damaged storage returns the fallback.
  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch (error) {
      return fallback;
    }
  }

  function message(text) {
    let box = document.getElementById("storage-message");

    if (!box) {
      box = document.createElement("p");
      box.id = "storage-message";
      box.className = "container field-error";
      box.setAttribute("role", "status");
      document.querySelector("main").prepend(box);
    }

    box.textContent = text;
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      message("");
      window.dispatchEvent(new Event("rowfive:change"));
      return true;
    } catch (error) {
      message("Could not save data. Allow browser storage and try again.");
      return false;
    }
  }

  function accounts() {
    const data = read(keys.accounts, []);

    if (!Array.isArray(data)) return [];

    return data.filter(function (account) {
      return account &&
        typeof account.email === "string" &&
        typeof account.name === "string" &&
        typeof account.password === "string";
    });
  }

  function user() {
    const session = read(keys.session, null);

    return accounts().find(function (account) {
      return account.email === session?.email;
    }) || null;
  }

  function items() {
    const data = read(keys.items, []);

    if (!Array.isArray(data)) return [];

    return data.filter(function (item) {
      return item &&
        typeof item.key === "string" &&
        typeof item.title === "string" &&
        ["movie", "series", "booking"].includes(item.type) &&
        Number.isFinite(item.minutes) &&
        item.minutes >= 0 &&
        (
          item.type !== "booking" ||
          (
            Number.isFinite(item.total) &&
            Number.isInteger(item.seats) &&
            item.seats > 0 &&
            typeof item.date === "string"
          )
        );
    });
  }

  // Shared functions used by Home, Catalog, Series and Picker
  window.RowFive = {
    user,
    items,

    emailExists(email) {
      return accounts().some(function (account) {
        return account.email === email.toLowerCase();
      });
    },

    register(account) {
      if (this.emailExists(account.email)) return false;

      return write(keys.accounts, [...accounts(), account]) &&
        write(keys.session, { email: account.email });
    },

    credentials(email, password) {
      return accounts().some(function (account) {
        return account.email === email.toLowerCase() &&
          account.password === password;
      });
    },

    login(email) {
      return write(keys.session, { email: email.toLowerCase() });
    },

    has(key) {
      return items().some(function (item) {
        return item.key === key;
      });
    },

    toggle(item) {
      const list = items();

      const updated = this.has(item.key)
        ? list.filter(saved => saved.key !== item.key)
        : [...list, item];

      return write(keys.items, updated);
    },

    book(movie, date, seats, total) {
      const key = "booking-" + Date.now() + "-" +
        Math.random().toString(36).slice(2);

      const booking = {
        key,
        type: "booking",
        title: movie.title,
        minutes: movie.minutes,
        date,
        seats,
        total
      };

      return write(keys.items, [...items(), booking]);
    }
  };

  // Add Profile and Log In / Log Out to the navigation
  const nav = document.querySelector(".navbar-nav");

  if (nav) {
    const profileItem = document.createElement("li");
    profileItem.className = "nav-item";
    profileItem.innerHTML =
      '<a class="nav-link" id="profile-link" href="profile.html">My list</a>';

    const authItem = document.createElement("li");
    authItem.className = "nav-item";
    authItem.innerHTML =
      '<a class="nav-link" id="login-link" href="index.html#login">Log In</a>' +
      '<button type="button" class="btn theme-btn" id="logout-button" hidden>' +
        'Log Out' +
      '</button>';

    nav.append(profileItem, authItem);

    document.getElementById("logout-button")
      .addEventListener("click", function () {
        if (write(keys.session, null)) {
          message("You are logged out.");
        }
      });
  }

  function setupLoginForm(form) {
    if (!form) return;

    const emailField = form.querySelector('input[type="email"]');
    const passwordField = form.querySelector('input[type="password"]');

    setupForm(form, function (field) {
      const email = emailField.value.trim();
      const password = passwordField.value;

      if (field === emailField && !isEmailValid(email)) {
        return "Enter a correct email.";
      }

      if (field === passwordField) {
        if (!password) return "Enter your demo password.";
        if (!RowFive.credentials(email, password)) {
          return "Incorrect email or password.";
        }
      }

      return "";
    }, function () {
      const email = emailField.value.trim();
      if (!RowFive.login(email)) return false;

      if (form.id === "login") window.location.href = "profile.html";
    });
  }

  // Add the demo note and login form on Home
  const joinForm = document.getElementById("join-form");

  if (joinForm) {
    const note = document.createElement("p");
    note.className = "phone-note";
    note.textContent =
      "Demo only — do not use real passwords. " +
      "Accounts and your saved list stay in this browser.";

    joinForm.prepend(note);
    joinForm.querySelector('[type="submit"]').textContent = "Sign Up";

    document.getElementById("join-success").insertAdjacentHTML(
      "afterend",
      `
      <form id="login" class="booking-form mt-4" novalidate>
        <h3>Log In</h3>

        <div class="mb-3">
          <label for="login-email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="login-email"
            autocomplete="email"
            required
          >
          <div class="invalid-feedback"></div>
        </div>

        <div class="mb-3">
          <label for="login-password" class="form-label">
            Demo password
          </label>
          <input
            type="password"
            class="form-control"
            id="login-password"
            autocomplete="current-password"
            required
          >
          <div class="invalid-feedback"></div>
        </div>

        <button type="submit" class="btn btn-seat">Log In</button>
      </form>
      `
    );

    setupLoginForm(document.getElementById("login"));
  }

  setupLoginForm(document.getElementById("profile-login"));

  function render() {
    const account = user();
    const link = document.getElementById("profile-link");

    if (link) {
      link.textContent = account
        ? account.name + " · Profile"
        : "My list";

      document.getElementById("login-link").hidden = !!account;
      document.getElementById("logout-button").hidden = !account;

      if (location.pathname.endsWith("/profile.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    }

    const details = document.getElementById("profile-details");
    if (!details) return;

    const loginPanel = document.getElementById("profile-login-panel");
    if (loginPanel) loginPanel.hidden = !!account;

    details.textContent = account
      ? "Welcome, " + account.name +
        "! Email: " + account.email +
        ". Favorite mood: " + account.mood + "."
      : "You are browsing as a guest. Log in to see your profile and saved list.";

    const list = document.getElementById("saved-items");
    const saved = items();

    list.replaceChildren();

    let minutes = 0;
    let total = 0;
    let seats = 0;

    for (const item of saved) {
      const li = document.createElement("li");
      li.className = "saved-row";

      const text = document.createElement("span");

      text.textContent = item.type === "booking"
        ? item.title + " · " + item.date +
          " · " + item.seats + " seat(s) · " + item.total + " ₸"
        : item.title + " · " + item.type + " · " + item.minutes + " min";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn theme-btn";
      button.textContent = "Remove";
      button.setAttribute("aria-label", "Remove " + item.title);

      button.addEventListener("click", function () {
        const updated = items().filter(function (savedItem) {
          return savedItem.key !== item.key;
        });

        if (write(keys.items, updated)) {
          message("Removed " + item.title + ".");
          document.getElementById("clear-saved").focus();
        }
      });

      li.append(text, button);
      list.appendChild(li);

      if (item.type === "booking") {
        total += item.total;
        seats += item.seats;
      } else {
        minutes += item.minutes;
      }
    }

    document.getElementById("saved-summary").textContent =
      saved.length + " saved item(s). Watch time: " +
      Math.floor(minutes / 60) + " h " + minutes % 60 +
      " min. Tickets: " + seats + " seat(s), " + total + " ₸.";

    document.getElementById("saved-empty").hidden = saved.length !== 0;
  }

  const clear = document.getElementById("clear-saved");

  if (clear) {
    clear.addEventListener("click", function () {
      if (write(keys.items, [])) {
        message("Your saved list is empty.");
      }
    });
  }

  window.addEventListener("rowfive:change", render);

  window.addEventListener("storage", function (event) {
    if (event.key === null || Object.values(keys).includes(event.key)) {
      window.dispatchEvent(new Event("rowfive:change"));
    }
  });

  render();
})();
