const playerOneTrack = document.querySelectorAll("#player1-race td");
const playerTwoTrack = document.querySelectorAll("#player2-race td");
const playerOneTruck = document.getElementById("blue-truck");
const playerTwoTruck = document.getElementById("green-truck");
let onePosition = 0;
let twoPosition = 0;

const checkForWinner = () => {
  if (onePosition === 88) {
    alert("Player One WINS!!!");
    window.location.reload();
  } else if (twoPosition === 88) {
    alert("Player Two WINS!!!");
    window.location.reload();
  }
};

const moveCarOne = () => {
  onePosition += 1;
  playerOneTruck.style.left = `${onePosition}%`;
  checkForWinner();
};

const moveCarTwo = () => {
  twoPosition += 1;
  playerTwoTruck.style.left = `${twoPosition}%`;
  checkForWinner();
};

document.addEventListener("keyup", (event) => {
  if (event.key === "q") {
    moveCarOne();
  } else if (event.key === "p") {
    moveCarTwo();
  }
});
