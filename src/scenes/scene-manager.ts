import {GameData, GAME_SCENE} from "./game";
import {MessageData, MESSAGE_SCENE} from "./message";
import {LOADING_SCENE} from "./loading";
import {MENU_SCENE} from "./menu";
import Phaser from "phaser"

export class SceneManager {

	constructor(private readonly scene: Phaser.Scene) {
	}

	startLoadingLevel(): void {
		this.scene.scene.stop();
		this.scene.scene.start(LOADING_SCENE);
	}

	startLevel(data: GameData): void {
		this.scene.scene.stop();
		this.scene.scene.start(GAME_SCENE, data);
	}

	startMenu(): void {
		this.scene.scene.stop();
		this.scene.scene.start(MENU_SCENE);
	}

	startMessage(data: MessageData): void {
		this.scene.scene.stop();
		this.scene.scene.start(MESSAGE_SCENE, data);
	}

	startLose(): void {
		this.startMessage({message: 'You Lost!', nextScene: 'Menu', nextSceneData: {}});
	}
}
