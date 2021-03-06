import Phaser from "phaser"

export const MESSAGE_SCENE = "Message";

export interface MessageData {
	message: string;
	nextScene: string;
	nextSceneData: any;
}

const menuConfig: Phaser.Types.Scenes.SettingsConfig = {
	active: false,
	visible: false,
	key: MESSAGE_SCENE
}

export class MessageScene extends Phaser.Scene {

	constructor() {
		super(menuConfig);
	}

	create(data: MessageData): void {
		const height = this.game.canvas.height;
		const width = this.game.canvas.width;
		this.add.text(20, height / 2, data.message, {fontSize: '32px', color: '#fff'});

		const rect = this.add.rectangle(width / 2, height - 100, 100, 50, 0x553322);
		rect.setInteractive();
		rect.on('pointerdown', () => {
			this.scene.start(data.nextScene, data.nextSceneData);
		});
	}
}
