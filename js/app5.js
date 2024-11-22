
const que = [
    [
        "А когда с человеком может произойти дрожемент?",
        "Когда он влюбляется",
        "Когда он идет шопиться",
        "Когда он слышит смешную шутку",
        "Когда он боится, пугается",
        "Лексема «дрожемент» имплицирует состояние крайнего " +
        "напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят».",
        null, // Выбранный ответ
        4 // Правильный ответ
    ],
    [
        "Говорят, Антон заовнил всех. Это еще как понимать?",
        "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?",
        "Антон очень надоедливый и въедливый человек, всех задолбал",
        "Молодец, Антон, всех победил!",
        "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей",
        "Термин «заовнить» заимствован из английского языка, он происходит от " +
        "слова own и переводится как «победить», «завладеть», «получить».",
        null,
        3
    ],
    [
        "А фразу «заскамить мамонта» как понимать?",
        "Разозлить кого-то из родителей",
        "Увлекаться археологией",
        "Развести недотепу на деньги",
        "Оскорбить пожилого человека",
        "Заскамить мамонта — значит обмануть или развести на деньги. " +
        "Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых " +
        "людей (древних, как мамонты), которых легко обвести вокруг пальца.",
        null,
        3
    ],
    [
        "Кто такие бефефе?",
        "Вши?",
        "Милые котики, такие милые, что бефефе",
        "Лучшие друзья",
        "Люди, которые не держат слово",
        "Бефефе — это лучшие друзья. Этакая аббревиатура от " +
        "английского выражения best friends forever.",
        null,
        3
    ],
]

let currentQuestion = 0;
const maxQuestions = que.length;
const answersCount = 4;
let isStarted = false;
let endedTest = false



shuffleArray(que)

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}


document.getElementById("btn").onclick = function () {
    if (currentQuestion === 0 && !isStarted) {
        QuestionBlock();
        isStarted = true;
    }
}

const MakeChose = async (element_index) => {

    if (que[currentQuestion][6] != null)
        return

    que[currentQuestion][6] = element_index

    if (element_index === que[currentQuestion][7]){
        SetSuccessMarker();
        await CleanErrorAnswers();
        ShowDescription();

        await delay(5000)

        HideAnswerBlock()
    }else {
        SetErrorMarker();
        await CleanAllAnswers();
        HideAnswerBlock()
    }

    currentQuestion++;

    if (currentQuestion < maxQuestions){
        await QuestionBlock();
    } else {
        endedTest = true;
        document.getElementById("banner").style.display = "flex"
        // document.getElementById("result").style.display = "flex"

        let result = 0
        for (let i = 0; i < que.length; i++) {
            if (que[i][6] == que[i][7]){
                result +=1;
            }
        }

        // document.getElementById("result").innerText += result + '/' + maxQuestions

        const element = document.createElement('div');
        element.textContent = 'Ваш результат: '+result + '/' + maxQuestions;
        element.style.display = 'flex'
        element.id = 'result'

        document.getElementById("container1").append(element)

        
    }
}


const CleanErrorAnswers = async () => {

    let lateDisplayNone = []

    for (let i = 0; i < answersCount; i++){
        let answer = document.getElementsByClassName("answer" + (i+1))[currentQuestion]
        if (i !== que[currentQuestion][7] - 1){
            answer.classList.add("invalid_answer")
            lateDisplayNone.push(answer)
        } else{
            document.documentElement.style.
                setProperty('--shift-distance',
                "-"+((180 * i)+(16 * i))+"px");
            answer.classList.add("valid_answer")
        }
    }

    await delay(1000)

    for (let i = 0; i < lateDisplayNone.length; i++){
        lateDisplayNone[i].style.display = "none";
    }
}

const CleanAllAnswers = async () => {

    let lateDisplayNone = []

    for (let i = 0; i < answersCount; i++){
        let answer = document.getElementsByClassName("answer" + (i+1))[currentQuestion]
        answer.classList.add("invalid_answer")
        lateDisplayNone.push(answer)
    }

    await delay(1000)

    for (let i = 0; i < lateDisplayNone.length; i++){
        lateDisplayNone[i].style.display = "none";
    }
}


const ShowDescription = () => {
    let description = document.getElementsByClassName("description")[currentQuestion]
    description.style.display = "block";
}

const HideDescription = () => {
    document.getElementsByClassName("description")[currentQuestion].display = "none";
}

const HideAnswerBlock = () => {
    document.getElementsByClassName("answer_block")[currentQuestion].style.display = "none";
}

const ShowAnswerBlock = (index) => {
    document.getElementsByClassName("description")[index].style.display = "block";
    document.getElementsByClassName("answer"+(que[index][7]))[index].style.position = "static";
    document.getElementsByClassName("answer"+(que[index][7]))[index].classList.remove("invalid_answer");
    document.getElementsByClassName("answer"+(que[index][7]))[index].style.display = "block";
    document.getElementsByClassName("answer_block")[index].style.display = "flex";
}

const SetErrorMarker = () => {
    document.getElementsByClassName("image")[currentQuestion].src = "../src/no.png"
}
const SetSuccessMarker = () => {
    document.getElementsByClassName("image")[currentQuestion].src = "../src/yes.png"
}

// Общее создание нового вопроса в тесте
const QuestionBlock = async () => {

    if (currentQuestion > maxQuestions)
        return

    const question = `
    <div class="question_block">
        <div class="question">
            <div class="index">${currentQuestion + 1}.</div>
            <div class="title">${que[currentQuestion][0]}</div>
            <div class="image_block">
                <img class="image" src="">
            </div>
        </div>
        <div class="answer_block">
            <div class="answer1 answer">${que[currentQuestion][1]}</div>
            <div class="answer2 answer">${que[currentQuestion][2]}</div>
            <div class="answer3 answer">${que[currentQuestion][3]}</div>
            <div class="answer4 answer">${que[currentQuestion][4]}</div>
            <div class="description">${que[currentQuestion][5]}</div>
        </div>
    </div>
`;

    document.getElementById('container1')
        .insertAdjacentHTML('beforeend', question);


    // Добавляю обработчикки выбора варианта
    document.getElementsByClassName("answer1")[currentQuestion].onclick = async function() {
        await MakeChose(1)
    };

    document.getElementsByClassName("answer2")[currentQuestion].onclick = async function() {
        await MakeChose(2)
    };

    document.getElementsByClassName("answer3")[currentQuestion].onclick = async function() {
        await MakeChose(3)
    };

    document.getElementsByClassName("answer4")[currentQuestion].onclick = async function() {
        await MakeChose(4)
    };


    //
    document.getElementsByClassName("question_block")[currentQuestion].onclick
        = (function(questionIndex) {
        return function() {
            if (endedTest) {
                ShowAnswerBlock(questionIndex);
            }
        };
    })(currentQuestion);
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


