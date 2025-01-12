const MTR_BUTTON_CLASS = 'mtr_button'
const MTR_DEMONSTRATION_CLASS= 'mtr_demonstration'

const DISPLAY_BLOCK = document.getElementById('display')
const TIMER_FRONT = document.getElementById('timer_front')
const LABEL_BLOCK = document.getElementById('label')
const USERNAME_INPUT = document.getElementById('usernameInput')
const USERNAME_VALIDATION = document.getElementById('usernameValidation')
const START_GAME_BUTTON = document.getElementById('startGameButton')
const START_MENU = document.getElementById('startMenu')
const TO_START_MENU_BUTTON = document.getElementById('toStartMenuButton')
const LEADER_BOARD = document.getElementById('leaderBoard')
const LEADERS_BUTTON = document.getElementById('leaders')
const START_SUPER_GAME_BUTTON = document.getElementById('startSuperGame')
const BOARD_BLOCK = document.getElementById('board')
const SUPER_GAME_DISPLAY = document.getElementById('superGameDisplay')
const SUPER_GAME_BOARD = document.getElementById('superGameBoard')

const NEXT_LEVEL_MENU = document.getElementsByClassName('gameMenu')[0]
const RESULT_MENU = document.getElementsByClassName('gameMenu')[1]
const NEXT_LEVEL_MENU_TEXT = document.getElementsByClassName('menuText')[0]
const RESULT_MENU_TEXT = document.getElementsByClassName('menuText')[1]
const RESTART_LEVEL_BUTTON = document.getElementsByClassName('restartGameButton')
const NEXT_LEVEL_BUTTON = document.getElementsByClassName('nextLevelButton')
const RESULTS = document.getElementsByClassName('result')


let username;

const maxLevel = 3
let currentLevel = 1
let max_mtr = 0
let max_color = 0
let canDrag = false
let dataTransferId;

const mtr_size = [{v: 50, h: 30.5}, {v: 75, h: 45.75},
    {v: 100, h: 61}, {v: 150, h: 91.5}, {v: 200, h: 122}]
let answer = []
let result_temp = []

const timer_rect = TIMER_FRONT.getBoundingClientRect()
let timer_id;
let total_time = 0;
let timer_time = 1000
let duration = timer_time;
let timer_step = timer_rect.width / timer_time

let superGameData = {
    "tile_10": "../src/tiles/tile_1_0.png",
    "tile_22": "../src/tiles/tile_2_2.png",
    "tile_12": "../src/tiles/tile_1_2.png",
    "tile_02": "../src/tiles/tile_0_2.png",
    "tile_01": "../src/tiles/tile_0_1.png",
    "tile_11": "../src/tiles/tile_1_1.png",
    "tile_21": "../src/tiles/tile_2_1.png",
    "tile_00": "../src/tiles/tile_0_0.png",
    "tile_20": "../src/tiles/tile_2_0.png"
}
let needReplace = false
let needDelete = false
let prevTile
let indexByLink = {}

//local storage get data
let savedData = JSON.parse(localStorage.getItem('gameResults')) || { results: [] };


LEADERS_BUTTON.onclick = ShowLeadersBoard

TO_START_MENU_BUTTON.onclick = ToStartMenu

function ToStartMenu() {
    LEADER_BOARD.style.display = 'none'
}

NEXT_LEVEL_BUTTON[0].onclick = NextLevel

function NextLevel() {
    NEXT_LEVEL_MENU.style.display = 'none'
    InitializeLevel()
}

RESTART_LEVEL_BUTTON[0].onclick = RestartGame
RESTART_LEVEL_BUTTON[1].onclick = RestartGame

function RestartGame() {
    NEXT_LEVEL_MENU.style.display = 'none'
    RESULT_MENU.style.display = 'none'
    currentLevel = 1
    START_MENU.style.display = 'flex'
}


START_GAME_BUTTON.onclick = () => {

    if (!ValidateUsername())
        return

    BOARD_BLOCK.style.display = 'flex'
    DISPLAY_BLOCK.style.display = 'flex'

    START_MENU.style.display = 'none'

    currentLevel = 1

    InitializeLevel()
}

const ValidateUsername = () => {

    username = USERNAME_INPUT.value.trim()

    if (username === ''){
        USERNAME_VALIDATION.style.display = 'flex'
        return false
    }

    USERNAME_VALIDATION.style.display = 'none'
    return true
}


DISPLAY_BLOCK.ondragover = (event) => {
    event.preventDefault();
}

DISPLAY_BLOCK.ondrop = PutOnDisplay;

async function PutOnDisplay (event)  {

    if (!canDrag) return

    canDrag = false

    const id = dataTransferId

    answer.push(id)


    DISPLAY_BLOCK.style.justifyContent = 'end'
    DISPLAY_BLOCK.insertAdjacentHTML('afterbegin', CreateMtr());

    let mtr_demonstration = document.getElementsByClassName(MTR_DEMONSTRATION_CLASS)
    let new_mtr = mtr_demonstration[0]
    new_mtr.classList.add(id)
    new_mtr.style.width = mtr_size[mtr_size.length - max_mtr - 1 + answer.length].h + 'px'
    new_mtr.style.height = mtr_size[mtr_size.length - max_mtr - 1 + answer.length].v + 'px'


    if (answer.length >= 2){
        let curr_mtr_rect = new_mtr.getBoundingClientRect()
        let prev_mtr = mtr_demonstration[1]
        let prev_mtr_rect = prev_mtr.getBoundingClientRect()
        let diff = 80 + curr_mtr_rect.width / 2 + prev_mtr_rect.width / 2

        prev_mtr.style.zIndex = 10
        new_mtr.style.zIndex = 20

        OpenMtr(new_mtr)


        if (currentLevel === 1){
            new_mtr.style.transform = 'rotate(-360deg)'
            new_mtr.style.transition = '1s'
        } else if (currentLevel === 2){
            new_mtr.style.scale = "0.7"
            new_mtr.style.opacity = "0.8"

            await delay(500)

            new_mtr.style.scale = "1"
            new_mtr.style.opacity = "1"
            new_mtr.style.transition = '0.5s'
        }else if (currentLevel === 3){
            new_mtr.style.transform = 'rotate(360deg)'
            new_mtr.style.transition = '1s'
        }

        MoveLeft(prev_mtr, `${diff}px`, 1000)

        await delay(500)


        CloseMtr(new_mtr)

        await delay(500)

        prev_mtr.style.opacity = 0;

        await delay(500)

        if (answer.length === max_mtr){

            new_mtr.style.opacity = 0;

            total_time += timer_time - duration

            if (CheckResult()){

                if (currentLevel === maxLevel){

                    ShowWinResultMenu()
                } else{

                    ShowNextLevelMenu()
                    currentLevel++;
                }

            } else {
                ShowLoseResult()
            }

            ClearData()

            canDrag = false
            return
        }
    }

    canDrag = true
}



async function InitializeLevel(){

    LABEL_BLOCK.textContent = 'LEVEL ' + currentLevel
    DISPLAY_BLOCK.style.display = 'flex'
    BOARD_BLOCK.style.display = 'flex'

    switch(currentLevel){
        case 1:
            max_mtr = 3
            max_color = 2
            break
        case 2:
            max_mtr = 4
            max_color = 3
            break
        case 3:
            max_mtr = 5
            max_color = 4
            break
    }

    await ShowMtrButtons()
    await GenerateTaskCombination()

    await StartDemonstration()
}


async function StartDemonstration(){

    // Create mtrs on display
    result_temp.forEach(el => {
        DISPLAY_BLOCK.insertAdjacentHTML('beforeend', CreateMtr());
    })


    // Color and hide mtrs
    let mtr_demonstration = document.getElementsByClassName(MTR_DEMONSTRATION_CLASS)

    for(let i = 0; i < result_temp.length; i++){
        mtr_demonstration[i].style.width = mtr_size[i + mtr_size.length - result_temp.length].h + 'px'
        mtr_demonstration[i].style.height = mtr_size[i + mtr_size.length - result_temp.length].v + 'px'
        mtr_demonstration[i].classList.add(result_temp[i])
        mtr_demonstration[i].style.opacity = 0
    }


    // Show task on display
    mtr_demonstration[0].style.opacity = 1

    await delay(500)

    for(let i = 1; i < mtr_demonstration.length; i++){

        const curr_mtr = mtr_demonstration[i]
        const prev_mtr = mtr_demonstration[i-1]

        curr_mtr.style.opacity = 1

        await delay(500)

        OpenMtr(curr_mtr)

        const curr_mtr_rect = curr_mtr.getBoundingClientRect();
        const prev_mtr_rect = prev_mtr.getBoundingClientRect();

        MoveRight(prev_mtr, `${(80 + curr_mtr_rect.width / 2
            + prev_mtr_rect.width / 2)}px`, 500)

        await delay(500)

        CloseMtr(curr_mtr)

        await delay(500)

        prev_mtr.style.opacity = 0
    }

    await delay(500)

    mtr_demonstration[mtr_demonstration.length - 1].style.opacity = 0


    ClearMtrOnDisplay()


    canDrag = true

    timer_id = StartTimer(timer_time);
}


function ShowWinResultMenu(){
    RESULT_MENU.style.display = 'flex'
    RESULT_MENU_TEXT.textContent = `Поздравляю. Вы выиграли. Ваше время - ${total_time / 100}`

    // Добавляем новый результат
    savedData.results.push({ username: username, result: total_time / 100 });

    // Сохраняем обратно в localStorage
    localStorage.setItem('gameResults', JSON.stringify(savedData));

    savedData = JSON.parse(localStorage.getItem('gameResults')) || { results: [] };

    total_time = 0
}

function ShowNextLevelMenu(){
    NEXT_LEVEL_MENU.style.display = 'flex'
    NEXT_LEVEL_MENU_TEXT.textContent = `Вы закончили этот уровень за ${(timer_time - duration ) / 100} секунд`
}

function ShowLoseResult(){
    RESULT_MENU.style.display = 'flex'
    RESULT_MENU_TEXT.textContent = `Вы проиграли. Попробуйте еще раз.`
}


function CheckResult(){
    for (let i = 0; i < max_mtr; i++) {
        if (result_temp[i] !== answer[i]) {
            return false
        }
    }
    return true
}


function ClearData(){
    ClearMtrOnDisplay()
    DISPLAY_BLOCK.style.justifyContent = 'start'
    answer = []
    result_temp = []
    HideMtrButtons()
    StopTimer()
    duration = timer_time
    ClearSuperGame()
    DISPLAY_BLOCK.style.display = 'none'
    BOARD_BLOCK.style.display = 'none'
    SUPER_GAME_DISPLAY.innerHTML = ''
    SUPER_GAME_DISPLAY.style.display = 'none'
    SUPER_GAME_BOARD.innerHTML = ''
}

function ClearSuperGame(){

    let tiles = document.getElementsByClassName("tile")

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].style.display = 'none'
    }

    tiles = SUPER_GAME_BOARD.getElementsByClassName("tileInBoard")

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].style.display = "none"
    }
}



function CreateMtr(){
    return `
    <div class="${MTR_DEMONSTRATION_CLASS}">
        <div class="mtr">
            <img class="m_bot" src="../src/m_bot.svg">
            <img class="m_top" src="../src/m_top.svg">
        </div>
    </div>
`
}


async function GenerateTaskCombination(){
    for (let i = 0; i < max_mtr; i++){
        let random_number = Math.floor(Math.random() * max_color) + 1;
        result_temp[i] = 'mtr' + random_number
    }
}


function HideMtrButtons() {
    const mtr_buttons = document.getElementsByClassName(MTR_BUTTON_CLASS)
    for (let i = 0; i < max_color; i++) {
        mtr_buttons[i].style.display = 'none'
    }
}


function ClearMtrOnDisplay(){

    let mtrs = document.getElementsByClassName(MTR_DEMONSTRATION_CLASS)

    for (let i = mtrs.length - 1; i >= 0 ; i--){
        mtrs[i].remove();
    }
}


function ShowLeadersBoard() {

    let sortedResults = savedData.results.sort((a, b) => a.result - b.result)

    for (let i = 0; i < RESULTS.length; i++) {
        let children = RESULTS[i].children
        children[1].textContent = sortedResults[i].username
        children[2].textContent = sortedResults[i].result
    }

    LEADER_BOARD.style.display = 'flex'
}


async function ShowMtrButtons(){
    const mtr_buttons = document.getElementsByClassName(MTR_BUTTON_CLASS)
    for (let i = 0; i < max_color; i++) {
        mtr_buttons[i].style.display = 'flex'

        mtr_buttons[i].ondragstart = function(event){
            PutMtrToDisplay (event)

            const transparentImg = new Image();
            transparentImg.src = '';
            event.dataTransfer.setDragImage(transparentImg, 0, 0);
        }

        mtr_buttons[i].onclick = function(event){
            PutMtrToDisplay (event)
            PutOnDisplay()
        }

        mtr_buttons[i].ondblclick  = function(event){
            PutMtrToDisplay (event)
            PutOnDisplay()
        }

        function PutMtrToDisplay (event) {
            dataTransferId = mtr_buttons[i].children[0].classList[1]
        }
    }
}



function OpenMtr(mtr) {

    const children = mtr.children[0].children

    MoveTop(children[1], '100%', 1000)
    MoveBot(children[0], '100%', 1000)
}

function CloseMtr(mtr) {

    const children = mtr.children[0].children

    MoveBot(children[1], 0, 1000)
    MoveTop(children[0], 0, 1000)
}


function MoveLeft(element, value, durationMS) {
    element.style.transform = `translateX(-${value})`
    element.style.transitionDuration = durationMS
}
function MoveRight(element, value, durationMS) {
    element.style.transform = `translateX(${value})`
    element.style.transitionDuration = durationMS
}
function MoveTop(element, value, durationMS){
    element.style.transform = `translateY(-${value})`
    element.style.transitionDuration = durationMS
}
function MoveBot(element, value, durationMS) {
    element.style.transform = `translateY(${value})`
    element.style.transitionDuration = durationMS
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



function StartTimer() {

    const timer = setInterval(() => {

        TIMER_FRONT.style.width = timer_rect.width - timer_step * (timer_time - duration) + 'px'

        duration--;


        if (duration < 0) {
            clearInterval(timer);
            ShowLoseResult()
            ClearData()
        }
    }, 10);

    return timer;
}

function StopTimer() {

    clearInterval(timer_id)
    TIMER_FRONT.style.width = '100%'
}




const ShuffleSuperGameData = () => {

    const entries = Object.entries(superGameData);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Обмен элементов
        }
        return array;
    }

    const shuffledEntries = shuffleArray(entries);

    superGameData = Object.fromEntries(shuffledEntries);
}


const FormIndexByLink = () => {

    let i = 0
    for (let key in superGameData) {

        indexByLink[superGameData[key]] = i
        i++
    }

}



START_SUPER_GAME_BUTTON.onclick = async () => {

    if (!ValidateUsername())
        return


    timer_time = 3000
    duration = timer_time;
    timer_step = timer_rect.width / timer_time


    SUPER_GAME_BOARD.style.display = 'flex'

    LABEL_BLOCK.textContent = "SUPER GAME"

    SUPER_GAME_DISPLAY.style.display = 'flex'

    START_MENU.style.display = 'none'

    ShuffleSuperGameData()

    InitializeSuperGame()

    await delay(2000)

    ReturnAllTilesToBoard()

    ClearSuperGameDisplay()

    AddTilesInputs()

    timer_id = StartTimer(timer_time);

    FormIndexByLink()
}


const InitializeSuperGame = () => {

    let htmp = `
                <img id="tile_00" class="tile" src="../src/tiles/tile_0_0.png">
                <img id="tile_01" class="tile" src="../src/tiles/tile_0_1.png">
                <img id="tile_02" class="tile" src="../src/tiles/tile_0_2.png">
                <img id="tile_10" class="tile" src="../src/tiles/tile_1_0.png">
                <img id="tile_11" class="tile" src="../src/tiles/tile_1_1.png">
                <img id="tile_12" class="tile" src="../src/tiles/tile_1_2.png">
                <img id="tile_20" class="tile" src="../src/tiles/tile_2_0.png">
                <img id="tile_21" class="tile" src="../src/tiles/tile_2_1.png">
                <img id="tile_22" class="tile" src="../src/tiles/tile_2_2.png">
            `

    SUPER_GAME_DISPLAY.insertAdjacentHTML('afterbegin', htmp);

}


const ReturnTileToBoard = (link) => {

    let html = `<img class="tileInBoard" src="${link}" draggable="true">`

    SUPER_GAME_BOARD.insertAdjacentHTML('beforeend', html);
}


const ReturnAllTilesToBoard = () => {

    for (let key in superGameData) {

        ReturnTileToBoard(superGameData[key])

        let tilesInBoard = SUPER_GAME_BOARD.getElementsByClassName("tileInBoard");

        let i = tilesInBoard.length - 1;


        (function(index, currentKey) {
            tilesInBoard[index].ondragstart = (event) => {



                event.dataTransfer.setData("link", superGameData[currentKey]);

                needDelete = true
                prevTile = tilesInBoard[index];

            };
        })(i, key);

    }

}

const ClearSuperGameDisplay = () => {

    let tiles = document.getElementsByClassName("tile")

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].src = ""
    }
}


const AddTilesInputs = () => {

    let tiles = document.getElementsByClassName("tile")

    for (let i = 0; i < tiles.length; i++) {

        tiles[i].ondragover = (event) => {
            event.preventDefault();
        }

        tiles[i].ondrop = (event) => {

            let link = event.dataTransfer.getData('link')

            let el = document.getElementById(tiles[i].id)


            if (needReplace) {

                prevTile.src = el.getAttribute("src")
                needReplace = false
            }else if (tiles[i].getAttribute("src") !== "") {
                let tilesInBoard = SUPER_GAME_BOARD.getElementsByClassName("tileInBoard")

                tilesInBoard[indexByLink[tiles[i].getAttribute("src")]].style.opacity = "1"
                tilesInBoard[indexByLink[tiles[i].getAttribute("src")]].draggable = true

                tilesInBoard[indexByLink[link]].style.opacity = "0"
                tilesInBoard[indexByLink[link]].draggable = false

                needDelete = false
            }
            else if (needDelete) {
                prevTile.style.opacity = "0"
                prevTile.draggable = false

                needDelete = false
            }

            el.src = link


            if (CheckSuperGameResult()){
                ShowSuperGameWinResultMenu()
            }
        }

        tiles[i].ondragstart = function(event){


            event.dataTransfer.setData('link', tiles[i].getAttribute("src"))
            needReplace = true
            prevTile = tiles[i]
        }


    }
}


const CheckSuperGameResult = () => {

    let tiles = document.getElementsByClassName("tile")

    for (let i = 0; i < tiles.length; i++) {

        if (tiles[i].getAttribute("src") !== superGameData[tiles[i].id]) {

            return false
        }
    }

    return true
}


function ShowSuperGameWinResultMenu(){

    clearInterval(timer_id)
    total_time += timer_time - duration
    RESULT_MENU.style.display = 'flex'
    RESULT_MENU_TEXT.textContent = `Поздравляю. Вы победили в супер-игре. Ваше время - ${total_time / 100}`
    ClearData()
    total_time = 0

}


SUPER_GAME_BOARD.ondragover = (event) => {
    event.preventDefault();
}


SUPER_GAME_BOARD.ondrop = (event) => {

    let link = event.dataTransfer.getData('link')

    if (link === "") {
        needReplace = true
        return
    }

    if (needReplace) {

        prevTile.src = ""

        let tilesInBoard = SUPER_GAME_BOARD.getElementsByClassName("tileInBoard")

        tilesInBoard[indexByLink[link]].style.opacity = "1"
        tilesInBoard[indexByLink[link]].draggable = true

        needReplace = false
    }
}

