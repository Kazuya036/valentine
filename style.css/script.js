const heartsLayer = document.querySelector("#hearts-layer");
const modal = document.querySelector("#invitation-modal");
const lightbox = document.querySelector("#lightbox");

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "heart-float";
  heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${10 + Math.random() * 22}px`;
  heart.style.animationDuration = `${8 + Math.random() * 10}s`;
  heartsLayer.appendChild(heart);
  window.setTimeout(() => heart.remove(), 19000);
}
setInterval(createHeart, 950);
for (let index = 0; index < 8; index += 1)
  window.setTimeout(createHeart, index * 500);

function toggleModal(show) {
  modal.classList.toggle("open", show);
  modal.setAttribute("aria-hidden", String(!show));
  document.body.style.overflow = show ? "hidden" : "";
}
document
  .querySelector("#open-invitation")
  .addEventListener("click", () => toggleModal(true));
document
  .querySelectorAll("[data-close-modal]")
  .forEach((element) =>
    element.addEventListener("click", () => toggleModal(false)),
  );

const targetDate = new Date("2027-02-14T19:00:00");
function updateCountdown() {
  const now = new Date();
  let target = targetDate;
  if (now > target)
    target = new Date(`${now.getFullYear() + 1}-02-14T19:00:00`);
  const distance = Math.max(0, target - now);
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor(distance / 3600000) % 24,
    minutes: Math.floor(distance / 60000) % 60,
    seconds: Math.floor(distance / 1000) % 60,
  };
  Object.entries(values).forEach(([unit, value]) => {
    document.querySelector(`[data-unit="${unit}"]`).textContent = String(
      value,
    ).padStart(2, "0");
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

const envelope = document.querySelector("#envelope");
envelope.addEventListener("click", () => {
  const isOpen = envelope.classList.toggle("open");
  envelope.setAttribute("aria-expanded", String(isOpen));
  document.querySelector("#envelope-hint").textContent = isOpen
    ? "a little something from my heart"
    : "tap the seal to open";
});

const surprises = [
  "You make every day feel like Valentine’s Day.",
  "Every love story is beautiful, but ours is my favorite.",
  "You are the reason behind my smile.",
  "I like who I am a little more whenever I am with you.",
];
document.querySelector("#surprise-button").addEventListener("click", () => {
  const message = document.querySelector("#surprise-message");
  message.classList.remove("show");
  window.setTimeout(() => {
    message.textContent =
      surprises[Math.floor(Math.random() * surprises.length)];
    message.classList.add("show");
  }, 120);
});

const valentineAudio = new Audio(
  "music/Jim Brickman - Valentine (Official) ft. Martina McBride.mp3",
);
valentineAudio.loop = true;
valentineAudio.volume = 0.8;
let musicPlaying = false;
document.querySelector("#music-toggle").addEventListener("click", async () => {
  musicPlaying = !musicPlaying;
  if (musicPlaying) {
    try {
      await valentineAudio.play();
    } catch (error) {
      musicPlaying = false;
      console.error("Unable to play Valentine music.", error);
    }
  } else valentineAudio.pause();
  document.querySelector("#music-label").textContent = musicPlaying
    ? "sound off"
    : "sound on";
  document
    .querySelector("#music-toggle")
    .setAttribute("aria-pressed", String(musicPlaying));
});

document.querySelectorAll(".gallery-image").forEach((image) =>
  image.addEventListener("click", () => {
    const preview = document.querySelector("#lightbox-image");
    preview.src = image.dataset.full;
    preview.alt = image.querySelector("img").alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }),
);
document.querySelector("#lightbox-close").addEventListener("click", () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
});
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox)
    document.querySelector("#lightbox-close").click();
});

document.querySelector("#rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#form-success").classList.add("show");
  event.target.reset();
});

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleModal(false);
    document.querySelector("#lightbox-close").click();
  }
});

const loadingScreen = document.querySelector("#loading-screen");
const welcomeScreen = document.querySelector("#welcome-screen");
const loadingNumber = document.querySelector("#loading-number");
const nameInput = document.querySelector("#name-input");
const savedName = localStorage.getItem("valentine-name");
if (savedName) {
  nameInput.value = savedName;
  document.querySelectorAll(".name-output").forEach((element) => {
    element.textContent = savedName;
  });
}
let loadingProgress = 0;
const loaderTimer = setInterval(() => {
  loadingProgress = Math.min(
    100,
    loadingProgress + Math.ceil(Math.random() * 13),
  );
  loadingNumber.textContent = `${loadingProgress}%`;
  if (loadingProgress >= 100) {
    clearInterval(loaderTimer);
    loadingScreen.classList.add("is-done");
    welcomeScreen.classList.add("is-visible");
  }
}, 90);
document.querySelector("#begin-story").addEventListener("click", () => {
  const name = nameInput.value.trim() || "you";
  localStorage.setItem("valentine-name", name);
  document.querySelectorAll(".name-output").forEach((element) => {
    element.textContent = name;
  });
  welcomeScreen.classList.remove("is-visible");
  document.body.classList.add("story-begun");
  document.querySelector("#top").scrollIntoView({ behavior: "smooth" });
});

function burstHearts(source, amount = 18) {
  const bounds = source.getBoundingClientRect();
  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-burst";
    heart.textContent = index % 2 ? "♥" : "♡";
    heart.style.left = `${bounds.left + bounds.width / 2}px`;
    heart.style.top = `${bounds.top + bounds.height / 2}px`;
    heart.style.setProperty("--x", `${(Math.random() - 0.5) * 280}px`);
    heart.style.setProperty("--y", `${(Math.random() - 0.5) * 280}px`);
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1100);
  }
}
document.querySelector("#heart-trigger").addEventListener("click", (event) => {
  burstHearts(event.currentTarget, 26);
  window.setTimeout(() => toggleModal(true), 350);
});

const loveMeter = document.querySelector("#love-meter");
loveMeter.addEventListener("input", () => {
  const value = Number(loveMeter.value);
  document.querySelector("#meter-value").textContent = `${value}%`;
  const message = document.querySelector("#meter-message");
  if (value === 100) {
    message.textContent = "Still not enough ♥";
    burstHearts(loveMeter, 35);
  } else if (value > 80)
    message.textContent = "You are getting very close to the truth.";
  else message.textContent = "There is still room for a little more magic.";
});
document.querySelectorAll(".planner-option").forEach((option) =>
  option.addEventListener("click", () => {
    document
      .querySelectorAll(".planner-option")
      .forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    document.querySelector("#planner-detail").textContent = option.dataset.plan;
  }),
);
document.querySelectorAll(".choice-pill").forEach((option) =>
  option.addEventListener("click", (event) => {
    document
      .querySelectorAll(".choice-pill")
      .forEach((item) => item.classList.remove("selected"));
    event.currentTarget.classList.add("selected");
    document.querySelector("#compatibility-result").textContent =
      "100% compatible. I had a feeling. ♥";
    burstHearts(event.currentTarget, 14);
  }),
);

let quizAnswered = false;
document.querySelectorAll(".quiz-options button").forEach((option) =>
  option.addEventListener("click", (event) => {
    if (quizAnswered) return;
    quizAnswered = true;
    const result = document.querySelector("#quiz-result");
    result.textContent =
      event.currentTarget.dataset.correct === "true"
        ? "You know us beautifully. 100% ♥"
        : "Close enough. I will give you a hint over dinner. ♥";
    if (event.currentTarget.dataset.correct === "true")
      burstHearts(event.currentTarget, 20);
  }),
);

const gardenMessages = [
  "You make the world softer.",
  "You are worth celebrating.",
  "Your smile is my favorite view.",
  "You bring the magic with you.",
];
document.querySelector("#plant-rose").addEventListener("click", () => {
  const garden = document.querySelector("#garden-bed");
  document.querySelector("#garden-empty").style.display = "none";
  const rose = document.createElement("span");
  rose.className = "planted-rose";
  rose.innerHTML = `<span class="rose-message">${gardenMessages[garden.querySelectorAll(".planted-rose").length % gardenMessages.length]}</span>`;
  garden.appendChild(rose);
  burstHearts(document.querySelector("#plant-rose"), 8);
});

document.querySelectorAll(".proposal-button").forEach((button) =>
  button.addEventListener("click", (event) => {
    burstHearts(event.currentTarget, 45);
    event.currentTarget.classList.add("proposal-yes");
    document.querySelector("#finale").scrollIntoView({ behavior: "smooth" });
  }),
);
document
  .querySelector("#replay-story")
  .addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

let secretCode = "";
document.addEventListener("keydown", (event) => {
  secretCode = `${secretCode}${event.key.toUpperCase()}`.slice(-4);
  if (secretCode === "LOVE") {
    document.body.classList.add("heart-rain");
    for (let index = 0; index < 24; index += 1)
      window.setTimeout(createHeart, index * 80);
    secretCode = "";
  }
});
document.querySelector("#moon").addEventListener("dblclick", () => {
  const message = document.createElement("div");
  message.className = "hidden-message";
  message.textContent = "I can't wait to spend Valentine's Day with you ♥";
  document.body.appendChild(message);
  window.setTimeout(() => message.remove(), 4500);
});
