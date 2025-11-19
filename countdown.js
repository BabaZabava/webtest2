const countdownEl = document.getElementById("countdown");
const releaseDate = new Date("Nov 19, 2025 00:00:00").getTime();

countdownEl.innerHTML = `
    <span>00d</span>
    <span>00h</span>
    <span>00m</span>
    <span>00s</span>
`;


setTimeout(() => countdownEl.classList.add("loaded"), 100);


const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = releaseDate - now;

if (distance < 0) {
    clearInterval(timer);
    countdownEl.innerHTML = `<span>EHHE právě out!</span>`;
    countdownEl.classList.add("loaded");
    return;
}

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

countdownEl.innerHTML = `
    <span>${days.toString().padStart(2, "0")}d</span>
    <span>${hours.toString().padStart(2, "0")}h</span>
    <span>${minutes.toString().padStart(2, "0")}m</span>
    <span>${seconds.toString().padStart(2, "0")}s</span>
`;
}, 1000);
