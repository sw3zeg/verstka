
const WORD_CLASS = 'word'
const DEFAULT_COLOR = '#8c8c8c'
const add_words_button = document.querySelector('#add_words_button')
const words_input = document.querySelector('#words_input')
const words_output = document.querySelector('#output')
const block3 = document.querySelector('#block3')
const block2 = document.querySelector('#block2')


const words = new Map();

let a_counter = 0;
let b_counter = 0;
let n_counter = 0;

let offsetX = 0
let offsetY = 0


add_words_button.onclick = () => {

    ClearWords()

    let words_array = words_input.value
        .split('-')
        .map(word => word.trim())
        .sort((a, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            const isNumA = !isNaN(numA);
            const isNumB = !isNaN(numB);

            if (isNumA && isNumB) {
                return numA - numB;
            } else {
                return a.localeCompare(b);
            }
        })

    words_array.forEach(word => {
        words.set(GetNextKeyForWord(word), {word: word, color: GetRandomColor()});
    })

    DrawWordsOnPanel()
}

function GetNextKeyForWord(word) {

    let first_symbol = word[0]

    if (/\p{Lu}/u.test(first_symbol)){
        a_counter++;
        return 'a' + a_counter;
    }
    else if (/\p{Ll}/u.test(first_symbol)){
        b_counter++;
        return 'b' + b_counter;
    }
    else if (/[0-9]+/.test(first_symbol)){
        n_counter++;
        return 'n' + n_counter
    }
}

function DrawWordsOnPanel() {

    for (let i = 1; i <= a_counter; i++){
        let key = 'a' + i;
        let word = words.get(key).word;
        let wordLink = CreateNewWord(key, word)
        words.set(key, {...words.get(key), link: wordLink, used: false})
    }

    for (let i = 1; i <= b_counter; i++){
        let key = 'b' + i;
        let word = words.get(key).word;
        let wordLink = CreateNewWord(key, word)
        words.set(key, {...words.get(key), link: wordLink, used: false})
    }

    for (let i = 1; i <= n_counter; i++){
        let key = 'n' + i;
        let word = words.get(key).word;
        let wordLink = CreateNewWord(key, word)
        words.set(key, {...words.get(key), link: wordLink, used: false})
    }
}

function ReDrawWordsOnPanel() {

    block3.innerHTML = '';

    for (let i = 1; i <= a_counter; i++){
        let key = 'a' + i;

        if (words.get(key).used)
            continue;

        let wordLink = words.get(key).link
        block3.append(wordLink)
    }

    for (let i = 1; i <= b_counter; i++){
        let key = 'b' + i;

        if (words.get(key).used)
            continue;

        let wordLink = words.get(key).link
        block3.append(wordLink)
    }

    for (let i = 1; i <= n_counter; i++){
        let key = 'n' + i;

        if (words.get(key).used)
            continue;

        let wordLink = words.get(key).link
        block3.append(wordLink)
    }
}

function CreateNewWord(key, word) {
    const word_block = document.createElement('div');
    word_block.id = key;
    word_block.className = WORD_CLASS;
    word_block.draggable = true;
    word_block.textContent = `${key} ${word}`;

    block3.appendChild(word_block);

    word_block.ondragstart = function(event){
        event.dataTransfer.setData('id', key)
        event.dataTransfer.setData('offsetX', key)
        event.dataTransfer.setData('offsetY', key)

        const wordRect = event.target.getBoundingClientRect();
        offsetX = event.clientX - wordRect.left;
        offsetY = event.clientY - wordRect.top;
    }

    word_block.onclick = (function(key){
        return function() {

            const word = words.get(key);
            if (word.used) {

                const newWord = document.createElement('span')
                newWord.textContent = word.word + ' ';
                newWord.style.color = word.color;

                words_output.appendChild(newWord)
            }
        };
    })(key);

    return word_block;
}

function ClearWords() {
    words.clear();
    block3.innerHTML = '';
    block2.innerHTML = '';
    words_output.innerHTML = '';
    a_counter = 0;
    b_counter = 0;
    n_counter = 0;
}

block2.ondragover = (event) => {
    event.preventDefault();
}

block2.ondrop = (event) => {

    const wordId = event.dataTransfer.getData('id')

    words.set(wordId, {...words.get(wordId), used: true});

    const word = document.querySelector('#'+wordId)

    const containerRect = block2.getBoundingClientRect();

    // 10 - margin-left
    const x = event.clientX - containerRect.left - offsetX - 10;
    const y = event.clientY - containerRect.top - offsetY;

    word.style.position = 'absolute';
    word.style.left = `${x}px`;
    word.style.top = `${y}px`;

    word.style.backgroundColor = words.get(wordId).color;

    block2.appendChild(word);
}


block3.ondragover = (event) => {

    event.preventDefault();
}

block3.ondrop = (event) => {

    let wordId = event.dataTransfer.getData('id')
    words.set(wordId, {...words.get(wordId), used: false});

    const word = document.querySelector('#'+wordId)
    word.style.position = 'static'
    word.style.backgroundColor = DEFAULT_COLOR

    ReDrawWordsOnPanel()
}


function GetRandomColor() {

    let minBrightness = 100
    let maxBrightness = 200

    let r, g, b, brightness;

    do {
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);

        // Формула: яркость = 0.299*R + 0.587*G + 0.114*B
        brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    } while (brightness < minBrightness || brightness > maxBrightness);

    // Преобразуем значения в шестнадцатеричный формат
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
