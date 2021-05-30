import {MazeFile, MazeLoader} from "../maze/maze-loader";
import Phaser from "phaser"
import {MazeInfoLoader} from "../maze/maze-info-loader";


export const LOADING_SCENE = 'Loading';


const loadingConfig: Phaser.Types.Scenes.SettingsConfig = {
	active: false,
	visible: false,
	key: LOADING_SCENE
}

export class LoadingScene extends Phaser.Scene {

	private _loader = new MazeLoader()
	private _infoLoader = new MazeInfoLoader()

	constructor() {
		super(loadingConfig);
	}

	public create(): void {
		this.add.text(50, 50, 'LOADING...');

		this.loadMaze()
			.then((maze) => this.scene.start('Game', {maze}))

	}

	private async loadMaze(): Promise<MazeFile | null> {
		const id = window.location.hash || "starter"
		console.log(id)

		const mazeInfo = await this._infoLoader.getMazeInfoById(id);
		console.log(mazeInfo)

		if (mazeInfo) {
			return await this._loader.loadMaze(mazeInfo.filename);
		}

		return null;
	}
}
