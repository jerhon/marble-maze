import {MazeFile, MazeLoader} from "../maze/maze-loader";
import Phaser from "phaser"
import {MazeInfoLoader} from "../maze/maze-info-loader";

export const LOADING_SCENE = 'Loading';

export interface LoadingData
{
	id?: string,
	advance?: boolean
}

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

	public create(data: LoadingData): void {
		this.add.text(50, 50, 'LOADING...');

		this.loadMaze(data.id, data.advance)
			.then((maze) => this.scene.start('Game', maze))

	}

	private async loadMaze(maze: string, proceedToNext?: boolean): Promise<{ id: string, maze: MazeFile } | null> {
		let id = window.location.hash || maze || "starter"
		if (proceedToNext) {
			id = await this._infoLoader.getNextMazeId(id);
		}

		const mazeInfo = await this._infoLoader.getMazeInfoById(id);
		if (mazeInfo) {
			return { id, maze: await this._loader.loadMaze(mazeInfo.filename)}
		}

		return null;
	}
}
