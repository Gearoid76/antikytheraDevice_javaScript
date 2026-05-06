// this is a simple astronomical dial showing the sun and moon positions in the zodiac and calendar rings, as well as the moon phase. 
// The zodiac signs are in Greek for a more authentic feel. The dial is based on the number of days since January 1, 2000, which is a common epoch in astronomy.
const canvas = document.getElementById("dial");
const ctx = canvas.getContext("2d");

// Visual style (must come AFTER ctx exists)
ctx.lineWidth = 1.2;
ctx.shadowColor = "#d4af37";
ctx.shadowBlur = 4;

const centerX = 200;
const centerY = 200;

const zodiac = [
  "ΚΡΙΟΣ", "ΤΑΥΡΟΣ", "ΔΙΔΥΜΟΙ", "ΚΑΡΚΙΝΟΣ",
  "ΛΕΩΝ", "ΠΑΡΘΕΝΟΣ", "ΖΥΓΟΣ", "ΣΚΟΡΠΙΟΣ",
  "ΤΟΞΟΤΗΣ", "ΑΙΓΟΚΕΡΩΣ", "ΥΔΡΟΧΟΟΣ", "ΙΧΘΥΕΣ"
];

const DAY_MS = 86400000;

// --- TIME ---
function getDaysSinceEpoch() {
  return (Date.now() - new Date("2000-01-01")) / DAY_MS;
}

// --- ANGLES ---
function sunAngle(days) {
  return (days / 365.25) * Math.PI * 2;
}

function moonAngle(days) {
  return (days / 27.32) * Math.PI * 2;
}

// --- DRAW ---
function drawDial(sunA, moonA) {
  ctx.clearRect(0, 0, 400, 400);

  ctx.strokeStyle = "#d4af37";
  ctx.fillStyle = "#d4af37";

  const outerR = 160;
  const zodiacR = 140;
  const calendarR = 110;

  // Outer border
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
  ctx.stroke();

  // Zodiac ring
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * (outerR - 10),
      centerY + Math.sin(angle) * (outerR - 10)
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * zodiacR,
      centerY + Math.sin(angle) * zodiacR
    );
    ctx.stroke();

    const tx = centerX + Math.cos(angle) * (outerR - 25);
    const ty = centerY + Math.sin(angle) * (outerR - 25);

    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(angle + Math.PI / 2);
    ctx.font = "12px serif";
    ctx.textAlign = "center";
    ctx.fillText(zodiac[i], 0, 0);
    ctx.restore();
  }

  // Calendar ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, calendarR, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * (calendarR - 5),
      centerY + Math.sin(angle) * (calendarR - 5)
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * calendarR,
      centerY + Math.sin(angle) * calendarR
    );
    ctx.stroke();
  }

  // Sun pointer
  ctx.strokeStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(sunA) * (calendarR - 10),
    centerY + Math.sin(sunA) * (calendarR - 10)
  );
  ctx.stroke();

  // Moon pointer
  ctx.strokeStyle = "lightblue";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(moonA) * (calendarR - 25),
    centerY + Math.sin(moonA) * (calendarR - 25)
  );
  ctx.stroke();

  // Moon phase
  let phase = moonA - sunA;
  phase = ((phase + Math.PI * 2) % (Math.PI * 2));

  const px = centerX + Math.cos(moonA) * (calendarR - 40);
  const py = centerY + Math.sin(moonA) * (calendarR - 40);

  drawMoonPhase(px, py, phase);
}

// --- MOON PHASE ---
function drawMoonPhase(x, y, phase) {
  const r = 12;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.beginPath();
  const phaseFactor = Math.cos(phase);

  ctx.ellipse(
    x,
    y,
    r * Math.abs(phaseFactor),
    r,
    0,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "black";
  ctx.fill();
}

// --- LOOP ---
function animate() {
  const days = getDaysSinceEpoch();

  const sunA = sunAngle(days);
  const moonA = moonAngle(days);

  drawDial(sunA, moonA);

  requestAnimationFrame(animate);
}

animate();