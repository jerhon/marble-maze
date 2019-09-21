
export const MESSAGE_SCENE = "Message";

export interface MessageData {
    message: string;
    nextScene: string;
    nextSceneData: any;
}

const menuConfig : Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: MESSAGE_SCENE
}

export class MessageScene extends Phaser.Scene {

    constructor() {
        super(menuConfig);
    }

    create(data: MessageData) {
        var height = this.game.canvas.height;
        var width = this.game.canvas.width;
        this.add.text(20, height / 2, data.message, { fontSize: '32px', color: '#fff' });

        var rect = this.add.rectangle(width / 2, height - 100, 100, 50, 0x553322);
        rect.setInteractive();
        rect.on('pointerdown', (scene, gameObj: Phaser.GameObjects.Text) => {
            this.scene.start(data.nextScene, data.nextSceneData);
        });
    }
    
}