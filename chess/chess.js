
/*
1, Notations
2. Time control
3. Check allowance scenarions
4. Win, Checkmate
5. En Passment
6. Castling
7. Resign
8. Draw - salemate, agreement, threefold repetation, Fiftymove, file fold repetation, in-sufficient material

*/
class PiecesEnum {
    constructor() {
        this.King = 1;
        this.Queen = 2;
        this.Rook = 3;
        this.Bishop = 4;
        this.Kinght = 5;
        this.Pawn = 6;
    }

    ToString(value) {
        return value === this.King ? "K" : value === this.Queen ? "Q" : value === this.Rook ? "R"
            : value === this.Bishop ? "B" : value === this.Kinght ? "N" : value === this.Pawn ? "P" : "Unknown";
    }
}
class RankLocEnum {
    constructor() {
        this.One = 1;
        this.Two = 2;
        this.Three = 3;
        this.Four = 4;
        this.Five = 5;
        this.Six = 6;
        this.Seven = 7;
        this.Eight = 8;
    }

    ToString(value) {
        return value;
    }
}
class FileLocEnum {
    constructor() {
        this.A = 1;
        this.B = 2;
        this.C = 3;
        this.D = 4;
        this.E = 5;
        this.F = 6;
        this.G = 7;
        this.H = 8;
    }

    ToString(value) {
        return value === this.A ? "A" : value === this.B ? "B" : value === this.C ? "C"
            : value === this.D ? "D" : value === this.E ? "E" : value === this.F ? "F"
                : value === this.G ? "G" : value === this.H ? "H" : "Unknown";
    }
}
class PieceColorsEnum {
    constructor() {
        this.White = 1;
        this.Black = 2;
    }

    ToString(value) {
        return value === this.White ? "White" : value === this.Black ? "Black" : "Unknown";
    }
}
class MoveStatusEnum {
    constructor() {
        this.Moved = 0;
        this.InvalidMove = 1;
        this.InvalidNotInBoard = 2;
        this.InvalidDueByColor = 3;
        this.InvalidDueToCheck = 4;
    }

    ToString(value) {
        return value === this.Moved ? "Moved" : value === this.InvalidMove ? "InvalidMove" : value === this.InvalidNotInBoard ? "InvalidNotInBoard"
            : value === this.InvalidDueByColor ? "InvalidDueByColor" : value === this.InvalidDueToCheck ? "InvalidDueToCheck" : "Unknown";
    }
}
/*  Enums  */
var Pieces = new PiecesEnum();
var RankLoc = new RankLocEnum();
var FileLoc = new FileLocEnum();
var PieceColors = new PieceColorsEnum();
var MoveStatus = new MoveStatusEnum();
/*  Enums  */

class PieceHistoryItem {
    constructor(location, isNeverMoved, onBoard) {
        this.Location = location;
        this.IsNeverMoved = isNeverMoved;
        this.OnBoard = onBoard;
    }
}

class Piece {
    constructor(pieceType, location, color) {
        this.Color = color;
        this.PieceType = pieceType;
        this.Location = location;

        this.IsNeverMoved = true;
        this.OnBoard = true;

        this.SpecialMoveAllowed = false;

        this.Moves = [];
        this.Undos = [];
    }

    Move(newLocation, replacement = false) {
        // if (CanMove(newLocation, out path, replacement)) {
        // moving...
        this.MoveInternal(newLocation);
        //}

        // return path;
    }

    Remove() {
        this.Moves.push(new PieceHistoryItem(this.Location, this.IsNeverMoved, this.OnBoard));
        this.OnBoard = false;
    }

    MoveInternal(newLocation) {
        this.Moves.push(new PieceHistoryItem(this.Location, this.IsNeverMoved, this.OnBoard));
        this.Location = newLocation;
        this.IsNeverMoved = false;
    }

    Undo() {
        if (this.Moves.length > 0) {
            this.Undos.push(new PieceHistoryItem(this.Location, this.IsNeverMoved, this.OnBoard));

            var move = this.Moves.pop();
            this.Location = move.Location;
            this.IsNeverMoved = move.IsNeverMoved;
            this.OnBoard = move.OnBoard;
        }
    }

    Redo() {
        if (this.Undos.length > 0) {
            this.Moves.push(new PieceHistoryItem(this.Location, this.IsNeverMoved, this.OnBoard));

            var move = this.Undos.pop();
            this.Location = move.Location;
            this.IsNeverMoved = move.IsNeverMoved;
            this.OnBoard = move.OnBoard;
        }
    }

    ToString() {
        return Pieces.ToString(this.PieceType) + " (" + (this.OnBoard ? this.Location.ToString() : FileLoc.ToString(this.Location.File)) + ")";
    }
}
class MyStrings {
    constructor() { }
    PieceString(p) {
        return Pieces.ToString(p.PieceType) + " (" + (p.OnBoard ? this.PlacementString(p.Location) : FileLoc.ToString(p.Location.File)) + ")";
    }
    PlacementString(p) {
        return FileLoc.ToString(p.File) + RankLoc.ToString(p.Rank);
    }
}
class Placement {
    constructor(file, rank) {
        this.File = file;
        this.Rank = rank;
    }

    Equals(other) {
        return this.File === other.File && this.Rank === other.Rank;
    }

    ToString() {
        // Enum.GetName(typeof(FileLoc), this.File)
        return FileLoc.ToString(this.File) + RankLoc.ToString(this.Rank);
    }
}

class MoveResponse {
    constructor(piece, status, message, removed = false, checkOponent = undefined) {
        this.Piece = piece;
        this.Status = status;
        this.Message = message;

        this.Removed = removed;
        this.CheckOponent = checkOponent;

        this.Success = status === 0;
    }
}

class CheckOption1 {
    constructor(obstruction, _break) {
        this.obstruction = obstruction;
        this._break = _break;
    }
}

class CheckOponent {
    constructor(check, by) {
        this.Check = check;
        this.By = by;
    }
}

class PiecesChk {
    constructor(found, piece) {
        this.Found = found;
        this.FPiece = piece;
    }
}

class BoardPieceMovement {
    constructor(timeInMilliSeconds, white) {
        this.WhiteTime = timeInMilliSeconds;
        this.White = white;
        this.BlackTime = undefined;
        this.Black = undefined;
    }

    Next(timeInMilliSeconds, black) {
        this.BlackTime = timeInMilliSeconds;
        this.Black = black;
    }

    ToString() {
        var display = "<span>" + this.White.ToString() + "</span>";// + "&nbsp;<span>" + this.timeformat(this.WhiteTime) + "</span>";
        if (this.Black != null) {
            display += "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;<span>" + this.Black.ToString() + "</span>";// + "&nbsp;<span>" + this.timeformat(this.BlackTime) + "</span>";
        }

        return display;
    }

    timeformat(date) {
        return '';
        // // calculate (and subtract) whole days
        // var days = Math.floor(date / 86400);
        // date -= days * 86400;

        // // calculate (and subtract) whole hours
        // var hours = Math.floor(date / 3600) % 24;
        // date -= hours * 3600;

        // // calculate (and subtract) whole minutes
        // var minutes = Math.floor(date / 60) % 60;
        // date -= minutes * 60;

        // // what's left is seconds
        // var seconds = date % 60;  // in theory the modulus is not required

        // var mytime= (minutes && minutes > 0 ? minutes + ':' : '') + + seconds; // + ':' + ms;
        // return mytime;
    }
}

class PieceMovement {
    constructor(color, pieceType, location, toLocation, replacedObj) {
        this.Color = color;
        this.PieceType = pieceType;
        this.Location = location;
        this.ToLocation = toLocation;
        this.Replaced = replacedObj;

        this.Index = 0;
        this.Status = 0;
        this.Message = '';

        this.Removed = false;
        this.CheckOponent = undefined;

        this.Success = true;
    }

    SetMoveInfo(index, moveInfo) {
        this.Index = index;
        if (moveInfo) {
            this.Message = moveInfo.Message;
            this.Status = moveInfo.Status;
            this.Success = this.Status === 0;
            this.Removed = moveInfo.Removed;
            if (moveInfo.CheckOponent && moveInfo.CheckOponent.By) {
                this.CheckOponent = new CheckOponent(moveInfo.CheckOponent.Check, new BasicPiece(moveInfo.CheckOponent.By.Color, moveInfo.CheckOponent.By.PieceType));
                this.CheckOponent.By.Location = moveInfo.CheckOponent.By.Location;
            }
        }
    }

    ToString() {
        return Pieces.ToString(this.PieceType) + (this.Replaced !== undefined ? "x" : "") + this.ToLocation.ToString();
    }
}

class BasicPiece {
    constructor(color, pieceType) {
        this.Color = color;
        this.PieceType = pieceType;
        this.Location = undefined;
    }

    ToString() {
        return Pieces.ToString(this.PieceType);
    }
}

class Chess {
    constructor() {
        var rooka1 = new Piece(Pieces.Rook, new Placement(FileLoc.A, RankLoc.One), PieceColors.White);
        var kinghtb1 = new Piece(Pieces.Kinght, new Placement(FileLoc.B, RankLoc.One), PieceColors.White);
        var bishopC1 = new Piece(Pieces.Bishop, new Placement(FileLoc.C, RankLoc.One), PieceColors.White);
        var queuend1 = new Piece(Pieces.Queen, new Placement(FileLoc.D, RankLoc.One), PieceColors.White);
        var kinge1 = new Piece(Pieces.King, new Placement(FileLoc.E, RankLoc.One), PieceColors.White);
        var bishopf1 = new Piece(Pieces.Bishop, new Placement(FileLoc.F, RankLoc.One), PieceColors.White);
        var kinghtg1 = new Piece(Pieces.Kinght, new Placement(FileLoc.G, RankLoc.One), PieceColors.White);
        var rookh1 = new Piece(Pieces.Rook, new Placement(FileLoc.H, RankLoc.One), PieceColors.White);

        var pawna2 = new Piece(Pieces.Pawn, new Placement(FileLoc.A, RankLoc.Two), PieceColors.White);
        var pawnb2 = new Piece(Pieces.Pawn, new Placement(FileLoc.B, RankLoc.Two), PieceColors.White);
        var pawnc2 = new Piece(Pieces.Pawn, new Placement(FileLoc.C, RankLoc.Two), PieceColors.White);
        var pawnd2 = new Piece(Pieces.Pawn, new Placement(FileLoc.D, RankLoc.Two), PieceColors.White);
        var pawne2 = new Piece(Pieces.Pawn, new Placement(FileLoc.E, RankLoc.Two), PieceColors.White);
        var pawnf2 = new Piece(Pieces.Pawn, new Placement(FileLoc.F, RankLoc.Two), PieceColors.White);
        var pawng2 = new Piece(Pieces.Pawn, new Placement(FileLoc.G, RankLoc.Two), PieceColors.White);
        var pawnh2 = new Piece(Pieces.Pawn, new Placement(FileLoc.H, RankLoc.Two), PieceColors.White);

        var b_rooka8 = new Piece(Pieces.Rook, new Placement(FileLoc.A, RankLoc.Eight), PieceColors.Black);
        var b_kinghtb8 = new Piece(Pieces.Kinght, new Placement(FileLoc.B, RankLoc.Eight), PieceColors.Black);
        var b_bishopC8 = new Piece(Pieces.Bishop, new Placement(FileLoc.C, RankLoc.Eight), PieceColors.Black);
        var b_queuend8 = new Piece(Pieces.Queen, new Placement(FileLoc.D, RankLoc.Eight), PieceColors.Black);
        var b_kinge8 = new Piece(Pieces.King, new Placement(FileLoc.E, RankLoc.Eight), PieceColors.Black);
        var b_bishopf8 = new Piece(Pieces.Bishop, new Placement(FileLoc.F, RankLoc.Eight), PieceColors.Black);
        var b_kinghtg8 = new Piece(Pieces.Kinght, new Placement(FileLoc.G, RankLoc.Eight), PieceColors.Black);
        var b_rookh8 = new Piece(Pieces.Rook, new Placement(FileLoc.H, RankLoc.Eight), PieceColors.Black);

        var b_pawna7 = new Piece(Pieces.Pawn, new Placement(FileLoc.A, RankLoc.Seven), PieceColors.Black);
        var b_pawnb7 = new Piece(Pieces.Pawn, new Placement(FileLoc.B, RankLoc.Seven), PieceColors.Black);
        var b_pawnc7 = new Piece(Pieces.Pawn, new Placement(FileLoc.C, RankLoc.Seven), PieceColors.Black);
        var b_pawnd7 = new Piece(Pieces.Pawn, new Placement(FileLoc.D, RankLoc.Seven), PieceColors.Black);
        var b_pawne7 = new Piece(Pieces.Pawn, new Placement(FileLoc.E, RankLoc.Seven), PieceColors.Black);
        var b_pawnf7 = new Piece(Pieces.Pawn, new Placement(FileLoc.F, RankLoc.Seven), PieceColors.Black);
        var b_pawng7 = new Piece(Pieces.Pawn, new Placement(FileLoc.G, RankLoc.Seven), PieceColors.Black);
        var b_pawnh7 = new Piece(Pieces.Pawn, new Placement(FileLoc.H, RankLoc.Seven), PieceColors.Black);

        this.AllPieces = [
            rooka1, kinghtb1, bishopC1, queuend1, kinge1, bishopf1, kinghtg1, rookh1,
            pawna2, pawnb2, pawnc2, pawnd2, pawne2, pawnf2, pawng2, pawnh2,
            b_rooka8, b_kinghtb8, b_bishopC8, b_queuend8, b_kinge8, b_bishopf8, b_kinghtg8, b_rookh8,
            b_pawna7, b_pawnb7, b_pawnc7, b_pawnd7, b_pawne7, b_pawnf7, b_pawng7, b_pawnh7
        ];

        this.Current = PieceColors.White;
        this.Movements = [];
        this.PieceMovements = [];
        this.boardPieceMovement = undefined;

        this.WhiteName = 'Guest 1';
        this.BlackName = 'Guest 2';
        this.WhiteMessage = undefined;
        this.BlackMessage = undefined;
        this.Joined = false;
    }

    AddMovement(move, duration = 5000, moveResponse) {
        move.SetMoveInfo(this.Movements.length + 1, moveResponse);
        this.Movements.push(move);

        try {
            if (this.Current == PieceColors.White) {
                this.boardPieceMovement = new BoardPieceMovement(duration, move);
                this.PieceMovements.push(this.boardPieceMovement);
            }
            else {
                this.boardPieceMovement.Next(duration, move);
            }

        } catch (e) {

        }
    }

    UpdateName(name, color) {
        if (!color) color = this.Current;
        if (color == PieceColors.White) {
            this.WhiteName = name;
        } else {
            this.BlackName = name;
        }

        this.Joined = true;
    }

    Notify(message, color) {
        if (!color) color = this.Current;
        if (color === PieceColors.White) {
            this.WhiteMessage = message;
            // console.log(color + ' - ' + this.WhiteMessage)
        } else {
            this.BlackMessage = message;
            // console.log(color + ' - ' + this.BlackMessage)
        }
    }

    GetNotification(color) {
        if (!color) color = this.Current;
        if (color === PieceColors.White) {
            //console.log(color + ' - ' + this.BlackMessage)
           return this.BlackMessage;
        } else {
            //console.log(color + ' - ' + this.WhiteMessage)
            return this.WhiteMessage;
        }
    }

    LatestMoves(from = 0) {
        var resp = this.Movements.filter(x => x.Index > from);
        if (!resp || resp.length === 0) return undefined;
        return resp;
    }

    Move(_from, _to, duration = 5000) {
        if (!_from.Equals(_to)) {
            var piece = this.FindOnBoard(_from);
            if (piece !== undefined) {
                this.Joined = false;
                if (piece.Color !== this.Current) return new MoveResponse(piece, MoveStatus.InvalidDueByColor, "Not the turn for color: " + PieceColors.ToString(piece.Color));

                var canMove = this.CanMove(piece, _to);
                if (canMove) {
                    var targetObstruction1 = this.HasReplace(piece, _to);
                    var targetObstruction = targetObstruction1.FPiece;
                    var replacement = targetObstruction1.Found;
                    piece.Move(_to, replacement);
                    if (replacement) {
                        targetObstruction.Remove();
                    }

                    var opponentColor = piece.Color === PieceColors.Black ? PieceColors.White : PieceColors.Black;
                    var movedtocheck = this.KingInCheckPosition(piece.Color); // 
                    var checkOponent = undefined;
                    var res = undefined;
                    if (movedtocheck.Check) {
                        res = new MoveResponse(piece
                            , MoveStatus.InvalidDueToCheck
                            , "Can't Move to " + ", " + piece.ToString() + " <b><span style='color:red;'>King is in check position by " + movedtocheck.By.ToString() + '</span></b>'
                            , false
                            , movedtocheck);
                        if (replacement) {
                            targetObstruction.Undo();
                        }

                        piece.Undo();
                    }
                    else {
                        var checkOponent = this.KingInCheckPosition(opponentColor);
                        res = new MoveResponse(piece, MoveStatus.Moved, "Done", targetObstruction, checkOponent);
                        this.AddMovement(new PieceMovement(piece.Color,
                            piece.PieceType, _from, _to,
                            (replacement ? new BasicPiece(targetObstruction.Color, targetObstruction.PieceType) : undefined)),
                            duration, res);
                        this.Current = opponentColor;
                    }

                    return res;
                }
                else {
                    return new MoveResponse(piece, MoveStatus.InvalidMove, "Invalid Move, Invalid target position");
                }
            }
        }

        return new MoveResponse(undefined, MoveStatus.InvalidNotInBoard, "Invalid Move, Not in board");
    }

    FindOnBoard(loc) {
        var resp = this.AllPieces.filter(x => x.OnBoard && x.Location.Equals(loc));
        if (!resp || resp.length === 0) return undefined;
        return resp[0];
    }

    GetPiecesNotOnBoard(color) {
        var resp = this.AllPieces.filter(x => !x.OnBoard && x.Color == color);
        return resp;
    }

    HasAnyObstruction(p, to) {
        if (p.Location.Equals(to)) {
            return undefined;
        }

        var obstruction = this.FindOnBoard(to);
        return obstruction;
    }

    HasReplace(_this, tp) {
        var targetObstruction = this.HasAnyObstruction(_this, tp);
        if (targetObstruction) {
            var replacement = _this.Color !== targetObstruction.Color;
            return new PiecesChk(replacement, targetObstruction);
        }

        return new PiecesChk(false, targetObstruction);
    }

    KingInCheckPosition(color) {
        var resp = this.AllPieces.filter(x => x.PieceType === Pieces.King && x.Color === color);
        var kingc = resp[0];
        var kf = kingc.Location.File;
        var kr = kingc.Location.Rank;
        var targetObstruction = undefined;
        var index = 0;
        var _this = this;
        var checkSameLine = function (f, r) {
            index++;
            targetObstruction = _this.HasAnyObstruction(kingc, new Placement(f, r));
            if (targetObstruction) {
                if (targetObstruction.Color !== kingc.Color &&
                    (targetObstruction.PieceType === Pieces.Queen
                    || targetObstruction.PieceType === Pieces.Rook)) {
                    // Check
                    return new CheckOption1(true, false);
                } else {
                    return new CheckOption1(true, true); // same color
                }
            }

            return new CheckOption1(false, false);
        };
        var checkDiagonal = function (f, r) {
            index++;
            targetObstruction = _this.HasAnyObstruction(kingc, new Placement(f, r));
            if (targetObstruction) {
                if (targetObstruction.Color !== kingc.Color &&
                    (targetObstruction.PieceType === Pieces.Queen
                    || targetObstruction.PieceType === Pieces.Bishop
                    || (index === 1 && targetObstruction.PieceType === Pieces.Pawn))) {
                    // Check
                    return new CheckOption1(true, false);
                } else {
                    return new CheckOption1(true, true); // same color
                }
            }

            return new CheckOption1(false, false);
        };
        var checkKnightPos = function (f, r) {
            index++;
            targetObstruction = _this.HasAnyObstruction(kingc, new Placement(f, r));
            if (targetObstruction) {
                if (targetObstruction.Color === kingc.Color) return new CheckOption1(true, true); // same color
                if (targetObstruction.PieceType === Pieces.Kinght) {
                    // Check
                    return new CheckOption1(true, false);
                }
            }

            return new CheckOption1(false, false);
        };

        var check = undefined;
        var i = 0;
        var j = 0;

        // Threat by: Queuen, Rook
        for (i = kf - 1; i > 0; i--) {
            check = checkSameLine(i, kingc.Location.Rank);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }
        // Threat by: Queuen, Rook
        for (i = kf + 1; i < 9; i++) {
            check = checkSameLine(i, kingc.Location.Rank);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }
        // Threat by: Queuen, Rook
        for (j = kr - 1; j > 0; j--) {
            check = checkSameLine(kingc.Location.File, j);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }
        // Threat by: Queuen, Rook
        for (j = kr + 1; j < 9; j++) {
            check = checkSameLine(kingc.Location.File, j);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }

        index = 0;
        // Threat by: Queuen, Bishop, Pawn
        for (i = kf - 1, j = kr - 1; i > 0 && j > 0; i-- , j--) {
            check = checkDiagonal(i, j);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }
        index = 0;
        // Threat by: Queuen, Bishop, Pawn
        for (i = kf + 1, j = kr + 1; i < 9 && j < 9; i++ , j++) {
            check = checkDiagonal(i, j);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }


        index = 0;
        // Threat by: Queuen, Bishop, Pawn
        for (i = kf + 1, j = kr - 1; i < 9 && j > 0; i++ , j--) {
            check = checkDiagonal(i, j);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }
        index = 0;
        // Threat by: Queuen, Bishop, Pawn
        for (i = kf - 1, j = kr + 1; i > 0 && j < 9; i-- , j++) {
            check = checkDiagonal(i, j);
            if (check.obstruction) if (check._break) break; else return new CheckOponent(true, targetObstruction);
        }

        // Threat by: Knight
        var ikf = kf + 2;
        if (ikf < 9) {
            if (kr > 1) {
                check = checkKnightPos(ikf, (kingc.Location.Rank) - 1);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }

            if (kr < 8) {
                check = checkKnightPos(ikf, (kingc.Location.Rank) + 1);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }
        }
        ikf = kf - 2;
        if (ikf > 0) {
            if (kr > 1) {
                check = checkKnightPos(ikf, (kingc.Location.Rank) - 1);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }

            if (kr < 8) {
                check = checkKnightPos(ikf, (kingc.Location.Rank) + 1);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }
        }

        // Threat by: Knight
        var jkr = kr + 2;
        if (jkr < 9) {
            if (kf > 1) {
                check = checkKnightPos((kingc.Location.File) - 1, jkr);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }

            if (kf < 8) {
                check = checkKnightPos((kingc.Location.File) + 1, jkr);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }
        }
        jkr = kr - 2;
        if (jkr > 0) {
            if (kf > 1) {
                check = checkKnightPos((kingc.Location.File) - 1, jkr);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }

            if (kf < 8) {
                check = checkKnightPos((kingc.Location.File) + 1, jkr);
                if (check.obstruction) if (!check._break) return new CheckOponent(true, targetObstruction);
            }
        }

        return new CheckOponent(false, undefined);
    }

    CanMove(_this, tp) {
        var canMove = false;
        var x = _this.Location.File;
        var y = _this.Location.Rank;

        var _x = tp.File - _this.Location.File;
        var _y = tp.Rank - _this.Location.Rank;

        var _xabs = Math.abs(_x);
        var _yabs = Math.abs(_y);
        var obstruction = undefined;
        var targetObstruction1 = this.HasReplace(_this, tp);
        var targetObstruction = targetObstruction1.FPiece;
        var replacement = targetObstruction1.Found;
        if (!replacement && targetObstruction !== undefined) {
            // replace and same color obstruction
            return false;
        }

        var i = 0;
        var p = undefined;
        var hasObstruction = undefined;
        var nx = 0;
        var ny = 0;
        var max = 0;
        switch (_this.PieceType) {
            case Pieces.King:
                // Moves exactly one square horizontally, vertically, or diagonally
                // Castling only once per player (special)
                // _ _ _ _ _ 
                // _ y y y _ 
                // _ y x y _ 
                // _ y y y _ 
                // _ _ _ _ _ 
                canMove = (_xabs === 1 || _yabs === 1);
                if (canMove) {
                    ////
                }

                break;
            case Pieces.Queen:
                // Moves any number of vacant squares horizontally, vertically, or diagonally
                // y _ y _ y 
                // _ y y y _ 
                // y y x y y 
                // _ y y y _ 
                // y _ y _ y 
                canMove = (_xabs === _yabs && _xabs >= 1)
                    || (_xabs > 0 && _y === 0)
                    || (_yabs > 0 && _x === 0);
                if (canMove) {
                    if (_xabs == _yabs && _xabs >= 1) {
                        for (i = 0; i < _xabs; i++) {
                            nx = _x > 0 ? x + i + 1 : x - i - 1;
                            ny = _y > 0 ? y + i + 1 : y - i - 1;
                            p = new Placement(nx, ny);
                            obstruction = this.HasAnyObstruction(_this, p);
                            hasObstruction = obstruction !== undefined;
                            canMove = !hasObstruction || ((i === (_xabs - 1)) && replacement) || replacement;
                            if (!canMove && (i === (_xabs - 1) && replacement)) canMove = true;
                            if (canMove) {
                                ////
                            }
                            else {
                                break;
                            }
                        }
                    }
                    else if ((_xabs > 0 && _y === 0) || (_yabs > 0 && _x === 0)) {
                        max = _xabs > 0 ? _xabs : _yabs;
                        for (i = 0; i < max; i++) {
                            nx = _x == 0 ? x : _x > 0 ? x + i + 1 : x - i - 1;
                            ny = _y == 0 ? y : _y > 0 ? y + i + 1 : y - i - 1;
                            p = new Placement(nx, ny);
                            obstruction = this.HasAnyObstruction(_this, p);
                            hasObstruction = obstruction !== undefined;
                            canMove = !hasObstruction || ((i === (_xabs - 1)) && replacement) || replacement;
                            if (!canMove && (i === (max - 1) && replacement)) canMove = true;
                            if (canMove) {
                                ////
                            }
                            else {
                                break;
                            }
                        }
                    }
                }

                break;
            case Pieces.Rook:
                // Moves any number of vacant squares horizontally or vertically. 
                // Moved when castling.
                // _ _ y _ _
                // _ _ y _ _
                // y y x y y
                // _ _ y _ _
                // _ _ y _ _
                canMove = (_xabs > 0 && _y === 0)
                    || (_yabs > 0 && _x === 0);
                if (canMove) {
                    max = _xabs > 0 ? _xabs : _yabs;
                    for (i = 0; i < max; i++) {
                        nx = _x == 0 ? x : _x > 0 ? x + i + 1 : x - i - 1;
                        ny = _y == 0 ? y : _y > 0 ? y + i + 1 : y - i - 1;
                        p = new Placement(nx, ny);
                        obstruction = this.HasAnyObstruction(_this, p);
                        hasObstruction = obstruction !== undefined;
                        canMove = !hasObstruction || ((i === (_xabs - 1)) && replacement);
                        if (!canMove && (i === (max - 1) && replacement)) canMove = true;
                        if (canMove) {
                            ////
                        }
                        else {
                            break;
                        }
                    }
                }
                break;
            case Pieces.Bishop:
                // Moves any number of vacant squares diagonally
                // y _ _ _ + 
                // _ y _ y _ 
                // _ _ x _ _ 
                // _ y _ y _ 
                // y _ _ _ y 
                canMove = _xabs === _yabs && _xabs >= 1;
                if (canMove) {
                    for (i = 0; i < _xabs; i++) {
                        nx = _x > 0 ? x + i + 1 : x - i - 1;
                        ny = _y > 0 ? y + i + 1 : y - i - 1;
                        p = new Placement(nx, ny);
                        obstruction = this.HasAnyObstruction(_this, p);
                        hasObstruction = obstruction !== undefined;
                        canMove = !hasObstruction || ((i === (_xabs - 1)) && replacement);
                        if (!canMove && (i === (_xabs - 1) && replacement)) canMove = true;
                        if (canMove) {
                            ////
                        }
                        else {
                            break;
                        }
                    }
                }
                break;
            case Pieces.Kinght:
                // Moves to the nearest square not on the same rank, file, or diagonal.
                // _ y _ y _ 
                // y _ _ _ y 
                // _ _ x _ _ 
                // y _ _ _ y 
                // _ y _ y _ 
                canMove = (_x === 2 && _yabs === 1)
                    || (_x === -2 && _yabs === 1)
                    || (_y === 2 && _xabs === 1)
                    || (_y === -2 && _xabs === 1);
                if (canMove) {
                    ////
                }
                break;
            case Pieces.Pawn:
                // Placed one square in front of all of the other pieces.
                // _ _ ! _ _
                // _ ! y ! _
                // _ _ x _ _
                // _ _ _ _ _
                // _ _ _ _ _
                canMove = (!replacement && _x === 0 && (_y === (_this.Color === PieceColors.Black ? -1 : 1) || (_this.IsNeverMoved && _y === (_this.Color === PieceColors.Black ? -2 : 2))))
                    || (replacement && _xabs === 1 && _y === (_this.Color === PieceColors.Black ? -1 : 1));
                if (canMove) {
                    if (!replacement && _yabs === 2) {
                        ////
                    }
                    else {
                        ////
                    }
                }
                break;
        }

        return canMove;
    }

}

exports.Placement = Placement;
exports.Chess = Chess;
