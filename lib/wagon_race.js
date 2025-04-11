// const playerOneTrack = document.querySelectorAll("#player1-race td");
// const playerTwoTrack = document.querySelectorAll("#player2-race td");
// const playerOneTruck = document.getElementById("blue-truck");
// const playerTwoTruck = document.getElementById("green-truck");
// let onePosition = 0;
// let twoPosition = 0;

// const checkForWinner = () => {
//   if (onePosition === 88) {
//     alert("Player One WINS!!!");
//     window.location.reload();
//   } else if (twoPosition === 88) {
//     alert("Player Two WINS!!!");
//     window.location.reload();
//   }
// };

// const moveCarOne = () => {
//   onePosition += 1;
//   playerOneTruck.style.left = `${onePosition}%`;
//   checkForWinner();
// };

// const moveCarTwo = () => {
//   twoPosition += 1;
//   playerTwoTruck.style.left = `${twoPosition}%`;
//   checkForWinner();
// };

// document.addEventListener("keyup", (event) => {
//   if (event.key === "q") {
//     moveCarOne();
//   } else if (event.key === "p") {
//     moveCarTwo();
//   }
// });
// ========END OF OLD VERSION===============

const players = {
  player1: {
    key: "q",
    lastPressTimes: [],
    mp: 0,
    speed: 0,
    rotation: 0,
    elementId: "blue-truck",
    name: "Player 1"
  },
  player2: {
    key: "p",
    lastPressTimes: [],
    mp: 0,
    speed: 0,
    rotation: 0,
    elementId: "green-truck",
    name: "Player 2"
  }
};

const mpDecay = 0.3;
const maxMP = 500;
const accelerationFactor = 0.1;
const friction = 0.1;

let raceOver = false; // ✅ Added: flag to prevent continuing updates

document.addEventListener('keydown', (event) => {
  if (raceOver) return; // ✅ Prevent input if race is over

  for (const playerKey in players) {
    const player = players[playerKey];
    if (event.key === player.key) {
      updateMP(player);
    }
  }
});

function updateMP(player) {
  const now = performance.now();

  player.lastPressTimes.push(now);
  if (player.lastPressTimes.length > 4) {
    player.lastPressTimes.shift();
  }

  if (player.lastPressTimes.length > 1) {
    const intervals = [];
    for (let i = 1; i < player.lastPressTimes.length; i++) {
      intervals.push(player.lastPressTimes[i] - player.lastPressTimes[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

    const pressRate = Math.min(300 / avgInterval, 1); // Normalize
    player.mp = Math.min(player.mp + pressRate * 10, maxMP);
  }
}

function gameLoop() {
  if (raceOver) return;

  const track = document.querySelector(".background");
  const trackRect = track.getBoundingClientRect();

  for (const playerKey in players) {
    const player = players[playerKey];
    const truck = document.getElementById(player.elementId);

    // Move the truck
    if (player.mp > 0) {
      player.speed += player.mp * accelerationFactor;
      player.mp = Math.max(player.mp - mpDecay, 0);
    }

    player.speed *= friction;

    // Move the truck
    let currentPosition = parseFloat(truck.style.left) || 0;
    currentPosition += player.speed;
    truck.style.left = currentPosition + "px";

    // Win check
    const carRect = truck.getBoundingClientRect();
    const trackRight = trackRect.right;

    if (carRect.right >= trackRight) {
      truck.style.left = (track.offsetWidth - truck.offsetWidth) + "px";
      raceOver = true;

      for (const key in players) {
        players[key].speed = 0;
        players[key].mp = 0;
      }

      setTimeout(() => {
        alert(`${player.name} wins!`);
        location.reload();
      }, 100);
      return;
    }

    // 🎯 Rotate tires based on speed
    if (!player.rotation) player.rotation = 0;
    player.rotation += player.speed * 3; // Adjust multiplier for realism

    const tires = truck.querySelectorAll(".tire");
    tires.forEach(tire => {
      tire.style.transform = `rotate(${player.rotation}deg)`;
    });
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
