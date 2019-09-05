import { Physics } from "phaser";


/**
 * This is the data type for the maze service.
 */
export interface maze {
  name: string;
  mazePath: string;
  startingPosition: number[];
  endingPosition: number[];
  map: string[][];
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

interface Point {
  x: number;
  y: number;
}

export class GameScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Arc ;
  private end: Phaser.GameObjects.Arc;
  private walls: Phaser.GameObjects.Group;
  private height: number;
  private width: number;
  private wallWidth: number;
  private wallHeight: number;
  private wallXOffset: number;
  private wallYOffset: number;
  private radius: number;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super(sceneConfig);
  }
  
  public create(data: maze) {
    this.cursorKeys = this.input.keyboard.createCursorKeys()

    this.height = this.game.canvas.height;
    this.width = this.game.canvas.width;
    this.wallWidth = this.width / data.map[0].length;
    this.wallHeight = this.height / data.map.length;
    this.wallXOffset = this.wallWidth / 2;
    this.wallYOffset = this.wallHeight / 2;

    this.input.enabled = true;
    
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < data.map.length; y++) {
      for (let x = 0; x < data.map[y].length; x++) {
        if (data.map[y][x] === 'X') {
          var coords = this.getCoordinates({x, y});
          this.walls.add(this.add.rectangle(coords.x, coords.y, this.wallWidth, this.wallHeight, 0xFFFFFF));
        }
      }
    }

    this.radius = Math.min( this.wallWidth / 3, this.wallHeight / 3);
    
    let startCoords = this.getCoordinates({x: data.startingPosition[0], y: data.startingPosition[1]});
    this.player = this.add.circle(startCoords.x, startCoords.y, this.radius, 0xAAAAAA);

    let endCoords = this.getCoordinates({x: data.endingPosition[0], y: data.endingPosition[1]});
    this.end = this.add.circle(endCoords.x, endCoords.y, this.radius, 0xFF0000);
  }

  getCoordinates(p: Point): Point {
    return { 
        x: p.x * this.wallWidth + this.wallXOffset, 
        y: p.y * this.wallHeight + this.wallYOffset 
      }
  }
  
  public update(time: number, delta: number) {
    // TODO: add motion of player, and end goal of combining the marbles
    
  }
}