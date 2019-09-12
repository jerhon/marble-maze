
const loadingConfig : Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Loading'
}

export interface LoadingData {
  level: number;
}

export class LoadingScene extends Phaser.Scene {
    constructor() {
      super(loadingConfig);  
    }
    sizes = [10,20,30,40,60,100,120,150,200];
  
    public create(data: LoadingData) {
      let level = 0;
      if (data.level) {
        level = data.level;
      }
      let size = this.sizes[level % this.sizes.length];
      console.log('level', level, 'data', data);

      // Use the GitHub API to fetch the Maze Data
      fetch('https://api.noopschallenge.com/mazebot/random?minSize=' + size +  '&maxSize=' + size)
        .then((r) =>
          r.json().then((r1) => {
            console.log('level', level);
            this.scene.start('Game', {maze: r1, level});
          })
        );
  
      this.add.text(50, 50, 'LOADING...');
    }
  
  }