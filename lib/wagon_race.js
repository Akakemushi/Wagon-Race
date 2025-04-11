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
    elementId: "blue-truck",
    name: "Player 1"
  },
  player2: {
    key: "p",
    lastPressTimes: [],
    mp: 0,
    speed: 0,
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
  if (raceOver) return; // ✅ Stop loop if race is over

  const track = document.querySelector(".background");
  const trackRightEdge = track.offsetLeft + track.offsetWidth;

  for (const playerKey in players) {
    const player = players[playerKey];
    const carElement = document.getElementById(player.elementId);

    if (player.mp > 0) {
      player.speed += player.mp * accelerationFactor;
      player.mp = Math.max(player.mp - mpDecay, 0);
    }

    player.speed *= friction;

    let currentPosition = parseFloat(carElement.style.left) || 0;
    currentPosition += player.speed;

    // ✅ Check win condition
    const carRightEdge = currentPosition + carElement.offsetWidth;
    if (carRightEdge >= trackRightEdge) {
      carElement.style.left = (trackRightEdge - carElement.offsetWidth) + "px"; // Lock to edge
      raceOver = true;

      // ✅ Stop both players from moving
      for (const key in players) {
        players[key].speed = 0;
        players[key].mp = 0;
      }

      setTimeout(() => {
        alert(`${player.name} wins!`);
        location.reload(); // ✅ Reset the page
      }, 100); // small delay so the visual edge-collision is noticeable

      return;
    }

    carElement.style.left = currentPosition + "px";
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
