import { GameData, GAME_SCENE } from "./game";
import { MessageData, MESSAGE_SCENE } from "./message";
import { LoadingData, LOADING_SCENE } from "./loading";
import { MENU_SCENE } from "./menu";


export class GameStateMachine {

    constructor(private readonly game: Phaser.Scene) { }

    startLoading(data: LoadingData) {
        this.game.scene.start(LOADING_SCENE, data);
    }

    startGame(data: GameData) {
        this.game.scene.start(GAME_SCENE, data);
    }

    startMenu() {
        this.game.scene.start(MENU_SCENE);
    }

    startMessage(data: MessageData) {
        this.game.scene.start(MESSAGE_SCENE, data);
    }

    startLose() {
        this.startMessage({ message: 'You Lost!', nextScene: 'Menu', nextSceneData: {} });
    }
}