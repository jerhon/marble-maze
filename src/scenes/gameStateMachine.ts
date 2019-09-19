import { GameData, GAME_SCENE } from "./game";
import { MessageData, MESSAGE_SCENE } from "./message";
import { LoadingData, LOADING_SCENE } from "./loading";
import { MENU_SCENE } from "./menu";


export class GameStateMachine {

    constructor(private readonly scene: Phaser.Scene) { }

    startLoadingLevel(data: LoadingData) {
        this.scene.scene.stop();
        this.scene.scene.start(LOADING_SCENE, data);
    }

    startLevel(data: GameData) {
        this.scene.scene.stop();
        this.scene.scene.start(GAME_SCENE, data);
    }

    startMenu() {
        this.scene.scene.stop();
        this.scene.scene.start(MENU_SCENE);
    }

    startMessage(data: MessageData) {
        this.scene.scene.stop();
        this.scene.scene.start(MESSAGE_SCENE, data);
    }

    startLose() {
        this.startMessage({ message: 'You Lost!', nextScene: 'Menu', nextSceneData: {} });
    }
}