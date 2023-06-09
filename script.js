const container = document.querySelector('.gameboard');
const reset = document.querySelector('#reset');
const desc = document.querySelector('h2');
let index = 0;
/// /////////////////
// PLAYER CREATION //
/// /////////////////

const playerFactory = (name, mark) => {
    return { name, mark };
};

// let person1 = prompt("Please enter your name", "Harry Potter");
const player1 = playerFactory('Kozi', 'X');
let player2 = playerFactory('Opponent', 'O');
// eslint-disable-next-line no-param-reassign, prefer-const
let scores = {
    X: -10,
    O: 10,
    tie: 0
};

const gameBoard = (() => {
    // eslint-disable-next-line prefer-const
    let board = ['', '', '', '', '', '', '', '', ''];

    const createBoard = () => {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        for (let i = 0; i < board.length; i += 1) {
            const boardField = document.createElement('div');
            boardField.innerText = board[i];
            boardField.setAttribute('id', i);
            container.appendChild(boardField);
        }
    };

    createBoard();

    function checkWin() {
        const combs = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        // eslint-disable-next-line no-restricted-syntax
        let openSpots = 0;
        for (let i = 0; i < board.length; i += 1) {
            if (board[i] == '') {
                openSpots += 1;
            }
        }
        for (const comb of combs) {
            if (
                gameBoard.board[comb[0]] == gameBoard.board[comb[1]] &&
                gameBoard.board[comb[1]] == gameBoard.board[comb[2]] &&
                gameBoard.board[comb[0]] != ''
            ) {
                container.childNodes[comb[0]].style.backgroundColor = 'yellow';
                container.childNodes[comb[1]].style.backgroundColor = 'yellow';
                container.childNodes[comb[2]].style.backgroundColor = 'yellow';
                if (gameBoard.board[comb[0]] == 'X') {
                    desc.innerText = `${player1.name} win!`;
                    return 'X';
                }
                if (gameBoard.board[comb[0]] == 'O') {
                    desc.innerText = `${player2.name} win!`;
                    return 'O';
                }
            }
        }
        if (openSpots == 0) {
            desc.innerText = `It's a tie!`;
            return 'tie';
        }
        return false;
    }

    let activePlayer = player1;
    container.addEventListener('click', function (e) {
        if (!checkWin()) {
            // Game for two players
            if (index == '0') {
                if (e.target.innerText === '') {
                    board[e.path['0'].id] = activePlayer.mark;
                    createBoard();
                    if (activePlayer === player1) {
                        activePlayer = player2;
                        desc.innerText = `${player2.name} move`;
                    } else {
                        activePlayer = player1;
                        desc.innerText = `${player1.name} move`;
                    }
                }
            }
            // Game vs easy computer
            if (index === '1') {
                activePlayer = player1;
                player2 = playerFactory('Computer', 'O');
                if (e.target.innerText === '') {
                    board[e.path['0'].id] = activePlayer.mark;
                    activePlayer = player2;
                    if (!checkWin()) {
                        desc.innerText = `Computer move`;
                        const indexes = Array.from(Array(board.length).keys());
                        const availableIndexes = indexes.filter((indexe) => board[indexe] === '');
                        const selectedIndex =
                            availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
                        board[selectedIndex] = activePlayer.mark;
                        activePlayer = player1;
                        desc.innerText = `${player1.name} move`;
                    }
                    createBoard();
                }
            }

            // bestMove

            function bestMove() {
                let bestScore = -Infinity;
                let move;

                for (let i = 0; i < 9; i++) {
                    if (board[i] == '') {
                        board[i] = 'O';
                        // eslint-disable-next-line no-param-reassign, prefer-const
                        let score = minimax(board, 0, false);
                        board[i] = '';
                        if (score > bestScore || (score === bestScore && Math.random() < 0.5)) {
                            bestScore = score;
                            move = { i };
                        }
                    }
                }
                board[move.i] = 'O';
                activePlayer = player1;
            }

            // Minimax

            // eslint-disable-next-line no-inner-declarations
            function minimax(board, depth, isMaximizing) {
                // eslint-disable-next-line prefer-const
                let result = checkWin();
                if (result !== false) {
                    return scores[result];
                }

                if (isMaximizing) {
                    let bestScore = -Infinity;
                    for (let i = 0; i < 9; i += 1) {
                        // Is the spot available?
                        if (board[i] == '') {
                            board[i] = 'O';
                            // eslint-disable-next-line no-param-reassign, prefer-const
                            let score = minimax(board, depth + 1, false);
                            board[i] = '';
                            bestScore = Math.max(score, bestScore);
                        }
                    }
                    return bestScore;
                    // eslint-disable-next-line no-else-return
                }
                if (!isMaximizing) {
                    let bestScore = Infinity;
                    for (let i = 0; i < 9; i += 1) {
                        // Is the spot available?
                        if (board[i] === '') {
                            board[i] = 'X';
                            // eslint-disable-next-line no-param-reassign, prefer-const
                            let score = minimax(board, depth + 1, true);
                            board[i] = '';
                            bestScore = Math.min(score, bestScore);
                        }
                    }
                    return bestScore;
                }
            }
            // Game vs hard computer

            if (index === '2') {
                if (e.target.innerText === '') {
                    board[e.path['0'].id] = activePlayer.mark;
                    desc.innerText = `Computer move`;
                    const indexes = Array.from(Array(board.length).keys());
                    const availableIndexes = indexes.filter((indexe) => board[indexe] === '');
                    if (availableIndexes.length > 0) {
                        bestMove();
                    }
                    desc.innerText = `${player1.name} move`;
                    checkWin();
                    createBoard();
                }
            }

            //
            //
            checkWin();
        }
    });

    /// //////////////////////////////
    /// / //RESETING THE GAME/////////
    /// //////////////////////////////
    function startAgain() {
        for (let i = 0; i < board.length; i += 1) {
            board[i] = '';
            desc.innerText = 'Start the game';
        }
        createBoard();
    }

    reset.addEventListener('click', startAgain);

    return { board, activePlayer, reset, startAgain, checkWin };
})();

const buttons = document.querySelector('#buttons');
const twoPlayers = document.querySelector('.two');
const easy = document.querySelector('.easy');
const hard = document.querySelector('.hard');

buttons.addEventListener('click', function (e) {
    index = e.composedPath()['0'].dataset.indexNumber;
    if (index === '0') {
        twoPlayers.style.backgroundColor = 'black';
        easy.style.backgroundColor = '#E7473C';
        hard.style.backgroundColor = '#E7473C';
    } else if (index === '1') {
        twoPlayers.style.backgroundColor = '#E7473C';
        easy.style.backgroundColor = 'black';
        hard.style.backgroundColor = '#E7473C';
    } else {
        twoPlayers.style.backgroundColor = '#E7473C';
        easy.style.backgroundColor = '#E7473C';
        hard.style.backgroundColor = 'black';
    }
    gameBoard.startAgain();
});
