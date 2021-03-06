/**
 * @class MyStatePiecePicked
 * State of the game where the player has already picked the piece he wants to move
 * Responsible getting the player move
 * @param {MyScene} scene
 * @param {MyGame} game
 * @param {Object} piece Picked piece
 * @param {Array} possibleMoves Array of possible moves associated to the picked piece
 */
class MyStatePiecePicked extends MyGameState {
    constructor(scene, game, piece, possibleMoves) {
        super(scene, game);
        this.piece = piece;
        this.possibleMoves = possibleMoves;
    }

    /**
     * @method update Interprets player picking
     * Waits for user input
     * Once the move is obtained sends server requests to perform move
     * @param timeSinceProgramStarted
     */
    update(timeSinceProgramStarted) {
        console.log('waiting for place');

		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (let i = 0; i < this.scene.pickResults.length; i++) {

					const obj = this.scene.pickResults[i][0];
                    const id = this.scene.pickResults[i][1];

                    // verify if picked object is a tile
                    if (id <= 81) {
                        if (this.pickTile(id, timeSinceProgramStarted)) {
                            this.scene.discardPickResults();
                            return;
                        }
                    }
                    // reset piece selection otherwise 
                    else {
                        this.game.setState(new MyStateWaiting(this.scene, this.game, this.possibleMoves));
                        this.resetPossibleMoves();
                        return;
                    }
                }
                this.scene.discardPickResults();
            }
        }
    }

    /**
     * @method resetPossibleMoves
     * resets the possible moves array associated to state
     */
    resetPossibleMoves() {
        this.game.board.setPossibleMoves(null);
    }

    /**
     * @method pickTile
     * Interprets user input and sends server request with selected move
     */
    pickTile(id, timeSinceProgramStarted) {
        const startPos = this.piece.position;
        const endPos = { x: ((id-1)%9)+1, z: Math.floor((id-1)/9)+1 };

        if (isNaN(endPos.x) || isNaN(endPos.z)) return false;

        const move = this.isValidMove(startPos, endPos, this.piece);
        if (!move) return false;

        const pieceMovement = MyStateMoving.createPieceMovingState(this.scene, this.game, this.piece, timeSinceProgramStarted, startPos, endPos);

        // send server request (move)
        this.game.makeWaitingForStateUpdate();
        this.game.connection.applyMove(this.game.prologGameState, move, function(res) {
            this.game.prologGameState = { player: res.player, npieces: res.npieces, gameBoard: res.gameBoard, gameOver: res.gameOver };
            this.game.stopWaitingForStateUpdate();
        }.bind(this));

        this.game.setState(pieceMovement);
        this.resetPossibleMoves();

        return true;
    }

    /**
     * @method isValidMove
     * Given start and end position, verifies if move is valid
     * @param {Object} startPos Intial position of the piece animation
     * @param {Object} endPos Final position of the piece animation
     */
    isValidMove(startPos, endPos, piece) {
        console.log(piece.id);
        return this.possibleMoves.find(function(move) {
            const initial = move.initial;
            const final = move.final;

            return initial.x == startPos.x && initial.z == startPos.z &&
                final.x == endPos.x && final.z == endPos.z;
        });
    }
}