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

  augmentSprites(maze: string[][]) {
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] == 'X') {
          if (y > 0 && maze[y - 1][x] == 'X') {
            maze[y][x] = 'N';
          }
          if (y < maze.length - 1 && maze[y + 1][x] == 'X') {
            maze[y][x] = maze[y][x].concat('S');
          }
          if (x > 0 && maze[y][x - 1] == 'X') {
            maze[y][x] = maze[y][x].concat('W');
          }
          if (x < maze.length - 1 && maze[y][x + 1] == 'X') {
            maze[y][x] = maze[y][x].concat('E');
          }
        }
        if (maze[y][x].startsWith('X') && maze[y][x].length > 1) {
          maze[y][x] = maze[y][x].substr(1);
        }
      }
    }
  }
}