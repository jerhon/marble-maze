import {SceneManager} from "./scene-manager";
import Phaser from "phaser"


export const MENU_SCENE = 'Menu';

const menuConfig: Phaser.Types.Scenes.SettingsConfig = {
	active: false,
	visible: false,
	key: MENU_SCENE
}

export class MenuScene extends Phaser.Scene {

	currentOption = 0;
	options = [
		'New Game',
		'About'
	]
	menuOptions: Phaser.GameObjects.Text[] = [];
	private stateMachine: SceneManager;

	constructor() {
		super(menuConfig);

		this.stateMachine = new SceneManager(this);
	}

	public create(): void {
		if (window.location.hash) {
			this.stateMachine.startLoadingLevel();
		}

		let top = 0;
		const title = this.add.text(25, 25, 'Marble Maze', {fontSize: '50px', align: 'center'});
		title.setWordWrapWidth(this.game.canvas.width - 20, true);
		title.setFixedSize(this.game.canvas.width - 20, 0);

		top += 100;
		top += 50;

		for (const opt of this.options) {
			const optText = this.add.text(10, top, opt, {
				fontSize: '40px',
				fontFamily: 'Arial',
				color: '#ffffff',
				align: 'center',
			});
			optText.setWordWrapWidth(this.game.canvas.width - 20, true);
			optText.setFixedSize(this.game.canvas.width - 20, 0);

			optText.setInteractive();
			const callback = ((v1) => () => this.optionPicked(v1))(opt)
			optText.on('pointerup', callback);
			this.menuOptions.push(optText);
			top += 80;

			optText.on('pointerover', () => {
				this.currentOption = this.options.indexOf(opt);
			});
			optText.on('pointerdown', () => {
				this.optionPicked(opt);
			})
		}
		top += 50;

		const directions = this.add.text(25, top, 'Lead the marble through the maze.  Hold the phone flat in relation to the ground. Tilt your phone to move the marble through the maze. If your using a browser, use the arrow keys.', {fontSize: '30px'});
		directions.setWordWrapWidth(this.game.canvas.width - 50, true);
	}

	public optionPicked(option: string): void {
		switch (option) {
		case "New Game":
			this.stateMachine.startLoadingLevel();
			//this.scale.startFullscreen()
			break;
		case "Timed Game":
			this.stateMachine.startLoadingLevel();
			break;
		}
	}

	public update(time: number): void {
		for (let i = 0; i < this.menuOptions.length; i++) {
			if (i != this.currentOption) {
				this.menuOptions[i].alpha = 1;
			}
		}
		this.menuOptions[this.currentOption].alpha = 1 - (time % 750) / 750;
	}

}
