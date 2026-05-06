// --- SETUP ---
const canvas = document.getElementById("dial");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 1.2;
ctx.shadowColor = "#d4af37";
ctx.shadowBlur = 2;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const DIAL_GOLD = "#d4af37";
const ZODIAC_FONT = '15px Georgia, "Times New Roman", serif';
const ZODIAC_FONT_BOLD = 'bold 16px Georgia, "Times New Roman", serif';

// Rotate so Aries (0°) is at the top
const OFFSET = -Math.PI / 2;

// Greek zodiac labels
const zodiac = [
  "ΚΡΙΟΣ", "ΤΑΥΡΟΣ", "ΔΙΔΥΜΟΙ", "ΚΑΡΚΙΝΟΣ",
  "ΛΕΩΝ", "ΠΑΡΘΕΝΟΣ", "ΖΥΓΟΣ", "ΣΚΟΡΠΙΟΣ",
  "ΤΟΞΟΤΗΣ", "ΑΙΓΟΚΕΡΩΣ", "ΥΔΡΟΧΟΟΣ", "ΙΧΘΥΕΣ"
];

// --- REAL ASTRONOMY ---
const planetNames = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const planetStyles = {
  Mercury: { color: "#c0c0c0", length: 92, label: "Me" },
  Venus: { color: "#f5d76e", length: 104, label: "Ve" },
  Mars: { color: "#ff6b4a", length: 116, label: "Ma" },
  Jupiter: { color: "#d7b98e", length: 128, label: "Ju" },
  Saturn: { color: "#b9a77a", length: 140, label: "Sa" },
  Uranus: { color: "#7fdbff", length: 152, label: "Ur" },
  Neptune: { color: "#0074d9", length: 164, label: "Ne" },
  Pluto: { color: "#7870a4", length: 176, label: "Pl" }
};

function getAstronomyAngles() {
  const now = new Date();

  const sunVec = Astronomy.GeoVector("Sun", now, true);
  const moonVec = Astronomy.GeoVector("Moon", now, true);

  const sunEcl = Astronomy.Ecliptic(sunVec);
  const moonEcl = Astronomy.Ecliptic(moonVec);

  const sunAngle = (sunEcl.elon * Math.PI) / 180;
  const moonAngle = (moonEcl.elon * Math.PI) / 180;
  const planetAngles = planetNames.map((name) => {
    const vec = Astronomy.GeoVector(name, now, true);
    const ecl = Astronomy.Ecliptic(vec);

    return {
      name,
      angle: (ecl.elon * Math.PI) / 180
    };
  });

  return { sunAngle, moonAngle, planetAngles };
}


// --- DRAW DIAL ---
function drawDial(sunA, moonA, planetAngles) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = DIAL_GOLD;
  ctx.fillStyle = DIAL_GOLD;
  ctx.lineWidth = 1.5;

  const outerR = 258;
  const zodiacR = 220;
  const labelR = 238;
  const calendarR = 160;
  const sunDeg = ((sunA * 180) / Math.PI + 360) % 360;
  const signIndex = Math.floor(sunDeg / 30);

  // Outer circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
  ctx.stroke();

  // Zodiac ring
  for (let i = 0; i < 12; i++) {
    const boundaryAngle = (i / 12) * Math.PI * 2;
    const labelAngle = ((i + 0.5) / 12) * Math.PI * 2;
    const isCurrentSign = i === signIndex;

    const boundaryA = boundaryAngle + OFFSET;
    const labelA = labelAngle + OFFSET;

    // Tick
    ctx.strokeStyle = isCurrentSign ? "orange" : DIAL_GOLD;
    ctx.lineWidth = isCurrentSign ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(boundaryA) * (outerR - 12),
      centerY + Math.sin(boundaryA) * (outerR - 12)
    );
    ctx.lineTo(
      centerX + Math.cos(boundaryA) * zodiacR,
      centerY + Math.sin(boundaryA) * zodiacR
    );
    ctx.stroke();

    // Text
    const tx = centerX + Math.cos(labelA) * labelR;
    const ty = centerY + Math.sin(labelA) * labelR;

    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = isCurrentSign ? "orange" : DIAL_GOLD;
    ctx.font = isCurrentSign ? ZODIAC_FONT_BOLD : ZODIAC_FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(zodiac[i], tx, ty);
    ctx.restore();
  }

  ctx.strokeStyle = DIAL_GOLD;
  ctx.fillStyle = DIAL_GOLD;
  ctx.lineWidth = 1.5;

  // Calendar ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, calendarR, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2 + OFFSET;

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

  // --- SUN POINTER ---
  ctx.strokeStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(sunA + OFFSET) * (calendarR - 10),
    centerY + Math.sin(sunA + OFFSET) * (calendarR - 10)
  );
  ctx.stroke();

  // --- MOON POINTER ---
  ctx.strokeStyle = "lightblue";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
    centerX + Math.cos(moonA + OFFSET) * (calendarR - 25),
    centerY + Math.sin(moonA + OFFSET) * (calendarR - 25)
  );
  ctx.stroke();

  // --- PLANET HANDS ---
  ctx.lineWidth = 1;

  for (const planet of planetAngles) {
    const style = planetStyles[planet.name];
    const angle = planet.angle + OFFSET;
    const handX = centerX + Math.cos(angle) * style.length;
    const handY = centerY + Math.sin(angle) * style.length;
    const labelX = centerX + Math.cos(angle) * (style.length + 12);
    const labelY = centerY + Math.sin(angle) * (style.length + 12);

    ctx.strokeStyle = style.color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    ctx.fillStyle = style.color;
    ctx.beginPath();
    ctx.arc(handX, handY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "10px serif";
    ctx.textAlign = "center";
    ctx.fillText(style.label, labelX, labelY);
  }

  // --- MOON PHASE ---
  let phase = moonA - sunA;
  phase = ((phase + Math.PI * 2) % (Math.PI * 2)) - Math.PI;

  const px = centerX + Math.cos(moonA + OFFSET) * (calendarR - 40);
  const py = centerY + Math.sin(moonA + OFFSET) * (calendarR - 40);

  drawMoonPhase(px, py, phase);
}

// --- MOON PHASE DRAW ---
function drawMoonPhase(x, y, phase) {
  const r = 12;

  // White base
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  // Shadow overlay
  const phaseFactor = Math.cos(phase);

  ctx.beginPath();
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
window.activeFace = "front";

function animate() {
  if (window.activeFace === "eclipse") {
    requestAnimationFrame(animate);
    return;
  }

  const { sunAngle, moonAngle, planetAngles } = getAstronomyAngles();

  drawDial(sunAngle, moonAngle, planetAngles);

  requestAnimationFrame(animate);
}

animate();
