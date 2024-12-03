const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');
var NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');
var short = require('short-uuid');

var _chessBoard = require('./chess/chessboard');
var _chess = require('./chess/chess');
var email = require('./email');

var ttlSeconds = 60 * 60; // 1 hours
var cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", (req, res, next) => {
    if (
        req.path.startsWith("/auth") ||
        req.path.startsWith("/pub") ||
        req.path.startsWith("/api")
    ) {
        next();
    } else if (
        req.path.startsWith("/api-docs") ||
        req.path.startsWith("/swagger.json")
    ) {
        next();
    } else if (req.path.startsWith("/chess2")) {
        const directoryPath = path.join(
            __dirname,
            "public"
        );

        res.sendFile(path.join(directoryPath + '/chess2.html'));
    } else if (req.path.startsWith("/chess")) {
        const directoryPath = path.join(
            __dirname,
            "public"
        );

        res.sendFile(path.join(directoryPath + '/chess.html'));
    } else {
        const directoryPath = path.join(
            __dirname,
            "public"
        );

        let requestedFullPath = path.join(directoryPath + req.path);
        if (
            req.path == "" ||
            req.path == "/" ||
            !fs.existsSync(requestedFullPath)
        ) {
            res.sendFile(path.join(directoryPath + "/index.html"));
        } else {
            res.sendFile(path.join(directoryPath + req.path));
        }
    }
});

var apirouter = express.Router();

app.use("/api/", apirouter);

apirouter.get('/', function (req, res) {
    res.send('Hello World!');
});

apirouter.get('/chess/new', function (req, res) {
    var name = req.query.name;
    var color = parseInt(req.query.color);
    var key = short.generate();
    console.log('new chess ' + key);
    var chess = getChess(key, true);
    if (name) chess.UpdateName(name, color);
    res.send({
        key: key, board: chess.AllPieces
        , user1: chess.WhiteName, user2: chess.BlackName
    });
});

apirouter.get('/chess/join/:id', function (req, res) {
    var name = req.query.name;
    var color = parseInt(req.query.color);
    var key = req.params.id;
    console.log('join chess ' + key);
    var chess = getChess(key, false);
    if (!chess) res.send(undefined);
    if (name) chess.UpdateName(name, color);
    var moves = chess.LatestMoves(req.params.index);
    res.send({
        key: key, board: chess.AllPieces, moves: moves
        , notification: chess.GetNotification(color)
        , user1: chess.WhiteName, user2: chess.BlackName
    });
});

apirouter.post('/chess/message/:id', function (req, res) {
    var key = req.params.id;
    var color = parseInt(req.query.color);
    var message = req.body.message;
    console.log('message chess ' + key + ' - ' + message + '| user:' + color);
    var chess = getChess(key, false);
    if (!chess) res.send(undefined);
    chess.Notify(message, color);
    res.send({ status: 'OK' });
});

apirouter.get('/chess/refresh/:id/:index', function (req, res) {
    var key = req.params.id;
    var color = parseInt(req.query.color);
    console.log('refresh chess ' + key + '|' + req.params.index + '| user:' + color);
    var chess = getChess(key, false);
    if (!chess) res.send(undefined);

    var moves = chess.LatestMoves(req.params.index);
    var ures = { key: key, moves: moves };
    if (chess.Joined === true) {
        ures.joined = true;
        ures.user1 = chess.WhiteName;
        ures.user2 = chess.BlackName;
    }

    var _notification = chess.GetNotification(color);
    if (_notification) {
        ures.notification = _notification;
    }

    res.send(ures);
});

apirouter.get('/chess/play/:id/move', function (req, res) {
    var key = req.params.id;
    console.log('play chess ' + key + ' |file:' + req.query.file + '|rank:' + req.query.rank + '|tofile:' + req.query.tofile + '|torank:' + req.query.torank);
    var chess = getChess(key, false);
    if (chess) {
        var file = parseInt(req.query.file);
        var rank = parseInt(req.query.rank);
        var tofile = parseInt(req.query.tofile);
        var torank = parseInt(req.query.torank);
        var moveResponse = _chessBoard.boxClicked(chess, file, rank, tofile, torank);
        //cache.set(key + 'last', moveResponse);
        res.send({ move: moveResponse }); // , board: chess.AllPieces
    }
    else {
        res.send(undefined);
    }
});

apirouter.post('/contactus', function (req, res) {
    console.log('contactus by: ' + req.body.email);

    var emailMessage = 'Name: ' + req.body.name;
    emailMessage += '<br/>Phone: ' + req.body.phone;
    emailMessage += '<br/>Email: ' + req.body.email;
    emailMessage += '<br/>Message: ' + req.body.description;

    email.Send('LearnGurukul - ContactUs ' + req.body.name, 'mshubha123@gmail.com', emailMessage);

    emailMessage = 'Here is a copy of your enquiry with Learn Gurukul: ';
    emailMessage += '<br/>Name: ' + req.body.name;
    emailMessage += '<br/>Phone: ' + req.body.phone;
    emailMessage += '<br/>Email: ' + req.body.email;
    emailMessage += '<br/>Message: ' + req.body.description;

    email.Send('LearnGurukul - ContactUs', req.body.email, emailMessage);

    res.send({ status: 'OK' });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function getChess(key, isRestart) {
    if (!isRestart && key) {
        const value = cache.get(key);
        if (value) {
            return value;
        } else {
            return undefined;
        }
    }
    else {
        var newChess = _chessBoard.newChess();
        cache.set(key, newChess);
        return newChess;
    }
};
