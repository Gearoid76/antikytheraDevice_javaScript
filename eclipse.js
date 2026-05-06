function getSolarEclipses(count=20) {
    const eclipses = [];

    let eclipse = Astronomy.SearchGlobalSolarEclipse(new Date());

    for(let i = 0; i < count; i++) {
        eclipses.push(eclipse);
        eclipse = Astronomy.NextGlobalSolarEclipse(eclipse.peak);
    }

    return eclipses;

}
function drawEclipseFace(eclipses) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const outerR = 250;
  const innerR = 70;
  const turns = 4;

  ctx.strokeStyle = DIAL_GOLD;
  ctx.fillStyle = DIAL_GOLD;

  ctx.beginPath();

  for (let i = 0; i < 500; i++) {
    const t = i / 499;
    const angle = t * Math.PI * 2 * turns - Math.PI / 2;
    const radius = innerR + t * (outerR - innerR);

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();

  eclipses.forEach((eclipse, i) => {
    const t = i / Math.max(1, eclipses.length - 1);
    const angle = t * Math.PI * 2 * turns - Math.PI / 2;
    const radius = innerR + t * (outerR - innerR);

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);

    ctx.fillStyle =
      eclipse.kind === "total" ? "orange" :
      eclipse.kind === "annular" ? "lightblue" :
      "gray";

    ctx.fill();

    ctx.fillStyle = DIAL_GOLD;
    ctx.font = "10px Georgia";
    ctx.textAlign = "center";
    ctx.fillText(eclipse.peak.date.getFullYear(), x, y - 8);
  });
}


const eclipses = getSolarEclipses(30);

document.getElementById("toggleFace").addEventListener("click", () => {
    window.activeFace = window.activeFace === "eclipse" ? "front" : "eclipse";
});

function animateEclipses() {
    if (window.activeFace === "eclipse") {
        drawEclipseFace(eclipses);
    }

    requestAnimationFrame(animateEclipses);
}
animateEclipses();
