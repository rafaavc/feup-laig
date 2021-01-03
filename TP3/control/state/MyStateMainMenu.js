class MyStateMainMenu extends MyState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.scene.setMenuCamera();
        this.scene.initSceneGraph(this.scene.menus);

        this.menuController = new MyMenuController(scene, this);

        const mainMenuNode = scene.menus.nodes["mainMenu"];
        this.menus = {
            main: mainMenuNode.getLeafNode("main"),
            difficulty: mainMenuNode.getLeafNode("difficulty"),
            choosePlayer: mainMenuNode.getLeafNode("choosePlayer")
        };
        
        this.gameMode = null;
        this.chosePlayer = null;
    }

    display() {
        if (this.chosePlayer) this.menus.difficulty.display();
        else if (this.gameMode) this.menus.choosePlayer.display();
        else this.menus.main.display();
    }

    update() {
        this.menuController.update();
    }

    /* ACTIONS */

    goBack() {
        if (this.chosePlayer) {
            if (this.gameOrchestrator.strategy instanceof MyMvMStrategy)
                this.gameMode = null;
            else
                this.setPlayerColor(null);
            this.chosePlayer = null;
        }
        else if (this.gameMode) {
            this.setGameStrategy(null);
            this.gameMode = null;
        } 
    }

    advance(difficulty) {
        // HvM and MvM
        if (difficulty)
            this.gameOrchestrator.setStrategyDifficulty(difficulty);
        
        this.scene.setGameCamera();
        this.gameOrchestrator.setState(new MyStatePlaying(this.scene, this.gameOrchestrator));
    }

    setPlayerColor(color) {
        this.gameOrchestrator.setPlayerColor(color);
        this.chosePlayer = true;
    }

    setGameStrategy(strategy) {
        this.gameOrchestrator.setPlayingStrategy(strategy);
        this.gameMode = true;
        if (strategy instanceof MyMvMStrategy) this.chosePlayer = true;
    }
}