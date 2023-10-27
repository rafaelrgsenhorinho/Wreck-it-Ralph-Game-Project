const state = {
    view:{squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        life: document.querySelector("#lifes"),
        levels: document.querySelector("#level"),
    },
    values:{
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 10,
        level: 1,
    },
    actions: {
        timerId: null,
        countDownTimerId: setInterval(countDown, 1000),
        playerLife: 3,
    }
};

// Timer Configuration and Game Over

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if(state.values.currentTime <= 0) {
        alert("Game Over! Your score was: " + state.values.result);
        newGame();
    }

    if(state.actions.playerLife <= 0) {  
        alert("Game Over! You lost all your lifes. Your score was: " + state.values.result);
        newGame();
    }
}

//Click Sound

function playSound(audioName) {
    let audio = new Audio(`./src/sounds/${audioName}.m4a`)
    audio.volume = 0.2;
    audio.play();
}

//RESET GAME

function reset() {
    // Reset timer
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);

    //Restore initial values
    state.values.currentTime = 10;
    state.actions.playerLife = 3;
    state.values.result = 0;
    state.values.level = 1;
    state.values.gameVelocity = 1000;

    state.view.timeLeft.textContent =state.values.currentTime;
    state.view.life.textContent = state.actions.playerLife;
    state.view.score.textContent = state.values.result;
    state.view.levels.textContent = state.values.level;

    //Remove any EventListener remaining
    state.view.squares.forEach((square) => {
        square.removeEventListener("mousedown", handleClick);
    });
}

// Enemy Movement

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    })

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id

}

function moveEnemy() {
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity)
}

// Player Interaction

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        // Remove existing event listener if it exists, preventing double clicks
        square.removeEventListener("mousedown", handleClick);
        square.addEventListener("mousedown", handleClick);
    });
}

function handleClick() {
    if (this.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        playSound("hit");
        state.values.hitPosition = null;
        leveling();
    } else {
        //Lose a life if do not hit the right square
        state.actions.playerLife--;
        state.view.life.textContent = state.actions.playerLife;
    }
}

//Leveling the game

function leveling() {
    if (state.values.result >= state.values.level*5) {
        //Increase Level and add more time to the player
        state.values.level++
        state.values.currentTime += 10;
        state.view.timeLeft.textContent = state.values.currentTime;
        state.view.levels.textContent = state.values.level;

        // Decrease the game velocity
        state.values.gameVelocity -= 50;
        clearInterval(state.actions.timerId);
        state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    }
}


//Reset values and start a new game

function newGame() {
    //Reset values
    reset();

    // Restart the countdown timer and restart the game
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    init();
}


//Start the game

function init() {
    alert("Click OK to start");
    moveEnemy();
    addListenerHitBox();  
}


init();