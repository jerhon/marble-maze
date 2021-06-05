import {SceneManager} from "./scene-manager";
import {MazeBuilder} from "../maze/maze-builder";
import {MazeFile} from "../maze/maze-loader";
import Phaser from "phaser"


export interface GameData {
	id: string;
	maze: MazeFile;
}

export const GAME_SCENE = 'Game';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
	active: false,
	visible: false,
	key: GAME_SCENE,
};

export class GameScene extends Phaser.Scene {
	maze: MazeBuilder;
	private marble1: Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
	private endSquare: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
	private walls: Phaser.GameObjects.Group;
	private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
	private dimensions: { stage: number };
	private beta = 0;
	private gamma = 0;
	private gameData: GameData;
	private sceneManager: SceneManager;
	private pointer: Phaser.Input.Pointer;

	constructor() {
		super(sceneConfig);
	}


	public preload(): void {
		this.load.image('wall', 'assets/wall.jpg');
	}

	public create(data: GameData): void {

		this.gameData = data;
		this.sceneManager = new SceneManager(this);
		if ((window as any).DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", this.deviceOrientationChanged.bind(this));
		}

		this.cursorKeys = this.input.keyboard.createCursorKeys()
		this.pointer = this.input.pointer1;

		this.input.enabled = true;

		// calculate the dimensions for positioning
		const dimensions = this.calculateDimensions(this.gameData.maze.rows[0].length);
		this.dimensions = dimensions;

		this.maze = new MazeBuilder(this.gameData.maze, dimensions.wall, 0, 0);
		const {walls} = this.maze.addWalls(this);
		this.walls = walls;

		this.marble1 = this.createMarble(dimensions.marble);
		this.endSquare = this.createEndSquare(dimensions.wall);

		this.physics.add.collider(this.marble1, this.walls);
		this.physics.add.overlap(this.marble1, this.endSquare, this.nextLevel.bind(this));
	}

	/** Calculates dimensions needed to place game sprites and assets */
	calculateDimensions(tileCount: number): {stage: number, wall: number, marble: number} {
		const stage = Math.min(+this.game.config.height, +this.game.config.width);
		const wall = Math.ceil(stage / tileCount);
		const marble = Math.floor(wall / 4);
		return {stage, wall, marble}
	}


	/** Creates a marble. */
	createMarble(marbleRadius: number): Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body } {
		const {x, y} = this.maze.getStartPosition();
		const marble = this.add.rectangle(x, y, marbleRadius, marbleRadius, 0xFF0000) as any;
		const ret = this.physics.add.existing(marble) as Phaser.GameObjects.Arc & { body: Phaser.Physics.Arcade.Body };
		ret.body.setCollideWorldBounds(true);
		ret.body.setBounce(0.6, 0.6);
		ret.body.setDrag(5, 5);
		return marble;
	}

	createEndSquare(wallSize: number): Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body } {
		const {x, y} = this.maze.getEndPosition();
		const end = this.add.rectangle(x, y, wallSize, wallSize, 0xFF3300);
		this.physics.add.existing(end, true);
		return end as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
	}

	/** Moves to the next maze. */
	nextLevel(): void {
		this.sceneManager.nextLevel(this.gameData.id);
	}

	processKeyInput(): boolean {
		const marble = this.marble1;
		let processed = false;
		if (this.cursorKeys.right.isDown) {
			marble.body.setAccelerationX(50);
			processed = true;
		}
		else if (this.cursorKeys.left.isDown) {
			marble.body.setAccelerationX(-50)
			processed = true;
		}
		if (this.cursorKeys.down.isDown) {
			marble.body.setAccelerationY(50)
			processed = true;
		}
		else if (this.cursorKeys.up.isDown) {
			marble.body.setAccelerationY(-50)
			processed = true;
		}
		return processed;
	}

	processPointerInput(): boolean {
		if (this.pointer.isDown) {
			const marble = this.marble1;
			const halfStage = this.dimensions.stage / 2;
			marble.body.setAccelerationY((halfStage - this.pointer.y) / halfStage * -100);
			marble.body.setAccelerationX((halfStage - this.pointer.x) / halfStage * -100);
			return true;
		}
		return false;
	}

	processDeviceOrientationInput():void {
		const marble = this.marble1;
		marble.body.setAccelerationY((this.beta / 180) * 150);
		marble.body.setAccelerationX((this.gamma / 180) * 150)
	}

	updateInputs(): void {
		let processed = false;
		if (!processed) {
			processed = this.processKeyInput();
		}
		if (!processed) {
			processed = this.processPointerInput();
		}
		if (!processed) {
			this.processDeviceOrientationInput()
		}
	}

	/** Update for a single frame. */
	update(): void {
		this.updateInputs();
	}

	public deviceOrientationChanged(evt: DeviceOrientationEvent): void {
		this.beta = evt.beta;
		this.gamma = evt.gamma;
	}
}
