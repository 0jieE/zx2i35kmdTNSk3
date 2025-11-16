
/* -------------------------------------------
   ELEMENTS
-------------------------------------------- */
const flap = document.getElementById('flap');
const envelopeContainer = document.getElementById('envelopeContainer');
const letterCard = document.getElementById('letterCard');
const floatingContainer = document.getElementById('floatingContainer');
const music = document.getElementById('music');
const letterTextEl = document.getElementById("letterText");

/* -------------------------------------------
   STATE
-------------------------------------------- */
let isDragging = false;
let startY = 0;
let floatInterval = null;

/* -------------------------------------------
   BALLOON IMAGES
-------------------------------------------- */
const balloonImages = [
  "assets/pink_balloon.png",
  "assets/yellow_balloon.png",
  "assets/red_balloon.png",
  "assets/white_balloon.png"
];

/* -------------------------------------------
   DRAG EVENTS (MOUSE)
-------------------------------------------- */
flap.addEventListener('mousedown', (e) => {
  isDragging = true;
  startY = e.clientY;
  flap.style.cursor = "grabbing";
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const deltaY = startY - e.clientY;
  if (deltaY > 0) {
    flap.style.transform = `rotateX(${Math.min(deltaY, 90)}deg)`;
  }
});

document.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  flap.style.cursor = "grab";
  const deltaY = startY - e.clientY;

  if (deltaY > 40) {
    openEnvelope();
  } else {
    flap.style.transform = "rotateX(0deg)";
  }
});

/* -------------------------------------------
   DRAG EVENTS (TOUCH)
-------------------------------------------- */
flap.addEventListener("touchstart", (e) => {
  isDragging = true;
  startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const deltaY = startY - e.touches[0].clientY;
  if (deltaY > 0) {
    flap.style.transform = `rotateX(${Math.min(deltaY, 90)}deg)`;
  }
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  isDragging = false;

  const lastY = e.changedTouches[0].clientY;
  const deltaY = startY - lastY;

  if (deltaY > 40) {
    openEnvelope();
  } else {
    flap.style.transform = "rotateX(0deg)";
  }
});

/* -------------------------------------------
   OPEN ENVELOPE → SHOW LETTER → START TYPING
-------------------------------------------- */
function openEnvelope() {
  flap.style.transform = "rotateX(180deg)";

  setTimeout(() => {
    // Hide the envelope
    envelopeContainer.style.opacity = "0";
    envelopeContainer.style.pointerEvents = "none";

    // Show letter card
    letterCard.style.opacity = "1";
    letterCard.style.transform = "translate(-50%, -50%) scale(1)";
    letterCard.style.pointerEvents = "auto";

    // Start typing ONLY now
    typeLetter();

  }, 400);

  // Music
  music.play().catch(() => {});

  // Balloons
  if (!floatInterval) {
    for (let i = 0; i < 10; i++) spawnFloating();
    floatInterval = setInterval(spawnFloating, 1200);
  }
}

/* -------------------------------------------
   TYPEWRITER EFFECT
-------------------------------------------- */
let fullText = "";
let index = 0;
const typingSpeed = 40;

fetch("assets/letter.json")
  .then(res => res.json())
  .then(data => {
    fullText = data.message;
  });



function typeLetter() {
  if (index < fullText.length) {
    letterTextEl.textContent += fullText.charAt(index);
    index++;

    // Auto-scroll as it types
    letterTextEl.scrollTop = letterTextEl.scrollHeight;

    setTimeout(typeLetter, typingSpeed);
  }
}

/* -------------------------------------------
   FLOATING BALLOONS
-------------------------------------------- */
function spawnFloating() {
  const img = document.createElement("img");
  img.src = balloonImages[Math.floor(Math.random() * balloonImages.length)];
  img.className = "floating";
  img.style.left = (5 + Math.random() * 90) + "vw";
  img.style.animationDuration = (7 + Math.random() * 5) + "s";

  floatingContainer.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, 13000);
}
