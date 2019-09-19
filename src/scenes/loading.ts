
export const LOADING_SCENE = 'Loading';

const loadingConfig : Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: LOADING_SCENE
}

export interface LoadingData {
}

export class LoadingScene extends Phaser.Scene {
    constructor() {
      super(loadingConfig);  
    }
    sizes = [10,20,30,40,60,100,120,150,200];
  
    public create(data: LoadingData) {

      // Use the GitHub API to fetch the Maze Data
      fetch('https://api.noopschallenge.com/mazebot/random?minSize=20&maxSize=20')
        .then((r) =>
          r.json().then((r1) => {
            this.scene.start('Game', {maze: r1});
          })
        );
  
      this.add.text(50, 50, 'LOADING...');
    }
  
  }