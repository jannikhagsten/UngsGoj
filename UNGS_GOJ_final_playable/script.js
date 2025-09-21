let players = [];
let currentPlayer = 0;
let paused = false;
let board = [];

// Bræt felter
function initBoard() {
  board = [
    "START", "1 SUG", "2 SUG", "3 SUG 12 SEK", "4 SUG", "5 SUG", "6 SUG",
    "BOB MARLEY", "1X LUNGE", "DIY KONGE", "PASS THE SPLIFF", "SLÅ TILBAGE",
    "3 SUG", "TRAFIKLYS", "4 SUG 12 SEK", "BOB MARLEY", "5 SUG 15 SEK",
    "3 SUG", "SLÅ TILBAGE", "PASS THE SPLIFF", "3 SUG 10 SEK", "NINJA",
    "3 SUG", "BOB MARLEY", "TRAFIKLYS", "6 SUG", "2X TILBAGE", "4 SUG",
    "NINJA", "3X2 10 SEK", "5 SUG 15 SEK", "TRAFIKLYS", "4 SUG", "DIY KONGE",
    "5 SUG", "3 SUG", "2X LUNGE", "NINJA", "FINISH SLUT"
  ];
}

function startGame(playerNames) {
  initBoard();
  players = playerNames.map((n,i) => ({
    name: n,
    pos: 0,
    color: getPlayerColor(i)
  }));
  currentPlayer = 0;
  nextTurn();
}

function getPlayerColor(i) {
  const colors = ["red","blue","green","orange","purple","pink","cyan","yellow"];
  return colors[i % colors.length];
}

// Næste tur
function nextTurn() {
  if (paused) return;
  let player = players[currentPlayer];
  showRollPopup(player);
}

function showRollPopup(player) {
  const popup = document.getElementById("popup");
  const title = document.getElementById("popupTitle");
  const content = document.getElementById("popupContent");
  popup.style.background = player.color;
  title.innerText = player.name;

  let roll = Math.floor(Math.random()*6)+1;
  content.innerHTML = "";
  let diceEl = document.createElement("div");
  diceEl.innerText = "🎲 Ruller...";
  content.appendChild(diceEl);

  let rollInterval = setInterval(() => {
    diceEl.innerText = "🎲 " + (Math.floor(Math.random()*6)+1);
  }, 150);

  setTimeout(() => {
    clearInterval(rollInterval);
    diceEl.innerText = "🎲 " + roll;
    player.pos += roll;
    if (player.pos >= board.length-1) player.pos = board.length-1;

    let field = board[player.pos];
    let fieldEl = document.createElement("div");
    fieldEl.innerText = field;

    if (field.includes("TRAFIKLYS")) {
      fieldEl.innerHTML = `<img src="trafiklys.png" style="width:80px">`;
    }
    if (field.includes("NINJA")) {
      fieldEl.innerHTML = `<img src="ninja.png" style="width:80px">`;
    }

    content.appendChild(fieldEl);

    // Countdown
    let countdown = document.createElement("div");
    content.appendChild(countdown);
    let sec = 3;
    countdown.innerText = `Går videre om: ${sec} sekunder`;
    let cd = setInterval(() => {
      sec--;
      if (sec>0) {
        countdown.innerText = `Går videre om: ${sec} sekunder`;
      } else {
        clearInterval(cd);
        popup.style.display = "none";
        currentPlayer = (currentPlayer+1)%players.length;
        nextTurn();
      }
    },1000);

    popup.style.display = "block";
  }, 1000);
}

// Pause funktion
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    paused = !paused;
    if (paused) {
      document.getElementById("pauseOverlay").style.display = "flex";
      updatePauseInfo();
    } else {
      document.getElementById("pauseOverlay").style.display = "none";
      nextTurn();
    }
  }
});

function updatePauseInfo() {
  const info = document.getElementById("pauseInfo");
  info.innerHTML = "";
  players.forEach(p=>{
    let li=document.createElement("div");
    li.innerText = `${p.name}: ${board[p.pos]}`;
    info.appendChild(li);
  });
}

/* === STARTSKÆRM LOGIK === */
const startScreen = document.getElementById("start-screen");
const setupScreen = document.getElementById("player-setup-screen");
const gameScreen = document.getElementById("game-screen");
const btnContainer = document.getElementById("player-count-buttons");
const contBtn = document.getElementById("continue-btn");
const setupForm = document.getElementById("player-setup-form");
const setupTitle = document.getElementById("player-setup-title");
const startBtn = document.getElementById("start-game-btn");

let selectedCount=null;
for (let i=2;i<=8;i++) {
  let b=document.createElement("button");
  b.innerText=i;
  b.onclick=()=>{
    document.querySelectorAll(".player-count button").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    selectedCount=i;
    contBtn.disabled=false;
  };
  btnContainer.appendChild(b);
}

contBtn.onclick=()=>{
  if (!selectedCount) return;
  startScreen.classList.add("hidden");
  setupScreen.classList.remove("hidden");
  setupTitle.innerText=`${selectedCount} spillere`;
  setupForm.innerHTML="";
  for (let i=1;i<=selectedCount;i++) {
    let row=document.createElement("div");
    let input=document.createElement("input");
    input.type="text";
    input.value=`Spiller ${i}`;
    row.appendChild(input);
    setupForm.appendChild(row);
  }
};

startBtn.onclick=()=>{
  const names=[...setupForm.querySelectorAll("input")].map(i=>i.value);
  setupScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  startGame(names);
};
