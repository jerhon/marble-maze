
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
  
    public create(data: LoadingData) {
      let level = 1;
      if (data.level) {
        level = data.level;
      }
      let size = 9 + level;
      console.log('level', level, 'data', data);

      // Use the GitHub API to fetch the Maze Data
      fetch('https://api.noopschallenge.com/mazebot/random?minSize=' + size +  '&maxSize=' + size)
        .then((r) =>
          r.json().then((r1) => {
            console.log(r1);
            this.scene.start('Game', {maze: r1, level});
          })
        );
  
      this.add.text(50, 50, 'LOADING...');
    }
  
  }