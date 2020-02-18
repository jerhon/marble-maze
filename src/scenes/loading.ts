export const LOADING_SCENE = 'Loading';

/** This is the data type for the maze service. */
export interface MazeResponse {
  name: string;
  mazePath: string;
  startingPosition: number[];
  endingPosition: number[];
  map: string[][];
}

const loadingConfig: Phaser.Types.Scenes.SettingsConfig = {
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
  sizes = [10, 20, 30, 40, 60, 100, 120, 150, 200];

  public create(data: LoadingData) {

    // Use the GitHub API to fetch the Maze Data
    fetch('https://api.noopschallenge.com/mazebot/random?minSize=20&maxSize=20')
      .then((r) =>
        r.json().then((r1: MazeResponse) => {
          this.addPerimiter(r1.map);
          //this.augmentSprites(r1.map);
          this.scene.start('Game', { maze: r1 });
        })
      );

    this.add.text(50, 50, 'LOADING...');
  }

  addPerimiter(maze: string[][]) {
    maze.forEach((x) => {
      x.push('X');
      x.unshift('X');
    });
    maze.unshift(Array.from('X'.repeat(maze[0].length)));
    maze.push(Array.from('X'.repeat(maze[0].length)));
    return maze;
  }

  
}