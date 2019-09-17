import { Physics } from "phaser";
import { GameStateMachine } from "./gameStateMachine";


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

export const GAME_SCENE = 'Game';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: GAME_SCENE,
};

interface Point {
  x: number;
  y: number;
}

export class GameScene extends Phaser.Scene {
  private marble1: Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } ;
  private endSquare: Phaser.GameObjects.Rectangle  & { body : Phaser.Physics.Arcade.Body };
  private walls: Phaser.GameObjects.Group;

  
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  
  private beta: number = 0;
  private gamma: number = 0;


  private level: number = 0;
  private startTime: number;
  private timerText: Phaser.GameObjects.Text;
  private gameData: GameData;
  private stateMachine: GameStateMachine;

  private wallDim : {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  };
  private marbleDim : {
    radius: number;
  }
  private stageDim : {
    height: number;
    width: number;
    centerX: number;
    centerY: number;
  };
  private openDim : {
    x: number;
    y: number,
    height: number;
    width: number;
  }

  constructor() {
    super(sceneConfig);
  }
  


  public create(data: GameData) {

    this.gameData = data;
    this.stateMachine = new GameStateMachine(this);
    if ((window as any).DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", this.deviceOrientationChanged.bind(this));
    };

    this.cursorKeys = this.input.keyboard.createCursorKeys()

    const maze = this.gameData.maze;

    
    this.input.enabled = true;
    
    
    // calculate the dimensions for positioning
    this.calculateDimensions(data.maze.map.length);

    // create everything else
    this.createWalls(maze);
    this.createAside();   

    let startCoords = this.getCoordinates({x: maze.startingPosition[0], y: maze.startingPosition[1]});
    let endCoords = this.getCoordinates({x: maze.endingPosition[0], y: maze.endingPosition[1]});
    this.marble1 = this.createMarble(startCoords.x, startCoords.y);
    this.endSquare = this.createEndSquare(endCoords.x, endCoords.y);

    this.physics.add.collider([this.marble1, this.endSquare], this.walls);
    let gameEndCollider = this.physics.add.overlap(this.marble1, this.endSquare, this.nextLevel.bind(this));

    
    this.startTime = 0;
  }

  /** Calculates dimensions needed to place game sprites and assets */
  calculateDimensions(boxes: number) {
    const stageDim = Math.min(this.game.canvas.height, this.game.canvas.width);
    const wallDim = stageDim / boxes;

    this.stageDim = {
      height: stageDim,
      width: stageDim,
      centerX: stageDim / 2,
      centerY: stageDim / 2
    }

    this.wallDim = {
      width: wallDim,
      height: wallDim,
      offsetX: wallDim / 2,
      offsetY: wallDim / 2,
    }

    this.marbleDim = { 
      radius: Math.min( (wallDim / 2) / 2 )
    }

    const y = this.stageDim.height + this.wallDim.height;
    const x = this.stageDim.width + this.wallDim.width;

    if (this.game.canvas.height > this.game.canvas.width) {
      this.openDim = {
        x: 0,
        y: this.stageDim.height + this.wallDim.height,
        height: this.game.canvas.height - y,
        width: this.game.canvas.width
      }
    } else {
      this.openDim = {
        x: this.stageDim.width + this.wallDim.width,
        y: 0,
        height: this.game.canvas.height,
        width: this.game.canvas.width - x
      }
    }
    
  }

  /** Creates the walls for the game. */
  createWalls(maze: Maze) {
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < maze.map.length; y++) {
      for (let x = 0; x < maze.map[y].length; x++) {
        if (maze.map[y][x] === 'X') {
          var coords = this.getCoordinates({x, y});
          this.walls.add(this.add.rectangle(coords.x, coords.y, this.wallDim.width, this.wallDim.height, 0xFFFFFF));
        }
      }
    }
    this.walls.add(this.add.rectangle(this.stageDim.centerX, this.stageDim.height + this.wallDim.offsetY, this.stageDim.width, this.wallDim.height, 0xFFFFFF));
    this.walls.add(this.add.rectangle(this.stageDim.width + this.wallDim.offsetX, this.stageDim.centerY, this.wallDim.width, this.stageDim.height, 0xFFFFFF));
  }

  /** Creates the aside section of the game. */
  createAside() {
    this.timerText = this.add.text(this.openDim.x + 20, this.openDim.y + 20, "");
    
  }

  /** Creates a marble. */
  createMarble(x: number, y: number) : Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } {
    let marble = this.add.circle(x, y, this.marbleDim.radius, 0xFF0000) as any;
    let obj = this.physics.add.existing(marble);
    marble.body.setCollideWorldBounds(true);
    marble.body.setBounce(0.25, 0.25);
    marble.body.setDrag(20, 20);
    let ret = marble as Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body };
    ret.body.setCircle(this.marbleDim.radius);
    return ret;
  }

  createEndSquare(x: number, y: number) :  Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } {
    let end = this.add.rectangle(x, y, this.wallDim.width, this.wallDim.height, 0xFF3300);
    this.physics.add.existing(end, true);
    return end as Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } ;
  }

  /** Moves to the next level. */
  nextLevel() {
    this.stateMachine.startLoading({timed : this.gameData.timed, level: this.level + 1});
  }

  /** Gets Phaser coordinates relative to the game grid. */
  getCoordinates(p: Point): Point {
    return { 
        x: p.x * this.wallDim.width + this.wallDim.offsetX, 
        y: p.y * this.wallDim.height + this.wallDim.offsetY 
      }
  }

  /** Update the motion of objects when a frame tick occurs. */
  updateMotion() {
    for (let marble of [this.marble1]) {
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

  }

  /** Update the time on the game. */
  updateTime(time: number) {
    if (!this.startTime) { 
      this.startTime = time;
    }

    // TODO: add motion of player, and end goal of combining the marbles
    
    let timeOffset = Math.floor((time - this.startTime) / 1000);
    let overallTime = this.gameData.timed ? 30 - timeOffset : timeOffset;
    this.timerText.setText("" + overallTime);

    if (this.gameData.timed) {
      if (overallTime <= 5) {
        this.timerText.setColor('0xFF3300');
      }

      if (overallTime <= 0) {
        this.stateMachine.startLose();
      }
    }
  }

  /** Update for a single frame. */
  public update(time: number, delta: number) {
    this.updateMotion();
    this.updateTime(time);
  }

  public deviceOrientationChanged(evt: DeviceOrientationEvent) {
    this.beta = evt.beta;
    this.gamma = evt.gamma;
  }
}