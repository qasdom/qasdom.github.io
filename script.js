const playBoard = document.querySelector(".play-board");
const gamedetails = document.querySelector(".game-details");
const scoreElement = document.querySelector(".score");
const shieldElement = document.querySelector(".shield");
const timeElement = document.querySelector(".timer");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const bombs = document.querySelectorAll(".bombs i");
let gameOver = false;
let originalSnakeColor = '#60CBFF';
let foodX, foodY;
let bombX, bombY;
let fruitX, fruitY;
let bonusX, bonusY;
let colorn = 0;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let bonusType;
let bonusChance;
let colorgd = ["DarkOrange","DarkRed","DarkOrange","Green","GoldenRod","SkyBlue","RebeccaPurple","Violet"];
let color = ["SandyBrown","Salmon","LightSalmon","LightGreen","LemonChiffon","LightCyan","MediumPurple","LightPink"];
let setIntervalId;
let score = 0;
let shield = 0;
let bombsc = 1;
let time = 0;
let desat = 0;

var rounded = function(number){
    return Math.round(parseFloat(number) * 10) / 10;
}
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Рекорд: ${highScore}`;
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
const updateBonusPosition = () => {
    bonusX = Math.floor(Math.random() * 30) + 1;
    bonusY = Math.floor(Math.random() * 30) + 1;
    bonusType = Math.floor(Math.random() * 3) + 1;
}
const updateBombPosition = () => {
    bombsCoordinates = [];
    for (let i = 0; i < bombsc; i++) {
        let bombX, bombY;
        do {
            bombX = Math.floor(Math.random() * 30) + 1;
            bombY = Math.floor(Math.random() * 30) + 1;
        } while ((bombX === foodX && bombY === foodY) || (bombX === fruitX && bombY === fruitY));
        bombsCoordinates.push([bombX, bombY]);
    }
}
const updateFruitPosition = () => {
    fruitX = Math.floor(Math.random() * 30) + 1;
    fruitY = Math.floor(Math.random() * 30) + 1;
}
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Игра окончена !                                                                                             ------------------------------------------------------------------------------------------------                                                                             Справка:                                                                                                                                                                                                                 Касание стены убивает                                                                               Голубой квадрат - змейка                                                                            Красный квадрат - яблоко(при съедании добавляет 1 очко)                                                                                       Фиолетовый - гнилой фрукт(при съедании вычитает 1 очко)                                                                        Черный квадрат - бомба(при съедании игра заканчивается)                                                           ------------------------------------------------------------------------------------------------");
    location.reload();
}
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}
const changeBombs = q => {
    if (q.key === "ArrowR" && bombsc < 11) {
        bombsc += 1;
        updateBombPosition();
    } else if (q.key === "ArrowL" && bombsc > 1) {
        bombsc -= 1;
        updateBombPosition();
    } else if (q.key === "ArrowLc" && colorn > 0) {
        colorn -= 1;
        playBoard.style.backgroundColor = color[colorn];
        gamedetails.style.backgroundColor = colorgd[colorn];
        for (let control of controls) {
            control.style.backgroundColor = colorgd[colorn];
        }
        for (let bomb of bombs) {
            bomb.style.backgroundColor = colorgd[colorn];
        }
    } else if (q.key === "ArrowRc" && colorn < 10) {
        colorn += 1;
        playBoard.style.backgroundColor = color[colorn];
        gamedetails.style.backgroundColor = colorgd[colorn];
        for (let control of controls) {
            control.style.backgroundColor = colorgd[colorn];
        }
        for (let bomb of bombs) {
            bomb.style.backgroundColor = colorgd[colorn];
        }
    }
}
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));
bombs.forEach(button => button.addEventListener("click", () => changeBombs({ key: button.dataset.key })));
const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    for (let i = 0; i < bombsc; i++) {
        html += `<div class="bomb" style="grid-area: ${bombsCoordinates[i][1]} / ${bombsCoordinates[i][0]}"></div>`;
    }
    html += `<div class="fruit" style="grid-area: ${fruitY} / ${fruitX}"></div>`;
    html += `<div class="bonus" style="grid-area: ${bonusY} / ${bonusX}"></div>`;
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        updateBombPosition();
        updateFruitPosition();
        bonusChance = Math.floor(Math.random() * 4) + 1;
        if(bonusChance === 2){
            updateBonusPosition();
        }
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Счет: ${score}`;
        highScoreElement.innerText = `Рекорд: ${highScore}`;
    }
    for (let i=0; i<bombsCoordinates.length; i++) {
        if (snakeX === bombsCoordinates[i][0] && snakeY === bombsCoordinates[i][1]) {
            if(shield === 1){
                shield = 0
                updateBombPosition();
                shieldElement.innerText = ``;
            }
            else{
            return handleGameOver();
            }
        }
    }
    if(snakeX === bonusX && snakeY === bonusY){
        if(bonusType === 1){
            for (let i = 0; i < 3; i++) {
                snakeBody.unshift({ x: snakeX, y: snakeY });
            }
            score+=3;
            highScore = score >= highScore ? score : highScore;
            localStorage.setItem("high-score", highScore);
            scoreElement.innerText = `Счет: ${score}`;
            highScoreElement.innerText = `Рекорд: ${highScore}`;
        }
        if(bonusType === 2){
            if(snakeBody.length > 3){
                for (let i = 0; i < 3; i++) {
                    snakeBody.pop();
                }
                score-=3;
            }
            else if(snakeBody.length === 3){
                for (let i = 0; i < 2; i++) {
                    snakeBody.pop();
                }
                score-=2;
            }
            else if(snakeBody.length === 2){
                    snakeBody.pop();
                score-=1;
            }
            scoreElement.innerText = `Счет: ${score}`;
        }
        if(bonusType === 3){
            shield = 1;
            shieldElement.innerText = `Щит активирован`;
        }
        updateBonusPosition();
    }
    if(snakeX === fruitX && snakeY === fruitY){
    updateFruitPosition();
    if(shield === 1){
        shield = 0
        shieldElement.innerText = ``;
    }
    else{
        if(snakeBody.length>1){
            snakeBody.pop();
            score--;
            scoreElement.innerText = `Счет: ${score}`;
        }
    }   
    }
    snakeX += velocityX;
    snakeY += velocityY;
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];
    //o
    if(velocityX != 0 || velocityY != 0) {
        desat += 1;
    }
    if(desat == 10) {
        desat = 0;
        time += 1;
        timeElement.innerText = `Время: ${time}`;
    }
    //o
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}
updateFoodPosition();
updateBombPosition();
updateFruitPosition();
updateBonusPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
