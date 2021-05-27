import {MazeLoader} from "../maze/maze-loader";
import Phaser from "phaser"


export const LOADING_SCENE = 'Loading';


const loadingConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: LOADING_SCENE
}

export interface LoadingData {
}

export class LoadingScene extends Phaser.Scene {

  private _loader = new MazeLoader()

  constructor() {
    super(loadingConfig);
  }

  public create(data: LoadingData) {

    this._loader.loadMaze("maze1.txt")
        .then((maze) => {
          this.scene.start('Game', { maze});
        })

    this.add.text(50, 50, 'LOADING...');
  }
}
