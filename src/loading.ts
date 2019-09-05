
const loadingConfig : Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Loading'
}

export class LoadingScene extends Phaser.Scene {
    constructor() {
      super(loadingConfig);  
    }
  
    public create() {
  
      // Use the GitHub API to fetch the Maze Data
      fetch('https://api.noopschallenge.com/mazebot/random?maxSize=40')
        .then((r) =>
          r.json().then((r1) => {
            console.log(r1);
            this.scene.start('Game', r1);
          })
        );
  
      this.add.text(50, 50, 'LOADING...');
    }
  
  }