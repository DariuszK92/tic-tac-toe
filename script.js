const container = document.querySelector('.gameboard');
const btn = document.querySelector('button');
const result = document.querySelector('h2');
/// /////////////////
// PLAYER CREATION //
/// /////////////////

const playerFactory = (name, mark) => {
    return { name, mark };
};

// let person1 = prompt("Please enter your name", "Harry Potter");
const player1 = playerFactory('Kozi', 'X');
const player2 = playerFactory('Opponent', 'O');

const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

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
                    console.log(`${player1.name} win`);
                    result.innerText = `${player1.name} win!`;
                    return true;
                }
                result.innerText = `${player2.name} win!`;
                return true;
            }
        }
        return false;
    }

    let activePlayer = player1;
    container.addEventListener('click', function (e) {
        if (!checkWin()) {
            if (e.target.innerText === '') {
                board[e.path['0'].id] = activePlayer.mark;
                createBoard();
                if (activePlayer === player1) {
                    activePlayer = player2;
                    result.innerText = `${player2.name} move`;
                } else {
                    activePlayer = player1;
                    result.innerText = `${player1.name} move`;
                }
            }

            checkWin();
        }
    });

    /// //////////////////////////////
    /// / //RESETING THE GAME/////////
    /// //////////////////////////////

    btn.addEventListener('click', () => {
        for (let i = 0; i < board.length; i += 1) {
            board[i] = '';
            result.innerText = 'Start the game';
        }
        createBoard();
    });
    return { board, activePlayer, btn };
})();
