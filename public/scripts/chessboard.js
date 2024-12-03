var id = undefined;
var isLive = false;
var yourcolor = undefined;
var board = undefined;
var move = undefined;
var _index = 0;

var select = false;
var moveFromF = undefined;
var moveFromR = undefined;
var dtStart = Date.now();
var current = PieceColors.White;

var chess = new Chess();

function restart(isonline = false) {
    SetLive(false);
    ConfigTimer(true);
    if (!isonline) {
        id = undefined;
        var _gid = document.getElementById('gid');
        _gid.value = '';
    }

    chess = new Chess();
    dtStart = Date.now();
    current = PieceColors.White;
    _index = 0;

    var _message = document.getElementById('_message');
    _message.innerHTML = '&nbsp;';
    var _allmoves = document.getElementById('_allmoves');
    _allmoves.innerHTML = '';
    var _notonboardw = document.getElementById('_notonboardw');
    _notonboardw.innerHTML = '';
    var _notonboardb = document.getElementById('_notonboardb');
    _notonboardb.innerHTML = '';

    for (var i = 1; i < 9; i++) {
        for (var j = 1; j < 9; j++) {
            var piece1 = chess.FindOnBoard(new Placement(j, i));
            var from_loc = "loc_" + j + i;
            var from_ctrl = document.getElementById(from_loc);
            if (piece1) {
                var pcolor = piece1.Color == PieceColors.Black ? 'b' : 'w';
                from_ctrl.src = 'assets/img/' + pcolor + '_' + Pieces.ToString(piece1.PieceType).toLowerCase() + '.svg';
            } else {
                from_ctrl.src = 'assets/img/empty.svg';
            }
        }
    }
}

function boxClicked(file, rank) {
    var _message = document.getElementById('_message');
    _message.innerHTML = '&nbsp;';
    if (!select) {
        moveFromF = file;
        moveFromR = rank;

        var from_loc = "loc_" + moveFromF + moveFromR;
        var from_ctrl = document.getElementById(from_loc);
        var colorImPart = chess.Current === PieceColors.White ? 'img/w_' : 'img/b_';
        if (from_ctrl.src.includes('img/empty.svg')) {
            _message.innerHTML = 'Invalid source, empty!, turn for ' + PieceColors.ToString(chess.Current) + '!';
        }
        else {
            if (id) {
                colorImPart = chess.Current === yourcolor ? 'img/w_' : 'img/b_';
                if (!from_ctrl.src.includes(colorImPart)) {
                    _message.innerHTML = 'Not your turn';
                }
                else {
                    select = true;
                }
            }
            else if (!from_ctrl.src.includes(colorImPart)) {
                _message.innerHTML = 'Invalid move, Its turn for ' + PieceColors.ToString(chess.Current) + '!';
            }
            else {
                select = true;
            }
        }
    }
    else {
        select = false;
        if (id) {
            Move(moveFromF, moveFromR, file, rank);
            return;
        }

        var timeTaken = (Date.now() - dtStart) / 1000;
        var move = chess.Move(new Placement(moveFromF, moveFromR), new Placement(file, rank), timeTaken);
        if (move) {
            _message.innerHTML = move.Message;

            if (move.Success) {
                if (current != chess.Current) {
                    dtStart = Date.now();
                }

                var str_display = "";
                var _allmoves = document.getElementById('_allmoves');
                for (var i = 0; i < chess.PieceMovements.length; i++) {
                    var move1 = chess.PieceMovements[i];
                    str_display += '<div class="col-sm"><span>';
                    str_display += move1.ToString();
                    str_display += "</div>";
                }

                _allmoves.innerHTML = str_display;


                var from_loc = "loc_" + moveFromF + moveFromR;
                var from_ctrl = document.getElementById(from_loc);
                var to_loc = "loc_" + move.Piece.Location.File + move.Piece.Location.Rank;
                var to_ctrl = document.getElementById(to_loc);
                var fromsrc = from_ctrl.src;
                var tosrc = to_ctrl.src;
                to_ctrl.src = fromsrc;
                // no matter it removed other peice, alwas source will be empty normally
                from_ctrl.src = 'assets/img/empty.svg';
                _message.innerHTML = move.Message;

                var check = move.CheckOponent;
                if (check && check.Check) { // add x
                    _message.innerHTML += ". <b><span style='color:red;'>Check by " + check.By.ToString() + '</span></b>';
                }


                var whotesnotOnboard = chess.GetPiecesNotOnBoard(PieceColors.White);
                if (whotesnotOnboard && whotesnotOnboard.length > 0) {
                    var str_notonboardw = '<b>Whites:</b><br/>';
                    for (var i = 0; i < whotesnotOnboard.length; i++) {
                        str_notonboardw += '<span>' + whotesnotOnboard[i].ToString() + '</span><br/>';
                    }

                    var _notonboardw = document.getElementById('_notonboardw');
                    _notonboardw.innerHTML = str_notonboardw;
                }

                var blacksnotOnboard = chess.GetPiecesNotOnBoard(PieceColors.Black);
                if (blacksnotOnboard && blacksnotOnboard.length > 0) {
                    var str_notonboardb = '<b>Blacks:</b><br/>';
                    for (var i = 0; i < blacksnotOnboard.length; i++) {
                        str_notonboardb += '<span>' + blacksnotOnboard[i].ToString() + '</span><br/>';
                    }

                    var _notonboardb = document.getElementById('_notonboardb');
                    _notonboardb.innerHTML = str_notonboardb;
                }
            }
        }
    }
}

/* ****************************************** */
/* ****************************************** */

function SetLive(live = false) {
    isLive = live;

    var _btnOffline = document.getElementById('_btnOffline');
    var _offline = document.getElementById('_offline');

    var _gid = document.getElementById('gid');
    var _userText = document.getElementById('_newuser');
    var _user1 = document.getElementById('_user1');
    var _user2 = document.getElementById('_user2');
    var _btnOnlineW = document.getElementById('_btnOnlineW');
    var _btnOnlineB = document.getElementById('_btnOnlineB');
    var _online = document.getElementById('_online');
    var _showIfOnline = document.getElementById('_showIfOnline');

    _btnOffline.disabled = !live;
    _btnOnlineW.disabled = live;
    _btnOnlineB.disabled = live;
    _gid.disabled = live;

    _offline.classList.remove('collapse');
    _online.classList.remove('collapse');
    _showIfOnline.classList.remove('collapse');
    if (!live) {
        // ONLINE
        _online.classList.add('collapse');
        _showIfOnline.classList.add('collapse');
        if (yourcolor == PieceColors.White) {
            _user1.innerHTML = _userText.value;
        } else {
            _user2.innerHTML = _userText.value;
        }
    }
    else {
        // ONLINE
        _offline.classList.add('collapse');
    }
}

function SetBoard() {
    for (var ii = 1; ii < 9; ii++) {
        var i = yourcolor == PieceColors.Black ? (9 - ii) : ii;

        var filet = "filet_" + ii;
        var filet_ctrl = document.getElementById(filet);
        if (filet_ctrl) {
            var fileb = "fileb_" + ii;
            var rankl = "rankl_" + ii;
            var rankr = "rankr_" + ii;
            var fileb_ctrl = document.getElementById(fileb);
            var rankl_ctrl = document.getElementById(rankl);
            var rankr_ctrl = document.getElementById(rankr);
            var fileText = FileLoc.ToString(i);
            var rankText = RankLoc.ToString(i);

            filet_ctrl.innerHTML = fileb_ctrl.innerHTML = fileText;
            rankl_ctrl.innerHTML = rankr_ctrl.innerHTML = rankText;
        }

        for (var jj = 1; jj < 9; jj++) {
            var j = yourcolor == PieceColors.Black ? (9 - jj) : jj;

            var piece1 = FindOnBoard(new Placement(j, i));
            var from_loc = "loc_" + jj + ii;
            var btn_loc = "btn_" + jj + ii;
            var from_ctrl = document.getElementById(from_loc);
            var btn_ctrl = document.getElementById(btn_loc);

            if (piece1) {
                var pcolor = piece1.Color == PieceColors.Black ? 'b' : 'w';
                from_ctrl.src = 'assets/img/' + pcolor + '_' + Pieces.ToString(piece1.PieceType).toLowerCase() + '.svg';
            } else {
                from_ctrl.src = 'assets/img/empty.svg';
            }
        }
    }
}

function FindOnBoard(loc) {
    var resp = board.filter(x => x.OnBoard && x.Location.File == loc.File && x.Location.Rank == loc.Rank);
    if (!resp || resp.length === 0) return undefined;
    return resp[0];
}

var iniyourcolor = PieceColors.White;
function StartWhite() {
    iniyourcolor = PieceColors.White;
    var _newuser = document.getElementById('_newuser');
    if (!_newuser.value || _newuser.value.length == 0)
        _newuser.value = 'Guest 1';
}
function StartBlack() {
    iniyourcolor = PieceColors.Black;
    if (!_newuser.value || _newuser.value.length == 0)
        _newuser.value = 'Guest 2';
}
function updateWhatsappLink() {
    var key = id;
    var color = yourcolor == PieceColors.Black ? PieceColors.White : PieceColors.Black;
    document.getElementById('_whatsappjoin').href = 'https://api.whatsapp.com/send?text=Join: ' + key + '%20http://learngurukul.com/chess?key=' + key + '?color=' + color;
}

function Start() {
    var _userName = document.getElementById('_newuser').value;
    var _gid = document.getElementById('gid').value;

    if (iniyourcolor == PieceColors.Black && (!_gid || gid.length == 0)) {
        alert('Invalid Key, Please provide key shared and try again');
        return;
    }
    else if (iniyourcolor == PieceColors.White && (!_gid || gid.length == 0)) {
        // alert('Invalid Key, Please provide key shared and try again');
    }

    yourcolor = iniyourcolor;
    restart(true);
    id = _gid;
    if (id && id.length > 0) {
        refreshing = true;
        $.get("/api/chess/join/" + id + "?name=" + _userName + "&color=" + yourcolor, function (data, status) {
            //console.log(status);
            //console.log(data);
            if (data) {
                SetLive(true);
                id = data.key;
                board = data.board;
                yourcolor = iniyourcolor;
                SetBoard();
                datarefresh(data, false);
                ConfigTimer();
                document.getElementById('_user1').innerText = data.user1;
                document.getElementById('_user2').innerText = data.user2;
                updateWhatsappLink();
            } else {
                alert('Invalid Key');
            }
        });
    } else {
        $.get("/api/chess/new?name=" + _userName + "&color=" + yourcolor, function (data, status) {
            //console.log(status);
            //console.log(data);
            if (data) {
                SetLive(true);
                id = data.key;
                board = data.board;
                yourcolor = PieceColors.White;
                var _gid = document.getElementById('gid');
                _gid.value = id;
                SetBoard();
                refreshing = false;
                ConfigTimer();
                document.getElementById('_user1').innerText = data.user1;
                document.getElementById('_user2').innerText = data.user2;
                updateWhatsappLink();
            }
        });
    }
}

function SendMessage() {
    var _messageTextValue = document.getElementById('_messageText').value;
    if (id && id.length > 0) {
        $.post("/api/chess/message/" + id + "?color=" + yourcolor, { message: _messageTextValue }, function (data, status) {
            if (!data) {
                alert('Could not sent, something wrong!');
            }
        });
    }
}

var timer = undefined;
var refreshing = false;
var refreshTimeInterval = 3000;
function ConfigTimer(reset = false) {
    if (reset) {
        if (timer) clearInterval(timer);
        timer = undefined;
        return;
    }

    if (timer) return;

    timer = setInterval(Refresh, refreshTimeInterval);
}

function Refresh() {
    if (id && !refreshing) {
        refreshing = true;
        $.get("/api/chess/refresh/" + id + "/" + _index + "?color=" + yourcolor, function (data, status) {
            if (data) {
                // board = data.board;  
                datarefresh(data, true);
            } else {
                refreshing = false;
            }
        });
    }
}

function datarefresh(data, reacrrange = false) {
    if (!data) {
        refreshing = false;
        return;
    }

    var str_display = "";
    var str_notonboardw = "";
    var str_notonboardb = "";
    if (data.joined && data.joined === true) {
        document.getElementById('_user1').innerText = data.user1;
        document.getElementById('_user2').innerText = data.user2;
    }

    var _user1 = document.getElementById('_user1').innerText;
    var _user2 = document.getElementById('_user2').innerText;

    if (!data.moves) {
        refreshing = false;
        if (data.notification) {
            var _message = document.getElementById('_message');
            _message.innerHTML = "<br/>Message (<kbd " + (yourcolor == PieceColors.White ? ">" : "style='background-color:burlywood'>") + (yourcolor == PieceColors.Black ? _user1 : _user2) + "</kbd>): " + data.notification;
        }

        return;
    }

    data.moves.sort(function (a, b) { return a.Index - b.Index });
    var lastMoveIndex = data.moves[data.moves.length - 1].Index;
    data.moves.forEach((move) => {
        if (reacrrange) {
            var file = yourcolor == PieceColors.Black ? (9 - move.Location.File) : move.Location.File;
            var rank = yourcolor == PieceColors.Black ? (9 - move.Location.Rank) : move.Location.Rank;
            var tofile = yourcolor == PieceColors.Black ? (9 - move.ToLocation.File) : move.ToLocation.File;
            var torank = yourcolor == PieceColors.Black ? (9 - move.ToLocation.Rank) : move.ToLocation.Rank;
            updateMove(move, file, rank, tofile, torank, false, lastMoveIndex == move.Index);
        }

        str_display += '<kbd class="mr-2">';
        str_display += Pieces.ToString(move.PieceType) + (move.Replaced !== undefined ? "x" : "") + new MyStrings().PlacementString(move.ToLocation);
        str_display += "</kbd>";
        if (move.Color == PieceColors.Black) str_display += "<br/>";

        if (move.Replaced) {
            var movedPiece = "<kbd class='mr-2' " + (move.Replaced.Color == PieceColors.Black ? "" : "style='background-color:burlywood'")
                + ">" + Pieces.ToString(move.Replaced.PieceType) + "</kbd>";
            if (move.Replaced.Color == PieceColors.Black) {
                str_notonboardw += movedPiece;
            }
            else {
                str_notonboardb += movedPiece;
            }
        }
    });

    if (str_display && str_display.length > 0) {
        var _allmoves = document.getElementById('_allmoves');
        _allmoves.innerHTML += str_display;
    }

    if (str_notonboardw && str_notonboardw.length > 0) {
        var _notonboardw = document.getElementById('_notonboardw');
        _notonboardw.innerHTML += str_notonboardw;
    }

    if (str_notonboardb && str_notonboardb.length > 0) {
        var _notonboardb = document.getElementById('_notonboardb');
        _notonboardb.innerHTML += str_notonboardb;
    }

    if (data.notification) {
        var _message = document.getElementById('_message');
        _message.innerHTML += "<br/>Message (<kbd " + (yourcolor == PieceColors.White ? ">" : "style='background-color:burlywood'>") + (yourcolor == PieceColors.Black ? _user1 : _user2) + "</kbd>): " + data.notification;
    }

    _index = lastMoveIndex;
    refreshing = false;
}

function Move(_file, _rank, _tofile, _torank) {
    var file = yourcolor == PieceColors.Black ? (9 - _file) : _file;
    var rank = yourcolor == PieceColors.Black ? (9 - _rank) : _rank;
    var tofile = yourcolor == PieceColors.Black ? (9 - _tofile) : _tofile;
    var torank = yourcolor == PieceColors.Black ? (9 - _torank) : _torank;
    if (id) {
        $.get("/api/chess/play/" + id
            + "/move?file=" + file + "&rank=" + rank
            + "&tofile=" + tofile + "&torank=" + torank + ""
            , function (data, status) {
                //console.log(status);
                //console.log(data);
                move = data.move;
                if (move) {
                    //_index++;
                    updateMove(move, _file, _rank, _tofile, _torank, true);
                }
            });
    }
}

function updateMove(move, _file, _rank, _tofile, _torank, islocal = false, latest = true) {
    if (!move) return;
    var _message = document.getElementById('_message');
    if (move.Message && move.Message.length > 0) _message.innerHTML = move.Message;
    if (move.Success) {
        if (islocal === true || (move.Color && move.Color !== yourcolor)) {
            var from_loc = "loc_" + _file + _rank;
            var from_ctrl = document.getElementById(from_loc);
            var to_loc = "loc_" + _tofile + _torank;
            var to_ctrl = document.getElementById(to_loc);
            var fromsrc = from_ctrl.src;
            var tosrc = to_ctrl.src;
            to_ctrl.src = fromsrc;
            // no matter it removed other peice, alwas source will be empty normally
            from_ctrl.src = 'assets/img/empty.svg';
            if (move.Color && move.Color !== yourcolor) {
                to_ctrl.classList.add('box-highlight');
                setTimeout(function () {
                    to_ctrl.classList.remove('box-highlight');
                }, refreshTimeInterval);
            }
        }

        if (latest) {
            var check = move.CheckOponent;
            if (check && check.Check) { // add x
                _message.innerHTML += ". <b><span style='color:red;'>Check by " + new MyStrings().PieceString(check.By) + '</span></b>';
            }
        }
    }
}

function Restart(file, rank) {

}

/* ****************************************** */
/* ****************************************** */

SetLive(false);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

$(document).ready(function () {
    var _q_key = getParameterByName('key');
    var _q_color = getParameterByName('color');
    if (_q_key && _q_key.length > 1) {
        document.getElementById('gid').value = _q_key;
        if (_q_color) {
            iniyourcolor = parseInt(_q_color);
            iniyourcolor == PieceColors.White ? StartWhite() : StartBlack();
        }

        $("#newliveModel").modal();
    }
});

// https://api.whatsapp.com/send?text=pfvYvDfiwmqCp3aPMYiXhZ%20http://learngurukul.com/chess?key=pfvYvDfiwmqCp3aPMYiXhZ?color=2
