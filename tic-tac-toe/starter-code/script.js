const newGameCpuBtn = document.getElementById("newGame-cpu");
const newGamePlayerBtn = document.getElementById("newGame-player");

const gameMenuSect = document.querySelector(".gameMenu");
const gameBoardSect = document.querySelector(".gameBoard");

const gameBoxes = document.querySelectorAll(".box");

let isCpuPlaying;
let player1Starts;
let player1Mark = 'X';
let currentPlaying = 'X';

const board = {
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': ''
}

const gameScore = {
    'X': 0,
    'O': 0,
    "tie": 0,
}

const winConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
]

gameBoxes.forEach(box => box.addEventListener('click', event => markBox(event.target)))

newGameCpuBtn.addEventListener('click', () => {
    setupGame(true);
});

newGamePlayerBtn.addEventListener('click', () => {
    setupGame(false);
});

function setupGame(isCpu) {
    isCpuPlaying = isCpu;

    document.querySelectorAll("input[name='marks']").forEach(el => {
        if (el.checked) {
            player1Mark = el.getAttribute("value");
        }
    });

    gameMenuSect.classList.remove("visible");
    gameBoardSect.classList.add("visible");

    player1Starts = player1Mark == 'X';

    document.querySelector(".your-score-id").innerHTML = `${player1Mark} (you)`;
    document.querySelector(".player2-score-id").innerHTML = `${player1Starts ? 'O' : 'X'} ${isCpu ? '(CPU)' : '(P. 2)'}`;

    if (player1Starts) return;

    cpuPick();
}

function cpuPick() {
    const options = Object.entries(board).filter(x => !x[1]).map(x => Number(x[0]));
    let pickedOption;

    if (options.length == 0) return;

    while (!pickedOption) {
        const randomNumber = Math.floor((Math.random() * 9) + 1);

        if (!options.includes(randomNumber))
            continue;

        pickedOption = randomNumber;
    }

    const pickedBox = document.querySelector(`.box[data-box='${pickedOption}']`);
    markBox(pickedBox)
}

function markBox(box) {
    if (box.getAttribute("marked")) return;

    board[box.getAttribute("data-box")] = currentPlaying;

    box.setAttribute('marked', true);

    box.classList.add(`${currentPlaying}-marked`);

    box.classList.remove(`hoverClass${currentPlaying}`);

    checkResult();

    // if(result != "no-result"){
    //     showModal(result);
    // }

    const nextPlayer = currentPlaying == 'X' ? 'O' : 'X';

    gameBoxes.forEach(toCleanBox => {
        if (toCleanBox.getAttribute("marked")) return;

        toCleanBox.classList.replace(`hoverClass${currentPlaying}`, `hoverClass${nextPlayer}`);
    });

    currentPlaying = nextPlayer;

    // TODO: Trocar turno no container superior

    if (isCpuPlaying && nextPlayer !== player1Mark)
        cpuPick()
}

function checkResult() {
    const markedBoxes = Object.entries(board).filter(x => x[1] === currentPlaying).map(x => x[0]);

    if (markedBoxes.length < 3) return;

    // [1, 2, 3, 5] - Usuario marcou
    // [1 2 4]
    const won = winConditions.some(x => x.every(z => markedBoxes.includes(z.toString())));

    if (won) {
        gameScore[currentPlaying]++;

        const className = currentPlaying == player1Mark ? '.your-score' : '.cpu-score';

        document.querySelector(`${className} [data-score]`).innerHTML = gameScore[currentPlaying];

        return `${currentPlaying}-won`;
    } else {
        const tie = Object.values(board).every(x => x);

        if (tie){
            gameScore['tie']++;
            document.querySelector('.ties [data-score]').innerHTML = gameScore['tie'];
        }
    }
}

function showModal(result) {

}