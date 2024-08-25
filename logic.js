// console.log("hello world")

// Declare our variable for our 2d array, score, row, and columns.
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// create a function to set a game
//start of setGame()
function setGame(){
    // Initialize the 4x4 game board with all tiles set to 0.
    board =[
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    // Create a gameboard on the HTML document
    // 0 < 4 (Y)
    // 1 < 4 (Y)
    // 2 < 4 (Y)
    // 3 < 4 (Y)
    // 4 < 4 (N)



    // first loop is to create rows, second loop is to create columns
    // inner loop will be executed first before outer loop
    for(let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){
            // console.log(`[r${r}-c${c}]`);

            // create div element representing a tile

            let tile = document.createElement("div");

            // set a unique id for each tile base on each coordinate.
            // 2-3
            // "+" use to concatenate values if dealing with string.
            tile.id = r.toString() + "-" + c.toString();

            // get number from the board
            // wherein the board is currently set to 0
            let num = board[r][c];

            // Update the tile's appearance based on value.
            updateTile(tile, num);

            // place the tile inside the grid (board), in the right row
            document.getElementById("board").append(tile);
        }
    }

    setTwo();

}

// setGame();

// end of setGame()

// start of updateTile()
function updateTile(tile, num){
    // clear the tile text
    tile.innerText = "";

    // clear the classlist to avoid multiple classes
    tile.classList.value = "";

    // add class named "tile" to the classList of the tile, for the styling.
    tile.classList.add("tile")

    // to check if the current num is not zero.
    if(num > 0){
        // set the tiles text to the number based on num value.
        tile.innerText = num.toString();

        if(num <= 4096){
            tile.classList.add("x"+num.toString());
        }
        else{
            // if number is > 4096, a special class "x8192" will be added.
            tile.classList.add("x8192");
        }
    }
}
// end of updateTile()

// start window.onload

// event that triggered when webpage finished loading.
window.onload = function(){
    setGame();
}
// end of window.onload

// start of handleSlide()
// "e" represent the event object, which contains info about the event occured.
function handleSlide(e){
    // check keydown event.
    console.log(e.code);

    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",].includes(e.code)){

        // prevent default behavior, to avoid scrolling on keyboard
        e.preventDefault();

        // (=) assignment operator to asign or change a value of a variable
        // (==) compare the values
        if(e.code == "ArrowLeft"){
            slideLeft();
            setTwo();
        }
        else if(e.code == "ArrowRight"){
            slideRight();
            setTwo();
        }
        else if(e.code == "ArrowUp"){
            slideUp();
            setTwo();
        }
        else if(e.code == "ArrowDown"){
            slideDown();
            setTwo();
        }

        document.getElementById("score").innerText = score;

        setTimeout(()=>{
            if(hasLost()){
                alert("Game Over! You have lost the game. Game will restart.")
                restartGame();
                alert("press any arrow key to restart")
            }
            checkWin();
        }, 100);
    }


}
// when any key is pressed the handle slide function is called to handle the key press.
document.addEventListener("keydown", handleSlide);
// end of handleSlide()

// start of filterZero(tiles)
// removing empty tiles
function filterZero(tiles){
    return tiles.filter(num => num != 0);
}
// end of filterZero(tiles)

// start of slide(tiles)
// for sliding and merging tiles
function slide(tiles){

    // get rid of zero
    tiles = filterZero(tiles);

    for(let i=0; i < tiles.length; i++){
        // if two adjacent numbers are equal
        if(tiles[i] == tiles[i+1]){
            // merge them by doubling the first one
            tiles[i] *= 2;
            // set second one to zero
            tiles[i+1] = 0;
            // result: [2,2,2] -> [4,0,2]
            // score = score + tiles[i]
            score += tiles[i];
        }
    }

    tiles = filterZero(tiles)

    while(tiles.length < 4){
        tiles.push(0);
    }

    return tiles;
}
// end of slide(tiles)


// start of slideLeft()
function slideLeft(){
    for(let r=0; r < rows; r++){

        // store current row in the row variable
        let row = board[r]; // r = 0: [0,2,2,2]

        // line for animation
        let originalRow = row.slice()

        //slide() function, it will return a new value for a specific row (merging or tiles).
        row = slide(row);

        board[r] = row;

        for(let c=0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-right 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300); 
            }

            


            updateTile(tile, num);
        }
    }
}
// end of slideLeft()

// start of slideRight()
function slideRight(){
    for(let r=0; r < rows; r++){

        // store current row in the row variable
        let row = board[r]; // r = 0: [0,2,2,2]

        // add original row for animation
        let originalRow = row.slice();

        // reverse the row array since it is sliding to right
        row.reverse();

        //slide() function, it will return a new value for a specific row (mergging or tiles).
        row = slide(row);

        row.reverse();

        board[r] = row;

        for(let c=0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            // line for animation
            if(originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-left 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300); 
            }
            

            updateTile(tile, num);
        }
    }
}
// end of slideRight()


// start of slideUp()
function slideUp(){
    for(let c=0; c < columns; c++){

        // Create a temporary array call that represents the col
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice();

        col = slide(col)

        for(let r=0; r < rows; r++){
            // set values of board array back to the values of the modified col.
            board[r][c] = col[r];

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // line for animation
            if(originalCol[r] !== num && num !== 0){
                tile.style.animation = "slide-from-bottom 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300); 
            }

            updateTile(tile, num);
        }
    }
}
// end of slideUp()


// start of slideDown()
function slideDown(){
    for(let c=0; c < columns; c++){

        // Create a temporary array call that represents the col
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice();

        col.reverse();
        col = slide(col)
        col.reverse();

        for(let r=0; r < rows; r++){
            // set values of board array back to the values of the modified col.
            board[r][c] = col[r];

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

             // line for animation
             if(originalCol[r] !== num && num !== 0){
                tile.style.animation = "slide-from-top 0.3s"
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300); 
            }

            updateTile(tile, num);
        }
    }
}
// end of slideDown()

// start of hasEmptyTile()
// check wether game board contains any empty space (0) tiles

function hasEmptyTile(){
    for(let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){
            // check if current tile is = zero if yes it will return true
            if(board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}
// end of hasEmptyTile()

// start of setTwo()
// add a new random two tile in the game board
function setTwo(){
    // check if hasEmptyTile is false.
    if(!hasEmptyTile()){
        return;
    }

    // declare a value found tile
    let found = false;
    // this will run until random empty tile is found
    while(!found){
        // Math.random()- generates random number based on the given condition.
        // Math.floor- rounds down to the nearest integer.
        // TO GET A RANDOM VALUE FOR R AND C FROM 1 - 4.
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
    
        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");

            // set to found variable to true
            found = true;
        }
    }
}
// end of setTwo()

// start of checkWin()
function checkWin(){
    for(let r = 0; r < rows; r++){
        for(let c=0; c < columns; c++){
            // check if the current tile is a winning tile.
            if(board[r][c] == 2048 && is2048Exist == false){
                alert("You Win! You got 2048.");
                is2048Exist = true; 
            }
            else if (board[r][c] == 4096 && is4096Exist == false){
                alert("Your are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;
            }
            else if (board[r][c] == 8192 && is8192Exist == false){
                alert("Your are unstoppable at 8192! You are incredibly awesome! ");
                is8192Exist = true;
            }
        }
    }
}
// end of checkWin()

// start of hasLost()
function hasLost(){
    for(let r = 0; r < rows; r++){
        for(let c=0; c < columns; c++){
            if(board[r][c] == 0){
                // found an empty tile
                return false;
            }
            const currentTile = board[r][c];
            if(
                r > 0 && board[r-1][c] === currentTile ||
                r > rows- 1 && board[r+1][c] === currentTile ||
                c > 0 && board[r][c-1] === currentTile ||
                c > columns- 1 && board[r][c+1] === currentTile
            ){
                return false;
            }
        }
    }
    return true;
}
// end of hasLost()

// start of restartGame()
// RestartGame by replacing all values into zero.
function restartGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    
    setTwo();
    score = 0;    // new tile   

}
// end of restartGame()

// for mobile devices
// declare variable for touch input

let startX = 0;
let startY = 0;

// event listener to capture touch in the screen adn assign the x and y coor

document.addEventListener("touchstart", (e) =>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;


})

// prevents scrolling
document.addEventListener("touchmove", (e) => {
    if (!e.target.className.includes("tile")) {
        return;
    }
    e.preventDefault();
}, { passive: false });

// Listen for the touch end event on the entire document
document.addEventListener("touchend", (e) => {
    // Correct the typo in 'if' and use 'includes' method for checking className
    if (!e.target.className.includes("tile")) {
        return;
    }
    // Calculate the differences in touch positions
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            slideLeft();
            setTwo();
        } else {
            slideRight();
            setTwo();
        }
    } else {
        if (diffY > 0) {
            slideUp();
            setTwo();
        } else {
            slideDown();
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;

    setTimeout(()=>{
        if(hasLost()){
            alert("Game Over! You have lost the game. Game will restart.")
            restartGame();
            alert("press any arrow key to restart")
        }
        checkWin();
    }, 100);
});


// restart in touch
