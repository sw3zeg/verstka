
const response = confirm("Приступаем?");

if (response) {
    alert("Жизнь продолжается, и мы должны даигаться дальше");
} else {
    alert("Камень остается на месте")
}


var fuel;

document.getElementById('slider').addEventListener('input', function() {
    document.getElementById('sliderValue').textContent = this.value;
    fuel = this.value
});


var path

document.getElementById('path').onclick = function(){
    path = prompt("Введите значение:");
    document.getElementById('pathValue').textContent = path;
};


var rate;

document.getElementById("car").onclick = function() {
    rate = 10

    const carButton = document.getElementById('car');
    const motoButton = document.getElementById("moto");

    if (!carButton.classList.contains('active')) {
        carButton.classList.add('active');
        motoButton.classList.remove('active');
    }

    InsertResultImage()
}

document.getElementById("moto").onclick = function() {
    rate = 5

    const carButton = document.getElementById('car');
    const motoButton = document.getElementById("moto");

    if (!motoButton.classList.contains('active')) {
        motoButton.classList.add('active');
        carButton.classList.remove('active');
    }

    InsertResultImage()
}


const container = document.getElementById('imageContainer');
const InsertResultImage = () => {
    container.innerHTML = '';

    var isPossible = Calculate()

    const newImg = document.createElement('img');
    if (isPossible) {
        newImg.src = '../src/sm_1.png';
        newImg.alt = '1';
    } else {
        newImg.src = '../src/sm_2.png';
        newImg.alt = '2';
    }

    container.appendChild(newImg);
};

const Calculate = () => {
    return (path / 100 * rate) <= fuel
};
