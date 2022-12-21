//imports
import{Ship} from './script.js'
import { Gameboard } from './script.js'
import { Player } from './script.js'

//creating game variables
var Player1Board = Gameboard()
var Player2Board = Gameboard()

var Player1 = Player(NaN, Player1Board, 'Player One', 1, NaN)
var Player2 = Player(NaN, Player2Board, 'Player Two', 2, NaN)
Player1.state.enemy = Player2;
Player2.state.enemy = Player1;

var Player1Qualities = [Player1, Player1Board]
var Player2Qualities = [Player2, Player2Board]
Player1.state.qualities = Player1Qualities;
Player2.state.qualities = Player2Qualities;

//Global variables for setting up game
var TOTALSHIPTILES = 10
var NUMBEROFSHIPS = 4

var SELECTION = false
var SELECTIONNUMBER = 0
var SELECTIONTYPE = NaN

var REMOVING = false

//site element
let site = document.getElementById('site')

//delays time inbetween game phases
function delay (time){
    return new Promise(resolve=> setTimeout(resolve, time));

}
//clears a div, mainly used on site
function clearDiv(div){
    div.innerHTML = ''
}

//the intro page to the website
function mainPage(parent){
    //clears
    clearDiv(parent)
    //header
    let header = document.createElement('h1');
    header.textContent = 'BattleShip!'
    parent.appendChild(header)
    //start game
    let startGame = document.createElement('button');
    startGame.textContent = 'Click me to play!'
    startGame.onclick= function(){
        playerSetUp(parent, Player1Qualities)
    }
    parent.appendChild(startGame)
}

//calls mainPage
mainPage(site)

//Function that updates the board on the screen w/ a gameboards information and its purpose
//Selecting means they are selecting where to put their ships in the beginning
//attacking means it is how the enemy board looks when they are attacking the enemy
//yours means it is what your board looks like during the game
function refreshBoardItems(board, gameboard, status){

    if (status == 'selecting'){
        let children = board.children;

        let num = 0
        //for each tile in the gameboard
        for (let i =0 ; i < gameboard.state.board.length; i++){
            for (let j = 0 ; j < gameboard.state.board[i].length; j++){
                //if empty
                if (gameboard.state.board[i][j] == 0){
                    children[num].classList.remove('ship')
                }
                //if it has a ship
                else if (gameboard.state.board[i][j] == 1){
                    children[num].classList.add('ship')
                }
    
                //used to circle through children elements
                num ++
            }
        }
    }else if (status == 'attacking'){
        let children = board.children;

        let num = 0


        for (let i = 0 ; i < gameboard.state.board.length; i++){
            for (let j = 0 ; j < gameboard.state.board[i].length; j++){
                //if it is hit
                if (gameboard.state.board[i][j] == 9){
                    children[num].classList.add('shipHit')

                    num ++
                }
                //if it is a miss
                else if (gameboard.state.board[i][j] == 2){
                    children[num].classList.add('missedHit')
                    num ++

                }else{
                    num ++
                }
    
    
            }
        }
    }else if (status == 'yours'){
        let children = board.children;

        let num = 0
      
        for (let i =0 ; i < gameboard.state.board.length; i++){
            for (let j = 0 ; j < gameboard.state.board[i].length; j++){
                //if empty
                if (gameboard.state.board[i][j] == 0){
                    children[num].classList.remove('ship')

                    num ++
                
                }
                //if a ship (not hit)
                else if (gameboard.state.board[i][j] == 1){
                    children[num].classList.add('ship')
                    num ++

                }
                //if a hit
                else if (gameboard.state.board[i][j] == 9){
                    children[num].classList.add('shipHit')

                    num ++
                }//if a miss
                else if (gameboard.state.board[i][j] == 2){
                    children[num].classList.add('missedHit')
                    num ++

                }else{
                    num++
                }
    
            }
        }
    }
    
}

//make SELECTION SCREEN BOARD
function makeBoard(parent, gameboard){
    let board = document.createElement('div')
    board.setAttribute('id', 'board')
    parent.append(board)
    let total = 0
    //for each item i nthe board
    for (let i = 0; i < (gameboard.state.board.length); i++){
        for(let j = 0 ; j < gameboard.state.board[i].length; j++){
            total ++
            let tile = document.createElement('div')
            tile.classList.add('tile')
            tile.setAttribute('id', `tile${total}`)
            //on clicking a tile
            tile.onclick = function(){
                //if user is selecting a tile to place a ship
                if (SELECTION == true){
                    REMOVING = false
                    SELECTION = false
                    let ship = Ship(SELECTIONNUMBER)
                    gameboard.placeShip(ship, i, j, SELECTIONTYPE)
                    //refresh board to look new
                    refreshBoardItems(board, gameboard, 'selecting')
                }
                //if user is removing a ship
                if (REMOVING == true){
                    SELECTION = false
                    REMOVING = false


                    let coords = [i, j]
                    //for each ship
                    for (let k = 0; k < gameboard.state.allShips.length ; k++){
                        let singularShip = gameboard.state.allShips[k];

                        for (let m = 0; m < singularShip.state.shipShape.length; m ++){
                            //for each value in the ship
                            let shipShapeValue = singularShip.state.shipShape[m]
                            //if the clicked on coordinate matches a ship's coordinate
                            if (JSON.stringify(shipShapeValue) == JSON.stringify(coords)){
                                let total = 0
                                //est its gameboard coordinate to 0
                                for (let l = 0 ; l < singularShip.state.shipShape.length; l++){
                                    total++
                                    gameboard.state.board[singularShip.state.shipShape[l][0]][singularShip.state.shipShape[l][1]] = 0
                                }

                                //used for disabling selection tools, didnt quite work as planned, maybe get rid of this
                                let horz = document.getElementById(`Horizontal${total}`)
                                let vert = document.getElementById(`Vertical${total}`)

                                horz.disabled = false
                                vert.disabled = false

                                gameboard.state.allShips.splice(k, 1);


                            }
                        }




                    }
                    refreshBoardItems(board, gameboard, 'selecting')

                }
            }

            board.appendChild(tile)
        

            }

        }
    }


//sets up div for player setting up
function playerSetUp(parent, playerquals){
    clearDiv(parent)
    //headers
    let header = document.createElement('h1');
    header.textContent = 'BattleShip!'
    parent.appendChild(header)
    let header2 = document.createElement('h3');
    header2.textContent = ` ${playerquals[0].state.name}, put down your ships. ${playerquals[0].state.enemy.state.name}, look away`
    parent.appendChild(header2)

    //div to select certain size of ship
    let allSelections = document.createElement('div');
    allSelections.setAttribute('id', 'allSelections')
    
    let numbers = ['One', 'Two', 'Three', 'Four'];
    //for each number
    for (let i = 0 ; i < numbers.length ; i++){

        let ShipSelect = document.createElement('div');
        ShipSelect.classList.add('shipSelection')
        ShipSelect.textContent = numbers[i]
    
        //horizontal selection
        let Horizontal = document.createElement('button')
        Horizontal.setAttribute('id', `Horizontal${i+1}`)
        //vert selection
        let Vertical = document.createElement('button')
        Vertical.setAttribute('id', `Vertical${i+1}`)


        //on click it sets global variables to the value
        Horizontal.textContent = 'Horizontal'
        Horizontal.onclick = function(){
            SELECTION = true
            SELECTIONNUMBER = (i + 1)
            SELECTIONTYPE = 'horizontal'
            // Vertical.disabled = true
            // Horizontal.disabled = true

        }

        //on click it sets global variables to the value

        Vertical.textContent = 'Vertical'
        Vertical.onclick = function(){
            SELECTION = true
            SELECTIONNUMBER = (i + 1)
            SELECTIONTYPE = 'vertical'
            // Vertical.disabled = true
            // Horizontal.disabled = true
        }
    


        ShipSelect.appendChild(Horizontal)
        ShipSelect.appendChild(Vertical)
    
        allSelections.appendChild(ShipSelect)
    
    }
    //apend to parent
    parent.appendChild(allSelections)

    //removes a ship

    let removeButton = document.createElement('button')
    removeButton.textContent = 'Remove a Ship'
    removeButton.onclick = function(){
        //sets global removing variable to true
        REMOVING = true
    }


    parent.appendChild(removeButton)
    //uses make board for selection function
    makeBoard(parent, playerquals[1])

    //next round
    let nextRound = document.createElement('button');
    nextRound.textContent = 'Next Round'
    nextRound.onclick = function(){

        //checks to see if the number of ship tiles on the board is equal to 10 (global variable)
        let allShipsPlaced = playerquals[1].state.allShips;


        let sum = allShipsPlaced.reduce(
            (first, second) => first + second.state.shipShape.length,
            0
            )
        
        
        //works but allows other combinations of 4 ships and 10 tiles,
        //make it eventually so that it only allows 4,3,2,1, but dont focus on that now
        if (sum == TOTALSHIPTILES && allShipsPlaced.length == NUMBEROFSHIPS){
            if (playerquals[0].state.playerNum == 1){
                //if its player 1, switch to player 2
                playerSetUp(parent, Player2Qualities)
            }else if (playerquals[0].state.playerNum == 2){
                //if its player 2, switch to player 1
                playerAttacking(parent, Player1Qualities)
            }
        }else{
            alert('You must have a 1 tile, 2 tile, 3 tile, and 4 tile ship')
        }

        
    }
    parent.appendChild(nextRound)

    



}

//checks for number of ships sunk
function numberOfShipsSunk(gameboard){
    let total = 0
    for (let i = 0; i < gameboard.state.allShips.length; i++){
        let ship = gameboard.state.allShips[i]
        if (ship.state.sunk == true){
            total ++ 
        }

    }
    return total
}

//making a board for PLAYING the game, not setting up
function makePlayingBoard(parent, gameboard, status, playerquals){
    //if attacking board
    if (status == 'attacking'){
        let board = document.createElement('div')
        board.setAttribute('id', 'shootingboard')
        parent.append(board)
        let total = 0
        //for each tile
        for (let i = 0; i < (gameboard.state.board.length); i++){
            for(let j = 0 ; j < gameboard.state.board[i].length; j++){
                total ++
                let tile = document.createElement('div')
                tile.classList.add('tile')
                tile.setAttribute('id', `tile${total}`)
                tile.onclick = function(){
                    let shipsSunk = numberOfShipsSunk(gameboard)
                    let test = gameboard.receiveAttack([i, j])
                    //checks for if already shot
                    if (test instanceof Error){
                        alert('You have already shot there')
                    }else{
                        refreshBoardItems(board, gameboard, 'attacking')

                        //alerts if a new battleship has been sunk
                        let newShipsSunk = numberOfShipsSunk(gameboard)

                        if (newShipsSunk > shipsSunk){
                            alert('You have sunk a battleship!')
                        }
                        //if sunk all, game ends

                        if (gameboard.state.allDead == true){
                            alert('Congrats You have Won!')
                            let playAgain = document.createElement('button');
                            playAgain.textContent = 'Play Again?'
                            playAgain.onclick = function(){
                                location.reload()
                                mainPage(parent)
                            }
                            parent.appendChild(playAgain)
                        }else{
                            //continue game
                            playerAttacking(parent, playerquals[0].state.enemy.state.qualities)
                        }
                    }
                    
    
                }
                board.appendChild(tile)
    
            }
        }
    }else if(status == 'yours'){
        //basic board, no function

        let board = document.createElement('div')
        board.setAttribute('id', 'yourboard')
        parent.append(board)
        let total = 0
        for (let i = 0; i < (gameboard.state.board.length); i++){
            for(let j = 0 ; j < gameboard.state.board[i].length; j++){
                total ++
                let tile = document.createElement('div')
                tile.classList.add('tile')
                tile.setAttribute('id', `tile${total}`)

                board.appendChild(tile)
    
            }
        }
    }
    
}

//Function for creating page of someone attacking another
async function playerAttacking(parent, playerquals){
    //passing device so that players dont see
    clearDiv(parent)
    let passing = document.createElement('h1');
    passing.textContent = 'Pass the device to the other player!'
    parent.appendChild(passing)
    await delay(2000)
    clearDiv(parent)


    let header = document.createElement('h1');
    header.textContent = 'BattleShip!'
    parent.appendChild(header)

    let header2 = document.createElement('h3');
    header2.textContent = ` ${playerquals[0].state.name}, choose a tile to hit. ${playerquals[0].state.enemy.state.name}, look away`
    parent.appendChild(header2)

    //makes attacking board
    makePlayingBoard(parent, playerquals[0].state.enemy.state.board, 'attacking', playerquals)
    let shootingboard = document.getElementById('shootingboard')
    //sets styling and refreshes div
    refreshBoardItems(shootingboard, playerquals[0].state.enemy.state.board, 'attacking')

    let header3 = document.createElement('h3');
    header3.textContent = 'Your map below'
    parent.appendChild(header3)

    //makes your board
    makePlayingBoard(parent, playerquals[1], 'yours', playerquals)
    let yourBoard = document.getElementById('yourboard')
    //sets styling and refreshes div
    refreshBoardItems(yourBoard, playerquals[0].state.board, 'yours')


}



