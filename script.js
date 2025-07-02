let score = 0;
let autoClickers = 0;
let clickCount = 0;

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

  document.querySelector(`#${id} .power_up`).textContent = `Upgrade Pwr`;
  document.querySelector(`#${id} .speed_up`).textContent = `Upgrade Spd`;

  const clicker = document.querySelector(`#${id}`);
  clicker.onclick = () => {
    score += pixelUpgrades[id].data.value;
    clickSound.play();
    updateBoth();

    clickCount++;
    if (clickCount >= 100) {
      clickCount = 0;
      if (typeof sdk !== "undefined" && sdk.showInterstitial) {
        sdk.showInterstitial();
      }
    }
  };

  const costDisplay = document.createElement("p");
  costDisplay.textContent = `Upgrade Cost: ${pixelUpgrades[id].upgradeCost.toFixed(2)}`;
  costDisplay.className = "upgrade-cost";
  clicker.insertBefore(costDisplay, clicker.children[1]);
}

loadPixelData("green", "green.json");

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
      pixelUpgrades[pixelId].data.value = Number((pixelUpgrades[pixelId].data.value * 1.1).toFixed(2));

      const costLabel = btn.closest(".clicker").querySelector(".upgrade-cost");
      if (costLabel) {
        costLabel.textContent = `Upgrade Cost: ${upgrades.upgradeCost.toFixed(2)}`;
      }

      updateBoth();
    }
  };
});

document.querySelectorAll(".speed_up").forEach(btn => {
  btn.onclick = (event) => {
    event.stopPropagation();
    // Future speed logic
  };
});

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

window.addEventListener("load", () => {
  if (typeof sdk !== "undefined" && sdk.showBanner) {
    sdk.showBanner();
  }
});
