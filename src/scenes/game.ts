import { GameStateMachine } from "./gameStateMachine";
import { MazeResponse } from "./loading";

export interface GameData {
  maze: MazeResponse;
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
  

  public preload() {
    this.load.image('wall', 'assets/wall.jpg' );
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

    let startCoords = this.getCoordinates({x: maze.startingPosition[0]+1, y: maze.startingPosition[1]+1});
    let endCoords = this.getCoordinates({x: maze.endingPosition[0]+1, y: maze.endingPosition[1]+1});
    this.marble1 = this.createMarble(startCoords.x, startCoords.y);
    this.endSquare = this.createEndSquare(endCoords.x, endCoords.y);

    this.physics.add.collider(this.marble1, this.walls);
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

    if (this.game.canvas.height > this.game.canvas.width) {
      this.openDim = {
        x: 0,
        y: this.stageDim.height,
        height: this.game.canvas.height - this.stageDim.height,
        width: this.game.canvas.width
      }
    } else {
      this.openDim = {
        x: this.stageDim.width + this.wallDim.width,
        y: 0,
        height: this.game.canvas.height,
        width: this.game.canvas.width - this.stageDim.width
      }
    }
  }

  /** Creates the walls for the game. */
  createWalls(maze: MazeResponse) {
    this.walls = this.physics.add.staticGroup();
    for (let y = 0; y < maze.map.length; y++) {
      for (let x = 0; x < maze.map[y].length; x++) {
        let c = maze.map[y][x];
        if (c != ' ' && c != 'A') {
          var coords = this.getCoordinates({x, y});
          let wall = this.physics.add.staticImage(coords.x, coords.y, 'wall');
          
          // This was super tricky to get right, the image doesn't enable the body, and setting the display size
          // doesn't alter the size of the body on the static image.
          wall.setDisplaySize(this.wallDim.width, this.wallDim.height);
          wall.enableBody(true, coords.x, coords.y, true, true);
          wall.body.setSize(this.wallDim.width, this.wallDim.height);
          wall.body.immovable = true;
          
          this.walls.add(wall);
        }
      }
    }
  }

  /** Creates the aside section of the game. */
  createAside() {
    this.timerText = this.add.text(this.openDim.x + 20, this.openDim.y + 20, "");
  }

  /** Creates a marble. */
  createMarble(x: number, y: number) : Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body } {
    let marble = this.add.circle(x, y, this.marbleDim.radius, 0xFF0000) as any;
    let ret = this.physics.add.existing(marble) as Phaser.GameObjects.Arc & { body : Phaser.Physics.Arcade.Body };
    ret.body.setCollideWorldBounds(true);
    ret.body.setBounce(0.5, 0.5);
    ret.body.setDrag(10, 10);
    return ret;
  }

  createEndSquare(x: number, y: number) :  Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } {
    let end = this.add.rectangle(x, y, this.wallDim.width, this.wallDim.height, 0xFF3300);
    this.physics.add.existing(end, true);
    return end as Phaser.GameObjects.Rectangle & { body : Phaser.Physics.Arcade.Body } ;
  }

  /** Moves to the next level. */
  nextLevel() {
    this.stateMachine.startLoadingLevel({ });
  }

  /** Gets Phaser coordinates relative to the game grid. */
  getCoordinates(p: Point): Point {
    const ret = { 
        x: (p.x ) * this.wallDim.width + this.wallDim.offsetX, 
        y: (p.y ) * this.wallDim.height + this.wallDim.offsetY
      }
    return ret;
  }

  /** Update the motion of objects when a frame tick occurs. */
  updateMotion() {
    for (let marble of [this.marble1]) {
      if (this.cursorKeys.down.isDown) {
        marble.body.setAccelerationY(20);
      } else if (this.cursorKeys.up.isDown) {
        marble.body.setAccelerationY(-20);
      } else {
        marble.body.setAccelerationY( (this.beta / 180) * 150 );
      } 
      
      if (this.cursorKeys.left.isDown) {
        marble.body.setAccelerationX(-20);
      } else if (this.cursorKeys.right.isDown) {
        marble.body.setAccelerationX(20);
      } else {
        marble.body.setAccelerationX( (this.gamma / 180) * 150 )
      }
    }

  }

  /** Update the time on the game. */
  updateTime(time: number) {
    if (!this.startTime) { 
      this.startTime = time;
    }

    let timeOffset = Math.floor((time - this.startTime) / 1000);
    this.timerText.setText("" + timeOffset);
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