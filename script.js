// === GameMonetize SDK Init ===
window.sdk = window.sdk || {};

document.addEventListener("DOMContentLoaded", function () {
  if (typeof sdk !== "undefined" && sdk.initAd) {
    sdk.initAd();        // Initializes ads
    sdk.showBanner();    // Optional banner ad
  }
});

let score = 0;
let autoClickers = 0;
let upgradesSinceAd = 0; // track upgrades for interstitial ads

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

    // Optionally show an interstitial ad every 30 points
    if (score % 30 < pixelUpgrades[id].data.value && sdk.showAd) {
      sdk.showAd(); // show ad occasionally
    }
  };

  // Display shared cost above the buttons
  const costDisplay = document.createElement("p");
  costDisplay.textContent = `Upgrade Cost: ${pixelUpgrades[id].upgradeCost}`;
  costDisplay.className = "upgrade-cost";
  clicker.insertBefore(costDisplay, clicker.children[1]);
}

loadPixelData("green", "green.json");
loadPixelData("blue", "green.json");

// Power up button logic
document.querySelectorAll(".power_up").forEach(btn => {
  btn.onclick = (event) => {
    event.stopPropagation();

    const pixelId = btn.closest(".clicker").id;
    const upgrades = pixelUpgrades[pixelId];
    if (!upgrades) return;

    if (score >= upgrades.upgradeCost) {
      score -= upgrades.upgradeCost;
      upgrades.upgradeCost = Number((upgrades.upgradeCost * upgrades.data.cost_multiplier).toFixed(2));
      pixelUpgrades[pixelId].data.value *= 1.1;

      btn.textContent = `Upgrade Pwr`;
      const costLabel = btn.closest(".clicker").querySelector(".upgrade-cost");
      if (costLabel) {
        costLabel.textContent = `Upgrade Cost: ${upgrades.upgradeCost}`;
      }

      updateBoth();

      // Show interstitial ad every 3 upgrades
      upgradesSinceAd++;
      if (upgradesSinceAd >= 3 && sdk.showAd) {
        sdk.showAd();
        upgradesSinceAd = 0;
      }
    }
  };
});

// (Optional) Remove broken block creation
// document.querySelectorAll(".speed_up").forEach(btn => {
//   const block = document.createElement("div");
//   block.classList.add("block");
//   btn.parentNode.insertBefore(block, btn);
// });

function updateScore() {
  scoreDisplay.textContent = score.toFixed(2);
}

function updateAutoClickers() {
  autoClickersDisplay.textContent = autoClickers;
}

function updateBoth() {
  updateScore();
  updateAutoClickers();
}
