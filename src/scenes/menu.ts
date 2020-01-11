import { GameStateMachine } from "./gameStateMachine";

export const MENU_SCENE = 'Menu';

const menuConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: MENU_SCENE
}

export class MenuScene extends Phaser.Scene {

    private stateMachine: GameStateMachine;
    currentOption = 0;

    constructor() {
        super(menuConfig);

        this.stateMachine = new GameStateMachine(this);
    }

    options = [
        'New Game',
        'About'
    ]
    menuOptions: Phaser.GameObjects.Text[] = [];

    public create() {
        let top = 0;
        this.add.text(25, 25, 'Marble Maze', { fontSize: '50px' });
        top += 85;
        top += 50;

        let idx = 0;
        for (let opt of this.options) {           
            let optText = this.add.text(10, top, opt, {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
            });
            optText.setWordWrapWidth(this.game.canvas.width - 20, true);
            optText.setFixedSize(this.game.canvas.width - 20, 0);

            optText.setInteractive();
            var callback = ((v1) => (pointer, gameObject) => this.optionPicked(v1))(opt)
            optText.on('pointerup', callback);
            this.menuOptions.push(optText);
            top += 80;

            optText.on('pointerover', (pointer: Phaser.Input.Pointer) => {
                this.currentOption = this.options.indexOf(opt);
            });
            optText.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                this.optionPicked(opt);
            })
        }
        top += 50;

        var directions = this.add.text(25, top, 'Lead the marble through the maze.  Hold the phone flat in relation to the ground. Tilt your phone to move the marble through the maze.');
        directions.setWordWrapWidth(this.game.canvas.width - 50, true);
    }

    public optionPicked(option: string) {
        switch (option) {
            case "New Game":
                this.stateMachine.startLoadingLevel({})
                break;
            case "Timed Game":
                this.stateMachine.startLoadingLevel({})
                break;
        }
    }

    public update(time: number, delta: number) {
        for (let i = 0; i < this.menuOptions.length; i++) {
            if (i != this.currentOption) {
                this.menuOptions[i].alpha = 1;
            }
        }
        this.menuOptions[this.currentOption].alpha = 1 - (time % 750) / 750;
    }

}