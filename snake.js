//SNAKE snakeController
const snakeModel = (function () {
    let data = {
        gridCells: 17,
        length: 3,
        x: 0, 
        y: 0,
        tab: []
    };

    //Randomize position to spawn next 'apple'
    const randomizePosition = function () {
        let i, j;

        do {
            i = Math.floor((Math.random()* (data.gridCells-2))+1);
            j = Math.floor((Math.random()* (data.gridCells-2))+1);
        } while (data.tab[i][j] != 0);

        data.tab[i][j] = -1;
    };

    //Increment snake's parts
    const increaseSnake = function () {
        for (let i = 1; i < data.gridCells-1; i++) {
            for (let j = 1; j < data.gridCells-1; j++) {
                if (data.tab[i][j] > 0) {
                    data.tab[i][j]++;
                }
            }
        }
    };
    
    //Clear last snake's part after move
    const clearTail = function () {
        for (let i = 1; i < data.gridCells-1; i++) {
            for (let j = 1; j < data.gridCells-1; j++) {
                if (data.tab[i][j] > data.length) {
                    data.tab[i][j] = 0;
                }
            }
        }
    };

    const showScore = function (score) {
        if (score === 1) {
            alert(`Congratulations! You have won!`);
        }else if (score === 0) {
            alert(`You have lost! You have scored ${data.length} points!`);
        } else {
            alert(`You have committed suicide :( You have scored ${data.length} points!`);
        }
    };

    return {

        getData: function() {
            return data;
        },

        //Initialize 2D array to represent every element on grid
        tabInitialize: function() {
            // -2 -> wall
            // -1 -> apple
            // 0  -> empty field
            // >0 -> snake
            for (let i = 0 ; i < data.gridCells ; i++) {
                if (i == 0 || i == data.gridCells - 1) {
                    for (let j = 0 ; j < data.gridCells ; j++) {
                        if (!data.tab[j]) {
                            data.tab[j] = [];
                        }
                        data.tab[i][j] = -2;
                    }	
                } else {
                    for (let j = 0 ; j < data.gridCells ; j++) {
                        if (j == 0 || j == data.gridCells-1) {
                            if (!data.tab[j]) {
                                data.tab[j] = [];
                            }
                            data.tab[i][j] = -2;
                        } else {
                            if (!data.tab[j]) {
                                data.tab[j] = [];
                            }
                            data.tab[i][j] = 0;
                        }
                    }
                }
            }

            //Randomize and set snake starting position	
            data.x = Math.floor((Math.random()* (data.gridCells-2))+1), 
            data.y = Math.floor((Math.random()* (data.gridCells-2))+1),

            data.tab[data.y][data.x] = 1;

            //Randomize and set 'apple' position
            randomizePosition();
        },	

        //Main function with all the logic of the game
        crawl: function (direction, snake)
        {
            //Check if player's score isn't maximum
            if ((data.gridCells - 2) * (data.gridCells - 2) != data.length) {
                if (direction == 'up') {
                    increaseSnake();
                    if (data.tab[data.y-1][data.x] == -2) { //Collision with border -> lost
                        showScore(0);
                        clearInterval(snake);
                    } else if (data.tab[data.y-1][data.x] > 0) { //Collision with body -> suicide
                        showScore(-1);
                        clearInterval(snake);
                    } else if (data.tab[data.y-1][data.x] == -1) { //Apple collected
                        data.tab[data.y-1][data.x] = 1;
                        data.y--;
                        data.length++;
                        randomizePosition();
                    } else { //Move to empty field
                        data.tab[data.y-1][data.x] += 1;
                        data.y--;
                    }
                    clearTail();
                } else if (direction=='left') {
                    increaseSnake();
                    if (data.tab[data.y][data.x-1] == -2) { //Collision with border -> lost
                        showScore(0);
                        clearInterval(snake);
                    } else if (data.tab[data.y][data.x-1] > 0) { //Collision with body -> suicide
                        showScore(-1);
                        clearInterval(snake);
                    }  else if (data.tab[data.y][data.x-1] == -1) { //Apple collected
                        data.tab[data.y][data.x-1] = 1;
                        data.x--;
                        data.length++;
                        randomizePosition();
                    } else { //Move to empty field
                        data.tab[data.y][data.x-1]++;
                        data.x--;
                    }
                    clearTail();
                } else if (direction=='down') {
                    increaseSnake();
                    if (data.tab[data.y+1][data.x] ==- 2) { //Collision with border -> lost
                        showScore(0);
                        clearInterval(snake);
                    } else if(data.tab[data.y+1][data.x] > 0) { //Collision with body -> suicide
                        showScore(-1);
                        clearInterval(snake);
                    }  else if(data.tab[data.y+1][data.x] == -1) { //Apple collected
                        data.tab[data.y+1][data.x] = 1;
                        data.y++;
                        data.length++;
                        randomizePosition();
                    } else { //Move to empty field
                        data.tab[data.y+1][data.x]++;
                        data.y++;
                    }
                    clearTail();
                } else if (direction=='right') {
                    increaseSnake();
                    if (data.tab[data.y][data.x+1] == -2) { //Collision with border -> lost
                        showScore(0);
                        clearInterval(snake);
                    } else if (data.tab[data.y][data.x+1] > 0) { //Collision with body -> suicide
                        showScore(-1);
                        clearInterval(snake);
                    }  else if (data.tab[data.y][data.x+1] == -1) { //Apple collected
                        data.tab[data.y][data.x+1] = 1;
                        data.x++;
                        data.length++;
                        randomizePosition();
                    } else { //Move to empty field
                        data.tab[data.y][data.x+1]++;
                        data.x++;
                    }
                    clearTail();
                }
            } else { //Max score -> win
                showScore(1);
                clearInterval(snake);
            }
        }
    };

})();

//UI snakeController
const snakeView = (function () {

    const DOMstrings = {
        btnRestart: '.btn--restart',
        container: '.grid'
    };

    const calculateHeight = function () { 
        let gridSize = 0;

        window.innerWidth > window.innerHeight ? gridSize = window.innerHeight : gridSize = window.innerWidth;
        gridSize = gridSize - document.querySelector("header").offsetHeight - document.querySelector("footer").offsetHeight - 100;

        return gridSize;
    };

    return {
        getDOMstrings: function () {
            return DOMstrings;
        },

        //Render grid as small divs with some styling
        showGrid: function (gridCells) {
            const parent = document.querySelector(DOMstrings.container);

            let gridSize = calculateHeight();

            parent.style.height = gridSize + "px";
            parent.style.width = gridSize + "px";

            for (let i = 0; i < gridCells; i++) {
                for (let j = 0; j < gridCells; j++) {
                    const small = document.createElement("div");
                    parent.appendChild(small);
                    small.id="d_"+i+"_"+j;
                    small.classList.add("field");
                    small.style.width = gridSize / gridCells + "px";
                    small.style.height = gridSize / gridCells + "px";
                    small.style.position = "absolute";
                    small.style.left = j * gridSize / gridCells + "px";
                    small.style.top = i * gridSize / gridCells + "px";
                    small.style.lineHeight = gridSize / gridCells + "px";
                }
            }
        },

        //Update grid and inside fields on resize event
        updateGrid: function (gridCells) {
            const parent = document.querySelector(DOMstrings.container);
            let gridSize = calculateHeight();

            parent.style.height = gridSize + "px";
            parent.style.width = gridSize + "px";

            for (let i = 0; i < gridCells; i++) {
                for (let j = 0; j < gridCells; j++) {
                    let small = document.querySelector(`#d_${i}_${j}`);
                    small.style.width = gridSize / gridCells + "px";
                    small.style.height = gridSize / gridCells + "px";
                    small.style.left = j * gridSize / gridCells + "px";
                    small.style.top = i * gridSize / gridCells + "px";
                    small.style.lineHeight = gridSize / gridCells + "px";
                }
            }
        },

        //Set the background color of each grid's field
        stylize: function (gridCells, cellValue) {
            for(let i = 0; i < gridCells; i++) {
                for(let j = 0; j < gridCells; j++) {
                    document.querySelector(`#d_${i}_${j}`).innerHTML = cellValue.tab[i][j];
                    
                    if(cellValue.tab[i][j] == -2) {
                        document.querySelector(`#d_${i}_${j}`).style.backgroundColor="#2f3640";
                    }else if(cellValue.tab[i][j] == -1) {
                        document.querySelector(`#d_${i}_${j}`).style.backgroundColor="#e84118";
                    }else if(cellValue.tab[i][j] == 1) {
                        document.querySelector(`#d_${i}_${j}`).style.backgroundColor="#44bd32";
                    }else if(cellValue.tab[i][j] == 0) {
                        document.querySelector(`#d_${i}_${j}`).style.backgroundColor="#f5f6fa";
                    }else if(cellValue.tab[i][j] > 1) {
                        document.querySelector(`#d_${i}_${j}`).style.backgroundColor="#4cd137";
                    }
                }
            }
        }
    }

})();

//GLOBAL APP Controller
const snakeController = (function (snakeModel, snakeView) {

    let ctrlVars = {
        snake : null,
        direction: "start"
    };	

    const setupEventListeners = function () {
        const DOM = snakeView.getDOMstrings();

        document.querySelector(DOM.btnRestart).addEventListener('click', () => { location.reload() });

        document.addEventListener('keypress', keyBinding);
        window.addEventListener('resize', () => snakeView.updateGrid(17));
    };

    const keyBinding = function (event) {
        if ((event.key === "a" && ctrlVars.direction != "right") || (event.which === 65 && ctrlVars.direction != "right")) {
            ctrlVars.direction = "left";
        } else if ((event.key === "w" && ctrlVars.direction != "down") || (event.which === 87 && ctrlVars.direction != "down")) {
            ctrlVars.direction = "up";
        } else if ((event.key === "d" && ctrlVars.direction != "left") || (event.which === 68 && ctrlVars.direction != "left")) {
            ctrlVars.direction = "right";
        } else if ((event.key === "s" && ctrlVars.direction != "up") || (event.which === 83 && ctrlVars.direction != "up")) {
            ctrlVars.direction = "down";
        }
    };

    const startGame = function () {
        if (ctrlVars.direction == "start") {
            ctrlVars.snake = setInterval(function() {
                snakeModel.crawl(ctrlVars.direction, ctrlVars.snake);
                snakeView.stylize(17, snakeModel.getData());
            }, 130);
            ctrlVars.direction = "started";
        }
    };

    return {
        init: function() {
            snakeModel.tabInitialize();
            snakeView.showGrid(17);
            snakeView.stylize(17, snakeModel.getData());
            setupEventListeners();
            startGame();
        }
    }

})(snakeModel, snakeView);

snakeController.init();