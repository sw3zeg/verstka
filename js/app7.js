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

const NEXT_LEVEL_MENU = document.getElementsByClassName('gameMenu')[0]
const RESULT_MENU = document.getElementsByClassName('gameMenu')[1]
const NEXT_LEVEL_MENU_TEXT = document.getElementsByClassName('menuText')[0]
const RESULT_MENU_TEXT = document.getElementsByClassName('menuText')[1]
const RESTART_LEVEL_BUTTON = document.getElementsByClassName('restartGameButton')
const NEXT_LEVEL_BUTTON = document.getElementsByClassName('nextLevelButton')
const RESULTS = document.getElementsByClassName('result')


let username;

let currentLevel = 1
const maxLevel = 3
let max_mtr = 0
let max_color = 0
let canDrag = false

let result_temp = []
let answer = []
const mtr_size = [{v: 50, h: 30.5}, {v: 75, h: 45.75},
    {v: 100, h: 61}, {v: 150, h: 91.5}, {v: 200, h: 122}]

let timer_id;
let total_time = 0;
let timer_time = 1000
let duration = timer_time;
const timer_rect = TIMER_FRONT.getBoundingClientRect()
const timer_step = timer_rect.width / timer_time

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

    username = USERNAME_INPUT.value.trim()

    if (username === ''){
        USERNAME_VALIDATION.style.display = 'flex'
        return
    }

    USERNAME_VALIDATION.style.display = 'none'
    START_MENU.style.display = 'none'

    currentLevel = 1

    InitializeLevel()
}


DISPLAY_BLOCK.ondragover = (event) => {
    event.preventDefault();
}

DISPLAY_BLOCK.ondrop = async (event) => {

    if (!canDrag) return

    canDrag = false

    const id = event.dataTransfer.getData('id')

    answer.push(id)


    DISPLAY_BLOCK.style.justifyContent = 'end'
    DISPLAY_BLOCK.insertAdjacentHTML('afterbegin', CreateMtr());

    let mtr_demonstration = document.getElementsByClassName(MTR_DEMONSTRATION_CLASS)
    let new_mtr = mtr_demonstration[0]
    // console.log(new_mtr)
    new_mtr.classList.add(id)
    new_mtr.style.width = mtr_size[mtr_size.length - max_mtr - 1 + answer.length].h + 'px'
    new_mtr.style.height = mtr_size[mtr_size.length - max_mtr - 1 + answer.length].v + 'px'

    // eventQueue.push(curr_mtr: new_mtr)

    if (answer.length >= 2){
        let curr_mtr_rect = new_mtr.getBoundingClientRect()
        let prev_mtr = mtr_demonstration[1]
        let prev_mtr_rect = prev_mtr.getBoundingClientRect()
        let diff = 80 + curr_mtr_rect.width / 2 + prev_mtr_rect.width / 2

        prev_mtr.style.zIndex = 10
        new_mtr.style.zIndex = 20
        //console.log(max_mtr - answer.length)

        OpenMtr(new_mtr)

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

                console.log(currentLevel)
                console.log(maxLevel)

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

    switch(currentLevel){
        case 1:
            console.log(111)
            max_mtr = 3
            max_color = 2
            break
        case 2:
            console.log(222)
            max_mtr = 4
            max_color = 3
            break
        case 3:
            console.log(333)
            max_mtr = 5
            max_color = 4
            break
    }

    console.log(max_mtr)
    console.log(max_color)

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
    console.log(RESULT_MENU_TEXT)
    console.log(total_time)
    RESULT_MENU_TEXT.textContent = `Поздравляю. Вы выиграли. Ваше время - ${total_time / 100}`

    // Добавляем новый результат
    savedData.results.push({ username: username, result: total_time / 100 });

    // Сохраняем обратно в localStorage
    localStorage.setItem('gameResults', JSON.stringify(savedData));

    savedData = JSON.parse(localStorage.getItem('gameResults')) || { results: [] };
}

function ShowNextLevelMenu(){
    NEXT_LEVEL_MENU.style.display = 'flex'
    NEXT_LEVEL_MENU_TEXT.textContent = `Вы закончили этот уровень за ${(timer_time - duration ) / 100} секунд`
}

function ShowLoseResult(){
    RESULT_MENU.style.display = 'flex'
    RESULT_MENU_TEXT.textContent = `Вы проиграли. Попробуйте еще раз. Пройдено ${currentLevel - 1} из ${maxLevel} уровней.`
}


function CheckResult(){
    for (let i = 0; i < max_mtr; i++) {
        //console.log(`${result_temp[i]} - ${answer[i]}`)
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

    console.log(1)
    let sortedResults = savedData.results.sort((a, b) => a.result - b.result)

    for (let i = 0; i < RESULTS.length; i++) {
        let children = RESULTS[i].children
        console.log(sortedResults[i].username)
        console.log(sortedResults[i].result)
        children[1].textContent = sortedResults[i].username
        children[2].textContent = sortedResults[i].result
    }

    LEADER_BOARD.style.display = 'flex'
    console.log(2)
}


async function ShowMtrButtons(){
    const mtr_buttons = document.getElementsByClassName(MTR_BUTTON_CLASS)
    for (let i = 0; i < max_color; i++) {
        mtr_buttons[i].style.display = 'flex'

        mtr_buttons[i].ondragstart = function(event){
            event.dataTransfer.setData('id', mtr_buttons[i].children[0].classList[1])

            const transparentImg = new Image();
            transparentImg.src = '';
            event.dataTransfer.setDragImage(transparentImg, 0, 0);
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

    clearInterval(timer_id);
    TIMER_FRONT.style.width = '100%'
}
