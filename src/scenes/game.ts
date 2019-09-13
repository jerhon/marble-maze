import { Physics } from "phaser";


/**
 * This is the data type for the maze service.
 */
export interface Maze {
  name: string;
  mazePath: string;
  startingPosition: number[];
  endingPosition: number[];
  map: string[][];
}

export interface GameData {
  maze: Maze;
  level: number;
  timed: boolean;
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
  private marble1: Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } ;
  private marble2: Phaser.GameObjects.Arc  & { body : Phaser.Physics.Arcade.Body };
  private walls: Phaser.GameObjects.Group;
  private height: number;
  private width: number;
  private wallWidth: number;
  private wallHeight: number;
  private wallXOffset: number;
  private wallYOffset: number;
  private radius: number;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private beta: number = 0;
  private gamma: number = 0;
  private level: number = 0;
  private startTime: number;
  private timerText: Phaser.GameObjects.Text;
  private gameData: GameData;

  constructor() {
    super(sceneConfig);
  }
  
  public create(data: GameData) {
    this.gameData = data;
    if ((window as any).DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", this.deviceOrientationChanged.bind(this));
    }

    let maze = data.maze;
    this.level = data.level;

    this.cursorKeys = this.input.keyboard.createCursorKeys()

    this.height = Math.min(this.game.canvas.height, this.game.canvas.width);
    this.width = this.height;
    this.wallWidth = this.width / maze.map[0].length;
    this.wallHeight = this.height / maze.map.length;
    this.wallXOffset = this.wallWidth / 2;
    this.wallYOffset = this.wallHeight / 2;

    this.input.enabled = true;
    
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < maze.map.length; y++) {
      for (let x = 0; x < maze.map[y].length; x++) {
        if (maze.map[y][x] === 'X') {
          var coords = this.getCoordinates({x, y});
          this.walls.add(this.add.rectangle(coords.x, coords.y, this.wallWidth, this.wallHeight, 0xFFFFFF));
        }
      }
    }
    this.walls.add(this.add.rectangle(this.width / 2, this.height + this.wallYOffset, this.width, this.wallHeight, 0xFFFFFF));
    this.walls.add(this.add.rectangle(this.width + this.wallXOffset, this.height / 2, this.wallWidth, this.height, 0xFFFFFF));

    this.radius = Math.min( this.wallWidth / 3, this.wallHeight / 3);
    
    let startCoords = this.getCoordinates({x: maze.startingPosition[0], y: maze.startingPosition[1]});
    this.marble1 = this.add.circle(startCoords.x, startCoords.y, this.radius, 0xAAAAAA) as any;
    this.physics.add.existing(this.marble1);
    this.marble1.body.setCollideWorldBounds(true);
    this.marble1.body.setBounce(0.25, 0.25);
    this.marble1.body.setDrag(20, 20);

    let endCoords = this.getCoordinates({x: maze.endingPosition[0], y: maze.endingPosition[1]});
    this.marble2 = this.add.circle(endCoords.x, endCoords.y, this.radius, 0xFF0000) as any;
    this.physics.add.existing(this.marble2);
    this.marble2.body.setCollideWorldBounds(true);
    this.marble2.body.setBounce(0.15, 0.15);
    this.marble1.body.setDrag(20, 20);

    this.physics.add.collider([this.marble1, this.marble2], this.walls);
    let gameEndCollider = this.physics.add.overlap(this.marble1, this.marble2, this.gameEnd.bind(this));

    if (this.height < this.game.canvas.height) {
      this.timerText = this.add.text(20, this.height + this.wallHeight + 20, "" + this.time);
    } else {
      this.timerText = this.add.text(this.width + this.wallWidth + 20, 20, "" + this.time);
    }
    
    
  }

  gameEnd() {
    this.scene.start('Loading', {level: this.level+1});
  }

  getCoordinates(p: Point): Point {
    return { 
        x: p.x * this.wallWidth + this.wallXOffset, 
        y: p.y * this.wallHeight + this.wallYOffset 
      }
  }
  
  public update(time: number, delta: number) {
    if (!this.startTime) { 
      this.startTime = time;
    }

    // TODO: add motion of player, and end goal of combining the marbles
    for (let marble of [this.marble1, this.marble2]) {
      if (this.cursorKeys.down.isDown) {
        marble.body.setAccelerationY(20);
      } else if (this.cursorKeys.up.isDown) {
        marble.body.setAccelerationY(-20);
      } else {
        marble.body.setAccelerationY( (this.beta / 180) * 100 );
        ;
      } 
      
      if (this.cursorKeys.left.isDown) {
        marble.body.setAccelerationX(-20);
      } else if (this.cursorKeys.right.isDown) {
        marble.body.setAccelerationX(20);
      } else {
        marble.body.setAccelerationX( (this.gamma / 180) * 100 )
      }
    }

    let timeOffset = Math.floor((time - this.startTime) / 1000);
    let overallTime = this.gameData.timed ? 30 - timeOffset : timeOffset;
    this.timerText.setText("" + overallTime);

    if (time - this.startTime > 30000) {
      // Game over
    }
  }

  public deviceOrientationChanged(evt: DeviceOrientationEvent) {
    this.beta = evt.beta;
    this.gamma = evt.gamma;
  }
}