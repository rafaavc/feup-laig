
class MyGameState {
    constructor(scene, game) {
		if (this.constructor == MyGameState) {
			throw new Error("MyGameState is an abstract class. Abstract classes can't be instantiated.");
        }
        this.scene = scene;
        this.game = game;
    }

    update(timeSinceProgramStarted) {}
}

