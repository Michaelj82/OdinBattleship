
// module.exports = {};


//Ship fatory
export const Ship = (length) => {

    let state = {
        length: length,
        timesHit: 0,
        sunk: false,
        shipShape: [],

    }

    function isSunk(){
        if (length === state.timesHit){
            state.sunk = true;
        }
    };

    function hit(){
        state.timesHit++
        isSunk()
    }

    function place(y, x, direction){
        state.shipShape = []
         //puts coordinates for the length of the ship in the shipShape

        if (direction == 'vertical'){
            for (let i = 0; i < state.length; i++){
                state.shipShape.push([y+i,x])
            }
        }else if (direction == 'horizontal'){
            for (let i = 0; i < state.length; i++){
                state.shipShape.push([y,x+i])

            }
        }
        



    }

    return Object.assign(
        {state, hit, place}
    )


};

// module.exports.Ship = Ship



export const Gameboard = () =>{

    let state = {
        board: [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
        ],
        hitCoordinates:[],
        missedCoordinates:[],
        allShips: [],
        allDead: false,



    }

    function placeShip(ship, y, x, direction){
        ship.place(y,x,direction)

        let valid = true;

        for (let i = 0; i < ship.state.shipShape.length; i++){
            for (let j = 0; j < ship.state.shipShape[i].length; j++){
                //if coordinates dont match board, set valid false
                if (ship.state.shipShape[i][j] >= 7){

                    valid = false
                }

            }

        }

        if (valid == true){

            let toPutOnCoordinates = []
            //put it on the board
            for (let i = 0; i < ship.state.shipShape.length; i++){
                let y = ship.state.shipShape[i][0]
                let x = ship.state.shipShape[i][1]

                //if spot already taken
                if (state.board[y][x] == 1){
                    ship.state.shipShape = []
                    return Error('Overlaps a ship')
                }else{
                    //if spot not taken put in this list
                    toPutOnCoordinates.push([y, x])
                }

            }

            //set coordinates to 1 in board
            for (let i = 0; i < toPutOnCoordinates.length; i++){
                let y = toPutOnCoordinates[i][0];
                let x = toPutOnCoordinates[i][1];
                
                state.board[y][x] = 1;
            }
            //push ship into allShips
            state.allShips.push(ship)


        }else if (valid == false){
            ship.state.shipShape = []
            return Error('Ship overextends map')
        }

    }

    //function to receive attack and check if ship is htere
    function receiveAttack(coordinates){
        if (state.allDead == false){
            let y = coordinates[0];
            let x = coordinates[1];
    
            let missedHit = true;
            let notGuessed = true;
            let guessedCoordinates = state.hitCoordinates.concat(state.missedCoordinates)
            //if the coordinate has been guessed set notGuessed to false
            for (let i = 0; i < guessedCoordinates.length; i++){
                if (JSON.stringify(coordinates) == JSON.stringify(guessedCoordinates[i])){
                    notGuessed = false
                    break
                }
            }
    
            //if not guessed
            if (notGuessed == true){
                //for each ship
                for (let i = 0; i < state.allShips.length; i++){
                    let ship = state.allShips[i]
        
                    //check if ship has coordinates that matches the submitted shot
                    for (let j = 0; j < ship.state.shipShape.length; j++){
                        //if it hits
                        if (JSON.stringify(ship.state.shipShape[j]) == JSON.stringify(coordinates)){
                            state.hitCoordinates.push(coordinates)
                            missedHit = false
                            //9 means ship tile hit
                            state.board[y][x] = 9
                            ship.hit()
                            allShipsDead()
                        }
        
                    }
                }
                //if a miss
                if (missedHit == true){
    
                    //2 means empty tile hit
                    state.board[y][x] = 2
        
                    state.missedCoordinates.push(coordinates)
        
                }
            }else if (notGuessed == false){
                return Error('Already shot there')
            }
        }else{
            return 'You have already won!'
        }
        
        
        

    }

    //check if all ships are dead
    function allShipsDead(){

        let totalShipsSunk = 0

        for (let i = 0; i < state.allShips.length; i++){
            let ship = state.allShips[i]
            if (ship.state.sunk == true){
                totalShipsSunk++
            }

        }

        if (totalShipsSunk == state.allShips.length){
            state.allDead = true
        }
    }

    return Object.assign(
        {state, placeShip, receiveAttack}
    )


}



// module.exports.Gameboard = Gameboard

//Player factory
export const Player = (enemy, board, name, playerNum, qualities) => {

    let state = {
        enemy:enemy,
        board: board,
        name: name,
        playerNum: playerNum,
        qualities: qualities,

    }
    //attacks at a coordinate
    function attackEnemy(coordinates){

        state.enemy.state.board.receiveAttack(coordinates)

    }


    return Object.assign(
        {state, attackEnemy}
    )


}

// module.exports.Player = Player