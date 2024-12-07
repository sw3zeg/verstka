
// Исходный массив
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


// Перемешиваем массив
shuffleArray(que)


const maxQuestions = que.length;
const answersCount = 4;

let currentQuestion = 0;
let isStarted = false;
let endedTest = false




// Перемешивает массив с вопросами
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
}


document.getElementById("btn")
    .onclick = async function () {
        if (currentQuestion === 0 && !isStarted) {
            await CreateNextQuestionBlock();
            isStarted = true;
        }
    }


// Выбор варианта ответа
const MakeChose = async (element_index) => {

    // Перестраховка, чтобы не перезаписывалось значение
    if (que[currentQuestion][6] != null)
        return

    que[currentQuestion][6] = element_index

    // Если выбран верный ответ
    if (element_index === que[currentQuestion][7]){
        SetSuccessMarker();
        await CleanErrorAnswers();
        ShowDescription();

        // Пауза, чтобы прочитать описание
        await delay(3000)

        HideAnswerBlock()
    }else {
        SetErrorMarker();
        await CleanAllAnswers();
        HideAnswerBlock()
    }

    currentQuestion++;

    if (currentQuestion < maxQuestions){
        await CreateNextQuestionBlock();
    } else {
        endedTest = true;
        document.getElementById("banner")
            .style.display = "flex"

        let result = 0
        for (let i = 0; i < que.length; i++) {
            if (que[i][6] == que[i][7]){
                result +=1;
            }
        }

        const resultBlock = document.createElement('div');
        resultBlock.textContent = 'Ваш результат: '+result + '/' + maxQuestions;
        resultBlock.style.display = 'flex'
        resultBlock.id = 'result'

        document.getElementsByClassName("main")[0]
            .appendChild(resultBlock);
    }
}


// Если ответили верно, нужно убрать неверные ответы, а верный пометить
const CleanErrorAnswers = async () => {

    let lateDisplayNone = []

    for (let i = 0; i < answersCount; i++){

        let answer =
            document.getElementsByClassName("answer" + (i+1))[currentQuestion]

        // Если текущий вариант ответа не верный
        if (i !== que[currentQuestion][7] - 1){
            answer.classList.add("invalid_answer")

            lateDisplayNone.push(answer)
        } else{
            // Для адаптивности. Если ширина разрешения > 1300 записываем
            // в css переменную горизонтальную величину для анимации
            if (window.innerWidth > 1300){
                let width = answer.getBoundingClientRect().width
                let gup = (((60 / 100) * window.innerWidth)-(width*4))/5;

                document.documentElement.style.
                setProperty('--shift-left-distance',
                    "-"+((width * i)+(gup * i))+"px");
            }
            else{
                let height = 60
                let gup = 10;

                document.documentElement.style.
                setProperty('--shift-top-distance',
                    "-"+((height * i)+(gup * i))+"px");
            }

            answer.classList.add("valid_answer")
        }
    }

    await delay(1000)

    for (let i = 0; i < lateDisplayNone.length; i++){
        lateDisplayNone[i].style.display = "none";
    }
}


// Вызывается если ответили неправильно и нужно выкинуть все ответы
const CleanAllAnswers = async () => {
    // Массив, все элементы которого будут выключены
    let lateDisplayNone = []

    for (let i = 0; i < answersCount; i++){
        let answer =
            document.getElementsByClassName("answer" + (i+1))[currentQuestion]

        answer.classList.add("invalid_answer")
        lateDisplayNone.push(answer)
    }

    await delay(1000)

    for (let i = 0; i < lateDisplayNone.length; i++){
        lateDisplayNone[i].style.display = "none";
    }
}


// Отобразить и скрыть описание
const ShowDescription = () => {
    document.getElementsByClassName("description")[currentQuestion]
        .style.display = "flex";
}
const HideDescription = () => {
    document.getElementsByClassName("description")[currentQuestion]
        .display = "none";
}


// Скрывает блок ответов
const HideAnswerBlock = () => {
    document.getElementsByClassName("answer_block")[currentQuestion]
        .style.display = "none";
}


// Отобразить скрытый блок с правильным ответом и описанием
const ShowAnswerBlock = (index) => {
    //que[index][7]) - это индекс верного ответа для конкретного вопроса
    document.getElementsByClassName("answer"+(que[index][7]))[index]
        .style.position = "relative";
    document.getElementsByClassName("answer"+(que[index][7]))[index]
        .classList.remove("invalid_answer");
    document.getElementsByClassName("answer"+(que[index][7]))[index]
        .style.display = "flex";
    document.getElementsByClassName("answer_block")[index]
        .style.display = "flex";
    document.getElementsByClassName("description")[index]
        .style.display = "flex";
}


// Установка картинки(да/нет) в тексте вопроса
const SetErrorMarker = () => {
    document.getElementsByClassName("image")[currentQuestion]
        .src = "../src/no.png"
}
const SetSuccessMarker = () => {
    document.getElementsByClassName("image")[currentQuestion]
        .src = "../src/yes.png"
}


// Создание следующего вопроса в тесте
const CreateNextQuestionBlock = async () => {

    // Чтобы не выйти за пределы массива
    if (currentQuestion > maxQuestions)
        return


    // Создаем блок вопроса с нужной структурой
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


    // Добавляем в конце класса main html объект question
    document.getElementsByClassName("main")[0]
        .insertAdjacentHTML('beforeend', question);


    // Добавляю обработчикки для вариантов ответа
    document.getElementsByClassName("answer1")[currentQuestion]
        .onclick = async function() {
            // this.style.padding = "0 20px"; Не стал делать, не красиво
            await MakeChose(1)
        };

    document.getElementsByClassName("answer2")[currentQuestion]
        .onclick = async function() {
            await MakeChose(2)
        };

    document.getElementsByClassName("answer3")[currentQuestion]
        .onclick = async function() {
            await MakeChose(3)
        };

    document.getElementsByClassName("answer4")[currentQuestion]
        .onclick = async function() {
            await MakeChose(4)
        };


    // Добавляет обработчики нажатия на блоки вопросов, запоминая их индекс,
    // чтобы потом выдвинуть для него ответ при нажатии
    document.getElementsByClassName("question_block")[currentQuestion]
        .onclick = (function(questionIndex) {
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
