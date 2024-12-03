var _chess = require('./chess');

function boxClicked(chess, file, rank, tofile, torank) {
    // console.log(JSON.stringify(chess));
    var move = chess.Move(new _chess.Placement(file, rank), new _chess.Placement(tofile, torank), 1000);
    return move;
}

function newChess() {
    return new _chess.Chess();
}

function restart() {
    return new _chess.Chess();
}

exports.newChess = newChess;
exports.boxClicked = boxClicked;
exports.restart = restart;