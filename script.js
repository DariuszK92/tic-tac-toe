const container = document.querySelector('.gameboard');

const playerFactory = (name, mark) => {
    return { name, mark };
};

const player1 = playerFactory('player 1', 'X');
const player2 = playerFactory('player 2', 'O');

const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];
    const createBoard = () => {
        for (let i = 0; i < board.length; i++) {
            const boardField = document.createElement('div');
            boardField.innerText = board[i];
            boardField.setAttribute('id', i);
            container.appendChild(boardField);
        }
    };
    createBoard();
    let activePlayer = player1;
    container.addEventListener('click', function (e) {
        if (e.target.innerText === '') {
            console.log(e.path['0'].id);
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            board[e.path['0'].id] = activePlayer.mark;
            createBoard();
            if (activePlayer === player1) {
                activePlayer = player2;
            } else {
                activePlayer = player1;
            }
        }
    });

    return { board };
})();

const displayController = () => {
    const endGame = (board) => {
        console.log(board);
    };
    return { endGame };
};
