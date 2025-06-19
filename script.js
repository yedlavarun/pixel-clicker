let score = 0;
let autoClickers = 0;
const scoreDisplay = document.getElementById("score");
const autoClickersDisplay = document.getElementById("autoclickers");
const clickSound = new Audio("assets/click.mp3");

const pixelUpgrades = {};

async function loadPixelData(id, file) {
  const response = await fetch(`pixels/${file}`);
  const pixelData = await response.json();

  pixelUpgrades[id] = {
    data: pixelData,
    upgradeCost: pixelData.base_cost
  };

  // Set button labels
  document.querySelector(`#${id} .power_up`).textContent = `Upgrade Pwr`;
  document.querySelector(`#${id} .speed_up`).textContent = `Upgrade Spd`;

  // Set click behavior AFTER data is ready
  const clicker = document.querySelector(`#${id}`);
  clicker.onclick = () => {
    score += pixelUpgrades[id].data.value;
    clickSound.play();
    updateBoth();
  };

  // Optional: add cost display
  const up_cost = document.createElement("h5");
  up_cost.textContent = `up_cost (${pixelUpgrades[id].upgradeCost})`;
  clicker.appendChild(up_cost);
}

loadPixelData("green", "green.json");

// Power up button logic
document.querySelectorAll(".power_up").forEach(btn => {
  btn.onclick = (event) => {
    event.stopPropagation();

    const pixelId = btn.closest(".clicker").id;
    const upgrades = pixelUpgrades[pixelId];

    if (!upgrades) return;

    if (score >= upgrades.upgradeCost) {
      score -= upgrades.upgradeCost;
      autoClickers++;
      upgrades.upgradeCost = Number((upgrades.upgradeCost * upgrades.data.cost_multiplier).toFixed(2));

      btn.textContent = `Upgrade Pwr (${upgrades.upgradeCost})`;
      updateBoth();
    }
  };
});

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateAutoClickers() {
  autoClickersDisplay.textContent = autoClickers;
}

function updateBoth() {
  updateScore();
  updateAutoClickers();
}
